/**
 * 贷款期限单位
 */
export enum DAYS_UNIT_ENUM {
  /** 天 */
  DAY = '1',
  /** 月 */
  MONTH = '2',
}
export const DAYS_UNIT_LIST = [
  { value: DAYS_UNIT_ENUM.DAY, label: '天' },
  { value: DAYS_UNIT_ENUM.MONTH, label: '月' },
];
