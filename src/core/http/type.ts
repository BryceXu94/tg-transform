import { AxiosRequestConfig, Canceler } from 'axios';
import { DOMAIN_ENV_ENUM, DOMAIN_SYSTEM_ENUM } from '@tiangong/utils';

export interface IHttpCompanyInfoItem {
  /*
  * 租户Id
  * */
  companyId: string;
  /*
  * 租户编码
  * */
  companyCode: string;
  /*
  * 租户名称
  * */
  companyName: string;
}

export interface IHttpAccount {
  /*
  * 当前租户
  * */
  currentCompanyInfo?: IHttpCompanyInfoItem;
  /*
  * 用户ID
  * */
  userId?: string;
  /*
  * token
  * */
  ssoToken: string;
  /*
  * 用户名称
  * */
  username?: string;
}

export interface IRequestConfig extends AxiosRequestConfig {
  /**
   * 强制不取消请求
   */
  isNotCancel?: boolean;
  cancelFn?: Canceler;
  /**
   * 是否显示loading
   */
  loading?: boolean;
  /**
   * 全局loading 提示语
   */
  loadingMessage?: string;
  /**
   * 调用的域名
   */
  server?: DOMAIN_SYSTEM_ENUM;
  /**
   * 缓存请求 cancelToken 的key
   */
  cacheRequestKey?: string;
  /**
   * GET 请求设置时间戳参数, 解决缓存问题
   */
  cache?: boolean;
  /**
   * 请求配置
   */
  config?: any;
  /**
   * 取消重复url 请求（不包含参数）
   */
  isCancelDuplicateUrlRequests?: boolean;
  /**
   * 用户信息
   */
  account?: IHttpAccount;
  /**
   * 是否上传接口
   */
  isUploadFileApi?: boolean;
  isDeleteOss?: boolean;
}

export interface IResponse<T = any> {
  data: T;
  successful: boolean;
  message?: string;
  code?: string;
}

export interface IPromise<T = any> extends Promise<IResponse<T>> {
}

export interface IndexObject {
  [key: string]: any;
}

export interface IEnvItem {
  id: string; // 主键id
  domainSystem: DOMAIN_SYSTEM_ENUM; // 域名所属系统
  domainBaseUrl: string; // 域名地址
  domainDesc: string; // 域名名称描述
  domainEnv: DOMAIN_ENV_ENUM; // 环境
  createdTime: string; // 创建时间
  revisedTime: string; // 更新时间
}

export type ISystemDomainMap = Partial<Record<DOMAIN_SYSTEM_ENUM, string>>;
