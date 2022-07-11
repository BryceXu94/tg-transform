import http from '@/core/http';
import { AxiosRequestConfig } from 'axios';
import { DOMAIN_SYSTEM_ENUM } from '@tiangong/utils';
import { FileUploadResponseItem } from './type.d';

export const uploadFile = (
  data: FormData,
  isNotCancel = true,
  onUploadProgress?: AxiosRequestConfig['onUploadProgress'],
) => {
  return http.post<FileUploadResponseItem[]>({
    url: '/api/file/upload',
    data,
    loading: true,
    isNotCancel,
    isUploadFileApi: true,
    onUploadProgress,
  });
};

/**
 * 获取 获取省市区数据
 * @param {*} params
 * @returns
 */
export const getAreaTree = (params: any) => {
  const url = '/ufg/web/v1/area/queryAllAreas';

  return http.get({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    params,
  });
};
