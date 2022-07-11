import { computed, Ref } from 'vue';
import { ITableColumnsItem } from '@/components/tgo-table/package/type';
import { formatTime } from '@tiangong/utils';
import { filters } from '@/core/plugins/filter';
import {
  TARGET_TYPE_LIST,
  TARGET_STATUS_LIST,
  EFFECTIVE_DATE_LIST,
  TARGET_RANGE_LIST,
  TARGET_STATUS_ENUM,
} from '../../constant';
import {
  ISaleTargetPageResListItem,
} from '@/modules/sales-manage/target-setting/api/type';
import { IDictionaryItem } from '@/hooks/use-dictionary/types';

interface IItem {
  value: string;
  label: string;
  tag: string;
  color?: string;
}
export const useColumns = (
  handleTargetChange: (row: ISaleTargetPageResListItem) => void,
  CAN_VIEW_DETAIL: boolean,
  CAN_MBBG: boolean,
  utils: Ref<IDictionaryItem[]>,
) => {
  const getColor = (list: IItem[], item: string) => {
    return list.find(info => info.value === item)?.color || '';
  };
  const getTag = (list: IItem[], item: string) => {
    return list.find(info => info.value === item)?.tag || '';
  };
  const columns = computed<ITableColumnsItem<ISaleTargetPageResListItem>[]>(() => [
    {
      label: '目标名称',
      minWidth: '170',
      render: row => (
        <div>
          <el-tooltip
            effect="dark"
            content={row?.targetName}
            placement="top-start"
          >
            <div style={
                {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                >{row?.targetName}
              </div>
          </el-tooltip>
          <div>
            <el-tag
              type={getTag(TARGET_STATUS_LIST, row.effectiveState!)}
            >
              {filters.getEnumLabel(TARGET_STATUS_LIST, row.effectiveState!)}
            </el-tag>
            <el-tag
              class="margin-left-10"
              color={getColor(TARGET_TYPE_LIST, row.targetType!)}
              style={{ color: '#fff', 'border-color': getColor(TARGET_TYPE_LIST, row.targetType!) }}
            >
              {filters.getEnumLabel(TARGET_TYPE_LIST, row.targetType!)}
            </el-tag>
          </div>
        </div>
      ),
    },
    {
      label: '目标值',
      minWidth: '120',
      render: row => (
        <div>{row?.targetValue}{filters.getEnumLabel(utils.value, row.targetUnit!)}</div>
      ),
    },
    {
      label: '生效日期',
      minWidth: '180',
      render: row => (
        <div>
          <span>{filters.getEnumLabel(EFFECTIVE_DATE_LIST, row.effectivePeriod!)}</span>
          <span>（{formatTime(row.effectiveBeginDate!, 'yyyy-MM-DD')}）</span>
        </div>
      ),
    },
    {
      label: '设置对象',
      minWidth: '200',
      render: row => (
        <div>{row?.objectiveList?.[0]?.objectiveName}</div>
      ),
    },
    {
      label: '设置范围',
      minWidth: '90',
      render: row => (
        <div>{filters.getEnumLabel(TARGET_RANGE_LIST, row.objectiveType!)}</div>
      ),
    },
    {
      label: '设置信息',
      minWidth: '200',
      render: row => (
        <div>
          <div>{row?.creatorName}</div>
          <div>{formatTime(row.createdTime!)}</div>
        </div>
      ),
    },
    {
      label: '操作',
      minWidth: '160',
      fixed: 'right',
      render: row => (
        <div>
          {CAN_VIEW_DETAIL && <router-link
              to={{
                name: 'SalesManageTargetSettingDetail',
                params: {
                  id: row?.targetId,
                },
              }}
            >
            <el-button type="text">查看详情</el-button>
          </router-link>}
          {/* 未生效和生效中才可以变更 */}
          {CAN_MBBG
          && [TARGET_STATUS_ENUM.NOT_EFFECTIVE, TARGET_STATUS_ENUM.EFFECTIVE_PADDING]
            .includes(row.effectiveState!)
          && <el-button
            type="text"
            class={'margin-left-15'}
            onClick={() => handleTargetChange(row)}
          >
            目标变更
          </el-button>}
        </div>
      ),
    },
  ]);
  return {
    columns,
  };
};
