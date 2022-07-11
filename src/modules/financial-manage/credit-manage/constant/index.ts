/**
 * 温馨提示弹窗-操作类型
 */
export enum TIPS_DIALOG_TYPE_ENUM {
  /** 启用 */
  ENABLE = 'ENABLE',
  /** 停用 */
  DIASBLE = 'DIASBLE',
  /** 停用_回款催收提醒 */
  DIASBLE_REMIND = 'DIASBLE_REMIND',
}

/**
 * 启用状态
 */
export enum STATUS_ENUM {
  /** 启用 */
  ENABLE = 'ENABLE',
  /** 停用 */
  DIASBLE = 'DISABLE',
}
export const STATUS_LIST = [
  { value: STATUS_ENUM.ENABLE, label: '已启用' },
  { value: STATUS_ENUM.DIASBLE, label: '已停用' },
];
export const STATUS_REVERT_LIST = [
  { value: STATUS_ENUM.ENABLE, label: '停用' },
  { value: STATUS_ENUM.DIASBLE, label: '启用' },
];
/**
 * 启用状态-数字
 */
export enum STATUS_NUMBER_ENUM {
  /** 启用 */
  ENABLE = '1',
  /** 停用 */
  DIASBLE = '0',
}
export const STATUS_NUMBER_LIST = [
  { value: STATUS_NUMBER_ENUM.ENABLE, label: '已启用' },
  { value: STATUS_NUMBER_ENUM.DIASBLE, label: '已停用' },
];
export const STATUS_NUMBER_REVERT_LIST = [
  { value: STATUS_NUMBER_ENUM.ENABLE, label: '停用' },
  { value: STATUS_NUMBER_ENUM.DIASBLE, label: '启用' },
];

/**
 * 调整额度弹窗-调整类型
 */
export enum UPDATE_REDIT_TYPE_ENUM {
  /** 提额调整 */
  ROUTINE = 'ROUTINE',
  /** 临时调整（回款后系统自动扣减对应额度） */
  TEMPORARY = 'TEMPORARY',
  /** 外界系统单据调整 */
  OUTING_SYSTEM_ORDER = 'OUTING_SYSTEM_ORDER',
  /** 差异调整 */
  DIFF_ADJUST = 'DIFF_ADJUST',
}
export const UPDATE_REDIT_TYPE_LIST = [
  { value: UPDATE_REDIT_TYPE_ENUM.ROUTINE, label: '提额调整（若需要降额则需要负数即可）' },
  { value: UPDATE_REDIT_TYPE_ENUM.TEMPORARY, label: '临时调整（回款后系统自动扣减对应额度）' },
  { value: UPDATE_REDIT_TYPE_ENUM.DIFF_ADJUST, label: '差异调整（系统外手工关联调整）' },
];

/**
 * 授信审批操作类型
 */
export enum CREDIT_OPERATE_TYPE_ENUM {
  /** 初次授信 */
  FIRST = 'FIRST',
  /** 提额调整额度 */
  ROUTING = 'ROUTING',
  /** 临时调整额度 */
  TEMPORARY = 'TEMPORARY',
  /** 差异调整额度 */
  DIFF_ADJUST = 'DIFF_ADJUST',
  /** 启用 */
  ENABLE = 'ENABLE',
  /** 停用 */
  DISABLE = 'DISABLE',
}
export const CREDIT_OPERATE_TYPE_LIST = [
  { value: CREDIT_OPERATE_TYPE_ENUM.FIRST, label: '初次授信' },
  { value: CREDIT_OPERATE_TYPE_ENUM.ROUTING, label: '提额调整额度' },
  { value: CREDIT_OPERATE_TYPE_ENUM.TEMPORARY, label: '临时调整额度' },
  { value: CREDIT_OPERATE_TYPE_ENUM.DIFF_ADJUST, label: '差异调整额度' },
  { value: CREDIT_OPERATE_TYPE_ENUM.ENABLE, label: '启用' },
  { value: CREDIT_OPERATE_TYPE_ENUM.DISABLE, label: '停用' },
];

// 导出类型
export enum EXPORT_TYPE_ENUM {
  /** 客户授信表 */
  AMOUNT_INFO = '1',
  /** 客户授信明细表 */
  AMOUNT_ADJUST_INFO = '2',
  /** 集团授信表 */
  GROUP_AMOUNT_INFO = '3',
  /** 集团授信明细表 */
  GROUP_AMOUNT_ADJUST_INFO = '4'

}
export const EXPORT_TYPE_LIST = [
  { value: EXPORT_TYPE_ENUM.AMOUNT_INFO, label: '客户授信表' },
  { value: EXPORT_TYPE_ENUM.AMOUNT_ADJUST_INFO, label: '客户授信明细表' },
];
export const GROUP_EXPORT_TYPE_LIST = [
  { value: EXPORT_TYPE_ENUM.GROUP_AMOUNT_INFO, label: '集团授信表' },
  { value: EXPORT_TYPE_ENUM.GROUP_AMOUNT_ADJUST_INFO, label: '集团授信明细表' },
];
