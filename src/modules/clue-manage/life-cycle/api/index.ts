import http from '@/core/http';
import {
  IGetCluesLifeCycleBarDataReq,
  IGetCluesLifeCycleBarDataRes,
  IGetCluesLifeCycleFunnelDataReq,
  IGetCluesLifeCycleFunnelDataRes,
  IGetUserOrgOptions,
} from './type';

/**
 * 客户线索命周期-柱状对比图
 * @see https://yapi.ibaibu.com/project/2106/interface/api/145353
 */
export const getCluesLifeCycleBarData = (data: IGetCluesLifeCycleBarDataReq) => {
  return http.post<IGetCluesLifeCycleBarDataRes>({
    url: '/crm-customer/web/v1/life-cycle/track-life-cycle-comparing',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};
/**
 * 客户档案-柱状对比图
 * @see https://yapi.ibaibu.com/project/2106/interface/api/145361
 */
export const getRecordLifeCycleBarData = (data: IGetCluesLifeCycleBarDataReq) => {
  return http.post<IGetCluesLifeCycleBarDataRes>({
    url: '/crm-customer/web/v1/life-cycle/customer-life-cycle-comparing',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 客户线索漏斗
 * @see https://yapi.ibaibu.com/project/2106/interface/api/145305
 */
export const getCluesLifeCycleFunnelData = (data: IGetCluesLifeCycleFunnelDataReq) => {
  return http.post<IGetCluesLifeCycleFunnelDataRes>({
    url: '/crm-customer/web/v1/life-cycle/track-life-cycle',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 客户档案漏斗
 * @see https://yapi.ibaibu.com/project/2106/interface/api/145313
 */
export const getRecordLifeCycleFunnelData = (data: IGetCluesLifeCycleFunnelDataReq) => {
  return http.post<IGetCluesLifeCycleFunnelDataRes>({
    url: '/crm-customer/web/v1/life-cycle/customer-life-cycle',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 查询用户组织节点下拉选项
 * @see https://yapi.ibaibu.com/project/2106/interface/api/151873
 */
export const getUserOrgOptions = () => {
  return http.get<IGetUserOrgOptions>({
    url: '/crm-customer/web/v1/life-cycle/bd-org',
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};
