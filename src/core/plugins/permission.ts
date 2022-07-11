import { useMenuStore } from '@/store/menu';
import { useAccountStore } from '@/store/account';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import router from '@/router';
import { jumpSSOLogin } from '@/core/utils/router';
import http from '@/core/http';
import { DOMAIN_SYSTEM_ENUM } from '@tiangong/utils';
import { SSO_AUTHORIZATION_CODE } from '@/constant';

NProgress.configure({ showSpinner: true });

const hasRoute = (route: RouteLocationNormalized) => {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  const { authMenuList } = useMenuStore();
  return authMenuList.includes(route.name as string);
};

const pathHandler = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const { token, currentCompany } = useAccountStore();
  const isLogin = token;
  const selectedCompany = currentCompany;
  const isLoginPath = to.path === '/login';
  const noMatchRouter = to.matched.length === 0;
  const noAuth = !to.meta.auth;
  const redirectUrl = encodeURIComponent(to.fullPath);

  const ssoAuthorizationCode = to.query[SSO_AUTHORIZATION_CODE];
  if (ssoAuthorizationCode) {
    delete to.query[SSO_AUTHORIZATION_CODE];
  }

  const validators = [
    // 是否存在 ssoAuthorizationCode 如果存在 删除code 进入页面
    { rule: !!ssoAuthorizationCode, params: { path: to.path, query: to.query, params: to.params, replace: true } },
    // 没有匹配对应路由 直接调整404
    { rule: noMatchRouter, params: { path: '/redirect/404', replace: true } },
    // 登陆过 && 进入登陆页面 调整首页
    { rule: isLogin && isLoginPath, params: { path: '/' } },
    // 不需要登陆 直接下一步
    { rule: noAuth },
    // 已登录 && 没有选择租户 && 不是选择租户页面
    {
      rule: isLogin && !selectedCompany && to.name !== 'SelectCompany',
      params:
        {
          name: 'SelectCompany',
          query: { redirect: redirectUrl },
          replace: true,
        },
    },
    // 已登录 && 选择租户页面
    { rule: isLogin && to.name === 'SelectCompany' },
    // 没有登陆 && 不是登陆页面 调整登陆页面
    { rule: !isLogin && !isLoginPath, params: { path: '/login', query: { redirect: redirectUrl }, replace: true } },
    // 登陆过 && 有权限 直接下一步
    { rule: isLogin && hasRoute(to) },
    // 登陆过 && 没有权限 跳过
    { rule: isLogin && !hasRoute(to), params: { path: '/redirect/403', replace: true } },
  ];
  const found = validators.find((valid) => {
    return valid.rule;
  });
  if (found && found.params) {
    if (found.params.path === '/login') {
      const url = http.systemDomainMap[DOMAIN_SYSTEM_ENUM.sso];
      if (url) {
        jumpSSOLogin(url);
      }
      next();
    } else {
      next(found.params);
    }
  } else {
    next();
  }
};

// 处理当前用户信息
const handleCurrentUser = async (to: RouteLocationNormalized) => {
  // 处理 根据code 换token
  const ssoAuthorizationCode = to.query[SSO_AUTHORIZATION_CODE] as string;
  const accountStore = useAccountStore();
  if (ssoAuthorizationCode) {
    await accountStore.exchangeToken(ssoAuthorizationCode);
  }
  // 已登陆
  if (accountStore.token && to.fullPath.toUpperCase() !== '/LOGIN') {
    // 获取用户信息
    await accountStore.getAccountInfo();
    // 存在租户id才获取资源
    if (accountStore.currentCompany) {
      // 获取菜单
      await useMenuStore().getMenus();
    }
  }
};

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  await http.evnReadyPromise;
  await handleCurrentUser(to);
  pathHandler(to, from, next);
});

router.afterEach(() => {
  NProgress.done();
});
