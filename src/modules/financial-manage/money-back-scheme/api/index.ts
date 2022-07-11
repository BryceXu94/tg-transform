import http from '@/core/http';
import {
  IGetMoneyBackSchemeListReq,
  IGetMoneyBackSchemeListRes,
  IGetMoneyBackSchemeSummaryRes,
  IUpdateMoneyBackSchemeDateReq,
} from './types';

/**
 * 获取回款计划列表
 * yapi：https://yapi.ibaibu.com/project/2286/interface/api/144089
 */
export const getMoneyBackSchemeList = (data: IGetMoneyBackSchemeListReq) => {
  return http.post<IGetMoneyBackSchemeListRes>({
    url: '/crm-finance/web/v1/repayment-plan/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取回款计划汇总
 * yapi：https://yapi.ibaibu.com/project/2286/interface/api/144425
 */
export const getMoneyBackSchemeSummary = (data: IGetMoneyBackSchemeListReq) => {
  return http.post<IGetMoneyBackSchemeSummaryRes>({
    url: '/crm-finance/web/v1/repayment-plan/repayment-count',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 设置预计回款日
 * yapi：https://yapi.ibaibu.com/project/2286/interface/api/144097
 */
export const updateMoneyBackSchemeDate = (data: IUpdateMoneyBackSchemeDateReq) => {
  return http.post({
    url: '/crm-finance/web/v1/repayment-plan/update-date',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};
