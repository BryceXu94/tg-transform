import { IGetMoneyBackSchemeListReq, IGetMoneyBackSchemeListRes } from '../../api/types';

export interface IParams extends IGetMoneyBackSchemeListReq {
  /** 预计回款日范围 */
  planRepaymentDate?: string[];
  /** 逾期日期范围 */
  overdueDate?: string[];
}

export type IListItem = IGetMoneyBackSchemeListRes['list'][0];
