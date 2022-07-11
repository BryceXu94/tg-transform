import http from '@/core/http';
import { IFinishStatsPageReq, IFinishStatsPageRes } from './type';
import { DOMAIN_SYSTEM_ENUM } from '@tiangong/utils';
/**
 * 分页列表
 * @see https://yapi.ibaibu.com/project/2226/interface/api/158265
 */
export const getfinishStatsPageApi = (params: IFinishStatsPageReq) => {
  const url = '/crm-salesman/web/v1/sale-target/finish-stats/page';
  return http.post<IFinishStatsPageRes>({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    data: params,
    loading: true,
  });
};
