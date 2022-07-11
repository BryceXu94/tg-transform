// 客户状态
export enum CUSTOMER_STATE_ENUM {
  /** 待启用 */
  INIT = 'INIT',
  /** 已启用 */
  ENABLE = 'ENABLE',
  /** 已停用 */
  DISABLE = 'DISABLE',
  /** 未准入 */
  ALLOW_REJECTED = 'ALLOW_REJECTED'
}

export const CUSTOMER_STATUS_LIST = [
  { value: CUSTOMER_STATE_ENUM.INIT, label: '待启用' },
  { value: CUSTOMER_STATE_ENUM.ENABLE, label: '已启用' },
  { value: CUSTOMER_STATE_ENUM.DISABLE, label: '已停用' },
  { value: CUSTOMER_STATE_ENUM.ALLOW_REJECTED, label: '未准入' },
];

// 客户档案状态
export enum PROFILE_STATE_ENUM {
  /** 待提交 */
  WAIT_COMMIT = 'WAIT_COMMIT',
  /**  待审核 */
  WAIT_AUDIT = 'WAIT_AUDIT',
  /** 待BD审核 */
  WAIT_BDM_AUDIT = 'WAIT_BDM_AUDIT',
  /** 待补录资料 */
  WAIT_PROFILE_COMPLETE = 'WAIT_PROFILE_COMPLETE',
  /** 待CM审核 */
  WAIT_CM_AUDIT = 'WAIT_CM_AUDIT',
  /** 待财务审核 */
  WAIT_FINANCE_AUDIT = 'WAIT_FINANCE_AUDIT',
  /** 财务审核驳回 */
  FINANCE_AUDIT_FAILED = 'FINANCE_AUDIT_FAILED',
  /** bdm审核驳回 */
  BDM_AUDIT_FAILED = 'BDM_AUDIT_FAILED',
   /** cm审核驳回 */
  CM_AUDIT_FAILED = 'CM_AUDIT_FAILED',
  /** 审核已通过 */
  AUDIT_PASSED = 'AUDIT_PASSED',
  /** 财务驳回后再次编辑完成 */
  FINANCE_RE_EDIT = 'FINANCE_RE_EDIT',
  /** cm驳回后再次编辑完成 */
  CM_RE_EDIT = 'CM_RE_EDIT',
}

export const PROFILE_STATE_LIST = [
  { value: PROFILE_STATE_ENUM.WAIT_COMMIT, label: '待提交' },
  { value: PROFILE_STATE_ENUM.WAIT_AUDIT, label: '待审核' },
  { value: PROFILE_STATE_ENUM.WAIT_PROFILE_COMPLETE, label: '资料补录中' },
  { value: PROFILE_STATE_ENUM.WAIT_BDM_AUDIT, label: 'BDM审核中' },
  { value: PROFILE_STATE_ENUM.WAIT_CM_AUDIT, label: 'CM审核中' },
  { value: PROFILE_STATE_ENUM.WAIT_FINANCE_AUDIT, label: '财务审核中' },
  { value: PROFILE_STATE_ENUM.AUDIT_PASSED, label: '审核已通过' },
  { value: PROFILE_STATE_ENUM.BDM_AUDIT_FAILED, label: 'BDM审核驳回' },
  { value: PROFILE_STATE_ENUM.CM_AUDIT_FAILED, label: 'CM审核驳回' },
  { value: PROFILE_STATE_ENUM.FINANCE_AUDIT_FAILED, label: '财务审核驳回' },
  { value: PROFILE_STATE_ENUM.FINANCE_RE_EDIT, label: '财务驳回后再次编辑完成' },
  { value: PROFILE_STATE_ENUM.CM_RE_EDIT, label: 'CM驳回后再次编辑完成' },
];

// 创建模块枚举
export enum MODULE_BLOCK_ENUM {
  /** 基本资料-工商信息 */
  COMPANY_INFO = 'COMPANY_INFO',
  /** 基本资料-人员规模 */
  CUSTOMER_SCALE = 'CUSTOMER_SCALE',
  /** 基本资料-其它信息 */
  CUSTOMER_OTHER = 'CUSTOMER_OTHER',
  /** 运营信息-品牌 */
  BRAND = 'BRAND',
  /** 运营信息-邮寄地址 */
  SHIPPING_ADDRESS = 'SHIPPING_ADDRESS',
  /** 联系人信息 */
  CONTACTS = 'CONTACTS',
  /** 账期-货款账期 */
  ACCOUNTING_PERIOD = 'ACCOUNTING_PERIOD',
  /** 账期-发票信息 */
  INVOICE = 'INVOICE',
  /** 账期-银行卡信息 */
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  /** 风险信息 */
  RISK_INFO = 'RISK_INFO',
  /** 资料文件 */
  PROFILE_FILES = 'PROFILE_FILES',
  /** 客户外部关联关系 */
  EXTERNAL_RELATION = 'EXTERNAL_RELATION'
}

// 档案审核
export enum ARCHIVES_AUDIT_STATE {
  /** 待审核 */
  WAIT = 'WAIT',
  /** 通过 */
  PASS = 'PASS',
  /** 驳回 */
  REJECT = 'REJECT'
}
export const ARCHIVES_AUDIT_LIST = [
  { value: ARCHIVES_AUDIT_STATE.WAIT, label: '待审核' },
  { value: ARCHIVES_AUDIT_STATE.PASS, label: '通过' },
  { value: ARCHIVES_AUDIT_STATE.REJECT, label: '驳回' },
];

// 审核记录
export enum AUDIT_MESSAGE_ENUM {
  /** bdm审核 */
  BDM_AUDIT = 'BDM_AUDIT',
  /** 客户补录 */
  PROFILE_COMPLETE = 'PROFILE_COMPLETE',
  /** cm审核 */
  CM_AUDIT = 'CM_AUDIT',
  /** cm驳回再编辑 */
  CM_RE_EDIT = 'CM_RE_EDIT',
  /** 财务审核 */
  FINANCE_AUDIT = 'FINANCE_AUDIT',
  /** 财务驳回再编辑 */
  FINANCE_RE_EDIT = 'RE_EDIT',
  /** 创建客户档案资料 */
  BD_CREATE = 'BD_CREATE',
  /** 客户未准入 */
  BDM_RE_EDIT = 'BDM_RE_EDIT',
}

// tabs枚举
export enum TABS_ENUM {
  /** 基本信息 */
  TAB_BASIC = 'tab-basic',
  /** 运营信息 */
  TAB_OPERATE = 'tab-operate',
  /** 联系管理 */
  TAB_RELATIONSHIP = 'tab-relationship',
  /** 货款帐期 */
  TAB_PAYMENT = 'tab-payment',
  /** 风险信息 */
  TAB_RISK = 'tab-risk',
  /** 资料文件 */
  TAB_INFORMATION = 'tab-information',
  /** 系统关联 */
  TAB_SYSTEM = 'tab-system',
  /** 审核记录 */
  TAB_EXAMINE = 'tab-examine'
}

// 操作日志-操作类型
export enum LOG_OPERATE_TYPE_ENUM {
  /** 创建 */
  ADD = 'ADD',
  /** 编辑 */
  UPDATE = 'UPDATE',
  /** 审批 */
  EXAMINE_AND_APPROVE = 'EXAMINE_AND_APPROVE',
  /** 启用 */
  ENABLE = 'ENABLE',
  /** 禁用 */
  DISABLE = 'DISABLE'
}
export const LOG_OPERATE_TYPE_LIST = [
  { value: LOG_OPERATE_TYPE_ENUM.ADD, label: '创建' },
  { value: LOG_OPERATE_TYPE_ENUM.UPDATE, label: '编辑' },
  { value: LOG_OPERATE_TYPE_ENUM.EXAMINE_AND_APPROVE, label: '审批' },
  { value: LOG_OPERATE_TYPE_ENUM.ENABLE, label: '启用' },
  { value: LOG_OPERATE_TYPE_ENUM.DISABLE, label: '禁用' },
];

// 客户类型
export enum CUSTOMER_TYPE_ENUM {
  /** 外部客户 */
  EXTERNAL_CUSTOMER = '1',
  /** 内部客户 */
  INSIDE_CUSTOMER = '2',
}
export const CUSTOMER_TYPE_LIST = [
  { value: CUSTOMER_TYPE_ENUM.EXTERNAL_CUSTOMER, label: '否' },
  { value: CUSTOMER_TYPE_ENUM.INSIDE_CUSTOMER, label: '是' },
];

// 本地缓存 KEY
export enum CRM_STORAGE_KEY_ENUM {
  /* 客户档案搜索条件 */
  CRM_CUSTOMERLIST_SEARCH_PARAMS = 'crm-customerList-search-params',
}
// 出账类型
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

// 出账日设置
export enum PERIOD_DATE_ORDER_ENUM {
  /** 财务操作 */
  ORDER_SIGN = 'ORDER_SIGN',
}
export const PERIOD_DATE_ORDER_LIST = [
  { value: PERIOD_DATE_ORDER_ENUM.ORDER_SIGN, label: '客户签收日' },
];

// 优惠档次
export enum DISCOUNT_GRADE_ENUM {
  /** A */
  A = 'A',
  /** B */
  B = 'B',
  /** C */
  C = 'C'
}
export const DISCOUNT_GRADE_LIST = [
  { value: DISCOUNT_GRADE_ENUM.A, label: 'A' },
  { value: DISCOUNT_GRADE_ENUM.B, label: 'B' },
  { value: DISCOUNT_GRADE_ENUM.C, label: 'C' },
];

/**
 * 金融授信结果
 */
export enum FINANCE_CREDIT_STATE_ENUM {
  /** 未开通 */
  NOT_OPENED = '0',
  /** 开通失败 */
  NOT_FAILED = '11',
  /** 开通成功 */
  OPENED = '10'
}
export const FINANCE_CREDIT_STATE_LIST = [
  { value: FINANCE_CREDIT_STATE_ENUM.NOT_OPENED, label: '未开通' },
  { value: FINANCE_CREDIT_STATE_ENUM.NOT_FAILED, label: '开通失败' },
  { value: FINANCE_CREDIT_STATE_ENUM.OPENED, label: '开通成功' },
];

/**
 * 检测方式
*/
export enum CHECK_WAY_ENUM {
  /**
   * 需要外检
   */
  EXTERNAL_CHECK = '1',
  /**
   * 无需检测
   */
  NOT_REQUIRED_CHECK = '2',
  /**
   * 天工自检
   */
  TIANGONG_CHECK = '3'
}
export const CHECK_WAY_LIST = [
  { value: CHECK_WAY_ENUM.EXTERNAL_CHECK, label: '需要外检' },
  { value: CHECK_WAY_ENUM.NOT_REQUIRED_CHECK, label: '无需检测' },
  { value: CHECK_WAY_ENUM.TIANGONG_CHECK, label: '天工自检' },
];

// 支付方式
export enum PAYMENT_WAY_ENUM {
  /**
   * 客户支付
   */
  CUSTOMER_PAY = '1',
  /**
   * 天工支付
   */
  TIANGONG_PAY = '2'
}
export const PAYMENT_WAY_LIST = [
  { value: PAYMENT_WAY_ENUM.CUSTOMER_PAY, label: '客户支付' },
  { value: PAYMENT_WAY_ENUM.TIANGONG_PAY, label: '天工支付' },
];

// 包装供给方
export enum PACKAGE_PROVIDER_ENUM {
  /**
   * 客户提供
   */
  CUSTOMER_PROVIDER = '1',
  /**
   * 天工提供
   */
  TIANGONG_PROVIDER = '2'
}
export const PACKAGE_PROVIDER_LIST = [
  { value: PACKAGE_PROVIDER_ENUM.CUSTOMER_PROVIDER, label: '客户提供' },
  { value: PACKAGE_PROVIDER_ENUM.TIANGONG_PROVIDER, label: '天工提供' },
];
