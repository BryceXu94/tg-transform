import { computed, Ref } from 'vue';
import { ITableColumnsItem } from '@/components/tgo-table/package/type';
import { formatTime } from '@tiangong/utils';
import { filters } from '@/core/plugins/filter';
import {
  TARGET_TYPE_LIST,
  EFFECTIVE_PERIOD_TYPE_LIST,
  STANDARD_TYPE_LIST,
} from '@/modules/report-forms-manage/goal-completion-statistics/constant';
import { IFinishStatsPageResListItem } from '@/modules/report-forms-manage/goal-completion-statistics/api/type';
import { IDictionaryItem } from '@/hooks/use-dictionary/types';

export const useDataColumns = (
  utils: Ref<IDictionaryItem[]>,
) => {
  const columns = computed<ITableColumnsItem<IFinishStatsPageResListItem>[]>(() => [
    {
      label: '目标名称',
      minWidth: '150',
      render: row => (
        <div>
          <div>{row.targetName}</div>
        </div>
      ),
    },
    {
      label: '目标类型',
      minWidth: '90',
      render: row => <div>{filters.getEnumLabel(TARGET_TYPE_LIST, row?.targetType)}</div>,
    },
    {
      label: '设置人',
      minWidth: '150',
      render: row => (
        <div>
          <span>{row.creatorName}</span>
          {row.regionName && <span>{row.regionName ? `[${row.regionName}]` : ''}</span>}
        </div>
      ),
    },
    {
      label: '所属部门',
      minWidth: '150',
      render: row => <div>{row.orgName}</div>,
    },
    {
      label: '设置对象',
      minWidth: '250',
      render: row => (
        <div>
          <div>{row?.objectiveName}</div>
        </div>
      ),
    },
    {
      label: '目标值',
      minWidth: '90',
      render: row => (
        <div>
          <div>{row?.targetValue}{filters.getEnumLabel(utils.value, row.targetUnit!)}</div>
        </div>
      ),
    },
    {
      label: '生效日期',
      minWidth: '180',
      render: row => (
        <div>
          <span>{filters.getEnumLabel(EFFECTIVE_PERIOD_TYPE_LIST, row?.effectivePeriod)}</span>
          <span>（{formatTime(row?.effectiveBeginDate, 'YYYY-MM-DD')}）</span>
        </div>
      ),
    },
    {
      label: '实际完成',
      minWidth: '150',
      render: row => (
        <div>
          <div>
            <span>{row.completedAmount}</span>
            {row.completedPercent && <span>{row.completedPercent ? `(${row.completedPercent})` : ''}</span>}
          </div>
        </div>
      ),
    },
    {
      label: '是否达标',
      minWidth: '90',
      fixed: 'right',
      render: row => (
        <div>
          <div>{filters.getEnumLabel(STANDARD_TYPE_LIST, row?.isAttainment)}</div>
        </div>
      ),
    },
  ]);
  return {
    columns,
  };
};
