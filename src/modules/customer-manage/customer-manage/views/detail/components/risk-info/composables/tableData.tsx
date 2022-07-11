import { IColumnsItem } from '@/components/custom-table/package/type.d';

// 法律诉讼
export const renderColumns = (): IColumnsItem<any>[] => {
  return [
    {
      label: '序号',
      type: 'index',
    },
    {
      label: '案件名称',
      render: row => (
        <div>{row?.name}</div>
      ),
    },
    {
      label: '案由',
      render: row => (
        <div>{row?.reason}</div>
      ),
    },
    {
      label: '在本案中身份',
      render: row => (
        <div>{row?.identity}</div>
      ),
    },
    {
      label: '裁判结果',
      render: row => (
        <div>{row?.result}</div>
      ),
    },
  ];
};
