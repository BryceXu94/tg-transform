<template>
  <div>
    <app-page class="goal-completion-statistics-list">
      <template #fheader>
        <search-area
          v-model="params"
          :config="searchConfig"
          @handleSearch="handleSearch"
          @handleReset="handleReset"
        >
          <template #customer>
            <query-select
              placeholder="请选择客户名称"
              v-model="params.customerId"
              :method="getCustomerOptions"
              :config="{
                valueKey: 'customerId',
                labelKey: 'customerName',
                keywordQueryKey: 'customerName',
                valueQueryKey: 'customerName',
                dataKey: 'data',
                showValue: true,
              }"
            />
          </template>
        </search-area>
      </template>
      <template #header>
        <header-area>
          <template #button>
            <el-button
              v-if="CAN_EXPORT"
              type="primary"
              @click="handleExposeExcel"
            >导出</el-button>
          </template>
        </header-area>
      </template>
      <template #main="{ height }">
        <custom-table
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
import { exportByBlob } from '@/core/utils/file-download';
import { getUserInfo, getCustomerOptions } from '@/api/query-options';

import { useList } from '@/hooks/use-list';
import CustomTable from '@/components/custom-table';
import { useDataColumns } from './hooks/use-data-columns';
import { useSearch } from './hooks/use-search';

import { getfinishStatsPageApi } from '@/modules/report-forms-manage/goal-completion-statistics/api';
import {
  IFinishStatsPageReq,
  IFinishStatsPageRes,
} from '@/modules/report-forms-manage/goal-completion-statistics/api/type';
import { usePermissionConfig } from '../../use-permission-config';
import { useDictionary } from '@/hooks/use-dictionary';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';

export default defineComponent({
  name: 'GoalCompletionStatisticsList',
  components: {
    CustomTable,
  },
  setup() {
    const { searchConfig } = useSearch();
    const { CAN_EXPORT } = usePermissionConfig();

    // 单位
    const { getDictionaryOptions } = useDictionary();
    const utilList = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_SALESMAN_AMOUNT_UNIT);
    });

    const { columns } = useDataColumns(
      utilList,
    );

    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<IFinishStatsPageRes, IFinishStatsPageReq>({
      request: {
        api: getfinishStatsPageApi,
        params: {
          creatorName: '',
          customerId: '',
          effectiveBeginDate: '',
          effectiveEndDate: '',
          pageNum: 1,
          pageSize: 10,
        },
      },
    });
    handleSearch();

    // 导出
    const handleExposeExcel = async () => {
      try {
        await exportByBlob({
          method: 'post',
          url: '/crm-salesman/web/v1/sale-target/finish-stats/export',
          data: params.value,
          filename: '目标完成统计.xlsx',
          loading: true,
        });
      } catch (error) {
        console.log(error);
      }
    };
    return {
      params,
      tableTotal,
      tableData,
      columns,
      CAN_EXPORT,

      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      getUserInfo,
      getCustomerOptions,
      handleExposeExcel,
      searchConfig,
    };
  },
});
</script>

<style scoped lang="scss">
.goal-completion-statistics-list {
  .prompt {
    color: #ccc;
    padding: 0 10px;
  }
}
</style>
