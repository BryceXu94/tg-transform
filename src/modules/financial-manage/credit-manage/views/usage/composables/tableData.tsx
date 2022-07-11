import { toThousands } from '@tiangong/utils';
import { filters } from '@/core/plugins/filter';
import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { CREDIT_SUBJECT_ROUTE_ENUM } from '@/constant';
import { IListItem } from '../types';

export const renderColumns = (
  type: CREDIT_SUBJECT_ROUTE_ENUM,
): IColumnsItem<IListItem>[] => {
  const columnsLeft: IColumnsItem<IListItem>[] = [
    {
      label: '来源系统',
      minWidth: '120px',
      prop: 'sourceSystemName',
    },
    {
      label: '单据编号',
      minWidth: '150px',
      prop: 'billCode',
    },
    {
      label: '单据名称',
      minWidth: '100px',
      prop: 'billName',
    },
    {
      label: '发生金额(元)',
      minWidth: '120px',
      prop: 'adjustAmount',
      render: row => (
        <div>{toThousands(row.adjustAmount)}</div>
      ),
    },
  ];
  const columnsRight: IColumnsItem<IListItem>[] = [
    {
      label: '创建时间',
      minWidth: '170px',
      prop: 'createdTime',
      render: row => (
        <div>{filters.formatTime(row.createdTime)}</div>
      ),
    },
    {
      label: '操作人',
      minWidth: '70px',
      prop: 'sourceOperator',
    },
    {
      label: '备注',
      minWidth: '200px',
      prop: 'remark',
      ellipsis: true,
    },
  ];
  return type === CREDIT_SUBJECT_ROUTE_ENUM.GROUP ? [
    ...columnsLeft,
    {
      label: '关联主体',
      minWidth: '150px',
      prop: 'sourceCustomerName',
      render: row => (
        <div>{row.sourceCustomerName || '-'}</div>
      ),
    },
    ...columnsRight,
  ] : [
    ...columnsLeft,
    ...columnsRight,
  ];
};
