import http from '@/core/http';
import {
  ICustomerVisitPageReq,
  ICustomerVisitDetailRes,
  ICustomerVisitDetailReq,
  ICustomerVisitPageRes,
  ICustomerVisitFeedbackReq,
} from './types';

/**
 * 拜访记录列表
 * yapi: https://yapi.ibaibu.com/project/2226/interface/api/125284
 */
export const getCustomerInfoPageApi = (data: ICustomerVisitPageReq) => {
  return http.post<ICustomerVisitPageRes>({
    url: '/crm-salesman/web/v1/customer-visit/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 销售管理-拜访信息
 * yapi: https://yapi.ibaibu.com/project/2226/interface/api/125286
 */
export const getVisitPersonInfoApi = (data: ICustomerVisitDetailReq) => {
  return http.post<ICustomerVisitDetailRes>({
    url: '/crm-salesman/web/v1/customer-visit/detail',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 拜访信息-异常反馈
 * yapi: https://yapi.ibaibu.com/project/2226/interface/api/125288
 */
export const abnormalFeedBack = (data: ICustomerVisitFeedbackReq) => {
  return http.post({
    url: '/crm-salesman/web/v1/customer-visit/feedback',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 操作日志
 * yapi: https://yapi.ibaibu.com/project/2226/interface/api/125686
 */
export const getSalesLogsApi = (data: {
  buzId: string;
}) => {
  return http.post({
    url: '/crm-salesman/web/v1/operation-log/get-operation-list',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};
