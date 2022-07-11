// 客户类型
export enum CUSTOMER_TYPE_ENUM {
  /**
   * 销售跟进
  */
  CUSTOMER_FOLLOW = 'CUSTOMER_FOLLOW',
  /**
   * 公海客户
  */
  PUBLIC_CUSTOMER = 'PUBLIC_CUSTOMER'
}

export const CUSTOMER_TYPE_LIST = [
  { value: CUSTOMER_TYPE_ENUM.CUSTOMER_FOLLOW, label: '销售跟进' },
  { value: CUSTOMER_TYPE_ENUM.PUBLIC_CUSTOMER, label: '公海客户' },
];

/**
 * 所属业务
 */
export enum BUSINESS_TYPE_ENUM {
  /** 天工业务 */
  TIAN_GONG = 'TIAN_GONG',
}
export const BUSINESS_TYPE_LIST = [
  { value: BUSINESS_TYPE_ENUM.TIAN_GONG, label: '天工业务' },
];
