import { RouteLocationNormalized, useRouter } from 'vue-router';
import { SYSTEM_ENUM, SSO_AUTHORIZATION_CODE } from '@/constant';

// 跳转SSO登陆页面
export const jumpSSOLogin = (ssoLoginUrl: string) => {
  const url = window.location.href;
  let path = '';
  let query = '';
  // 切除路径中的code
  if (url.indexOf('?') !== -1) {
    let search = '';
    [path, search] = url.split('?');
    const paramsKeys = search.split('&');
    paramsKeys.some((v, i) => {
      const [key] = v.split('=');
      if (key === SSO_AUTHORIZATION_CODE) {
        paramsKeys.splice(i, 1);
        return true;
      }
      return false;
    });
    if (paramsKeys.length) {
      query = `?${paramsKeys.join('&')}`;
    }
  } else {
    path = url;
  }
  window.location.href = `${
    ssoLoginUrl
  }/saas-sso/auth/toLogin?server=${encodeURIComponent(`${path}${query}`)}&systemCode=${SYSTEM_ENUM.CCS}`;
};

// 跳转SSO退出登陆页面
export const jumpSSOLogout = (ssoLoginUrl: string) => {
  window.location.href = `${
    ssoLoginUrl
  }/saas-sso/auth/logout?server=${encodeURIComponent(`${window.location.origin}/#/`)}&systemCode=${SYSTEM_ENUM.CCS}`;
};

export const getRouteUrl = (route: RouteLocationNormalized) => {
  const {
    path,
    params,
  } = route;
  let url = path;
  Object.keys(params).forEach((key) => {
    const val = params[key] as string;
    url = url.replace(new RegExp(val), key);
  });
  return url;
};

export function updateRouteUrl(query: {
  [key:string]: any;
}) {
  const router = useRouter();
  query = Object.assign({}, query);
  // 调用 this.$router.replace 路由重复时，报 Navigation Duplicated
  query.t = +new Date();
  // 编码中文
  Object.keys(query).forEach((key) => {
    const value = query[key];
    if (typeof value === 'object') {
      query[key] = encodeURIComponent(JSON.stringify(value));
    } else {
      query[key] = value ? encodeURIComponent(value) : '';
    }
  });
  router.replace({
    name: router.currentRoute.value.name!,
    query,
  });
}
