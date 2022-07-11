import http from '@/core/http';
import {
  ICustomerTenantPageReq,
  ICustomerTenantPageRes,
  ICustomerTenantSaveReq,
  ICustomerTenantSaveRes,
  IUserPageRes,
  IBrandBaseInfoRes,
  IUserSaveReq,
  IUserSaveRes,
  ICustomerTenantDetailRes,
  IUserDetailRes,
} from './types';

/**
 * 租户管理列表
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/123144
 */
export const getCustomerTenantPageApi = (data: ICustomerTenantPageReq) => {
  return http.post<ICustomerTenantPageRes>({
    url: '/crm-customer/web/v1/customer-tenant/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 详情
 * @see https://yapi.ibaibu.com/project/2106/interface/api/123136
 */
export const customerTenantDetailApi = (tenantId: string) => {
  return http.get<ICustomerTenantDetailRes>({
    url: `/crm-customer/web/v1/customer-tenant/detail/${tenantId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 租户管理，新增/编辑
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/123138
 */
export const customerTenantSaveApi = (data: ICustomerTenantSaveReq) => {
  return http.post<ICustomerTenantSaveRes>({
    url: '/crm-customer/web/v1/customer-tenant/save',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 租户管理，启用
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/123140
 */
export const customerTenantEnableApi = (tenantId: string) => {
  return http.get<ICustomerTenantSaveRes>({
    url: `/crm-customer/web/v1/customer-tenant/enable/${tenantId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 租户管理，停用
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/123142
 */
export const customerTenantDisableApi = (tenantId: string) => {
  return http.get<ICustomerTenantSaveRes>({
    url: `/crm-customer/web/v1/customer-tenant/disable/${tenantId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 账号列表
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/154201
*/
export const getCustomerTenantUserPageApi = (data: ICustomerTenantPageReq) => {
  return http.post<IUserPageRes>({
    url: '/crm-customer/web/v1/customer-tenant/user/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 账号管理，新增/编辑
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/123138
 */
export const customerAccountSaveApi = (data: IUserSaveReq) => {
  return http.post<IUserSaveRes>({
    url: '/crm-customer/web/v1/customer-tenant/user/save',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 根据客户id获取客户的品牌基本信息
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/153977
 */
export const customerBrandInfoApi = (customerId: string) => {
  return http.get<IBrandBaseInfoRes>({
    url: `/crm-customer/web/v1/customer-info/brand/base-info/${customerId}?includeDeleted=1`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 账号列表，启用/停用
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/154209
 */
export const handleAccountEnableOrDisableApi = (userId: string, data: {
  enableState: string;
}) => {
  return http.get<ICustomerTenantSaveRes>({
    url: `/crm-customer/web/v1/customer-tenant/user/modify-state/${userId}`,
    isCancelDuplicateUrlRequests: true,
    params: data,
    loading: true,
  });
};

/**
 * 账号详情
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/154209
 */
export const getAccountDetailApi = (userId: string) => {
  return http.get<IUserDetailRes>({
    url: `/crm-customer/web/v1/customer-tenant/user/detail/${userId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};
