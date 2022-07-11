import http from '@/core/http';
import {
  IGetTgoBullionListReq,
  IGetTgoBullionListRes,
} from './types';

/**
 * 获取天工金条列表
 */
export const getTgoBullionList = (data: IGetTgoBullionListReq) => {
  return http.post<IGetTgoBullionListRes>({
    url: '/crm-finance/web/v1/credit-amount/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};
