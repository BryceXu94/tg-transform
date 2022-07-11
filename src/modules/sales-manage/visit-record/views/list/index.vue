<template>
  <div>
    <app-page class="sales-list">
      <template #fheader>
        <search-area
          v-model="params"
          :config="searchConfig"
          @handleSearch="handleSearch"
          @handleReset="handleReset"
        />
      </template>
      <template #header>
        <header-area>
          <template #default>
            <condition-select
              :conditionInfo="typeConditionInfo"
              v-model="params.isRegister"
              @conditionChange="handleSearch()"
            />
          </template>
          <template #button>
            <el-button
              type="primary"
              v-if="CAN_EXPORT_EXCEL"
              @click="handleExposeExcel"
            >
              导出
            </el-button>
          </template>
        </header-area>
      </template>
      <template #main="{ height }">
        <custom-table
          border
          :height="height"
          :key="height"
          :data="tableData"
          :columns="customerRenderColumns(
            handleUpdate,
            CAN_VIEW_CUSTOMER_DETAIL,
            CAN_ABNORMAL_FEEDBACK,)"
        />
      </template>
      <template #ffooter>
        <el-row
          style="width: 100%"
          type="flex"
          justify="end"
        >
          <pagination
            :total="tableTotal"
            :current-page="params.pageNum"
            :page-size="params.pageSize"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </template>
      <initial-dialog
        ref="initialDialogEl"
        @success="handleSearch()"
      />
    </app-page>
  </div>
</template>
<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { formatTime } from '@tiangong/utils';
import { ElForm } from 'element-plus';
import { exportByBlob } from '@/core/utils/file-download';
import { getCustomerOptions } from '@/api/query-options';

import InitialDialog from './components/initial-dialog/index.vue';

import { useList } from '@/hooks/use-list';
import CustomTable from '@/components/custom-table';
import { IListItemCustomer } from './types';
import { ICustomerVisitPageRes, ICustomerVisitPageReq } from '@/modules/sales-manage/visit-record/api/types';
import { customerRenderColumns } from './composables/tableData';
import { getCustomerInfoPageApi } from '@/modules/sales-manage/visit-record/api';
import { REGISTER_STATE_LIST, VISIT_TYPE_LIST } from '@/modules/sales-manage/visit-record/constant';
import { usePermissionConfig } from '@/modules/sales-manage/visit-record/use-permission-config';

export default defineComponent({
  name: 'SalesManageVisitRecordList',
  components: {
    CustomTable,
    InitialDialog,
  },
  setup() {
    const formEl = ref<InstanceType<typeof ElForm> | null>(null);
    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<ICustomerVisitPageRes, ICustomerVisitPageReq>({
      request: {
        api: getCustomerInfoPageApi,
        params: {
          pageNum: 1,
          pageSize: 10,
          customerName: '',
          visitPersonName: '',
          clockTimeStart: '',
          clockTimeEnd: '',
          visitType: '',
          isRegister: '', // 客户登记状态
        },
      },
    });

    handleSearch();
    // 权限
    const {
      CAN_VIEW_CUSTOMER_DETAIL,
      CAN_ABNORMAL_FEEDBACK,
      CAN_EXPORT_EXCEL,
    } = usePermissionConfig();
    const initialDialogEl = ref<typeof InitialDialog | null>(null); // 异常反馈弹窗实例

    // 异常反馈
    const handleUpdate = (row: IListItemCustomer) => {
      initialDialogEl.value?.handleInit(row);
    };

    // 导出
    const handleExposeExcel = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { pageNum, pageSize, ...rest } = params.value;
      await exportByBlob({
        method: 'post',
        url: '/crm-salesman/web/v1/customer-visit/export',
        data: rest,
        filename: '拜访记录.xlsx',
        loading: true,
      });
    };

    return {
      params,
      tableTotal,
      tableData,

      // 权限
      CAN_VIEW_CUSTOMER_DETAIL,
      CAN_ABNORMAL_FEEDBACK,
      CAN_EXPORT_EXCEL,
      initialDialogEl,
      formEl,
      customerRenderColumns,
      handleUpdate,
      handleExposeExcel,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      getCustomerOptions,
      searchConfig: [
        {
          name: '客户名称：',
          component: 'input',
          valueName: 'customerName',
          placeholder: '请输入客户名称',
          maxlength: '100',
        },
        {
          name: '拜访人员：',
          component: 'input',
          valueName: 'visitPersonName',
          placeholder: '请输入拜访人员',
          maxlength: '100',
        },
        {
          name: '签到时间：',
          component: 'datePicker',
          valueName: ['clockTimeStart', 'clockTimeEnd'],
          placeholder: ['开始日期', '结束日期'],
          disabledDate: (time: Date) => {
            return time.getTime() > new Date(formatTime(Date.now())).getTime();
          },
        },
        {
          name: '拜访类型：',
          component: 'select',
          valueName: 'visitType',
          placeholder: '请选择',
          options: [
            {
              label: '全部',
              value: '',
            },
            ...VISIT_TYPE_LIST,
          ],
          clearable: true,
        },
      ],
      typeConditionInfo: {
        title: '是否登记：',
        conditionList: [
          {
            label: '全部',
            value: '',
          },
          ...REGISTER_STATE_LIST.filter((item) => {
            return item.value;
          }),
        ],
      },
    };
  },
});
</script>

<style scoped lang="scss">
.sales-list {
  :deep(.visit_summary_item) {
    @include ellipsisMulti(2);
  }
}
</style>
