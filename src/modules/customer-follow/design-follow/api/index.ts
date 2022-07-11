import http from '@/core/http';

import {
  ICustomerGroupRelationPageReq,
  ICustomerGroupRelationPageRes,
  ICustomerGroupRelationDeleteGroupRelationReq,
  ICustomerGroupRelationTransferCustomerReq,
  ICustomerGroupRelationBindingCustomerReq,
} from './types';

/**
 * 获取设计跟进（公海客户）列表
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/126318
 */
export const getRelationFollowListApi = (data: ICustomerGroupRelationPageReq) => {
  return http.post<ICustomerGroupRelationPageRes>({
    url: '/crm-customer/web/v1/customer-group-relation/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 释放公海
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/126654
 */
export const releaseCustomerApi = (data: ICustomerGroupRelationDeleteGroupRelationReq) => {
  return http.post({
    url: '/crm-customer/web/v1/customer-group-relation/delete-group-relation',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 转移客户
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/126652
 */
export const transferCustomerApi = (data: ICustomerGroupRelationTransferCustomerReq) => {
  return http.post({
    url: '/crm-customer/web/v1/customer-group-relation/transfer-customer',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};
/**
 * 绑定设计组
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/126320
 */
export const bindingCustomerApi = (data: ICustomerGroupRelationBindingCustomerReq) => {
  return http.post({
    url: '/crm-customer/web/v1/customer-group-relation/binding-customer',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};
