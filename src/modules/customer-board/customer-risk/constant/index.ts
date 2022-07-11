// 风险状态
export enum RISK_STATE_ENUM {
  /** 风险上升 */
  UP = '1',
  /** 风险下降 */
  DOWN = '2',
}
export const RISK_STATE_LIST = [
  { value: RISK_STATE_ENUM.UP, label: '风险上升' },
  { value: RISK_STATE_ENUM.DOWN, label: '风险下降' },
];

// 风险等级
export enum RISK_LEVEL_ENUM {
  /** 低风险 */
  LOW = '1',
  /** 中风险 */
  MEDIUM = '2',
  /** 较高风险 */
  HIGH = '3',
  /** 高风险 */
  HIGHER = '4',
}
export const RISK_LEVEL_LIST = [
  { value: RISK_LEVEL_ENUM.LOW, label: '低风险' },
  { value: RISK_LEVEL_ENUM.MEDIUM, label: '中风险' },
  { value: RISK_LEVEL_ENUM.HIGH, label: '较高风险' },
  { value: RISK_LEVEL_ENUM.HIGHER, label: '高风险' },
];

// 授信类型
export enum CREDIT_TYPE_ENUM {
  /** 客户授信 */
  CUSTOMER_CREDIT = '1',
  /** 集团授信 */
  GROUP_CREDIT = '2',
}
export const CREDIT_TYPE_LIST = [
  { value: CREDIT_TYPE_ENUM.CUSTOMER_CREDIT, label: '客户授信' },
  { value: CREDIT_TYPE_ENUM.GROUP_CREDIT, label: '集团授信' },
];

// 授信状态
export enum CREDIT_STATE_ENUM {
  /** 未授信 */
  UN_CREDIT = '',
  /** 待授信 */
  WAIT_CREDIT_GRANTING = '2',
  /** 已授信 */
  ENABLE = '3',
  /** 已禁用 */
  DISABLED = '4',
}
export const CREDIT_STATE_LIST = [
  { value: CREDIT_STATE_ENUM.UN_CREDIT, label: '未授信' },
  { value: CREDIT_STATE_ENUM.WAIT_CREDIT_GRANTING, label: '待授信' },
  { value: CREDIT_STATE_ENUM.ENABLE, label: '已启用' },
  { value: CREDIT_STATE_ENUM.DISABLED, label: '已停用' },
];

// 出账类型
export enum BILL_TYPE_ENUM {
  /** 订单 */
  ORDER = '1',
  /** 自然月 */
  NATURAL_MONTHS = '2',
}
export const BILL_TYPE_LIST = [
  { value: BILL_TYPE_ENUM.ORDER, label: '订单' },
  { value: BILL_TYPE_ENUM.NATURAL_MONTHS, label: '自然月' },
];

export const RISK_QUERY_PARAMS_KEY = 'risk-query-params';

export const RISK_STATISTIC_CONFIG = [
  { desc: '高风险', riskLevel: RISK_LEVEL_ENUM.HIGHER, className: 'higher', titleColor: '#EC808D', pieColor: '#EC808D' },
  { desc: '较高风险', riskLevel: RISK_LEVEL_ENUM.HIGH, className: 'high', titleColor: '#F59A23', pieColor: '#F59A23' },
  { desc: '中风险', riskLevel: RISK_LEVEL_ENUM.MEDIUM, className: 'medium', titleColor: '#555', pieColor: '#FFFF80' },
  { desc: '低风险', riskLevel: RISK_LEVEL_ENUM.LOW, className: 'low', titleColor: '#4B7902', pieColor: '#CAF982' },
];
