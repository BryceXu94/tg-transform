<template>
  <app-page class="column-list">
    <template #fheader>
      <search-area
        v-model="params"
        @handleSearch="handleSearch"
        @handleReset="handleReset"
        :config="searchAreaConfig"
      />
    </template>
    <template #header>
      <header-area>
        <template #default>
          <condition-select
            :conditionInfo="typeConditionInfo"
            v-model="params.auditState"
            @conditionChange="handleConditionChange"
          />
        </template>
      </header-area>
    </template>
    <template #main="{ height }">
      <custom-table
        border
        :height="height"
        :key="height"
        :data="tableData"
        :columns="demandRenderColumns(handleShowRecord, CAN_VIEW_RECORD)"
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useList } from '@/hooks/use-list';
import CustomTable from '@/components/custom-table';
import { demandRenderColumns } from './composables/tableData';

import {
  getcolumnCustomerPageApi,
  getcolumnCustomerRecordApi,
} from '@/modules/customer-manage/develop-plan/api';
import {
  IColumnCustomerInfoPageReq,
  IColumnCustomerInfoPageRes,
} from '@/modules/customer-manage/develop-plan/api/types';

import {
  AUDIT_STATE_LIST,
} from '@/modules/customer-manage/develop-plan/constant';

import AuditRecord from './components/audit-record.vue';
import { handleOpenDialog } from '@/hooks/use-dialog';

import { formatTime } from '@tiangong/utils';

import { usePermissionConfig } from '@/modules/customer-manage/develop-plan/use-permission-config';

export default defineComponent({
  name: 'CustomerManageDevelopPlanList',
  components: {
    CustomTable,
  },
  setup() {
    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<IColumnCustomerInfoPageRes, IColumnCustomerInfoPageReq>({
      request: {
        api: getcolumnCustomerPageApi,
        params: {
          columnCustomerName: '',
          auditState: '',
          creatorName: '',
          pageNum: 1,
          pageSize: 10,
        },
      },
    });
    handleSearch();

    // 审核记录
    const handleShowRecord = async (columnCustomerId: string) => {
      const res = await getcolumnCustomerRecordApi(columnCustomerId);
      const columnCustomerRecord = res?.data || [];
      handleOpenDialog(AuditRecord, {
        columnCustomerRecord,
      });
    };

    const handleConditionChange = () => {
      handleSearch();
    };

    // 权限
    const {
      CAN_VIEW_RECORD,
    } = usePermissionConfig();

    const typeConditionInfo = {
      title: '计划状态',
      conditionList: [
        {
          label: '全部',
          value: '',
        },
        ...AUDIT_STATE_LIST,
      ],
    };

    const searchAreaConfig = [
      {
        name: '客户名称：',
        component: 'input',
        valueName: 'columnCustomerName',
        placeholder: '请输入客户名称',
      },
      {
        name: '创建人：',
        component: 'input',
        valueName: 'creatorName',
        placeholder: '请输入创建人',
      },
      {
        name: '创建时间：',
        component: 'datePicker',
        valueName: ['createdTimeBegin', 'createdTimeEnd'],
        placeholder: ['开始日期', '结束日期'],
        disabledDate: (time: Date) => {
          return time.getTime() > new Date(formatTime(Date.now())).getTime();
        },
      },
    ];

    return {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,

      demandRenderColumns,
      handleShowRecord,
      handleConditionChange,

      searchAreaConfig,
      typeConditionInfo,

      CAN_VIEW_RECORD,
    };
  },
});
</script>
