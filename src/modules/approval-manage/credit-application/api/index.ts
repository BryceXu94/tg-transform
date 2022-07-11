import http from '@/core/http';
import {
  IGetCreditApplicationListReq,
  IGetCreditApplicationListRes,
  ICreateCreditApplicationReq,
  IGetCreditApplicationProgressRes,
  IGetCreditApplicationDetailRes,
  IGetCustomerDataWithBdByCustomerIdRes,
  IGetGroupCreditApplicationListReq,
  IGetGroupCreditApplicationListRes,
  IGetGroupCreditApplicationDetailRes,
  ICreateGroupCreditApplicationReq,
  IGetGroupCreditApplicationProgressRes,
} from './types';

/**
 * 获取授信申请列表
 */
export const getCreditApplicationList = (data: IGetCreditApplicationListReq) => {
  return http.post<IGetCreditApplicationListRes>({
    url: '/crm-credit/web/v1/credit-approval/apply-page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取授信申请详情
 */
export const getCreditApplicationDetail = (data: { creditApplyId: string; }) => {
  return http.get<IGetCreditApplicationDetailRes>({
    url: `/crm-credit/web/v1/credit-approval/apply-detail/${data.creditApplyId}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取授信申请详情（解密）
 */
export const getCreditApplicationDetailWithDecrypt = (data: { creditApplyId: string; }) => {
  return http.get<IGetCreditApplicationDetailRes>({
    url: `/crm-credit/web/v1/credit-approval/apply-edit/${data.creditApplyId}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 创建授信申请
 */
export const createCreditApplication = (data: ICreateCreditApplicationReq) => {
  return http.post({
    url: '/crm-credit/web/v1/credit-approval/apply',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
    isDeleteOss: false,
  });
};

/**
 * 撤销授信申请
 */
export const revokeCreditApplication = (data: { creditApplyId: string; }) => {
  return http.put({
    url: `/crm-credit/web/v1/credit-approval/apply-quash/${data.creditApplyId}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取授信审批进度
 */
export const getCreditApplicationProgress = (data: { creditApplyId: string; }) => {
  return http.get<IGetCreditApplicationProgressRes>({
    url: `/crm-credit/web/v1/credit-approval/apply-progress/${data.creditApplyId}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 根据客户ID获取用户信息（带BD信息）
 */
export const getCustomerDataWithBdByCustomerId = (data: { id: string; }) => {
  return http.get<IGetCustomerDataWithBdByCustomerIdRes>({
    url: `/crm-customer/web/v1/customer-info/get-customer-with-bd/${data.id}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取集团授信申请列表
 */
export const getGroupCreditApplicationList = (data: IGetGroupCreditApplicationListReq) => {
  return http.post<IGetGroupCreditApplicationListRes>({
    url: '/crm-credit/web/v1/group-credit-approval/apply-page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取集团授信申请详情
 */
export const getGroupCreditApplicationDetail = (data: { creditApplyId: string; }) => {
  return http.get<IGetGroupCreditApplicationDetailRes>({
    url: `/crm-credit/web/v1/group-credit-approval/apply-detail/${data.creditApplyId}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取集团授信申请详情（解密）
 */
export const getGroupCreditApplicationDetailWithDecrypt = (data: { creditApplyId: string; }) => {
  return http.get<IGetGroupCreditApplicationDetailRes>({
    url: `/crm-credit/web/v1/group-credit-approval/apply-edit/${data.creditApplyId}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 创建集团授信申请
 */
export const createGroupCreditApplication = (data: ICreateGroupCreditApplicationReq) => {
  return http.post({
    url: '/crm-credit/web/v1/group-credit-approval/apply',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
    isDeleteOss: false,
  });
};

/**
 * 撤销集团授信申请
 */
export const revokeGroupCreditApplication = (data: { creditApplyId: string; }) => {
  return http.put({
    url: `/crm-credit/web/v1/group-credit-approval/apply-quash/${data.creditApplyId}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取集团授信审批进度
 */
export const getGroupCreditApplicationProgress = (data: { creditApplyId: string; }) => {
  return http.get<IGetGroupCreditApplicationProgressRes>({
    url: `/crm-credit/web/v1/group-credit-approval/apply-progress/${data.creditApplyId}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};
