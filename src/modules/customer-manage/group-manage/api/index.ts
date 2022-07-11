import http from '@/core/http';
import {
  IGetGroupListReq,
  IGetGroupListRes,
  IGetGroupDetailRes,
  ICreateGroupReq,
} from './types';

/**
 * 获取集团管理列表
 */
export const getGroupList = (data: IGetGroupListReq) => {
  return http.post<IGetGroupListRes>({
    url: '/crm-customer/web/v1/group-info/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 获取集团详情
 */
export const getGroupDetail = (data: { id: string; }) => {
  return http.get<IGetGroupDetailRes>({
    url: `/crm-customer/web/v1/group-info/edit/${data.id}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

export const getEncryptGroupDetail = (data: { id: string; }) => {
  return http.get<IGetGroupDetailRes>({
    url: `/crm-customer/web/v1/group-info/detail/${data.id}`,
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 创建集团
 */
export const createGroup = (data: ICreateGroupReq) => {
  return http.post({
    url: '/crm-customer/web/v1/group-info/save',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 更新集团
 */
export const updateGroup = (data: ICreateGroupReq) => {
  return http.put({
    url: '/crm-customer/web/v1/group-info/update',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};
