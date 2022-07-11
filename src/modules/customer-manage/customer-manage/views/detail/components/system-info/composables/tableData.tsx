import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { IGetCustomerRelationRes } from '@/modules/customer-manage/customer-manage/api/types';

// 系统关联
export const renderColumns = (): IColumnsItem<IGetCustomerRelationRes>[] => {
  return [
    {
      label: '客户名称',
      render: row => (
        <div>{row?.customerName}</div>
      ),
    },
    {
      label: '客户编码',
      render: row => (
        <div>{row?.customerCode}</div>
      ),
    },
  ];
};
