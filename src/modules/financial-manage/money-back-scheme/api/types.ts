import { YES_OR_NO_NUMBER_ENUM } from '@/constant';
import {
  RECOVERIES_STATUS_ENUM,
  PAYBACK_TYPE_ENUM,
  BILL_TYPE_ENUM,
} from '../constant';

export interface IGetMoneyBackSchemeListReq {
  /**
   * 客户名称
   */
  customerName?: string;
  /**
   * 账单号
   */
  billCode?: string;
  /**
   * 预计回款日-开始
   */
  planRepaymentStartDate?: string;
  /**
   * 预计回款日-结束
   */
  planRepaymentEndDate?: string;
  /**
   * 回款分类
   */
  paybackClassifyState?: PAYBACK_TYPE_ENUM | '';
  /**
   * 回款状态
   */
  paybackState?: RECOVERIES_STATUS_ENUM | '';
  /**
   * bd名称【销售BD】
   */
  bdName?: string;
  /**
   * 逾期日期-开始
   */
  overdueStartDate?: string;
  /**
   * 逾期日期-结束
   */
  overdueEndDate?: string;
  /**
   * 是否逾期，0-否，1-是
   */
  isOverdue?: YES_OR_NO_NUMBER_ENUM | '';
  /**
   * 区域编码
   */
  regionCode?: string;
  /**
   * 账单类型 1-普通账单 2-金融账单
   */
  billType?: BILL_TYPE_ENUM | '';
  /**
   * 当前查询的页码
   */
  pageNum: number;
  /**
   * 当前查询单页的数据量
   */
  pageSize: number;
}

/**
 * 回款计划列表返回体
 */
export interface IGetMoneyBackSchemeListRes {
  /**
   * 当前页码, 主要给 web 端做分页校验
   */
  page: number;
  /**
   * 总数据量
   */
  total: number;
  /**
   * 分页数据
   */
  list: {
    /**
     * 回款计划表主键id
     */
    repaymentPlanId: string;
    /**
     * 账单id
     */
    billId: string;
    /**
     * 账单月份
     */
    planMonth: string;
    /**
     * 客户账单号
     */
    billCode: string;
    /**
     * 客户id
     */
    customerId?: string;
    /**
     * 客户编码
     */
    customerCode?: string;
    /**
     * 客户名称
     */
    customerName?: string;
    /**
     * 出账日
     */
    billDate: number;
    /**
     * 计划回款日
     */
    planRepaymentDate: number;
    /**
     * 逾期日期
     */
    overdueDate: number;
    /**
     * 账单金额
     */
    billAmount: string;
    /**
     * 本期计划回款
     */
    currentPlanRepaymentAmount: string;
    /**
     * 本期实际回款
     */
    currentActualRepaymentAmount: string;
    /**
     * 本期待回款
     */
    currentWaitRepaymentAmount: string;
    /**
     * 当前还款期数
     */
    currentRepaymentPeriod?: string;
    /**
     * 还款总期数
     */
    totalRepaymentPeriod?: string;
    /**
     * 回款及时率 如：0.953
     */
    timelyRepaymentRate: string;
    /**
     * 是否逾期，0-否，1-是
     */
    isOverdue: YES_OR_NO_NUMBER_ENUM;
    /**
     * 是否预付定金，0-否，1-是
     */
    isAdvancePayment: YES_OR_NO_NUMBER_ENUM;
    /**
     * 逾期天数
     */
    overdueDays: string;
    /**
     * 回款状态
     */
    paybackState: RECOVERIES_STATUS_ENUM;
    /**
     * bdId【销售BD】
     */
    bdId?: string;
    /**
     * bd编号【销售BD】
     */
    bdCode?: string;
    /**
     * bd名称【销售BD】
     */
    bdName?: string;
    /**
     * 区域编码
     */
    regionCode?: string;
    /**
     * 区域名称
     */
    regionName: string;
    /**
     * 创建时间
     */
    createdTime: number;
    /**
     * 实际结算货款
     */
    actualSettleGoodsAmount: number;
    /**
     * 回款周期配置金额百分比
     */
    returnPercent: number;
    /**
     * 账单类型 1-普通账单 2-金融账单
     */
    billType: BILL_TYPE_ENUM;
  }[];
}

/**
 * 回款汇总返回体
 */
export interface IGetMoneyBackSchemeSummaryRes {
  /**
   * 计划回款小计
   */
  planRepaymentCount?: string;
  /**
   * 实际回款小计
   */
  actualRepaymentCount?: string;
  /**
   * 待回款小计
   */
  waitRepaymentCount?: string;
}

/**
 * 设置预计回款日请求体
 */
export interface IUpdateMoneyBackSchemeDateReq {
  /**
   * 回款计划表主键id
   */
  repaymentPlanId: string;
  /**
   * 计划回款日 如：2022-01-09
   */
  planRepaymentDate: string;
}
