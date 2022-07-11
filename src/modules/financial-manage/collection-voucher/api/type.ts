/**
 * 回款列表
 * yapi地址：https://yapi.ibaibu.com/project/2226/interface/api/157777
 */
export interface IPaybackPageReq {
  /**
   * bd id
   */
  bdId?: string;
  /**
   * 客户id
   */
  customerId?: string;
  /**
   * 区域code
   */
  regionCode?: string;
  /**
   * 开始时间
   */
  beginDate?: string;
  /**
   * 结束时间
   */
  endDate?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface IPaybackPageResListItemPaybackProofsItem {
  /**
   * URL地址
   */
  url?: string;
  /**
   * 文件名
   */
  name?: string;
}

export interface IPaybackPageResListItem {
  /**
   * 客户id
   */
  customerId?: string;
  /**
   * 客户名称
   */
  customerName?: string;
  /**
   * 回款凭证
   */
  paybackProofs?: IPaybackPageResListItemPaybackProofsItem[];
  /**
   * 回款金额
   */
  paybackAmount?: string;
  /**
   * 回款日期
   */
  paybackDate?: number;
  /**
   * 开户户名
   */
  accountName?: string;
  /**
   * 银行账号
   */
  bankAccountNumber?: string;
  /**
   * 开户银行
   */
   bankName?: string;
  /**
   * bd名称
  */
  bdName?: string;
   /**
   * bd区域
  */
  regionName?: string;
   /**
   * 组织
  */
  orgName?: string;
   /**
   * 创建人
  */
  creatorName?: string;
   /**
   * 创建时间
  */
  createdTime?: string;
  /**
   * 回款编码
  */
  paybackCode?: string;
}

export interface IPaybackPageRes {
  page?: number;
  total?: number;
  list?: IPaybackPageResListItem[];
}
