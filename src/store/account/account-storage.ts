import { ENV_PREFIX } from '@/core/http/env';
import { SYSTEM_ENUM } from '@/constant';

const accountStorage = {
  tokenKey: `${SYSTEM_ENUM.CCS}-tokenKey-${ENV_PREFIX}`,
  companyKey: `${SYSTEM_ENUM.CCS}-companyKey-${ENV_PREFIX}`,
  getToken(): string {
    return localStorage.getItem(this.tokenKey) || '';
  },
  setToken(token: string) {
    return localStorage.setItem(this.tokenKey, token);
  },
  removeToken() {
    return localStorage.removeItem(this.tokenKey);
  },
  getCompany(): string {
    const token = localStorage.getItem(this.companyKey);
    return token || '';
  },
  setCompany(token: string) {
    localStorage.setItem(this.companyKey, token);
  },
  removeCompany() {
    return localStorage.removeItem(this.companyKey);
  },
};

export default accountStorage;
