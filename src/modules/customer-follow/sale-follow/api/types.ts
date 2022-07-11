import { BUSINESS_TYPE_ENUM } from '../constant';

/**
 * 客户跟进
 */
export interface ICustomerBdDetailPageReq {
  /**
   * 客户名称
   */
   customerName?: string;
   /**
   * 业务模式
   */
   businessType?: string;
   /**
    * bd名称
    */
   ownerName?: string;
   /**
    * 客户区域
   */
    regionCode?: string;
   /**
    * 客户审核状态
    */
   customerProfileState?:
     | 'INIT'
     | 'WAIT_BDM_AUDIT'
     | 'WAIT_PROFILE_COMPLETE'
     | 'WAIT_CM_AUDIT'
     | 'WAIT_FINANCE_AUDIT'
     | 'AUDIT_PASSED'
     | 'AUDIT_FAILED';
   /**
    * 查询类型
    */
   queryType: 'CUSTOMER_FOLLOW' | 'PUBLIC_CUSTOMER';
   pageNum: number;
   pageSize: number;
}
export interface ICustomerBdDetailPageListItem {
  /**
   * 详情id
   */
   detailId: string;
   /**
    * 客户编码
    */
   customerCode: string;
   /**
    * 客户名称
    */
   customerName: string;
   /** 客户id */
   customerId: string;
   /**
    * bdId
    */
   ownerId: string;
   /**
    * bd名称
    */
   ownerName: string;
   /**
    * 所属业务
    */
   cooperationBusiness: BUSINESS_TYPE_ENUM;
   /**
    * 业务id
    */
   businessId: string;
   /**
    * 创建时间
    */
   createdTime: string;
   businessType: string;
   /** 所属区域 */
   regionName: string;
}
export interface ICustomerBdDetailPageRes {
  page: string;
  total: string;
  list: ICustomerBdDetailPageListItem[];
}

/**
 * 转移客户
 */
export interface ICustomerBdDetailTransferCustomerReq {
  detailIdList: string[];
  /**
   * bdId
   */
  ownerId: string;
  /**
   * bd名称
   */
  ownerName: string;
  /**
   * cmId
   */
  cmId?: string;
  /**
   * cm名字
   */
  cmName?: string;
}

/**
 * 绑定客户
*/
export interface ICustomerBdDetailBindingCustomerReq {
  /**
   * 业务id
   */
  businessId?: string;
  /**
  * bdId
  */
  ownerId?: string;
  /**
  * bd名称
  */
  ownerName?: string;
  /**
  * 客户id
  */
  customerId: string;
  /**
  * cmId
  */
  cmId?: string;
  /**
  * cm名字
  */
  cmName?: string;
}

export interface IBdInfoReq {
  /**
   * 客户id集合
   */
  customerIdList: string[];
}
export interface IBdInfo {
  bdmId: string;
  bdmName: string;
  customerCode: string;
  customerId: string;
  customerName: string;
  personType: string;
  profileState: string;
}
export interface IBdInfoRes {
  bdInfo: IBdInfo[];
  bdmInfo: IBdInfo[];
  isShow: boolean;
}
