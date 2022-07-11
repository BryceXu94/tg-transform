import {
  GROUP_CREDIT_APPROVE_STATUS_ENUM,
} from '@/constant/global';
/**
 * 根据客户名查询客户
 * yapi地址：https://yapi.ibaibu.com/project/2106/interface/api/115848
 */

/**
 * 授信状态
 */
export const enum CreditGrantingStateEnum {
  /**
   * 待授信
   */
  WAIT_CREDIT_GRANTING = 'WAIT_CREDIT_GRANTING',
  /**
   * 启用(已授信)
   */
  ENABLE = 'ENABLE',
  /**
   * 停用(已授信)
   */
  DISABLED = 'DISABLED'
}

/**
 * 客户状态
 */
export const enum CustomerStateEnum {
  /**
   * 待启用
   */
  INIT = 'INIT',
  /**
   * 已启用
   */
  ENABLE = 'ENABLE',
  /**
   * 未准入
   */
  ALLOW_REJECTED = 'ALLOW_REJECTED',
  /**
   * 已禁用
   */
  DISABLE = 'DISABLE'
}

/**
 * 业务类型 默认自营业务
 * 传空串'',可以去掉默认
 */
export const enum BusinessTypeEnum {
  /**
   * 自营业务
   */
  SELF_OPERATED_BUSINESS = 'SELF_OPERATED_BUSINESS',
  /**
   * 平台业务
   */
  PLATFORM_BUSINESS = 'PLATFORM_BUSINESS'
}

/**
 * 允许下单类型
 */
export const enum AllowedOrderTypeEnum {
  /**
   * 自营订单
   */
  SELF_OPERATED_ORDER = '1',
  /**
   * 平台订单
   */
  PLATFORM_ORDER = '2'
}
export interface ICustomerInfoSearchReq {
  /**
   * 客户名称-模糊搜索
   */
  customerName: string;
  /**
   * bdId
   */
  ownerId?: string;
  /**
   * 客户状态
   */
  customerState?: CustomerStateEnum;
  /**
   * 授信状态
   */
  creditGrantingState: CreditGrantingStateEnum;
  /**
   * 业务类型 默认自营业务
   * 传空串'',可以去掉默认
   */
  businessType?: BusinessTypeEnum;
  /**
   * 允许下单类型
   */
  allowedOrderType?: AllowedOrderTypeEnum;
  /**
   * 是否过滤有租户的客户
   * 1--过滤，否则不过滤
   */
  filterHavingTenant?: string;
  /**
   * 是否绑定Bd
   * 1--绑定，0--未绑定
   */
  isBindBd?: string;
  /**
   * 是否需全部经营地址
   * 1--需要，0--不需要
   */
  allOperatingAddress?: string;
}

export interface ICustomerInfoSearchResItem {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 客户编码
   */
  customerCode: string;
  /**
   * 客户全称
   */
  customerName: string;
  /**
   * 归属集团id
   * 为空表示未归属
   */
  groupId?: string;
  /**
   * 归属集团名称
   */
  groupName?: string;
  /**
   * 注册地址(包含省市区)
   */
  fullRegistrationAddress?: string;
  /**
   * 默认的 经营地址(包含省市区)
   */
  fullOperatingAddress?: string;
  /**
   * 全部经营地址(包含省市区)
   * 需要指定获取全部经营地址才返回
   */
  fullOperatingAddressList?: string[];
  /**
   * 授信状态
   */
  creditGrantingState?: CreditGrantingStateEnum;
  /**
   * 客户状态
   */
  customerState?: CustomerStateEnum;
}

export type ICustomerInfoSearchRes = ICustomerInfoSearchResItem[];

/**
 * 用户查询参数
 */
export interface IUsersQueryUserReq {
  userId?: string;
  userCode?: string;
  companyId?: string;
  secretKey?: string;
  operatorUserCode?: string;
  operatorUserId?: string;
  systemCode?: string;
}
/**
 * 响应数据
 */
export interface IUsersQueryUserRes {
  id: string;
  username: string;
  phone: string;
  email: string;
  companyCode: string;
  status: string;
  userCode: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  orgInfo: string;
}

/*
 * 用户查询参数
 */
export interface IUsersQueryUserByUsernameAndCompanyIdReq {
  companyId?: string;
  username?: string;
  secretKey?: string;
  operatorUserCode?: string;
  operatorUserId?: string;
  systemCode?: string;
}
/**
 * 响应数据
 */
export type IUsersQueryUserByUsernameAndCompanyIdRes = {
  username: string;
  userId: string;
  userCode: string;
}[];

/**
 * 所属BD下拉列表返回体
 */
export interface IGetUserOptionsByUserNameRes {
  /** 用户编码 */
  userCode: string;
  /** 用户ID */
  userId: string;
  /** 用户名称 */
  username: string;
  /** 所属组织列表 */
  orgList: {
    /** 组织ID */
    orgId: string;
    /** 组织名称 */
    orgName: string;
    /** 组织路径 */
    orgPath: string;
  }[];
}

// 外部关联信息
export interface ICustomerInfoReq {
  sourceCustomerCode: string;
  excludeBinding?: string;
}
export interface ICustomerInfoRes {
  customerId: string;
  sourceCustomerCode: string;
  sourceCustomerName: string;
  sourceSystemCode: string;
  sourceSystemName: string;
}

/**
 * 请求参数
 */
export interface IBdGetBdSuperiorReq {
  /**
   * 流程id
   */
  companyId: string;
  /**
   * 业务id（新建客户审核：客户id）
   */
  bdId: string;
}
export interface IBdGetBdSuperiorRes {
  /**
   * bdmId
   */
  bdmId: string;
  /**
   * bdm工号
   */
  bdmCode: string;
  /**
   * bdm名字
   */
  bdmName: string;
  /**
   * bdCompanyId
   */
  bdCompanyId: string;
  /**
   * cmId
   */
  cmId: string;
  /**
   * cm工号
   */
  cmCode: string;
  /**
   * cm名字
   */
  cmName: string;
  /**
   * cmCompanyId
   */
  cmCompanyId: string;
}

/**
 * 查询组织树
 * yapi地址：https://yapi.ibaibu.com/project/1656/interface/api/93312
 */
export interface IOrgsListReq {
  companyCode?: string;
  companyId?: string;
  secretKey?: string;
  operatorUserCode?: string;
  operatorUserId?: string;
  systemCode?: string;
}

export interface IOrgsListResItemSystemParameterListItem {
  systemParameterId?: string;
  systemCode?: string;
  parameterKey?: string;
  parameterValue?: string;
  parameterType?: string;
  status?: string;
  orgId?: string;
}

export interface IOrgsListResItemChildrenItem {
  orgId?: string;
  orgCode?: string;
  orgName?: string;
  parentId?: string;
  parentCode?: string;
}
export interface IOrgsListResItem {
  orgId?: string;
  orgCode?: string;
  orgName?: string;
  parentId?: string;
  parentCode?: string;
  children?: IOrgsListResItemChildrenItem[];
  systemParameterList?: IOrgsListResItemSystemParameterListItem[];
  companyCode?: string;
}
export type IOrgsListRes = IOrgsListResItem[];
export interface ICustomerContactSearchReq {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 合作业务：1-天工业务
   */
  cooperationBusiness?: 'TIAN_GONG';
  /**
   * 是否启用
   */
  enable?: 'YES' | 'NO';
}
export type ICustomerContactSearchResItem = {
  /**
   * 联系人id，回传字段
   * 编辑时后端有返回就回传
   */
  customerContactId: string;
  /**
   * 联系人名字
   */
  contactName: string;
  /**
   * 职务
   */
  post: string;
  /**
   * 电话
   */
  phone: string;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 是否启用
   * YES-启用，NO-禁用
   */
  enable: 'YES' | 'NO';
  /**
   * 来源类型
   * tag-v0.2
   */
  sourceType: 'WEB' | 'MINI_APP' | 'TIANGONG';
};
export interface ICustomerAddressSearchReq {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 地址类型: bulk_address 大货地址、 sample_address 样衣地址
   */
  type?: string;
  /**
   * 合作业务：1-天工业务
   */
  cooperationBusiness?: 'TIAN_GONG';
}
export type ICustomerAddressSearchResItem = {
  /**
   * 地址类型，来自字典表
   */
  type: string;
  /**
   * 是否默认
   */
  isDefault: 'YES' | 'NO';
  /**
   * 客户地址id，回传字段
   * 编辑时后端有返回就回传
   */
  customerAddressId: string;
  /**
   * 收件人
   */
  recipient: string;
  /**
   * 收件人电话
   */
  recipientPhone: string;
  /**
   * 省份
   */
  province: string;
  /**
   * 城市
   */
  city: string;
  /**
   * 区域
   *     @NotEmpty(message = "区域不能为空")
   */
  region: string;
  /**
   * 街道详细地址
   */
  addressDetail: string;
  /**
   * 接收者邮箱
   */
  email: string;
  /**
   * tag-v0.2
   * 来源类型
   */
  sourceType: 'WEB' | 'MINI_APP' | 'TIANGONG';
};
/**
 * 获取区域管理信息
 * yapi地址：https://yapi.ibaibu.com/project/1128/interface/api/124836
 */
export interface IRegionListResItem {
   /**
    * 区域id
    */
   regionId?: string;
   /**
    * 区域code
    */
   regionCode?: string;
   /**
    * 区域名称
    */
   regionName?: string;
   /**
    * 创建人id
    */
   creatorId?: string;
   /**
    * 创建人姓名
    */
   creatorName?: string;
   /**
    * 创建时间
    */
   createdTime?: number;
   /**
    * 修改人id
    */
   reviserId?: string;
   /**
    * 修改人名称
    */
   reviserName?: string;
   /**
    * 更新时间
    */
   revisedTime?: number;
 }

export type IRegionListRes = IRegionListResItem[];

export type IBrandBaseInfoResItem = {
  /**
   * 主键，品牌id
   */
  brandId: string;
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 品牌名称
   */
  brandName: string;
  /**
   * 变为数组 customer-optimization
   * 品牌类型
   */
  brandType: string[];
  /**
   * 对标品牌
   */
  benchmarkingBrand: string;
  /**
   * 品质要求
   */
  qualityRequirement: string;
  /**
   * 产品风格
   */
  productStyle: string[];
  /**
   * 消费年龄
   */
  consumerAgeList: string[];
  /**
   * 面料级别-来源字典配置
   */
  fabricLevel: string;
  /**
   * 工艺级别-来源字典配置
   */
  craftLevel: string;
  /**
   * 供应链服务级别-来源字典配置
   */
  supplyChainLevel: string;
  /**
   * 合作业务Id
   */
  businessId: string;
  /**
   * 创建人名称
   */
  creatorName: string;
  /**
   * 最近修改人名称
   */
  reviserName: string;
};
/**
 * 集团下拉列表返回体
 */
export interface IGetGroupOptionsRes {
  /**
   * 集团名称 === 全称
   */
  groupName: string;
  /**
   * 集团编码
   */
  groupCode: string;
  /**
   * 集团id
   */
  groupId: string;
  /**
   * 是否已有审批中的申请
   */
  isHavingUnderApproval: boolean;
  /**
   * 授信状态（null代表未授信）
   */
  amountStatus: GROUP_CREDIT_APPROVE_STATUS_ENUM;
}
