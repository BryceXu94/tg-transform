import http from '@/core/http';
import {
  IDemandPageReq,
  IDemandPageRes,
  IDemandCountResItem,
  IOrderCountResItem,
  IDemandDetailRes,
  IDemandSaveReq,
  IDemandLogsResItem,
  IBillDownloadResItem,
} from './types';

/**
 * 需求管理列表
 * yapi: https://yapi.ibaibu.com/project/2202/interface/api/122604
 */
export const getDemandPageApi = (data: IDemandPageReq) => {
  return http.post<IDemandPageRes>({
    url: '/crm-demand/web/v1/demand/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 需求管理列表 统计数量
 * yapi: https://yapi.ibaibu.com/project/2202/interface/api/124210
 */
export const getDemandCountApi = (data: IDemandPageReq) => {
  return http.post<IDemandCountResItem[]>({
    url: '/crm-demand/web/v1/demand/count',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 订单状态统计数量
 * @see https://yapi.ibaibu.com/project/2202/interface/api/154321
 */
export const getOrderCountApi = (data: IDemandPageReq) => {
  return http.post<IOrderCountResItem[]>({
    url: '/crm-demand/web/v1/demand/order/count',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 需求详情
 * yapi: https://yapi.ibaibu.com/project/2202/interface/api/121640
*/
export const getEncryptDemandDetailApi = (demandId: string) => {
  return http.get<IDemandDetailRes>({
    url: `/crm-demand/web/v1/demand/${demandId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};
export const getDemandDetailApi = (demandId: string) => {
  return http.get<IDemandDetailRes>({
    url: `/crm-demand/web/v1/demand/decode/${demandId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 创建需求
 * yapi: https://yapi.ibaibu.com/project/2202/interface/api/121642
 */
export const createDemandApi = (data: IDemandSaveReq) => {
  return http.post({
    url: '/crm-demand/web/v1/demand/save',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 更新需求
 * yapi: https://yapi.ibaibu.com/project/2202/interface/api/154313
 */
export const updateDemandApi = (data: IDemandSaveReq) => {
  return http.post({
    url: '/crm-demand/web/v1/demand/update',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 操作日志
 * yapi: https://yapi.ibaibu.com/project/2202/interface/api/125072
*/
export const getDemandLogsApi = (demandId: string) => {
  return http.get<IDemandLogsResItem>({
    url: `/crm-demand/web/v1/demand/logs/${demandId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 下载对账单
 * @see https://yapi.ibaibu.com/project/2202/interface/api/155049
 */
export const billDownloadApi = (billId: string) => {
  return http.get<IBillDownloadResItem[]>({
    url: `/crm-demand/web/v1/demand/bill/download/${billId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};
