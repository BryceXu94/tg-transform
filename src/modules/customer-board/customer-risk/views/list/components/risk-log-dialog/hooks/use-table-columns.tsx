import { computed } from 'vue';
import { ITableColumnsItem } from '@/components/tgo-table/package/type';
import { IFinanceRiskInfoDetailResRiskHistoryListItem } from '../../../type';
import { getLabelByVal } from '@/core/plugins/filter';
import { RISK_LEVEL_LIST } from '@/modules/customer-board/customer-risk/constant';
import { Top, Bottom } from '@element-plus/icons-vue';

export const useTableColumns = () => {
  const tableColumns = computed<ITableColumnsItem<IFinanceRiskInfoDetailResRiskHistoryListItem>[]>(() => {
    return [
      {
        label: '更新日期',
        minWidth: '120',
        prop: 'riskUpdateDate',
        type: 'date',
        format: 'YYYY-MM-DD',
      },
      {
        label: '最新风险等级',
        minWidth: '100',
        render: row => (
          <div class="flex flex-align-center">
            {getLabelByVal(RISK_LEVEL_LIST, row?.riskLevelLast)}
            <el-icon color={['', '#D9001B', '#70B603'][row?.riskTrend]}>
              {['', <Top />, <Bottom />][row?.riskTrend]}
            </el-icon>
          </div>
        ),
      },
      {
        label: '历史风险等级',
        minWidth: '100',
        render: row => (
          <div>
            {row?.riskTrend ? getLabelByVal(RISK_LEVEL_LIST, row?.riskLevelHistory) : '-'}
          </div>
        ),
      },
    ];
  });
  return {
    tableColumns,
  };
};
