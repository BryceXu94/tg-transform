import Interceptors, { ILogout } from './Interceptor';
import axios from 'axios';
import qs from 'qs';
import { API_BASE, currentEnv } from './env';
import {
  IRequestConfig,
  IResponse,
  IPromise,
  IEnvItem,
  ISystemDomainMap,
  IHttpAccount,
} from './type';
import { DOMAIN_ENV_ENUM, DOMAIN_SYSTEM_ENUM } from '@tiangong/utils';

class Request {
  private instance = axios.create({
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    withCredentials: true,
  });

  private interceptors = new Interceptors();

  public set logout(value: ILogout) {
    this.interceptors.logout = value;
  }

  public get account(): IHttpAccount | null {
    return this.interceptors.account;
  }

  public set account(value: IHttpAccount | null) {
    this.interceptors.account = value;
  }

  private _systemDomainMap: ISystemDomainMap = API_BASE;

  public get systemDomainMap() {
    return this._systemDomainMap;
  }

  public set systemDomainMap(value) {
    this.interceptors.systemDomainMap = value;
    this._systemDomainMap = value;
  }

  public evnReadyPromise;

  constructor() {
    const { request, response } = this.instance.interceptors;
    request.use(config => this.interceptors.handleRequestDefault(config), error => Promise.reject(error));
    request.use(config => this.interceptors.handleRequestConfigUrl(config));
    request.use(config => this.interceptors.handleRequestDuplicate(config));
    request.use(config => this.interceptors.handleRequestParams(config));
    request.use(config => this.interceptors.handleRequestHeaderParams(config));
    response.use(config => this.interceptors.handleResponseDefault(config));
    response.use(config => this.interceptors.handleResponseSuccess(config));
    response.use(config => this.interceptors.handleResponseError(config), err => this.interceptors.handleError(err));
    this.evnReadyPromise = this.getEnv();
  }

  get<T = any>({
    ...requestConfig
  }: IRequestConfig): IPromise<T> {
    return this.request<IResponse<T>>({ method: 'GET', ...requestConfig }).then(res => res.data);
  }

  post<T = any>({
    ...requestConfig
  }: IRequestConfig): IPromise<T> {
    return this.request<IResponse<T>>({ method: 'POST', ...requestConfig }).then(res => res.data);
  }

  put<T = any>({
    ...requestConfig
  }: IRequestConfig): IPromise<T> {
    return this.request<IResponse<T>>({ method: 'PUT', ...requestConfig }).then(res => res.data);
  }

  delete<T = any>({
    ...requestConfig
  }: IRequestConfig): IPromise<T> {
    return this.request<IResponse<T>>({ method: 'DELETE', ...requestConfig }).then(res => res.data);
  }

  async request<T = any>({
    method = 'GET',
    params = {},
    data = {},
    config = {},
    isDeleteOss = true,
    ...requestConfig
  }: IRequestConfig) {
    const defaultConfig: IRequestConfig = {
      server: DOMAIN_SYSTEM_ENUM.tiangong,
      url: '',
      method,
      params,
      data,
      loading: false,
      loadingMessage: '加载中...',
      responseType: 'json',
      isCancelDuplicateUrlRequests: false,
      isNotCancel: false,
      isDeleteOss,
      ...config,
    };

    const mergeConfig = Object.assign({}, {
      ...defaultConfig,
      ...requestConfig,
    });

    if (method === 'GET' || method === 'DELETE') {
      mergeConfig.paramsSerializer = (requestParams: any) => {
        return qs.stringify(requestParams);
      };
    }

    mergeConfig.cancelToken = new axios.CancelToken((c) => {
      mergeConfig.cancelFn = c;
    });
    await this.evnReadyPromise;
    return this.instance.request<T>(mergeConfig);
  }

  private processSystemDomain = (envList: IEnvItem[], curEnv: DOMAIN_ENV_ENUM) => {
    return envList.filter(it => it.domainEnv === curEnv).reduce((result, it) => {
      result[it.domainSystem] = it.domainBaseUrl;
      return result;
    }, {} as Partial<Record<DOMAIN_SYSTEM_ENUM, string>>);
  };

  private async getEnv() {
    const { data = [] } = await this.get<IEnvItem[]>({
      url: `/api/domain/conf/${currentEnv}`,
      loading: true,
      server: DOMAIN_SYSTEM_ENUM.tiangong,
    });
    this.systemDomainMap = this.processSystemDomain(data, currentEnv);
  }
}

export default Request;
