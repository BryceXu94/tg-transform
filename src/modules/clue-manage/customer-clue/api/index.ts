import http from '@/core/http';
import {
  IGetCluesListReq,
  IGetCluesListRes,
  IGetCluesDetailRes,
  IConfirmCluesReq,
  IConfirmCluesRes,
  IGetCluesAuditLogsRes,
  IBatchAuditCluesReq,
  IGetCluesStatisticalRes,
  IGetCluesStatisticalReq,
  IGetCluesOperationLogsRes,
} from './type';

/**
 * 客户线索列表
 * @see: https://yapi.ibaibu.com/project/2106/interface/api/144657
 */
export const getCluesList = (data: IGetCluesListReq) => {
  return http.post<IGetCluesListRes>({
    url: '/crm-customer/web/v1/customer-track/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 线索状态统计
 * @see: https://yapi.ibaibu.com/project/2106/interface/api/144705
 */
export const getCluesStatistical = (data: IGetCluesStatisticalReq) => {
  return http.post<IGetCluesStatisticalRes>({
    url: '/crm-customer/web/v1/customer-track/state-count',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 客户线索详情
 * @see: https://yapi.ibaibu.com/project/2106/interface/api/146793
 */
export const getCluesDetail = (data: { id: string; }) => {
  return http.get<IGetCluesDetailRes>({
    url: `/crm-customer/web/v1/customer-track/edit/track-info/${data.id}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};
/**
 * 客户线索详情 脱敏
 * @see: https://yapi.ibaibu.com/project/2106/interface/api/146793
 */
export const getEncryptionCluesDetail = (data: { id: string; }) => {
  return http.get<IGetCluesDetailRes>({
    url: `/crm-customer/web/v1/customer-track/detail/track-info/${data.id}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 提交保存
 * @see: https://yapi.ibaibu.com/project/2106/interface/api/144673
 */
export const confirmClues = (data: IConfirmCluesReq) => {
  return http.post<IConfirmCluesRes>({
    url: '/crm-customer/web/v1/customer-track/submit-audit',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 暂存线索
 * @see: https://yapi.ibaibu.com/project/2106/interface/api/145545
 */
export const stageClues = (data: IConfirmCluesReq) => {
  return http.post<IConfirmCluesRes>({
    url: '/crm-customer/web/v1/customer-track/temporary-save',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 审核记录
 * @see: https://yapi.ibaibu.com/project/2106/interface/api/145265
 */
export const getCluesAuditLogs = (data: { customerTrackId: string; }) => {
  return http.get<IGetCluesAuditLogsRes[]>({
    url: `/crm-customer/web/v1/customer-track-audit/audit-list/${data.customerTrackId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};
/**
 * 操作日志
 * @see: https://yapi.ibaibu.com/project/2106/interface/api/116014
 */
export const getCluesOperationLogs = (data: { buzId: string; }) => {
  return http.post<IGetCluesOperationLogsRes[]>({
    url: '/crm-customer/web/v1/operation-log/get-operation-list',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 批量/审核线索
 * @see: https://yapi.ibaibu.com/project/2106/interface/api/144713
 */
export const batchAuditClues = (data: IBatchAuditCluesReq) => {
  return http.post({
    url: '/crm-customer/web/v1/customer-track-audit/track-audit',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 激活线索
 * @see: https://yapi.ibaibu.com/project/2106/interface/api/146801
 */
export const activeClue = (data: {
  trackId: string;
}) => {
  return http.get({
    url: `/crm-customer/web/v1/customer-track-audit/track-active/${data.trackId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};
