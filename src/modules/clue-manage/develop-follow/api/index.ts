import http from '@/core/http';
import { DOMAIN_SYSTEM_ENUM } from '@tiangong/utils';
import {
  ICustomerClueDevPageReq,
  ICustomerClueDevPageRes,
  ICustomerClueDevGetRes,
  ICustomerClueDevDetailRes,
  ICustomerClueDevActivationReq,
  IBdInfoReq,
  IDevFeedbackReq,
  IDevFinishReq,
  IDevPublicReq,
  IGetHistoryReq,
  IGetHistoryListResItem,
  IClueBdListResItem,
  IOperationLogGetOperationListReq,
  IOperationLogGetOperationListResItem,
  ICustomerClueDevGetCompanyProfileRes,
} from './types';

/**
 * 查询列表（分页）
 * @see https://yapi.ibaibu.com/project/2106/interface/api/145041
 */
export const customerClueDevPage = (params: ICustomerClueDevPageReq) => {
  const url = '/crm-customer/web/v1/customer-clue-dev/page';
  return http.post<ICustomerClueDevPageRes>({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    data: params,
    loading: true,
  });
};

/**
 * 详情
 * @see https://yapi.ibaibu.com/project/2106/interface/api/145049
 */
export const customerClueDevGet = (id: string) => {
  const url = `/crm-customer/web/v1/customer-clue-dev/get/${id}`;
  return http.get<ICustomerClueDevGetRes>({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    loading: true,
  });
};

/**
 * 基本信息
 * @see https://yapi.ibaibu.com/project/2106/interface/api/165177
 */
export const customerClueDevDetail = (id: string) => {
  const url = `/crm-customer/web/v1/customer-clue-dev/detail/${id}`;
  return http.get<ICustomerClueDevDetailRes>({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    loading: true,
  });
};

/**
 * 重新激活
 * @see https://yapi.ibaibu.com/project/2106/interface/api/145057
 */
export const customerClueDevActivation = (
  params: ICustomerClueDevActivationReq,
) => {
  const url = '/crm-customer/web/v1/customer-clue-dev/activation';
  return http.post({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    data: params,
    loading: true,
  });
};

/**
 * 转移bd/分配bd/bd认领
 * @see https://yapi.ibaibu.com/project/2106/interface/api/145065
 */
export const bdInfo = (params: IBdInfoReq) => {
  const url = '/crm-customer/web/v1/customer-clue-dev/update/bd/info';
  return http.post({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    data: params,
    loading: true,
  });
};

/**
 * 开发反馈
 * @see https://yapi.ibaibu.com/project/2106/interface/api/145073
 */
export const devFeedback = (params: IDevFeedbackReq) => {
  const url = '/crm-customer/web/v1/customer-clue-dev/dev/feedback';
  return http.post({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    data: params,
    loading: true,
  });
};

/**
 * 提交结果
 * @see https://yapi.ibaibu.com/project/2106/interface/api/145081
 */
export const devFinish = (params: IDevFinishReq) => {
  const url = '/crm-customer/web/v1/customer-clue-dev/dev/finish';
  return http.post({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    data: params,
    loading: true,
  });
};

/**
 * 释放公海
 * @see https://yapi.ibaibu.com/project/2106/interface/api/145089
 */
export const devPublic = (params: IDevPublicReq) => {
  const url = '/crm-customer/web/v1/customer-clue-dev/change/dev/public';
  return http.post({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    data: params,
    loading: true,
  });
};

/**
 * 开发历程
 * @see https://yapi.ibaibu.com/project/2106/interface/api/146209
 */
export const getHistory = (params: IGetHistoryReq) => {
  const url = '/crm-customer/web/v1/customer-clue-history/get/history';
  return http.post<IGetHistoryListResItem[]>({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    data: params,
    loading: true,
  });
};

/**
 * 开发历程所有的bd
 * @see https://yapi.ibaibu.com/project/2106/interface/api/145033
 */
export const clueBd = (id: string) => {
  const url = `/crm-customer/web/v1/customer-clue-history/clue/bd/${id}`;
  return http.get<IClueBdListResItem[]>({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    loading: true,
  });
};

/**
 * 开发跟进操作日志查询
 * @see https://yapi.ibaibu.com/project/2106/interface/api/145905
 */
export const operationLogGetOperationList = (
  params: IOperationLogGetOperationListReq,
) => {
  const url = '/crm-customer/web/v1/operation-log/get-clue-list';
  return http.post<IOperationLogGetOperationListResItem[]>({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    data: params,
    loading: true,
  });
};

/**
 * 获取开发计划工商信息详情
 * @see https://yapi.ibaibu.com/project/2106/interface/api/147609
 */
export const customerClueDevGetCompanyProfile = (id: string) => {
  const url = `/crm-customer/web/v1/customer-clue-dev/get-company-profile/${id}`;
  return http.get<ICustomerClueDevGetCompanyProfileRes>({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    loading: true,
  });
};
