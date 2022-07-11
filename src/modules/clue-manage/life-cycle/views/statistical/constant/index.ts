/** 漏斗维度 */
export enum DIMENSION_ENUM {
  /** 客户线索漏斗 */
  CLUES = '1',
  /** 客户档案漏斗 */
  RECORD = '2',
}

export const DIMENSION_LIST = [
  { value: DIMENSION_ENUM.CLUES, label: '客户线索漏斗' },
  { value: DIMENSION_ENUM.RECORD, label: '客户档案漏斗' },
];

// 柱状图对比维度
export enum BAR_DATE_ENUM {
  /** 本月-上月 */
  MONTH = '1',
  /** 本周-上周 */
  WEEK = '2',
  /** 自定义 */
  CUSTOM = '3',
}

export const BAR_DATE_LIST = [
  { value: BAR_DATE_ENUM.MONTH, label: '上月-本月' },
  { value: BAR_DATE_ENUM.WEEK, label: '上周-本周' },
  { value: BAR_DATE_ENUM.CUSTOM, label: '自定义' },
];
