// 目标类型
export enum TARGET_TYPE_ENUM {
  /* 下单GMV */
  ORDER_GMV = '1',
  /* 回款金额 */
  RECEIVABLE_AMOUNT = '2',
}

export const TARGET_TYPE_LIST = [
  { value: TARGET_TYPE_ENUM.ORDER_GMV, label: '下单GMV' },
  { value: TARGET_TYPE_ENUM.RECEIVABLE_AMOUNT, label: '回款金额' },
];

// 生效周期类型
export enum EFFECTIVE_PERIOD_TYPE_ENUM {
  /* 次日 */
  NEXT_DAY = 'next_day',
  /* 本周 */
  THIS_WEEK = 'this_week',
  /* 下一周 */
  NEXT_WEEK = 'next_week',
  /* 本月 */
  THIS_MONTH = 'this_month',
  /* 下一月 */
  NEXT_MONTH = 'next_month',
}

export const EFFECTIVE_PERIOD_TYPE_LIST = [
  { value: EFFECTIVE_PERIOD_TYPE_ENUM.NEXT_DAY, label: '次日' },
  { value: EFFECTIVE_PERIOD_TYPE_ENUM.THIS_WEEK, label: '本周' },
  { value: EFFECTIVE_PERIOD_TYPE_ENUM.NEXT_WEEK, label: '下周' },
  { value: EFFECTIVE_PERIOD_TYPE_ENUM.THIS_MONTH, label: '本月' },
  { value: EFFECTIVE_PERIOD_TYPE_ENUM.NEXT_MONTH, label: '下一月' },
];

// 达标类型
export enum STANDARD_TYPE_ENUM {
  /* 未完成 */
  UN_FINISH = '0',
  /* 已完成 */
  FINISH = '1',
}

export const STANDARD_TYPE_LIST = [
  { value: STANDARD_TYPE_ENUM.UN_FINISH, label: '未完成' },
  { value: STANDARD_TYPE_ENUM.FINISH, label: '已完成' },
];
