import { BUSINESS_MODE_NO_ENUM } from '@/constant/global';
import {
  RISK_STATE_ENUM,
  RISK_LEVEL_ENUM,
  CREDIT_TYPE_ENUM,
  CREDIT_STATE_ENUM,
  BILL_TYPE_ENUM,
} from '@/modules/customer-board/customer-risk/constant';

export interface IFinanceRiskInfoPageReq {
  /**
   * ops 区域编码
   */
  regionCode?: string;
  /**
   * 组织人员id
   */
  userIds: string[];
  cascader?: any[];
  /**
   * 是否是区域管理员
   * 1-是，0-不是
   */
  includePublic?: boolean;
  /**
   * 风险等级 1-低风险 2-中风险 3-较高风险 4-高风险
   */
  riskLevel?: RISK_LEVEL_ENUM[];
  /**
   * 更新开始时间
   */
  updateStartDate?: string;
  /**
   * 更新结束时间
   */
  updateEndDate?: string;
  /**
   * 客户名称
   */
  customerName?: string;
  /**
   * 风险变化趋势 1-风险上升 2-风险下降
   */
  riskTrend?: RISK_STATE_ENUM | '';
  pageNum?: number;
  pageSize?: number;
}
export interface IFinanceRiskInfoPageResListItem {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 客户名称
   */
  customerName: string;
  /**
   * ops 区域编码
   */
  regionCode: string;
  /**
   * ops 区域名字
   */
  regionName: string;
  /**
   * 业务类型
   */
  businessType: BUSINESS_MODE_NO_ENUM;
  /**
   * 风险等级 1-低风险 2-中风险 3-较高风险 4-高风险
   */
  riskLevel: RISK_LEVEL_ENUM;
  /**
   * 风险变化趋势 1-风险上升 2-风险下降
   */
  riskTrend: RISK_STATE_ENUM;
  /**
   * 风险等级更新日期
   */
  levelUpdateDate: string;
  /**
   * 授信类型 1-客户授信 2-集团授信
   */
  creditMark: CREDIT_TYPE_ENUM;
  /**
   * 客户授信状态，空-未授信，2-待授信，3-(已启用)已授信，4-已禁用
   */
  creditGrantingState: CREDIT_STATE_ENUM;
  /**
   * 授信额度
   */
  creditAmount: string;
  /**
   * 可用额度
   */
  availableAmount: string;
  /**
   * 出账类型 1-订单，2-自然月
   */
  billingDate: BILL_TYPE_ENUM;
  /**
   * 待回款金额
   */
  waitReturnAmount: string;
  /**
   * 所属bd
   */
  ownerName: string;
}
export interface IFinanceRiskInfoPageRes {
  page: string;
  total: string;
  list: IFinanceRiskInfoPageResListItem[];
}

export interface IFinanceRiskInfoDetailResRiskHistoryListItem {
  /**
   * 最新风险等级 1-低风险 2-中风险 3-较高风险 4-高风险
   */
  riskLevelLast: RISK_LEVEL_ENUM;
  /**
   * 历史风险等级 1-低风险 2-中风险 3-较高风险 4-高风险
   */
  riskLevelHistory: RISK_LEVEL_ENUM;
  /**
   * 风险变化趋势 1-风险上升 2-风险下降
   */
  riskTrend: RISK_STATE_ENUM;
  /**
   * 更新日期
   */
  riskUpdateDate: string;
}
export interface IFinanceRiskInfoDetailRes {
  /**
   * 客户名称
   */
  customerName: string;
  /**
   * 风险更新记录
   */
  riskHistoryList: IFinanceRiskInfoDetailResRiskHistoryListItem[];
}

export interface IFinanceRiskInfoRiskProfileReq {
  /**
   * 区域编码
   */
  regionCode?: string;
  /**
   * 组织人员id
   */
  userIds?: string[];
  cascader?: any[];
  /**
   * 是否展示公海客户 0-否 1-是
   */
  includePublic?: boolean;
}
export interface IFinanceRiskInfoRiskRiseResRiskRiseInfoListItem {
  /**
   * 客户名称
   */
  customerName: string;
  /**
   * 最新风险等级 1-低风险 2-中风险 3-较高风险 4-高风险
   */
  riskLevelLast: string;
  /**
   * 历史风险等级 1-低风险 2-中风险 3-较高风险 4-高风险
   */
  riskLevelHistory: string;
  /**
   * 更新日期
   */
  riskUpdateDate: string;
}
export interface IFinanceRiskInfoRiskRiseRes {
  /**
   * 近期风险上升客户数量
   */
  riskCustomerCount: string;
  /**
   * 风险上升客户信息
   */
  riskRiseInfoList: IFinanceRiskInfoRiskRiseResRiskRiseInfoListItem[];
}

export interface IFinanceRiskInfoLastUpdateDateRes {
  /**
   * 最近同步日期
   */
  lastUpdateDate: string;
}

export interface IFinanceRiskInfoRiskStatisticRes {
  /**
   * 低风险数据
   */
  lowRiskList: string[];
  /**
   * 中风险数据
   */
  middleRiskList: string[];
  /**
   * 较高风险数据
   */
  higherRiskList: string[];
  /**
   * 高风险数据
   */
  highRiskList: string[];
  /**
   * 日期
   */
  dateList: string[];
}
export type IFinanceRiskInfoRiskStatisticStateResItem = {
  /**
   * 风险登记
   */
  riskLevel: RISK_LEVEL_ENUM;
  /**
   * 数量
   */
  count: string;
  /**
   * 占全部风险登记百分比
   */
  ratio: string;
};
