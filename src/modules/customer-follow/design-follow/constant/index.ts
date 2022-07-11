// 客户类型
export enum CUSTOMER_TYPE_ENUM {
  /**
   * 设计跟进
  */
  DESIGN_FOLLOW = '1',
  /**
   * 公海客户
  */
  PUBLIC_CUSTOMER = '2'
}

export const CUSTOMER_TYPE_LIST = [
  { value: CUSTOMER_TYPE_ENUM.DESIGN_FOLLOW, label: '设计跟进' },
  { value: CUSTOMER_TYPE_ENUM.PUBLIC_CUSTOMER, label: '公海客户' },
];

/**
 * 所属业务
 */
export enum COOPERATION_BUSINESS_TYPE_ENUM {
  /* 天工业务 */
  TIAN_GONG = '1',
}
export const COOPERATION_BUSINESS_TYPE_LIST = [
  { value: COOPERATION_BUSINESS_TYPE_ENUM.TIAN_GONG, label: '天工业务' },
];

/**
 * 业务类型
 */
export enum BUSINESS_TYPE_ENUM {
  /* 自营业务 */
  SELF_OPERATED_BUSINESS = '1',
  /* 平台业务 */
  PLATFORM_BUSINESS = '2',
}
export const BUSINESS_TYPE_LIST = [
  { value: BUSINESS_TYPE_ENUM.SELF_OPERATED_BUSINESS, label: '自营业务' },
  { value: BUSINESS_TYPE_ENUM.PLATFORM_BUSINESS, label: '平台业务' },
];

export enum HANDLE_TYPE {
  /*  转移客户 */
  TRANSFER = 'transfer',
  /*  绑定设计组 */
  BINDING = 'binding',
}
