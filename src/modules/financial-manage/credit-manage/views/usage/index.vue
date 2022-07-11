<template>
  <app-page>
    <template #fheader>
      <div class="title">{{customerName}}</div>
      <search-area
        v-model="params"
        :config="searchConfig"
        @handleSearch="handleSearch"
        @handleReset="handleReset"
      />
    </template>
    <template #main="{ height }">
      <custom-table
        border
        :key="height"
        :height="height"
        :data="tableData"
        :columns="renderColumns(type)"
      />
    </template>
    <template #ffooter>
      <el-row
        style="width: 100%"
        justify="end"
      >
        <pagination
          :total="tableTotal"
          :current-page="params.pageNum"
          :size="params.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </template>
  </app-page>
</template>

<script lang="tsx">
import { defineComponent, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { formatTime } from '@tiangong/utils';

import { useList } from '@/hooks/use-list';
import { getCustomerDataByID } from '@/api/global';
import { getGroupDetail } from '@/modules/customer-manage/group-manage/api';
import { getCreditUsageList } from '@/modules/financial-manage/credit-manage/api';
import { CREDIT_SUBJECT_ROUTE_ENUM, CREDIT_SUBJECT_ENUM } from '@/constant';
import { IListItem, IParams } from './types';
import { renderColumns } from './composables/tableData';

export default defineComponent({
  setup() {
    const $route = useRoute();
    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<IListItem, IParams>({
      request: {
        api: getCreditUsageList,
        params: {
          customerId: $route.params?.id as string,
          billCode: '',
          startTime: '',
          endTime: '',
          sourceOperator: '',
          billName: '',
          pageNum: 1,
          pageSize: 10,
          creditMark: $route.params?.type === CREDIT_SUBJECT_ROUTE_ENUM.GROUP
            ? CREDIT_SUBJECT_ENUM.GROUP
            : CREDIT_SUBJECT_ENUM.CUSTOMER,
        },
        handleParams(paramsObj) {
          // 处理时间
          if (paramsObj.createDate?.length === 2) {
            [paramsObj.startTime, paramsObj.endTime] = paramsObj.createDate;
          }
          delete paramsObj.createDate;
          return {
            ...paramsObj,
          };
        },
      },
    });

    const customerName = ref(''); // 客户名称
    // 请求详情
    const handleGetDetail = async () => {
      try {
        if ($route.params?.type === CREDIT_SUBJECT_ROUTE_ENUM.GROUP) {
          const { data } = await getGroupDetail({
            id: $route?.params?.id as string,
          });
          customerName.value = data.groupName;
        } else {
          const { data } = await getCustomerDataByID({
            customerId: $route?.params?.id as string,
          });
          customerName.value = data.customerName;
        }
      } catch (error) {
        console.log(error);
      }
    };

    const init = () => {
      if ($route.params?.id) {
        handleReset();
        handleGetDetail();
      } else {
        customerName.value = '';
        tableData.value = [];
      }
    };

    watch(() => $route?.params?.id, () => {
      init();
    }, { immediate: true });

    return {
      params,
      tableTotal,
      tableData,
      customerName,
      type: $route?.params?.type as CREDIT_SUBJECT_ROUTE_ENUM,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      renderColumns,
      searchConfig: [
        {
          name: '单据编号：',
          component: 'input',
          valueName: 'billCode',
          placeholder: '请输入单据编号',
          maxlength: '100',
        },
        {
          name: '创建时间：',
          component: 'datePicker',
          valueName: ['startTime', 'endTime'],
          placeholder: ['开始日期', '结束日期'],
          disabledDate: (time: Date) => {
            return time.getTime() > new Date(formatTime(Date.now())).getTime();
          },
        },
        {
          name: '操作人：',
          component: 'input',
          valueName: 'sourceOperator',
          placeholder: '请输入操作人',
          maxlength: '100',
        },
        {
          name: '单据名称：',
          component: 'input',
          valueName: 'billName',
          placeholder: '请选择单据名称',
          maxlength: '100',
        },
      ],
    };
  },
});
</script>

<style scoped lang="scss">
.title {
  height: 16px;
  line-height: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  padding-left: 14px;
}
</style>
