import http from '@/core/http';
import {
  ISaleTargetPageReq,
  ISaleTargetPageRes,
  ISaleTargetSaveReq,
  ISaleTargetNextOrgAndUserReq,
  ISaleTargetNextOrgAndUserRes,
  ISaleTargetManageOrgRes,
  IV1SaleTargetRes,
} from './type';

/**
 * 目标设置-列表
 * @see https://yapi.ibaibu.com/project/2226/interface/api/157369
 */
export const getSaleTargetPageApi = (data: ISaleTargetPageReq) => {
  return http.post<ISaleTargetPageRes>({
    url: '/crm-salesman/web/v1/sale-target/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 目标设置-设置
 * @see https://yapi.ibaibu.com/project/2226/interface/api/157353
 */
export const saleTargetSaveApi = (data: ISaleTargetSaveReq) => {
  return http.post({
    url: '/crm-salesman/web/v1/sale-target/save',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 目标设置-变更
 * @see https://yapi.ibaibu.com/project/2226/interface/api/157361
 */
export const saleTargetUpdateApi = (data: ISaleTargetSaveReq) => {
  return http.post({
    url: '/crm-salesman/web/v1/sale-target/change',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 目标设置-根据companyId获取组织部门
 * @see https://yapi.ibaibu.com/project/2226/interface/api/157385
 */
export const getSaleTargetOrgApi = (companyId: string) => {
  return http.get<ISaleTargetManageOrgRes>({
    url: `/crm-salesman/web/v1/sale-target/manage-org/${companyId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 目标设置-获取设置对象
 * @see https://yapi.ibaibu.com/project/2226/interface/api/157385
 */
export const getSaleTargetUserApi = (data: ISaleTargetNextOrgAndUserReq) => {
  return http.post<ISaleTargetNextOrgAndUserRes>({
    url: '/crm-salesman/web/v1/sale-target/next-org-and-user',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 目标设置-详情
 * @see https://yapi.ibaibu.com/project/2226/interface/api/157345
 */
export const getSaleTargetDetailApi = (targetId: string) => {
  return http.get<IV1SaleTargetRes>({
    url: `/crm-salesman/web/v1/sale-target/${targetId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};
