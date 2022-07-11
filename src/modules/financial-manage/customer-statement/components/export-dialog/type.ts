import { IGetCustomerStatementDetailRes } from '../../api/types';

export type IListItem = IGetCustomerStatementDetailRes['details'][0]
export interface IStatementListItem extends IListItem {
  groupSize: number;
}
