// 操作日志-操作类型
export enum LOG_OPERATE_TYPE_ENUM {
  /* 创建 */
  ADD = 'ADD',
  /* 编辑 */
  UPDATE = 'UPDATE',
  /** 启用 */
  ENABLE = 'ENABLE',
  /** 禁用 */
  DISABLE = 'DISABLE'
}
export const LOG_OPERATE_TYPE_LIST = [
  { value: LOG_OPERATE_TYPE_ENUM.ADD, label: '创建' },
  { value: LOG_OPERATE_TYPE_ENUM.UPDATE, label: '编辑' },
  { value: LOG_OPERATE_TYPE_ENUM.ENABLE, label: '启用' },
  { value: LOG_OPERATE_TYPE_ENUM.DISABLE, label: '禁用' },
];
// 列表类型
export enum TABS_TYPE_ENUM {
  /**
   * 租户列表
  */
  TENANT_LIST = '1',
  /**
   * 账号列表
  */
  ACCOUNT_NO_LIST = '2'
}

export const TABS_TYPE_LIST = [
  { value: TABS_TYPE_ENUM.TENANT_LIST, label: '租户列表' },
  { value: TABS_TYPE_ENUM.ACCOUNT_NO_LIST, label: '账号列表' },
];

/** 数字 是否 */
export enum YES_OR_NO_NUMBER_ENUM {
  YES = '1',
  NO = '0',
}

export const AUTH_LIST = [
  /** 企业已认证 */
  { value: YES_OR_NO_NUMBER_ENUM.YES, label: '企业已认证' },
  /** 企业未认证 */
  { value: YES_OR_NO_NUMBER_ENUM.NO, label: '企业未认证' },
];
