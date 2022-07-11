/**
 * 账单类型
 */
export enum BILL_TYPE_ENUM {
  /** 普通账单 */
  COMMON = '1',
  /** 金融账单 */
  FINANCE = '2',
}
export const BILL_TYPE_LIST = [
  { value: BILL_TYPE_ENUM.COMMON, label: '普通账单' },
  { value: BILL_TYPE_ENUM.FINANCE, label: '金融账单' },
];

/**
 * 对账状态
 */
export enum RECONCILE_STATUS_ENUM {
  /**
   * 待对账（内部）
   */
  TO_STATEMENT_INNER = '10',
  /**
   * 待对账（客户）
   */
  TO_STATEMENT_CUSTOMER = '20',
  /**
   * 已对账
   */
  STATEMENT_COMPLETE = '30',
  /**
   * 已驳回
   */
  REJECT = '40',
  /**
   * 已作废
   */
  CANCEL = '50'
}
export const RECONCILE_STATUS_LIST = [
  { value: RECONCILE_STATUS_ENUM.TO_STATEMENT_INNER, label: '待对账（内部）' },
  { value: RECONCILE_STATUS_ENUM.TO_STATEMENT_CUSTOMER, label: '待对账（客户）' },
  { value: RECONCILE_STATUS_ENUM.STATEMENT_COMPLETE, label: '已对账' },
  { value: RECONCILE_STATUS_ENUM.REJECT, label: '已驳回' },
  { value: RECONCILE_STATUS_ENUM.CANCEL, label: '已作废' },
];
export const RECONCILE_STATUS_COLOR = {
  [RECONCILE_STATUS_ENUM.TO_STATEMENT_INNER]: 'warning',
  [RECONCILE_STATUS_ENUM.TO_STATEMENT_CUSTOMER]: 'warning',
  [RECONCILE_STATUS_ENUM.STATEMENT_COMPLETE]: 'success',
  [RECONCILE_STATUS_ENUM.REJECT]: 'error',
  [RECONCILE_STATUS_ENUM.CANCEL]: 'grey',
};

/**
 * 回款状态
 */
export enum RECOVERIES_STATUS_ENUM {
  /**
   * 待回款
   */
  WAIT_BACK = '10',
  /**
   * 部分回款
   */
  PART_BACK = '20',
  /**
   * 已回款
   */
  ALL_BACK = '30'
}
export const RECOVERIES_STATUS_LIST = [
  { value: RECOVERIES_STATUS_ENUM.WAIT_BACK, label: '待回款' },
  { value: RECOVERIES_STATUS_ENUM.PART_BACK, label: '部分回款' },
  { value: RECOVERIES_STATUS_ENUM.ALL_BACK, label: '已回款' },
];
export const RECOVERIES_STATUS_COLOR = {
  [RECOVERIES_STATUS_ENUM.WAIT_BACK]: 'warning',
  [RECOVERIES_STATUS_ENUM.PART_BACK]: 'warning',
  [RECOVERIES_STATUS_ENUM.ALL_BACK]: 'success',
};

/**
 * 支用状态
 */
export enum EXPAND_STATUS_ENUM {
  /**
   * 待支用
   */
  WAIT_SUPPORT = '10',
  /**
   * 支用中
   */
  IN_SUPPORT = '20',
  /**
   * 已放款
   */
  LOANED = '30',
  /**
   * 已支用
   */
  SUPPORTED = '40',
  /**
   * 支用失败
   */
  SUPPORT_FAIL = '-10'
}
export const EXPAND_STATUS_LIST = [
  { value: EXPAND_STATUS_ENUM.WAIT_SUPPORT, label: '待支用' },
  { value: EXPAND_STATUS_ENUM.IN_SUPPORT, label: '支用中' },
  { value: EXPAND_STATUS_ENUM.LOANED, label: '已放款' },
  { value: EXPAND_STATUS_ENUM.SUPPORTED, label: '已支用' },
  { value: EXPAND_STATUS_ENUM.SUPPORT_FAIL, label: '支用失败' },
];
export const EXPAND_STATUS_COLOR = {
  [EXPAND_STATUS_ENUM.WAIT_SUPPORT]: 'warning',
  [EXPAND_STATUS_ENUM.IN_SUPPORT]: 'warning',
  [EXPAND_STATUS_ENUM.LOANED]: 'success',
  [EXPAND_STATUS_ENUM.SUPPORTED]: 'success',
  [EXPAND_STATUS_ENUM.SUPPORT_FAIL]: 'error',
};

/**
 * 对账单操作类型
 */
export enum OPERATE_TYPE_ENUM {
  /** 客户确认 */
  CONFIRM = '1',
  /** 客户驳回 */
  REJECT = '2'
}
export const OPERATE_TYPE_LIST = [
  { value: OPERATE_TYPE_ENUM.CONFIRM, label: '客户确认' },
  { value: OPERATE_TYPE_ENUM.REJECT, label: '客户驳回' },
];

// 出账类型/对账类型
export enum OUTGOING_TYPE_ENUM {
  /** 自然月 */
  NATURAL_MONTHS = '2',
  /** 订单 */
  ORDER = '1',
}
export const OUTGOING_TYPE_LIST = [
  { value: OUTGOING_TYPE_ENUM.NATURAL_MONTHS, label: '自然月' },
  { value: OUTGOING_TYPE_ENUM.ORDER, label: '订单' },
];

// 还款状态
export enum REPAY_STATUS_ENUM {
  /** 待还款 */
  WAIT_REPAY = '1',
  /** 部分还款 */
  PART_REPAY = '2',
  /** 已还款 */
  ALL_REPAY = '3'
}
export const REPAY_STATUS_LIST = [
  { value: REPAY_STATUS_ENUM.WAIT_REPAY, label: '待还款' },
  { value: REPAY_STATUS_ENUM.PART_REPAY, label: '部分还款' },
  { value: REPAY_STATUS_ENUM.ALL_REPAY, label: '已还款' },
];

// 扣款收付类型
export enum DEDUCTION_PAYMENT_TYPE_ENUM {
  /** 大货质量扣款 */
  QUALITY = '1',
  /** 大货延期扣款 */
  DELAY = '2',
  /** 包装辅料费用 */
  PACK = '3',
  /** 客户打折收货 */
  DISCOUNT = '4',
}
export const DEDUCTION_PAYMENT_TYPE_LIST = [
  { value: DEDUCTION_PAYMENT_TYPE_ENUM.QUALITY, label: '大货质量扣款' },
  { value: DEDUCTION_PAYMENT_TYPE_ENUM.DELAY, label: '大货延期扣款' },
  { value: DEDUCTION_PAYMENT_TYPE_ENUM.PACK, label: '包装辅料费用' },
  { value: DEDUCTION_PAYMENT_TYPE_ENUM.DISCOUNT, label: '客户打折收货' },
];

// 奖励收付类型
export enum BONUS_COLLECTION_TYPE_ENUM {
  /** 其他加款 */
  OTHER = '1',
  /** 客户奖励 */
  CUSTOMER = '2',
  /** 包装辅料代采 */
  PACK = '3',
}
export const BONUS_COLLECTION_TYPE_LIST = [
  { value: BONUS_COLLECTION_TYPE_ENUM.OTHER, label: '其他加款' },
  { value: BONUS_COLLECTION_TYPE_ENUM.CUSTOMER, label: '客户奖励' },
  { value: BONUS_COLLECTION_TYPE_ENUM.PACK, label: '包装辅料代采' },
];

// 扣款/奖励处理方式
export enum DEDUCTION_AND_BONUS_HANDLE_ENUM {
  /** 线下退款 */
  REFUND_OFFLINE = '11',
  /** 账单扣款 */
  REFUND_BILL = '12',
  /** 线下付款 */
  PAY_OFFLINE = '21',
  /** 账单加款 */
  PAY_BILL = '22',
}
export const DEDUCTION_AND_BONUS_HANDLE_LIST = [
  { value: DEDUCTION_AND_BONUS_HANDLE_ENUM.REFUND_OFFLINE, label: '线下退款' },
  { value: DEDUCTION_AND_BONUS_HANDLE_ENUM.REFUND_BILL, label: '账单扣款' },
  { value: DEDUCTION_AND_BONUS_HANDLE_ENUM.PAY_OFFLINE, label: '线下付款' },
  { value: DEDUCTION_AND_BONUS_HANDLE_ENUM.PAY_BILL, label: '账单加款' },
];

// 扣款状态
export enum DEDUCTION_STATUS_ENUM {
  /** 未提交 */
  WAIT_SUBMIT = '0',
  /** 待确认 */
  WAIT_CONFIRM = '1',
  /** 已确认 */
  CONFIRM = '2',
  /** 驳回 */
  REJECT = '3',
}
export const DEDUCTION_STATUS_LIST = [
  { value: DEDUCTION_STATUS_ENUM.WAIT_SUBMIT, label: '未提交' },
  { value: DEDUCTION_STATUS_ENUM.WAIT_CONFIRM, label: '待确认' },
  { value: DEDUCTION_STATUS_ENUM.CONFIRM, label: '已确认' },
  { value: DEDUCTION_STATUS_ENUM.REJECT, label: '驳回' },
];

// 收款单类型
export enum RECEIPT_TYPE_ENUM {
  /** 预收款单 */
  ADVANCE = '1',
  /** 收款单 */
  NORMAL = '2',
}
export const RECEIPT_TYPE_LIST = [
  { value: RECEIPT_TYPE_ENUM.ADVANCE, label: '预收款单' },
  { value: RECEIPT_TYPE_ENUM.NORMAL, label: '收款单' },
];

// 收付类型
export enum COLLECTION_AND_PAYMENT_TYPE_ENUM {
  /** 供应商退款 */
  SUPPLIER_REFUND = '1',
  /** 大货回款 */
  PRODUCTION_PAYMENT= '2',
}
export const COLLECTION_AND_PAYMENT_TYPE_LIST = [
  { value: COLLECTION_AND_PAYMENT_TYPE_ENUM.SUPPLIER_REFUND, label: '供应商退款' },
  { value: COLLECTION_AND_PAYMENT_TYPE_ENUM.PRODUCTION_PAYMENT, label: '大货回款' },
];

// 收款单状态
export enum RECEIPT_STATUDS_ENUM {
  /** 未提交 */
  WAIT_SUBMIT = '1',
  /** 已提交 */
  SUBMIT = '2',
  /** 已确认 */
  CONFIRM = '3',
  /** 已作废 */
  CANCEL = '4',
}
export const RECEIPT_STATUDS_LIST = [
  { value: RECEIPT_STATUDS_ENUM.WAIT_SUBMIT, label: '未提交' },
  { value: RECEIPT_STATUDS_ENUM.SUBMIT, label: '已提交' },
  { value: RECEIPT_STATUDS_ENUM.CONFIRM, label: '已确认' },
  { value: RECEIPT_STATUDS_ENUM.CANCEL, label: '已作废' },
];

// 实际收款单状态
export enum RECEIPT_ACTUAL_STATUDS_ENUM {
  /** 待确认 */
  WAIT_CONFIRM = '1',
  /** 已确认 */
  CONFIRM = '2',
  /** 已作废 */
  CANCEL = '-1',
  /** 超时取消 */
  TIME_OUT = '-1'
}
export const RECEIPT_ACTUAL_STATUDS_LIST = [
  { value: RECEIPT_ACTUAL_STATUDS_ENUM.WAIT_CONFIRM, label: '待确认' },
  { value: RECEIPT_ACTUAL_STATUDS_ENUM.CONFIRM, label: '已确认' },
  { value: RECEIPT_ACTUAL_STATUDS_ENUM.CANCEL, label: '已作废' },
  { value: RECEIPT_ACTUAL_STATUDS_ENUM.TIME_OUT, label: '超时取消' },
];

// 记录类型
export enum DELIVERY_TYPE_ENUM {
  /** 发货 */
  DELIVERY = '1',
  /** 退货 */
  RETURN = '2',
}
export const DELIVERY_TYPE_LIST = [
  { value: DELIVERY_TYPE_ENUM.DELIVERY, label: '发货' },
  { value: DELIVERY_TYPE_ENUM.RETURN, label: '退货' },
];
