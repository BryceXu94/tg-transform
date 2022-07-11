import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
import { IGetCustomerStatementDetailRes } from '../../api/types';

export type IListItem = IGetCustomerStatementDetailRes['details'][0]
export interface IStatementListItem extends IListItem {
  groupSize: number;
}

export interface ISpanMethodProps {
  row: IStatementListItem;
  column: TableColumnCtx<IStatementListItem>;
  rowIndex: number;
  columnIndex: number;
}

// 表格参数
export interface IColumnsItem {
  /* 列属性 */
  property: keyof IStatementListItem;
  /* 标签 */
  label: string;
  /* 最小宽度 */
  minWidth: string;
  /* 类型 */
  type: string;
}
export interface ISummaryMethodProps {
  /** columns配置 */
  columns: IColumnsItem[];
  /* 列表数据 */
  data: IStatementListItem[];
}
