import http from '@/core/http';
import {
  IFinanceRiskInfoPageReq,
  IFinanceRiskInfoPageRes,
  IFinanceRiskInfoDetailRes,
  IFinanceRiskInfoRiskProfileReq,
  IFinanceRiskInfoRiskRiseRes,
  IFinanceRiskInfoLastUpdateDateRes,
  IFinanceRiskInfoRiskStatisticRes,
  IFinanceRiskInfoRiskStatisticStateResItem,
} from './types';

/**
 * 金融风险列表(分页)
 * @see https://yapi.ibaibu.com/project/2106/interface/api/162545
 */
export const getFinanceRiskInfoPageApi = (params: IFinanceRiskInfoPageReq) => {
  const url = '/crm-customer/web/v1/finance-risk-info/page';
  return http.post<IFinanceRiskInfoPageRes>({
    url,
    data: params,
    loading: true,
    isCancelDuplicateUrlRequests: true,
  });
};

/**
 * 金融风险详情(分页)
 * @see https://yapi.ibaibu.com/project/2106/interface/api/162553
 */
export const getFinanceRiskInfoDetailApi = (customerId: string) => {
  const url = `/crm-customer/web/v1/finance-risk-info/detail/${customerId}`;
  return http.get<IFinanceRiskInfoDetailRes>({
    url,
    loading: true,
    isCancelDuplicateUrlRequests: true,
  });
};

/**
 * 近期风险上升客户列表-显示全部
 * @see https://yapi.ibaibu.com/project/2106/interface/api/162561
 */
export const getFinanceRiskInfoRiskRiseApi = (
  params: IFinanceRiskInfoRiskProfileReq,
) => {
  const url = '/crm-customer/web/v1/finance-risk-info/risk-rise';
  return http.post<IFinanceRiskInfoRiskRiseRes>({
    url,
    data: params,
    loading: true,
    isCancelDuplicateUrlRequests: true,
  });
};

/**
 * 最近一次同步时间
 * @see https://yapi.ibaibu.com/project/2106/interface/api/162569
 */
export const getFinanceRiskInfoLastUpdateDateApi = () => {
  const url = '/crm-customer/web/v1/finance-risk-info/last-update-date';
  return http.post<IFinanceRiskInfoLastUpdateDateRes>({
    url,
    loading: true,
    isCancelDuplicateUrlRequests: true,
  });
};

/**
 * 客户风险概览-统计图部分
 * @see https://yapi.ibaibu.com/project/2106/interface/api/163137
 */
export const getFinanceRiskInfoRiskStatisticApi = (
  params: IFinanceRiskInfoRiskProfileReq,
) => {
  const url = '/crm-customer/web/v1/finance-risk-info/risk-statistic';
  return http.post<IFinanceRiskInfoRiskStatisticRes>({
    url,
    data: params,
    loading: true,
    isCancelDuplicateUrlRequests: true,
  });
};

/**
 * 客户风险概览-统计状态
 * @see https://yapi.ibaibu.com/project/2106/interface/api/164129
 */
export const getFinanceRiskInfoRiskStatisticStateApi = (
  params: IFinanceRiskInfoRiskProfileReq,
) => {
  const url = '/crm-customer/web/v1/finance-risk-info/risk-statistic-state';
  return http.post<IFinanceRiskInfoRiskStatisticStateResItem[]>({
    url,
    data: params,
    loading: true,
    isCancelDuplicateUrlRequests: true,
  });
};
