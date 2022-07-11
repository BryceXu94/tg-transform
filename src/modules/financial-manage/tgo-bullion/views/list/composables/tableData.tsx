import { toThousands } from '@tiangong/utils';
import { filters } from '@/core/plugins/filter';
import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { DAYS_UNIT_LIST } from '../../../constant';
import {
  IListItem,
} from '../types';

// 客户维度
export const renderColumns = (): IColumnsItem<IListItem>[] => [
  {
    label: '客户名称',
    minWidth: '150px',
    prop: 'customerName',
    render: row => (
      <div>
        <div>{row.customerName}</div>
        {row.regionName && <div>
          <el-tag type="warning">{row.regionName}</el-tag>
        </div>}
      </div>
    ),
  },
  {
    label: '总额度(元)',
    minWidth: '110px',
    prop: 'setingAmount',
    render: row => (
      <div>{toThousands(row.setingAmount)}</div>
    ),
  },
  {
    label: '可用额度(元)',
    minWidth: '120px',
    prop: 'creditUsableAmount',
    render: row => (
      <div>{toThousands(row.creditUsableAmount)}</div>
    ),
  },
  {
    label: '锁定额度(元)',
    minWidth: '120px',
    prop: 'creditCheckAmount',
    render: row => (
      <div>{toThousands(row.creditCheckAmount)}</div>
    ),
  },
  {
    label: '已支用额度(元)',
    minWidth: '120px',
    prop: 'creditUsedAmount',
    render: row => (
      <div>{toThousands(row.creditUsedAmount)}</div>
    ),
  },
  {
    label: '贷款期限',
    minWidth: '120px',
    prop: 'deadline',
    render: row => (
      <div>{row.days ? `${row.days}${filters.getEnumLabel(DAYS_UNIT_LIST, row.deadline)}` : '-'}</div>
    ),
  },
];
