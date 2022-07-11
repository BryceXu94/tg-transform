import http from '@/core/http';
import {
  IColumnCustomerInfoPageReq,
  IColumnCustomerInfoPageRes,
  IColumnCustomerInfoListResItem,
} from './types';

/**
 * 列表客户列表
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/125546
 */
export const getcolumnCustomerPageApi = (data: IColumnCustomerInfoPageReq) => {
  return http.post<IColumnCustomerInfoPageRes>({
    url: '/crm-customer/web/v1/columnCustomerInfo/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 审核记录
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/125548
*/
export const getcolumnCustomerRecordApi = (columnCustomerId: string) => {
  return http.get<IColumnCustomerInfoListResItem[]>({
    url: '/crm-customer/web/v1/columnCustomerInfo/list',
    isCancelDuplicateUrlRequests: true,
    params: {
      columnCustomerId,
    },
    loading: true,
  });
};
