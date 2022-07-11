// 温馨提示弹窗-操作类型
export enum TIPS_DIALOG_TYPE_ENUM {
  /** 提交 */
  SUBMIT = 'SUBMIT',
  /** 撤销 */
  REVOKE = 'REVOKE',
}

// 审批状态
export enum APPROVE_STATUS_ENUM {
  /** 待审批 */
  APPROVAL_PENDING = 'APPROVAL_PENDING',
  /** 审批中 */
  APPROVAL_PROGRESS = 'APPROVAL_PROGRESS',
  /** 已通过 */
  APPROVAL_PASS = 'APPROVAL_PASS',
  /** 已拒绝 */
  APPROVAL_REFUSE = 'APPROVAL_REFUSE',
  /** 已撤销 */
  APPROVAL_QUASH = 'APPROVAL_QUASH',
}
export const APPROVE_STATUS_TAB_LIST = [
  { value: APPROVE_STATUS_ENUM.APPROVAL_PROGRESS, label: '审批中' },
  { value: APPROVE_STATUS_ENUM.APPROVAL_PASS, label: '已通过' },
  { value: APPROVE_STATUS_ENUM.APPROVAL_REFUSE, label: '已拒绝' },
  { value: APPROVE_STATUS_ENUM.APPROVAL_QUASH, label: '已撤销' },
];
export const APPROVE_STATUS_LIST = [
  ...APPROVE_STATUS_TAB_LIST,
  { value: APPROVE_STATUS_ENUM.APPROVAL_PENDING, label: '待审批' },
];

// 授信申请类型
export enum CREDIT_APPLY_TYPE_ENUM {
  /** 初次授信 */
  FIRST = 'FIRST',
  /** 提额调整 */
  ROUTINE = 'ROUTINE',
  /** 临时调整 */
  TEMPORARY = 'TEMPORARY',
}
export const CREDIT_APPLY_TYPE_FIRST_LIST = [
  { value: CREDIT_APPLY_TYPE_ENUM.FIRST, label: '初次授信' },
];
export const CREDIT_APPLY_TYPE_AGAIN_LIST = [
  { value: CREDIT_APPLY_TYPE_ENUM.ROUTINE, label: '提额调整' },
  { value: CREDIT_APPLY_TYPE_ENUM.TEMPORARY, label: '临时调整' },
];
export const CREDIT_APPLY_TYPE_LIST = [
  ...CREDIT_APPLY_TYPE_FIRST_LIST,
  ...CREDIT_APPLY_TYPE_AGAIN_LIST,
];

// 授信审批类型
export enum CREDIT_APPROVE_TYPE_ENUM {
  /** 授信 */
  CREDIT = 'CREDIT',
}
export const CREDIT_APPROVE_TYPE_LIST = [
  { value: CREDIT_APPROVE_TYPE_ENUM.CREDIT, label: '授信' },
];

// 授信审批操作类型
export enum CREDIT_OPERATE_TYPE_ENUM {
  /** 发起审批 */
  INITIATE_APPROVAL = 'INITIATE_APPROVAL',
  /** 添加评论 */
  ADD_COMMENT = 'ADD_COMMENT',
  /** 已通过 */
  PASSED = 'PASSED',
  /** 已撤回 */
  WITHDRAWN = 'WITHDRAWN',
  /** 已拒绝 */
  REJECTED = 'REJECTED',
}
export const CREDIT_OPERATE_TYPE_LIST = [
  { value: CREDIT_OPERATE_TYPE_ENUM.INITIATE_APPROVAL, label: '发起审批' },
  { value: CREDIT_OPERATE_TYPE_ENUM.ADD_COMMENT, label: '添加评论' },
  { value: CREDIT_OPERATE_TYPE_ENUM.PASSED, label: '已通过' },
  { value: CREDIT_OPERATE_TYPE_ENUM.WITHDRAWN, label: '已撤回' },
  { value: CREDIT_OPERATE_TYPE_ENUM.REJECTED, label: '已拒绝' },
];

// 模板下载类型
export enum TEMPLATE_TYPE_ENUM {
  /** 客户信息档案表模板 */
  CUSTOMER_PROFILE = '1001',
  /** 客户信用评分表模板 */
  CUSTOMER_SCORE = '1002',
  /** 异常状态 */
  OTHER = '-1'
}
