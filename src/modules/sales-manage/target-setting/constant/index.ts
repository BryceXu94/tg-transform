// 目标类型
export enum TARGET_TYPE_ENUM {
  /** 下单GMV */
  ORDER_GMV = '1',
  /** 回款金额 */
  COLLECTION_AMOUNT = '2',
}

export const TARGET_TYPE_LIST = [
  { value: TARGET_TYPE_ENUM.ORDER_GMV, label: '下单GMV', tag: 'primary', color: '#409eff' },
  { value: TARGET_TYPE_ENUM.COLLECTION_AMOUNT, label: '回款金额', tag: 'success', color: '#8A2BE2' },
];

// 目标状态
export enum TARGET_STATUS_ENUM {
  /** 未生效 */
  NOT_EFFECTIVE= '1',
  /** 生效中 */
  EFFECTIVE_PADDING = '2',
  /** 已失效 */
  EXPIRED = '3',
  /** 已撤销 */
  RESCINDED = '4'
}
export const TARGET_STATUS_LIST = [
  { value: TARGET_STATUS_ENUM.NOT_EFFECTIVE, label: '未生效', tag: 'warning' },
  { value: TARGET_STATUS_ENUM.EFFECTIVE_PADDING, label: '生效中', tag: 'success' },
  { value: TARGET_STATUS_ENUM.EXPIRED, label: '已失效', tag: 'info' },
  { value: TARGET_STATUS_ENUM.RESCINDED, label: '已撤销', tag: 'danger' },
];

export enum TYPE_ENUM {
  /** 目标设置 */
  CREATE = 'CREATE',
  /** 目标变更 */
  UPDATE = 'UPDATE'
}

// 设置范围
export enum TARGET_RANGE_ENUM {
  /** 内部对象 */
  INNER_OBJECT = '1',
  /** 外部对象 */
  EXTERNAL_OBJECT = '2',
}
export const TARGET_RANGE_LIST = [
  { value: TARGET_RANGE_ENUM.INNER_OBJECT, label: '内部对象' },
  { value: TARGET_RANGE_ENUM.EXTERNAL_OBJECT, label: '外部对象' },
];

// 生效日期
const enum EFFECTIVE_DATE_ENUM {
  /** 次日 */
  TOMORROW = 'next_day',
  /** 本周 */
  THI_WEEK = 'this_week',
  /** 下一周 */
  NEXT_WEEK = 'next_week',
  /** 本月 */
  THIS_MOUTH = 'this_month',
  /** 下一月 */
  NEXT_MOUTH = 'next_month'
}
export const EFFECTIVE_DATE_LIST = [
  { value: EFFECTIVE_DATE_ENUM.TOMORROW, label: '次日' },
  { value: EFFECTIVE_DATE_ENUM.THI_WEEK, label: '本周' },
  { value: EFFECTIVE_DATE_ENUM.NEXT_WEEK, label: '下一周' },
  { value: EFFECTIVE_DATE_ENUM.THIS_MOUTH, label: '本月' },
  { value: EFFECTIVE_DATE_ENUM.NEXT_MOUTH, label: '下一月' },
];
