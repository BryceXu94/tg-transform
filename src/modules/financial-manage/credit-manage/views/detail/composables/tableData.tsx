import { toThousands } from '@tiangong/utils';
import { isEmpty } from 'lodash-es';
import { filters } from '@/core/plugins/filter';
import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { STATUS_LIST } from '../../../constant';
import { IListItem } from '../types';

export const renderColumns = (
): IColumnsItem<IListItem>[] => [
  {
    label: '客户名称',
    minWidth: '130px',
    prop: 'customerName',
  },
  {
    label: '初次授信额度(元)',
    minWidth: '140px',
    prop: 'initAmount',
    render: row => (
      <div>{isEmpty(row.initAmount) ? '/' : toThousands(row.initAmount)}</div>
    ),
  },
  {
    label: '总额度(元)',
    minWidth: '100px',
    prop: 'totalAmount',
    render: row => (
      <div>{isEmpty(row.totalAmount) ? '/' : toThousands(row.totalAmount)}</div>
    ),
  },
  {
    label: '可用额度(元)',
    minWidth: '110px',
    prop: 'availableAmount',
    render: row => (
      <div>{isEmpty(row.availableAmount) ? '/' : toThousands(row.availableAmount)}</div>
    ),
  },
  {
    label: '临时额度(元)',
    minWidth: '110px',
    prop: 'tempAmount',
    render: row => (
      <div>{isEmpty(row.tempAmount) ? '/' : toThousands(row.tempAmount)}</div>
    ),
  },
  {
    label: '启用状态',
    minWidth: '90px',
    prop: 'status',
    render: row => (
      <div>
        {isEmpty(row.amountStatus) ? '/' : filters.getEnumLabel(STATUS_LIST, row.amountStatus)}
      </div>
    ),
  },
];
