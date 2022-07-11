export enum AUDIT_STATE_ENUM {
  /** 待审核 */
  NOT_REVIEW = '0',
  /** 审核通过 */
  COLUMN_PASS = '1',
  /** 审核驳回 */
  COLUMN_CULL = '2',
}

export const AUDIT_STATE_LIST = [
  { value: AUDIT_STATE_ENUM.NOT_REVIEW, label: '待审核' },
  { value: AUDIT_STATE_ENUM.COLUMN_CULL, label: '审核驳回' },
  { value: AUDIT_STATE_ENUM.COLUMN_PASS, label: '审核通过' },
];
