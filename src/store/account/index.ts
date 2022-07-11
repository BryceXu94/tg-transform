import { logoutBySSO, getUserInfo, exchangeToken } from '@/api/account';
import http from '@/core/http';
import { defineStore } from 'pinia';
import { useMenuStore } from '../menu';
import { IState, IStoreAccount } from './type';
import { ICompanyInfoItem } from '@/api/account/type';
import { jumpSSOLogout } from '@/core/utils/router';
import { DOMAIN_SYSTEM_ENUM } from '@tiangong/utils';
import accountStorage from './account-storage';

const initToken = () => {
  const token = accountStorage.getToken();
  http.account = Object.assign({}, http.account || {}, { ssoToken: token });
  return token;
};

export const useAccountStore = defineStore({
  id: 'account',
  state: (): IState => ({
    account: null,
    token: initToken(),
    currentCompany: null,
  }),
  // 定义修改state数据函数
  actions: {
    // 设置当前租户
    setCurrentCompany(currentCompany: ICompanyInfoItem) {
      this.currentCompany = currentCompany;
      http.account = Object.assign(
        { ssoToken: this.token! },
        http.account || {},
        { currentCompanyInfo: currentCompany },
      );
      this.updateAccountUserName(currentCompany.username);
      accountStorage.setCompany(currentCompany.companyId);
    },
    setCurrentAccount(account: IStoreAccount) {
      this.account = account;
      http.account = Object.assign({ ssoToken: this.token! }, http.account || {}, account);
    },
    updateAccountUserName(username: string) {
      http.account!.username = username;
      this.account!.username = username;
    },
    setCurrentToken(token: string) {
      this.token = token;
      http.account = Object.assign({}, http.account || {}, { ssoToken: token });
      accountStorage.setToken(token);
    },
    async exchangeToken(code: string) {
      try {
        if (this.token) return;
        const { data } = await exchangeToken(code);
        this.setCurrentToken(data.ssoToken);
      } catch (e) {
        console.log(e);
        throw Error('兑换token失败');
      }
    },
    // 处理租户
    handleCompany() {
      const account = this.account!;
      // 判断租户列表
      if (account.companyInfoList && account.companyInfoList.length && account.companyInfoList.length === 1) {
        this.setCurrentCompany(account.companyInfoList[0]);
        return;
      }
      const companyId = accountStorage.getCompany();
      // 租户Id
      if (companyId) {
        const findItem = account.companyInfoList.find(it => it.companyId === companyId);
        if (findItem) {
          this.setCurrentCompany(findItem);
        }
      }
      // 存在多个租户 并且内存没有租户的情况下 后续在后续路由拦截器会处理跳转
    },
    // 获取用户信息
    async getAccountInfo() {
      try {
        if (this.account) return;
        const { data } = await getUserInfo();
        this.setCurrentAccount(data);
        this.handleCompany();
      } catch (e) {
        console.log(e);
        throw Error('获取用户信息失败');
      }
    },
    async logout(isExpiration = false) {
      const menuStore = useMenuStore();
      try {
        if (!isExpiration) {
          await logoutBySSO();
        }
        this.token = '';
        this.account = null;
        this.currentCompany = null;
        accountStorage.removeToken();
        menuStore.clearMenus();
        http.account = null;
        const url = http.systemDomainMap[DOMAIN_SYSTEM_ENUM.sso];
        if (url) {
          jumpSSOLogout(url);
        } else {
          window.location.reload();
        }
      } catch (error) {
        console.log('logout error', error);
      }
    },
  },
});

http.logout = async (isExpiration) => {
  await useAccountStore().logout(isExpiration);
};
