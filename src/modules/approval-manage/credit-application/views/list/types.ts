import {
  IGetCreditApplicationListReq,
  IGetCreditApplicationListRes,
  IGetGroupCreditApplicationListReq,
  IGetGroupCreditApplicationListRes,
} from '../../api/types';

// 客户维度
export interface IParams extends IGetCreditApplicationListReq {
  /** 申请时间范围 */
  applyDate?: string[];
}
export type IListItem = IGetCreditApplicationListRes['list'][0];

// 集团维度
export interface IParamsGroup extends IGetGroupCreditApplicationListReq {
  /** 申请时间范围 */
  applyDate?: string[];
}
export type IListItemGroup = IGetGroupCreditApplicationListRes['list'][0];
