import http from '@/core/http';
import { DOMAIN_SYSTEM_ENUM } from '@tiangong/utils';
import {
  IDataPermissionConfigPageReq,
  IDataPermissionConfigPageRes,
  IDataPermissionConfigDetailReq,
  IDataPermissionConfigDetailRes,
  IDataPermissionConfigSaveReq,
  IDataPermissionConfigUpdateReq,
} from './type';

/**
 * 数据权限列表
 * @see https://yapi.ibaibu.com/project/2226/interface/api/157097
 */
export const getDataPermissionConfigList = (params: IDataPermissionConfigPageReq) => {
  const url = '/crm-salesman/web/v1/data-permission-config/page';
  return http.post<IDataPermissionConfigPageRes>({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    data: params,
    loading: true,
  });
};

/**
 * 数据权限详情
 * @see https://yapi.ibaibu.com/project/2226/interface/api/157105
 */
export const getDataPermissionConfigDetail = (params: IDataPermissionConfigDetailReq) => {
  const url = '/crm-salesman/web/v1/data-permission-config/detail';
  return http.post<IDataPermissionConfigDetailRes>({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    data: params,
    loading: true,
  });
};

/**
 * 创建数据权限
 * @see https://yapi.ibaibu.com/project/2226/interface/api/157113
 */
export const createDataPermissionConfig = (params: IDataPermissionConfigSaveReq) => {
  const url = '/crm-salesman/web/v1/data-permission-config/save';
  return http.post({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    data: params,
    loading: true,
  });
};

/**
 * 编辑数据权限
 * @see https://yapi.ibaibu.com/project/2226/interface/api/157121
 */
export const editDataPermissionConfig = (params: IDataPermissionConfigUpdateReq) => {
  const url = '/crm-salesman/web/v1/data-permission-config/update';
  return http.post({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    data: params,
    loading: true,
  });
};

/**
 * 删除
 * @see https://yapi.ibaibu.com/project/2226/interface/api/157129
 */
export const deleteDataPermissionConfig = (params: { configId: string; }) => {
  const url = '/crm-salesman/web/v1/data-permission-config/delete';
  return http.post({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    data: params,
    loading: true,
  });
};

/**
 * 操作日志
 * yapi: https://yapi.ibaibu.com/project/2226/interface/api/125686
 */
export const getSalesLogsApi = (data: { buzId: string; }) => {
  return http.post({
    url: '/crm-salesman/web/v1/operation-log/get-operation-list',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};
