export enum CUSTOMER_STATUS_ENUM {
  /*
  * 停用
  * */
  CLOSE = '0',
  /*
  * 启用
  * */
  OPEN = '1',
}
export const CUSTOMER_STATUS_ENUM_LIST = [
  { value: CUSTOMER_STATUS_ENUM.CLOSE, label: '停用' },
  { value: CUSTOMER_STATUS_ENUM.OPEN, label: '启用' },
];
export enum AMOUNT_STATUS_ENUM {
  /*
  * 停用
  * */
  CLOSE = '0',
  /*
  * 启用
  * */
  OPEN = '1',
}
export const AMOUNT_STATUS_ENUM_LIST = [
  { value: AMOUNT_STATUS_ENUM.CLOSE, label: '停用' },
  { value: AMOUNT_STATUS_ENUM.OPEN, label: '启用' },
];
export enum ADJUST_TYPE_ENUM {
  // 1=调整期初额度，2=调整可用额度，3=变动可用额度
  MODIFY_INITAMOUNT = '1',
  MODIFY_AVAILABLE_AMOUNT = '2',
  UPDATE_AVAILABLE_AMOUNT = '3',
}

export const ADJUST_TYPE_ENUM_LIST = [
  { value: ADJUST_TYPE_ENUM.MODIFY_INITAMOUNT, label: '调整期初额度' },
  { value: ADJUST_TYPE_ENUM.MODIFY_AVAILABLE_AMOUNT, label: '调整可用额度' },
  { value: ADJUST_TYPE_ENUM.UPDATE_AVAILABLE_AMOUNT, label: '变动可用额度' },
];
