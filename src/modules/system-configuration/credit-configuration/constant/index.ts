/**
 * 授信配置类型
 */
export enum CREDIT_CONFIGURATION_TYPE_ENUM {
  /**
   * 客户授信限制
   */
  CUSTOMER_CREDIT_LIMIT = 'customer_credit_limit',
  /**
   * BD授信限制-禁止BD新增授信申请
   */
  BD_ADD_CREDIT_LIMIT = 'bd_add_credit_limit',
  /**
   * BD授信限制-禁止关联客户新增初始授信
   */
  BD_CUSTOMER_CREDIT_LIMIT = 'bd_customer_credit_limit'
}
