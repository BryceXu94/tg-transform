import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { IListItem } from './types';

export const renderColumns = (
): IColumnsItem<IListItem>[] => [
  {
    label: '回款周期',
    minWidth: '130px',
    prop: 'period',
  },
  {
    label: '回款周期说明',
    minWidth: '140px',
    prop: 'desc',
  },
];
