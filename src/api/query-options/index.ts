import { DOMAIN_SYSTEM_ENUM } from '@tiangong/utils';
import http from '@/core/http';
import {
  ICustomerInfoSearchReq,
  ICustomerInfoSearchRes,
  IUsersQueryUserReq,
  IUsersQueryUserRes,
  IUsersQueryUserByUsernameAndCompanyIdReq,
  IUsersQueryUserByUsernameAndCompanyIdRes,
  IGetUserOptionsByUserNameRes,
  ICustomerInfoReq,
  ICustomerInfoRes,
  IBdGetBdSuperiorReq,
  IBdGetBdSuperiorRes,
  IOrgsListReq,
  IOrgsListResItem,
  ICustomerContactSearchReq,
  ICustomerContactSearchResItem,
  ICustomerAddressSearchReq,
  ICustomerAddressSearchResItem,
  IRegionListRes,
  IBrandBaseInfoResItem,
  IGetGroupOptionsRes,
} from './type.d';

/**
 * 查询客户下拉列表
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115848
 */
export const getCustomerOptions = (data: ICustomerInfoSearchReq) => {
  return http.post<ICustomerInfoSearchRes>({
    url: '/crm-customer/web/v1/customer-info/search',
    isCancelDuplicateUrlRequests: true,
    data,
  });
};

/**
 * 查询用户
 * yapi: https://yapi.ibaibu.com/project/1656/interface/api/97892
 */
export const usersQueryUser = (params: IUsersQueryUserReq) => {
  return http.post<IUsersQueryUserRes>({
    url: '/sso-center/admin/users/query-user',
    isCancelDuplicateUrlRequests: true,
    data: params,
    loading: true,
  });
};

/** *
 * 获取用户（bd）信息
 * yapi: https://yapi.ibaibu.com/project/1656/interface/api/97890
 */
export const getUserInfo = (params: IUsersQueryUserByUsernameAndCompanyIdReq) => {
  return http.post<IUsersQueryUserByUsernameAndCompanyIdRes>({
    url: '/sso-center/admin/users/query-user-by-username-and-companyId',
    isCancelDuplicateUrlRequests: false,
    data: params,
    loading: true,
  });
};

/**
 * 员工下拉选项
 * yapi: https://yapi.ibaibu.com/project/1656/interface/api/116206
 */
export const getUserOptionsByUserName = (data: { username: string; }) => {
  return http.post<IGetUserOptionsByUserNameRes[]>({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url: '/sso-center/admin/users/query-user-info-by-username',
    loading: true,
    data,
    config: {
      withCredentials: false,
    },
  });
};

/** *
 * 根据外部关系code搜索外部关系
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/117536
 */
export const getCustomerInfo = (params: ICustomerInfoReq) => {
  return http.post<ICustomerInfoRes>({
    url: '/crm-customer/web/v1/customer-info/search-external-relation',
    isCancelDuplicateUrlRequests: true,
    data: params,
    loading: true,
  });
};

/**
 * 根据bdId获取某bd的上级
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/117550
 */
export const getBDSuperiorInfo = (params: IBdGetBdSuperiorReq) => {
  return http.post<IBdGetBdSuperiorRes>({
    url: '/crm-customer/web/v1/bd/get-bd-superior',
    isCancelDuplicateUrlRequests: true,
    data: params,
    loading: true,
  });
};

/**
 * 获取组织树
 * yapi: https://yapi.ibaibu.com/project/1656/interface/api/93312
*/
export const getAdminOrgsList = (params: IOrgsListReq) => {
  return http.post<IOrgsListResItem[]>({
    url: '/sso-center/admin/orgs/list',
    isCancelDuplicateUrlRequests: true,
    data: params,
    loading: true,
  });
};
/*
* 搜索联系人
* yapi: https://yapi.ibaibu.com/project/2106/interface/api/124206
*/
export const getCustomerContact = (data: ICustomerContactSearchReq) => {
  return http.post<ICustomerContactSearchResItem[]>({
    url: '/crm-customer/web/v1/customer-contact/search',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};
/**
 * 搜索地址
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/124208
 */
export const getCustomerAddress = (data: ICustomerAddressSearchReq) => {
  return http.post<ICustomerAddressSearchResItem[]>({
    url: '/crm-customer/web/v1/customer-address/search',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

// 区域设置列表
export const regionAreaListApi = () => {
  return http.get<IRegionListRes>({
    url: '/ufg/web/v1/region-area/get/region/list',
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 根据客户id获取客户的品牌基本信息
 * @see https://yapi.ibaibu.com/project/2106/interface/api/153977
 */
export const getBrandBaseInfo = (customerId: string) => {
  const url = `/crm-customer/web/v1/customer-info/brand/base-info/${customerId}`;
  return http.get<IBrandBaseInfoResItem[]>({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/*
 * 查询集团下拉列表
 * yapi: https://yapi.ibaibu.com/project/2130/interface/api/147841
 */
export const getGroupOptions = (params: { groupName: string; }) => {
  return http.post<IGetGroupOptionsRes[]>({
    url: '/crm-credit/web/v1/group-manager/search',
    isCancelDuplicateUrlRequests: true,
    params,
  });
};
