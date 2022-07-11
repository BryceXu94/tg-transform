import http from '@/core/http';
import { IPaybackPageReq, IPaybackPageRes } from './type';
/**
 * 回款凭证列表
 * yapi: https://yapi.ibaibu.com/project/2226/interface/api/157777
 */
export const getPayBackPageApi = (data: IPaybackPageReq) => {
  return http.post<IPaybackPageRes>({
    url: '/crm-salesman/web/v1/payback/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};
