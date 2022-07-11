import http from '@/core/http';
import {
  IContractArchivesPageReq,
  IContractArchivesPageRes,
} from './type';
/**
 * 合同档案列表
 * yapi: https://yapi.ibaibu.com/project/2202/interface/api/166913
 */
export const getCustomerInfoPageApi = (data: IContractArchivesPageReq) => {
  return http.post<IContractArchivesPageRes>({
    url: '/crm-demand/web/v1/contract-archives/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};
