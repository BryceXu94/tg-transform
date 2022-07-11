import { IGetCustomerStatementListReq, IGetCustomerStatementListRes } from '../../api/types';

export interface IParams extends IGetCustomerStatementListReq {
  /** 账单月份范围 */
  billDate?: string[];
  /** 创建时间范围 */
  createDate?: string[];
}

export type IListItem = IGetCustomerStatementListRes['list'][0];
