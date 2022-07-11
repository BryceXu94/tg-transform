import http from '@/core/http';

import {
  ICustomerBdDetailPageReq,
  ICustomerBdDetailPageRes,
  ICustomerBdDetailTransferCustomerReq,
  ICustomerBdDetailBindingCustomerReq,
  IBdInfoReq,
  IBdInfoRes,
} from './types';

/**
 * 获取客户跟进（公海客户）列表
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115502
 */
export const getCustomerFollowListApi = (data: ICustomerBdDetailPageReq) => {
  return http.post<ICustomerBdDetailPageRes>({
    url: '/crm-customer/web/v1/customer-bd-detail/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 转移客户
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115504
 */
export const transferCustomerApi = (data: ICustomerBdDetailTransferCustomerReq) => {
  return http.put({
    url: '/crm-customer/web/v1/customer-bd-detail/transfer-customer',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 释放至公海
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115506
 */
export const releaseCustomerApi = (data: {
  detailIdList: string[];
}) => {
  return http.put({
    url: '/crm-customer/web/v1/customer-bd-detail/delete-bd-detail',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 绑定客户
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115508
 */
export const bindingCustomerApi = (data: ICustomerBdDetailBindingCustomerReq) => {
  return http.put({
    url: '/crm-customer/web/v1/customer-bd-detail/binding-customer',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 转移bd获取审核信息
 * @see https://yapi.ibaibu.com/project/2106/interface/api/147057
 */
export const getAuditBdInfo = (params: IBdInfoReq) => {
  return http.post<IBdInfoRes>({
    url: '/crm-customer/web/v1/customer-bd-detail/get-audit/bd/info',
    isCancelDuplicateUrlRequests: true,
    data: params,
    loading: true,
  });
};
