import http from '@/core/http';
import { DOMAIN_SYSTEM_ENUM } from '@tiangong/utils';
import {
  IGetDictValueBatchListRes,
} from './type.d';

// 获取字典值 - 批量
export const getDictValueBatchList = (data: string[]) => {
  const url = '/ufg/web/v1/dict-value/batch-list';
  return http.post<IGetDictValueBatchListRes[]>({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url,
    data: { dictCodes: data },
  });
};
