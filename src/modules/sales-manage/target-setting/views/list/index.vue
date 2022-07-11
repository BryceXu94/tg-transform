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
              :conditionInfo="statusConditionInfo"
              v-model="params.effectiveState"
              @conditionChange="handleSearch()"
            />
          </template>
          <template #button>
            <el-button
              v-if="CAN_EXPORT"
              type="primary"
              @click="handelExport"
            >导出</el-button>
            <el-button
              v-if="CAN_MBSZ"
              type="primary"
              @click="handleOpenDialog(TargetSetDialog, {
                type: TYPE_ENUM.CREATE,
                utilList,
                success: handleSearch,
              })"
            >目标设置</el-button>
          </template>
        </header-area>
      </template>
      <template #main="{ height }">
        <tgo-table
          border
          :height="height"
          :key="height"
          :data="tableData"
          :columns="columns"
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
    </app-page>
  </div>
</template>
<script lang="tsx">
import { defineComponent, computed } from 'vue';
import { formatTime } from '@tiangong/utils';
import { getCustomerOptions } from '@/api/query-options';

import { useList } from '@/hooks/use-list';
import { useColumns } from './use-columns';

import { getSaleTargetPageApi } from '@/modules/sales-manage/target-setting/api';
import {
  ISaleTargetPageReq,
  ISaleTargetPageRes,
  ISaleTargetPageResListItem,
} from '@/modules/sales-manage/target-setting/api/type';
import { TARGET_TYPE_LIST, TARGET_STATUS_LIST, TYPE_ENUM } from '../../constant';

import { handleOpenDialog } from '@/hooks/use-dialog';
import TargetSetDialog from './components/target-set-dialog.vue';
import { usePermissionConfig } from '../../use-permission-config';
import { useDictionary } from '@/hooks/use-dictionary';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { exportByBlob } from '@/core/utils/file-download';

export default defineComponent({
  name: 'SalesManageTargetSettingList',
  setup() {
    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<ISaleTargetPageRes, ISaleTargetPageReq>({
      request: {
        api: getSaleTargetPageApi,
        params: {
          pageNum: 1,
          pageSize: 10,
          effectiveState: '', // 生效状态
          objectiveName: '', // 对象名称
          targetType: '', // 目标类型
          creatorName: '', // 创建人
          createdBeginDate: '',
          createdEndDate: '',
          effectiveBeginDate: '',
          effectiveEndDate: '',
        },
      },
    });
    handleSearch();

    // 单位
    const { getDictionaryOptions } = useDictionary();
    const utilList = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_SALESMAN_AMOUNT_UNIT);
    });

    // 目标变更
    const handleTargetChange = (row: ISaleTargetPageResListItem) => {
      handleOpenDialog(TargetSetDialog, {
        type: TYPE_ENUM.UPDATE,
        utilList: utilList.value,
        success: handleSearch,
        row,
      });
    };

    // 权限
    const {
      CAN_VIEW_DETAIL,
      CAN_EXPORT,
      CAN_MBBG,
      CAN_MBSZ,
    } = usePermissionConfig();

    const { columns } = useColumns(
      handleTargetChange,
      CAN_VIEW_DETAIL.value,
      CAN_MBBG.value,
      utilList,
    );

    // 导出
    const handelExport = async () => {
      const { pageNum, pageSize, ...rest } = params.value;
      console.log(pageNum, pageSize);
      await exportByBlob({
        method: 'post',
        url: '/crm-salesman/web/v1/sale-target/export',
        data: rest,
        filename: '目标设置.xlsx',
        loading: true,
      });
    };

    return {
      params,
      tableTotal,
      tableData,
      columns,
      TargetSetDialog,
      TYPE_ENUM,
      CAN_EXPORT,
      CAN_MBSZ,
      utilList,

      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      getCustomerOptions,
      handleOpenDialog,
      handelExport,
      searchConfig: [
        {
          name: '设置对象：',
          component: 'input',
          valueName: 'objectiveName',
          placeholder: '请输入对象名称',
          maxlength: '100',
        },
        {
          name: '目标类型：',
          component: 'select',
          valueName: 'targetType',
          placeholder: '请选择目标类型',
          options: [
            {
              label: '全部',
              value: '',
            },
            ...TARGET_TYPE_LIST,
          ],
          clearable: true,
        },
        {
          name: '生效日期：',
          component: 'datePicker',
          valueName: ['effectiveBeginDate', 'effectiveEndDate'],
          placeholder: ['开始日期', '结束日期'],
          valueFormat: 'YYYY-MM-DD',
        },
        {
          name: '创建人：',
          component: 'input',
          valueName: 'creatorName',
          placeholder: '请输入创建人',
          maxlength: '100',
        },
        {
          name: '创建时间：',
          component: 'datePicker',
          valueName: ['createdBeginDate', 'createdEndDate'],
          placeholder: ['开始日期', '结束日期'],
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          disabledDate: (time: Date) => {
            return time.getTime() > new Date(formatTime(Date.now())).getTime();
          },
        },
      ],
      statusConditionInfo: {
        title: '目标状态：',
        conditionList: [
          {
            label: '全部',
            value: '',
          },
          ...TARGET_STATUS_LIST.filter((item) => {
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
