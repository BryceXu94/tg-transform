import qs from 'qs';
import http from '@/core/http';
import { DOMAIN_SYSTEM_ENUM } from '@tiangong/utils';
import { IExchangeTokenRes, IUserInfoRes, IUpdateUserPasswordReq } from '@/api/account/type';

/*
 * 根据code 换取token
 * */
export const exchangeToken = (code: string) => {
  return http.post<IExchangeTokenRes>({
    server: DOMAIN_SYSTEM_ENUM.sso,
    url: '/saas-sso/auth/exchangeToken',
    data: qs.stringify({ code }),
    loading: true,
    config: {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      withCredentials: false,
    },
  });
};

/**
 * 【SSO】退出登陆
 */
export const logoutBySSO = () => {
  return http.post({
    server: DOMAIN_SYSTEM_ENUM.sso,
    url: '/saas-sso/api/auth/logout',
    loading: true,
    config: {
      withCredentials: false,
    },
  });
};

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return http.post<IUserInfoRes>({
    server: DOMAIN_SYSTEM_ENUM.tiangong,
    url: '/sso-center/admin/users/info',
    loading: true,
  });
}

/**
 * 修改当前用户密码
 */
export function updateUserPassword(data: IUpdateUserPasswordReq) {
  return http.post({
    url: '/sso-center/admin/users/modifyPassword',
    loading: true,
    data,
  });
}
