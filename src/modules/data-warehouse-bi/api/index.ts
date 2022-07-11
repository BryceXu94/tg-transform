import http from '@/core/http';

/**
 * 创新数仓数据看板外嵌CRM
 * @see https://yapi.ibaibu.com/project/2226/interface/api/139441
 */
export const boardGetToken = () => {
  return http.get<string>({
    url: '/crm-salesman/web/v1/outer-block/board/get-token',
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};
