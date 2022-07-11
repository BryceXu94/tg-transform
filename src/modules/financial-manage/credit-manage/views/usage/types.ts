import {
  IGetCreditUsageListReq,
  IGetCreditUsageListRes,
} from '../../api/types';

export interface IParams extends IGetCreditUsageListReq {
  /* 创建时间范围 */
  createDate?: string[];
}

// 使用明细列表项
export type IListItem = IGetCreditUsageListRes['list'][0];
