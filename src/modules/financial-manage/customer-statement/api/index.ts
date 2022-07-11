import http from '@/core/http';
import {
  IGetCustomerStatementListReq,
  IGetCustomerStatementListRes,
  IUpdateCustomerStatementTypeReq,
  IConfirmOrRejectStatementReq,
  IGetCustomerStatementDetailRes,
  IGetLogListRes,
  IGetCustomerBillDetailRes,
  IGetCustomerSubBillDetailRes,
} from './types';

/**
 * 获取客户对账单列表
 */
export const getCustomerStatementList = (data: IGetCustomerStatementListReq) => {
  return http.post<IGetCustomerStatementListRes>({
    url: '/crm-finance/web/v1/bill/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取客户对账单详情
 */
export const getCustomerStatementDetail = (data: { billId: string; }) => {
  return http.get<IGetCustomerStatementDetailRes>({
    url: `/crm-finance/web/v1/bill/detail/${data.billId}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 更改客户对账单类型
 */
export const updateCustomerStatementType = (data: IUpdateCustomerStatementTypeReq) => {
  return http.post({
    url: '/crm-finance/web/v1/bill/change-type',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 确认驳回对账单
 */
export const confirmOrRevokeStatement = (data: IConfirmOrRejectStatementReq) => {
  return http.post({
    url: '/crm-finance/web/v1/bill/confirm-or-reject',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 导出对账单
 */
export const exportStatement = (data: { billId: string; }) => {
  return http.get({
    url: `/crm-finance/web/v1/bill/export-excel/${data.billId}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
    responseType: 'blob',
  });
};

/**
 * 操作日志
 */
export const getLogList = (data: { bizId: string; }) => {
  return http.get<IGetLogListRes[]>({
    url: `/crm-finance/web/v1/common-log/get-log-list/${data.bizId}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取账单信息
 */
export const getCustomerBillDetail = (data: { billId: string; }) => {
  return http.get<IGetCustomerBillDetailRes>({
    url: `/crm-finance/web/v1/bill/info/${data.billId}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取子账单信息
 */
export const getCustomerSubBillDetail = (data: { billDetailCode: string; }) => {
  return http.get<IGetCustomerSubBillDetailRes>({
    url: `/crm-finance/web/v1/bill/sub/detail/${data.billDetailCode}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};
