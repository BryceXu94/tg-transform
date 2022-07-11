import { YES_OR_NO_NUMBER_ENUM } from '@/constant';
import { CREDIT_CONFIGURATION_TYPE_ENUM } from '../constant';

// 提交授信配置请求体
export interface ICreditConfigurationItem {
  /**
   * 配置主键id
   */
  configId?: string;
  /**
   * 配置类型
   */
  configType: CREDIT_CONFIGURATION_TYPE_ENUM;
  /**
   * 配置生效状态(0 否 1 是)
   */
  configState: YES_OR_NO_NUMBER_ENUM;
  /**
   * 配置内容({ "overdueNumber": 2, "overdueDays" : 7})
   */
  configContent: {
    /**
     * 逾期数量
     */
    overdueNumber?: string;
    /**
     * 逾期天数
     */
    overdueDays?: string;
  };
}

export interface ISubmitCreditConfigurationReq {
  /**
   * 配置记录多个
   */
  configReqs: ICreditConfigurationItem[];
}

// 授信配置详情返回体
export interface IGetCreditConfigurationRes {
  [CREDIT_CONFIGURATION_TYPE_ENUM.CUSTOMER_CREDIT_LIMIT]: ICreditConfigurationItem;
  [CREDIT_CONFIGURATION_TYPE_ENUM.BD_ADD_CREDIT_LIMIT]: ICreditConfigurationItem;
  [CREDIT_CONFIGURATION_TYPE_ENUM.BD_CUSTOMER_CREDIT_LIMIT]: ICreditConfigurationItem;
}
