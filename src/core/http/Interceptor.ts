/* eslint-disable class-methods-use-this */
import { IHttpAccount, IndexObject, IRequestConfig, ISystemDomainMap } from './type';
import axios, { AxiosError, AxiosResponse, Canceler } from 'axios';
import { hideFullScreenLoading, showFullScreenLoading } from './helper';
import { API_BASE } from './env';
import Router from '@/router';
import { ElMessage } from 'element-plus';
import Oss from './Oss';
import { DOMAIN_SYSTEM_ENUM } from '@tiangong/utils';
import { SYSTEM_ENUM } from '@/constant';
import qs from 'qs';
import accountStorage from '@/store/account/account-storage';

export interface ILogout {
  (isExpiration: boolean): void;
}

class Interceptor {
  // 缓存请求对象。用于取消重复请求
  private cacheRequestPromise: { [key: string]: Canceler; } = {};

  // 401:tiangong token过期错误码，12053:是sso错误码
  private jumpLoginCodeList = ['401', '12053'];

  private _systemDomainMap: ISystemDomainMap = API_BASE;

  public oss;

  constructor() {
    this.oss = new Oss();
  }

  public get systemDomainMap(): ISystemDomainMap {
    return this._systemDomainMap;
  }

  public set systemDomainMap(value: ISystemDomainMap) {
    this._systemDomainMap = value;
    this.oss.setDomainMap(value);
  }

  private _account: IHttpAccount | null = null;

  private _logout: ILogout = () => {
    console.error('退出登录方法未被实现');
  };

  public get logout(): ILogout {
    return this._logout;
  }

  public set logout(value: ILogout) {
    this._logout = value;
  }

  public get account(): IHttpAccount | null {
    return this._account;
  }

  public set account(value: IHttpAccount | null) {
    this._account = value;
  }

  /**
     * 默认拦截器 - 处理loading
     * @param config IRequestConfig
     */
  handleRequestDefault(config: IRequestConfig): IRequestConfig {
    // 显示 loading
    if (config.loading) {
      const message = config.loadingMessage;
      showFullScreenLoading(message);
    }
    return config;
  }

  /**
   * 请求拦截器 - 处理重复请求拦截器
   * @param config IRequestConfig
   */
  handleRequestDuplicate(config: IRequestConfig): IRequestConfig {
    const {
      isNotCancel,
    } = config;
    // 发起请求时，取消掉当前正在进行的相同请求
    let cacheRequestKey = config.url!;
    const _data = Object.assign({}, config.data);
    delete _data._;
    const _params = Object.assign({}, config.params);
    delete _params._;

    if (config.isCancelDuplicateUrlRequests) {
      cacheRequestKey += config.method;
      config.cacheRequestKey = cacheRequestKey;
      // 取消重复请求
      if (this.cacheRequestPromise[cacheRequestKey] && !isNotCancel) {
        this.cacheRequestPromise[cacheRequestKey](`Cancel operation ${config.url}`);
      }
      this.cacheRequestPromise[cacheRequestKey] = config.cancelFn!;
    }

    return config;
  }

  /**
   * 请求拦截器 - 处理请求url域名拼接
   * @param config IRequestConfig
   */
  handleRequestConfigUrl(config: IRequestConfig): IRequestConfig {
    // 处理完整的 URL. 非 http, https 的才处理
    const isExternal = /^(https?:)/.test(config.url!);
    if (!isExternal) {
      const hasServer = !!this.systemDomainMap[config.server!];
      if (!hasServer) {
        console.warn(`API_BASE not found 'server: ${config.server}' config`);
        throw new Error('查找不到对应server');
      }
      config.url = `${this.systemDomainMap[config.server!]}${config.url}`;
    }
    return config;
  }

  // 请求参数处理
  handleRequestParams(config: IRequestConfig): IRequestConfig {
    const METHOD = config.method!.toLowerCase();
    const { server, isDeleteOss } = config;
    // 如果是旧接口，参数不做处理
    if (server !== DOMAIN_SYSTEM_ENUM.tiangong) return config;

    let keyName: 'params' | 'data' = 'params';
    if (['post', 'put', 'delete'].includes(METHOD)) {
      keyName = 'data';
    }

    let reqParams = config[keyName];
    if (reqParams instanceof FormData) {
      return config;
    }
    if (METHOD === 'get') {
      if (typeof reqParams === 'string') {
        reqParams = qs.parse(reqParams);
        // GET 请求设置时间戳参数, 解决缓存问题
        reqParams._ = Date.now();
        reqParams = qs.stringify(reqParams);
      } else {
        // GET 请求设置时间戳参数, 解决缓存问题
        reqParams._ = Date.now();
      }
    }
    // 清除 oss 域名
    if (isDeleteOss) {
      config[keyName] = this.oss.deleteOssDomainAll(reqParams);
    }
    return config;
  }

  /**
   * 请求拦截器 - 添加header参数
   * @param config IRequestConfig
   */
  handleRequestHeaderParams(config: IRequestConfig): IRequestConfig {
    const account = this.account || config.account || (() => {
      const _token = accountStorage.getToken();
      return Object.assign({}, config.account, { ssoToken: _token });
    })();
    // 设置 SSO Token
    config.headers.ssoToken = account ? account.ssoToken : '';
    // 系统编码
    config.headers['System-Code'] = SYSTEM_ENUM.CCS;
    // 租户ID
    let companyId = account ? account.currentCompanyInfo?.companyId : '';

    if (!companyId) {
      companyId = accountStorage.getCompany();
    }
    config.headers['Tenant-Id'] = companyId;
    return config;
  }

  /**
   * 响应拦截器 - 默认拦截器 处理loading
   * @param response AxiosResponse
   */
  handleResponseDefault(response: AxiosResponse): AxiosResponse {
    const requestConfig: IRequestConfig = response.config;
    delete this.cacheRequestPromise[requestConfig.cacheRequestKey!];
    if (requestConfig.loading) {
      hideFullScreenLoading();
    }
    return response;
  }

  middlewareFileUrl = (response: AxiosResponse<any>) => {
    if ((response.config as IRequestConfig).isUploadFileApi && response.data.data) {
      response.data.data = this.oss.mapFileUrl(response.data.data);
    }
  }

  /**
 * 响应拦截器 - 判断业务响应是否 成功
 * @param response AxiosResponse
 */
  handleResponseSuccess(response: AxiosResponse): AxiosResponse<any> | Promise<AxiosResponse<any>> {
    const { data = {} } = response;
    if (response.config.responseType!.toLowerCase() === 'blob') {
      return Promise.resolve(response);
    }
    const { successful } = data;
    if (successful) {
      // 文件上传接口，响应字段 url 补全 oss域名
      this.middlewareFileUrl(response);
      return Promise.resolve(response);
    }
    return response;
  }

  /**
 * 响应拦截器 - 处理响应异常（业务异常）
 * @param response AxiosResponse
 */
  async handleResponseError(response: AxiosResponse): Promise<AxiosResponse<any>> {
    const { data } = response;
    if (response.config.responseType!.toLowerCase() === 'blob') {
      return Promise.resolve(response);
    }
    const { successful, code, message } = data;
    if (!successful) {
      // 没有登录 跳转到登录页面
      if (this.jumpLoginCodeList.includes(code)) {
        ElMessage.error(message || '会话过期， 请重新登陆!');
        const isExpiration = true;
        await this.logout(isExpiration);
        return Promise.reject(data);
      }

      // 没有权限 跳转到403
      if (code === '403') {
        Router.replace('/403');
        return Promise.reject(data);
      }

      ElMessage.error(message || '');
      return Promise.reject(data);
    }
    return response;
  }

  /**
   * 响应拦截器 - 处理响应失败拦截器 (http异常&canceled)
   * @param error any
   */
  async handleError(error: AxiosError): Promise<never> {
    hideFullScreenLoading();
    // 通过 axios.isCancel(err) 判断是否是 canceled的请求
    if (axios.isCancel(error)) {
      return Promise.reject({
        isCancel: true,
        status: 'canceled',
        statusText: 'Cancel operation',
        message: error.message,
      });
    }
    if (error.response) {
      const messages: IndexObject = {
        400: '错误请求',
        401: '会话过期，请重新登录',
        403: '拒绝访问',
        404: '请求错误，未找到该资源',
        405: '请求方法未允许',
        408: '请求超时',
        500: '服务器端出错',
        501: '网络未实现',
        502: '网络错误',
        503: '服务不可用',
        504: '网络超时',
        505: 'http版本不支持该请求',
      };
      error.message = messages[error.response.status] || `连接错误${error.response.status}`;
    } else {
      error.message = error.message || '连接到服务器失败';
    }

    try {
      const { status, statusText } = error.response ?? {};
      // 登录过期
      if (status === 401) {
        ElMessage.closeAll();
        ElMessage.error(error.message);
        const isExpiration = true;
        await this.logout(isExpiration);
        return Promise.reject(error);
      }

      // 非登录过期错误
      ElMessage.error(`${status} - ${error.message}`);

      return Promise.reject({
        status,
        statusText,
        message: error.message,
      });
    } catch (err) {
      console.log(err);
      return Promise.reject({
        status: '',
        statusText: '未知错误',
        message: error.message,
      });
    }
  }
}

export default Interceptor;
