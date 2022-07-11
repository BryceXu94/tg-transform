import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
import { IGetCustomerStatementDetailRes } from '../../api/types';

export type IListItem = IGetCustomerStatementDetailRes['details'][0]
export interface IStatementListItem extends IListItem {
  groupSize: number;
}

export interface IStatementData extends IGetCustomerStatementDetailRes {
  details: IStatementListItem[];
}

export interface ISpanMethodProps {
  row: IStatementListItem;
  column: TableColumnCtx<IStatementListItem>;
  rowIndex: number;
  columnIndex: number;
}
