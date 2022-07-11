import http from '@/core/http';
import {
  IGetCustomerDataByIDRes,
  IGetLogListRes,
  ICustomerInfoBusinessLicenseOcrReq,
  ICustomerInfoBusinessLicenseOcrRes,
  IDemandStyleDemandSpuInfoReq,
  IDemandStyleDemandSpuInfoResItem,
  IRegionListResItem,
  IDesensitizeDecryptReq,
  IDesensitizeDecryptRes,
  ICustomerInfoQueryUserRegionRes,
  IGetUserRegionAndDepartmentRes,
  IGetCompanyBusinessInfoRes,
  IRolesQueryRolesReq,
  IRolesQueryRolesRes,
  IGetUserOrgOptions,
} from './type';

/**
 * 根据客户ID获取用户信息
 */
export const getCustomerDataByID = (data: { customerId: string; }) => {
  return http.get<IGetCustomerDataByIDRes>({
    url: `/crm-customer/web/v1/customer-info/get-customer-by-id/${data.customerId}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取操作日志：客户管理/集团管理/租户管理
 */
export const getLogList = (data: { buzId: string; }) => {
  return http.post<IGetLogListRes>({
    url: '/crm-customer/web/v1/operation-log/get-operation-list',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * ocr图片识别
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/116404
 */
export const licenseOcrApi = (data: ICustomerInfoBusinessLicenseOcrReq) => {
  return http.post<ICustomerInfoBusinessLicenseOcrRes>({
    url: '/crm-customer/web/v1/customer-info/business-license-ocr',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 根据spu查询款式信息 模糊搜索
 * yapi: https://yapi.ibaibu.com/project/2202/interface/api/122800
 */
export const fuzzySearchSpuInfo = (data: IDemandStyleDemandSpuInfoReq) => {
  return http.post<IDemandStyleDemandSpuInfoResItem[]>({
    url: '/crm-demand/web/v1/demandStyle/demand-spu-info',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取区域管理信息
 * yapi https://yapi.ibaibu.com/project/1128/interface/api/123580
 */
export const getRegionList = () => {
  return http.get<IRegionListResItem[]>({
    url: '/ufg/web/v1/region-area/get/region/list',
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 解密
 * @see https://yapi.ibaibu.com/project/1128/interface/api/128820
 */
export const desensitizeDecrypt = (data: IDesensitizeDecryptReq) => {
  return http.post<IDesensitizeDecryptRes>({
    url: '/ufg/web/v1/desensitize/decrypt',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
* 根据sso用户id查询用户区域信息
*/
export const getUserRegion = (userId: string) => {
  return http.get<ICustomerInfoQueryUserRegionRes>({
    url: `/crm-customer/web/v1/customer-info/query-user-region/${userId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 根据sso 用户id查询ops区域信息和部门信息
 * yapi：https://yapi.ibaibu.com/project/2106/interface/api/147065
 */
export const getUserRegionAndDepartment = (data: { userId: string;}) => {
  return http.get<IGetUserRegionAndDepartmentRes>({
    url: `/crm-customer/web/v1/customer-info/query-region-and-department/${data.userId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
* 根据社会统一征信代码获取客户工商信息
*/
export const getCompanyBusinessInfo = (data: {
  /** 社会统一征信代码 */
  socialCreditCode: string;
}) => {
  return http.get<IGetCompanyBusinessInfoRes>({
    url: `/crm-customer/web/v1/customer-track/company-info/${data.socialCreditCode}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 根据系统编码查询角色
 * 小程序：CRM_CLIENT_WAPP
 * app：SKY_CREATION_APP
 * yapi: https://yapi.ibaibu.com/project/1656/interface/api/93332
*/
export const getSsoRoles = (data: IRolesQueryRolesReq) => {
  return http.post<IRolesQueryRolesRes>({
    url: '/sso-center/roles/queryRoles',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 查询用户组织节点下拉选项
 * @see https://yapi.ibaibu.com/project/2106/interface/api/151873
 */
export const getUserOrgOptions = () => {
  return http.get<IGetUserOrgOptions>({
    url: '/crm-customer/web/v1/life-cycle/bd-org',
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};
