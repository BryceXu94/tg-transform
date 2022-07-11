// TAB
export enum TAB_ENUM {
  /** 子账单 */
  SUB = 'SUB',
  /** 客户扣款 */
  DEDUCTION = 'DEDUCTION',
  /** 客户奖励 */
  BONUS = 'BONUS',
  /** 收款明细 */
  DETAIL = 'DETAIL',
}
export const TAB_LIST = [
  { value: TAB_ENUM.SUB, label: '子账单' },
  { value: TAB_ENUM.DEDUCTION, label: '客户扣款' },
  { value: TAB_ENUM.BONUS, label: '客户奖励' },
  { value: TAB_ENUM.DETAIL, label: '收款明细' },
];
