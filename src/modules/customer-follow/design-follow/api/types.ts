import { CUSTOMER_TYPE_ENUM } from '../constant';
/**
 * 查询列表（分页）
 * yapi地址：https://yapi.ibaibu.com/project/2106/interface/api/126318
 */
export interface ICustomerGroupRelationPageResListItem {
  /**
   * 客户与组别绑定关系id
   */
  customerGroupRelationId: string;
  /**
   * 客户id
   */
  customerId?: string;
  /**
   * 客户名称
   */
  customerName?: string;
  /**
   * 客户编码
   */
  customerCode?: string;
  /**
   * 组别Id
   */
  groupId?: string;
  /**
   * 组别名称
   */
  groupName?: string;
  /**
   * 业务模式
   */
  businessType: string;
  /**
   * 关联业务id
   */
  businessId: string;
  /**
   * 创建时间
   */
  createdTime: string;
  /**
   * 所属业务
   */
  cooperationBusiness: string;
  /** *
   * 区域名称
   *
  */
   regionName: string;
}

export interface ICustomerGroupRelationPageReq {
  /**
   * 客户名称
   */
  customerName?: string;
  /**
   * 客户区域
  */
  regionCode?: string;
  /**
   * 设计组名称
   */
  groupName?: string;
  /**
   * 业务模式
   */
  businessType?: string;
  /**
   * 客户审核状态
   */
  customerProfileStateList?: string[];
  queryType: CUSTOMER_TYPE_ENUM;
  /**
   * 当前查询的页码
   */
  pageNum?: number;
  /**
   * 当前查询单页的数据量
   */
  pageSize?: number;
}

export interface ICustomerGroupRelationPageRes {
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
  list?: ICustomerGroupRelationPageResListItem[];
}

/**
 * 转移到公海
 * yapi地址：https://yapi.ibaibu.com/project/2106/interface/api/126654
 */
export interface ICustomerGroupRelationDeleteGroupRelationReq {
  /**
   * businessId
   */
  businessIdList: string[];
}

export type ICustomerGroupRelationDeleteGroupRelationRes = null;

/**
 * 绑定客户
 * yapi地址：https://yapi.ibaibu.com/project/2106/interface/api/126320
 */

export interface ICustomerGroupRelationBindingCustomerReqGroupDetailListItem {
  /**
   * groupId
   */
  groupId: string;
  /**
   * group名称
   */
  groupName: string;
}

export interface ICustomerGroupRelationBindingCustomerReq {
  /**
   * 业务id
   */
  businessId?: string;
  groupDetailList?: ICustomerGroupRelationBindingCustomerReqGroupDetailListItem[];
  /**
   * 客户id
   */
  customerId?: string;
}

export type ICustomerGroupRelationBindingCustomerRes = null;

/**
 * 转移客户
 * yapi地址：https://yapi.ibaibu.com/project/2106/interface/api/126652
 */

export interface ICustomerGroupRelationTransferCustomerReqCustomerBusinessRelationListItemGroupDetailListItem {
  /**
   * groupId
   */
  groupId: string;
  /**
   * group名称
   */
  groupName: string;
}

export interface ICustomerGroupRelationTransferCustomerReqCustomerBusinessRelationListItem {
  customerId?: string;
  businessId?: string;
  groupDetailList?: ICustomerGroupRelationTransferCustomerReqCustomerBusinessRelationListItemGroupDetailListItem[];
}

export interface ICustomerGroupRelationTransferCustomerReq {
  customerBusinessRelationList?: ICustomerGroupRelationTransferCustomerReqCustomerBusinessRelationListItem[];
}

export type ICustomerGroupRelationTransferCustomerRes = null;
