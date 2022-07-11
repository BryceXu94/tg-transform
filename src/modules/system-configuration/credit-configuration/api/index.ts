import http from '@/core/http';
import {
  ISubmitCreditConfigurationReq,
  IGetCreditConfigurationRes,
} from './types';

/**
 * 提交授信配置
 */
export const submitCreditConfiguration = (data: ISubmitCreditConfigurationReq) => {
  return http.post({
    url: '/crm-credit/web/v1/credit-config/submit',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取授信配置
 */
export const getCreditConfiguration = () => {
  return http.post<IGetCreditConfigurationRes>({
    url: '/crm-credit/web/v1/credit-config/list',
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};
