// 回款状态
export enum RECOVERIES_STATUS_ENUM {
  /**
   * 待回款
   */
  WAIT_BACK = '0',
  /**
   * 部分回款
   */
  PART_BACK = '2',
  /**
   * 已回款
   */
  ALL_BACK = '1',
}
export const RECOVERIES_STATUS_LIST = [
  { value: RECOVERIES_STATUS_ENUM.WAIT_BACK, label: '待回款' },
  { value: RECOVERIES_STATUS_ENUM.PART_BACK, label: '部分回款' },
  { value: RECOVERIES_STATUS_ENUM.ALL_BACK, label: '已回款' },
];
export const RECOVERIES_STATUS_COLOR: {[key in RECOVERIES_STATUS_ENUM]: string;} = {
  0: 'warning',
  2: 'warning',
  1: 'success',
};

// 回款分类
export enum PAYBACK_TYPE_ENUM {
  /** 本期回款计划 */
  CURRENT = '0',
  /** 下期回款计划 */
  NEXT = '1',
  /** 历史回款计划 */
  HISTORY = '2',
}
export const PAYBACK_TYPE_LIST = [
  { value: PAYBACK_TYPE_ENUM.CURRENT, label: '本期回款计划' },
  { value: PAYBACK_TYPE_ENUM.NEXT, label: '下期回款计划' },
  { value: PAYBACK_TYPE_ENUM.HISTORY, label: '历史回款计划' },
];

// 账单类型
export enum BILL_TYPE_ENUM {
  /** 普通账单 */
  NORMAL = '1',
  /** 金融账单 */
  FINANCE = '2',
}
export const BILL_TYPE_LIST = [
  { value: BILL_TYPE_ENUM.NORMAL, label: '普通账单' },
  { value: BILL_TYPE_ENUM.FINANCE, label: '金融账单' },
];
