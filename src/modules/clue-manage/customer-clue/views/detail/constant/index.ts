export enum TAB_ENUM {
  /** 基础信息 */
  BASE_INFO = '1',
  /** 审核记录 */
  AUDIT_LOGS = '2',
}

export const TAB_LIST = [
  { value: TAB_ENUM.BASE_INFO, label: '基本信息' },
  { value: TAB_ENUM.AUDIT_LOGS, label: '审核记录' },
];
