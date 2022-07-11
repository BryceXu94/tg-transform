import { YES_OR_NO_NUMBER_ENUM, BUSINESS_MODE_ENUM } from '@/constant/global';

// 租户管理params
export interface ICustomerTenantPageReq {
  customerName?: string;
  phone?: string;
  isEnable?: string;
  pageNum: number;
  pageSize: number;
}

// 租户管理列表
export interface ICustomerTenantPageListItem {
  /**
   * 客户租户主键
   */
  tenantId: string;
  /**
   * sso租户id
   */
  ssoTenantId: string;
  /**
   * 客户id
   */
  customerId: string;
  /** 客户名称 */
  customerName: string;
  /** 业务类型 */
  businessType: string;
  /**
   * 是否启用，1--启用，0--禁用
   */
  isEnable: string;
  /**
   * 创建人名称
   */
  creatorName: string;
  /**
   * 创建时间
   */
  createdTime: string;
  /**
   * 管理员姓名
   */
  userName: string;
  userId: string;
  /**
   * 管理员电话
   */
   phone: string;
}
export interface ICustomerTenantPageRes {
  page: string;
  total: string;
  list: ICustomerTenantPageListItem[];
}

/**
 * 请求参数对象
 */
export interface ICustomerTenantSaveReq {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 联系人id
   */
  contactId: string;
}
export interface ICustomerTenantSaveRes {
  /**
   * 客户租户主键
   */
  tenantId: string;
  /**
   * sso租户id
   */
  ssoTenantId: string;
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 是否启用，1--启用，0--禁用
   */
  isEnable: string;
  /**
   * 创建人名称
   */
  creatorName: string;
  /**
   * 创建时间
   */
  createdTime: string;
  /**
   * 管理员姓名
   */
  userName: string;
  /**
   * 管理员电话
   */
  phone: string;
}

// 账号列表
/**
 * 业务类型
 */
export const enum BusinessTypeEnum {
  /**
   * 自营业务
   */
  SELF_OPERATED_BUSINESS = '1',
  /**
   * 平台业务
   */
  PLATFORM_BUSINESS = '2'
}
export interface IUserPageResListItem {
  /**
   * 租户用户表
   */
  userId?: string;
  /**
   * 租户id
   */
  customerTenantId?: string;
  /**
   * sso租户id
   */
  ssoTenantId?: string;
  /**
   * sso用户id
   */
  ssoUserId?: string;
  /**
   * 客户id
   */
  customerId?: string;
  /**
   * 用户手机
   */
  phone?: string;
  /**
   * 是否管理员
   */
  isManager?: string;
  /**
   * 用户姓名
   */
  userName?: string;
  /**
   * 用户是否启用，1--启用，0--禁用
   */
  enableState?: string;
   /**
   * 是否全部，1--是，0--不是
   */
    isAllBrand: string;
  /**
   * 品牌列表
   */
  brandNameList?: string[];
  /**
   * 小程序角色
   */
  miniAppRoleName?: string;
  /**
   * APP角色
   */
  appRoleName?: string;
  /**
   * 客户名称
   */
  customerName?: string;
  /**
   * 业务类型
   */
  businessType?: BusinessTypeEnum;
  /**
   * 创建人名称
   */
  creatorName?: string;
  /**
   * 创建人名称
   */
  createdTime?: string;
  /** 是否实名验证:0--否,1--是 */
  isPersonalCertificate?: '0' | '1';
  /** 企业是否认证 0:未认证 1:已认证 */
  isEnterpriseCertificate?: '0' | '1';
}

export interface IUserPageRes {
  /**
   * 当前页码, 主要给 web 端做分页校验
   */
  page?: number;
  /**
   * 总数据量
   */
  total?: number;
  /**
   * 分页数据
   */
  list?: IUserPageResListItem[];
}
export interface IBrandBaseInfoResItem {
  /**
   * 主键，品牌id
   */
  brandId?: string;
  isDeleted?: string;
  /**
   * 客户id
   */
  customerId?: string;
  /**
   * 品牌名称
   */
  brandName?: string;
  /**
   * 变为数组 customer-optimization
   * 品牌类型
   */
  brandType?: string[];
  /**
   * 对标品牌
   */
  benchmarkingBrand?: string;
  /**
   * 品质要求
   */
  qualityRequirement?: string;
  /**
   * 产品风格
   */
  productStyle?: string[];
  /**
   * 消费年龄
   */
  consumerAgeList?: string[];
  /**
   * 面料级别-来源字典配置
   */
  fabricLevel?: string;
  /**
   * 工艺级别-来源字典配置
   */
  craftLevel?: string;
  /**
   * 供应链服务级别-来源字典配置
   */
  supplyChainLevel?: string;
  /**
   * 合作业务Id
   */
  businessId?: string;
  /**
   * 创建人名称
   */
  creatorName?: string;
  /**
   * 最近修改人名称
   */
  reviserName?: string;
}
export type IBrandBaseInfoRes = IBrandBaseInfoResItem[];

/**
 * 创建/更新 用户
 * yapi地址：https://yapi.ibaibu.com/project/2106/interface/api/154193
 */
export interface IUserSaveReq {
  /**
   * 客户租户Id
   */
  tenantId: string;
  /**
   * 租户用户id，编辑时候回传该字段
   */
  userId?: string;
  /**
   * 用户电话，新建的时候需要
   */
  phone?: string;
  /**
   * 用户名字，新建的时候需要
   */
   userName?: string;
  /**
   * 所属品牌
   */
   brandIds: string[];
  /**
   * 小程序角色
   */
  miniAppRoleId: string;
  /**
   * APP角色
   */
  appRoleId: string;
  /**
   * 是否所有品牌 1-是，0-不是
  */
  isAllBrand: string;
}

export interface IUserSaveRes {
  /**
   * 租户用户表
   */
  userId?: string;
  /**
   * 租户id
   */
  customerTenantId?: string;
  /**
   * sso租户id
   */
  ssoTenantId?: string;
  /**
   * sso用户id
   */
  ssoUserId?: string;
  /**
   * 客户id
   */
  customerId?: string;
  /**
   * 用户手机
   */
  phone?: string;
  /**
   * 是否管理员
   */
  isManager?: string;
  /**
   * 用户姓名
   */
  userName?: string;
  /**
   * 租户-是否启用，1--启用，0--禁用
   */
  isTenantEnable?: string;
  /**
   * 用户是否启用，1--启用，0--禁用
   */
  enableState?: string;
}
export interface ICustomerTenantDetailRes {
  /**
   * 客户租户主键
   */
  tenantId: string;
  /**
   * sso租户id
   */
  ssoTenantId: string;
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 是否启用，1--启用，0--禁用
   */
  isEnable: YES_OR_NO_NUMBER_ENUM;
  /**
   * 客户名称
   */
  customerName: string;
  /**
   * 创建人名称
   */
  creatorName: string;
  /**
   * 创建时间
   */
  createdTime: string;
  /**
   * 管理员姓名
   */
  userName: string;
  /**
   * 管理员电话
   */
   phone: string;
  /**
   * 客户业务类型
   */
  businessType: BUSINESS_MODE_ENUM;
}

export interface IUserDetailRes {
  /**
   * 租户用户表
   */
  userId?: string;
  /**
   * 租户id
   */
  customerTenantId?: string;
  /**
   * sso租户id
   */
  ssoTenantId?: string;
  /**
   * sso用户id
   */
  ssoUserId?: string;
  /**
   * 客户id
   */
  customerId?: string;
  /**
   * 用户手机
   */
  phone?: string;
  /**
   * 是否管理员
   */
  isManager?: string;
  /**
   * 用户姓名
   */
  userName?: string;
  /**
   * 租户-是否启用，1--启用，0--禁用
   */
  isTenantEnable?: string;
  brandIds: string[];
  customerName: string;
  miniAppRoleId: string;
  appRoleId: string;
  /**
   * 是否全部，1--是，0--不是
 */
  isAllBrand: string;
}
