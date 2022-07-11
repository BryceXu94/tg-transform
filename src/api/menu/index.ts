import http from '@/core/http';
import { DOMAIN_SYSTEM_ENUM } from '@tiangong/utils';
import { IGetUserResourceItemRes } from '@/api/menu/type';

/**
 * 获取用户拥有的权限（菜单、按钮等）
 */
export function getUserResource() {
  return http.post<IGetUserResourceItemRes[]>({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url: '/sso-center/resources/get-by-user-id',
    loading: true,
  });
}
