import http from '@/core/http';
import {
  IGetCreditCustomerListReq,
  IGetCreditCustomerListRes,
  IGetCreditGroupListReq,
  IGetCreditGroupListRes,
  IGetCreditUsageListReq,
  IGetCreditUsageListRes,
  IInitialCreditLineReq,
  IUpdateCreditLineReq,
  IGetCreditDetailRes,
  IGetCreditProgressListRes,
  ICustomerCreditManagerExportCreditInfoReq,
  IUpdateCreditStatusReq,
} from './types';

/**
 * 获取授信管理客户列表
 */
export const getCreditCustomerList = (data: IGetCreditCustomerListReq) => {
  return http.post<IGetCreditCustomerListRes>({
    url: '/crm-credit/web/v1/customer-credit-manager/customer/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取授信管理集团列表
 */
export const getCreditGroupList = (data: IGetCreditGroupListReq) => {
  return http.post<IGetCreditGroupListRes>({
    url: '/crm-credit/web/v1/customer-credit-manager/group/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取授信管理详情
 */
export const getCreditDetail = (data: { dimension: string; id: string; }) => {
  return http.get<IGetCreditDetailRes>({
    url: `/crm-credit/web/v1/customer-credit-manager/amount-detail/${data.dimension}/${data.id}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 启用/停用客户授信资格
 */
export const updateCreditStatus = (data: IUpdateCreditStatusReq) => {
  return http.get<IGetCreditGroupListRes>({
    url: `/crm-credit/web/v1/customer-credit-manager/enable/${data.creditMark}/${data.operateType}/${data.customerId}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取授信管理使用明细列表
 */
export const getCreditUsageList = (data: IGetCreditUsageListReq) => {
  return http.post<IGetCreditUsageListRes>({
    url: '/crm-credit/web/v1/customer-credit-manager/adjust-info/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 初始授信管理授信额度
 */
export const initialCreditLine = (data: IInitialCreditLineReq) => {
  return http.post({
    url: '/crm-credit/web/v1/customer-credit-manager/init-amount/save',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 调整授信管理授信额度
 */
export const updateCreditLine = (data: IUpdateCreditLineReq, params: { token: string; }) => {
  return http.post({
    url: '/crm-credit/web/v1/customer-credit-manager/amount/system-adjust',
    isCancelDuplicateUrlRequests: true,
    data,
    params,
    loading: true,
  });
};

/**
 * 获取授信管理审批进度
 */
export const getCreditProgressList = (data: { customerId: string; }) => {
  return http.get<IGetCreditProgressListRes>({
    url: `/crm-credit/web/v1/customer-credit-manager/adjust-log/list/${data.customerId}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取 Token
 */
export const getCreditToken = () => {
  return http.get<string>({
    url: '/crm-credit/web/v1/tokens/next-token',
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 导出
*/
export const exportCreditInfo = (data: ICustomerCreditManagerExportCreditInfoReq) => {
  return http.post({
    url: '/crm-credit/web/v1/customer-credit-manager/export-credit-info',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};
