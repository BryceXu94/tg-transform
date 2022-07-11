// 需求状态
export enum DEMAND_STATE_ENUM {
  DEMAND_TO_BE_CONFIRMED = '10',
  // AWAITING_FACTORY_ORDER 待工厂接单
  FACTORY_MATCHING = '2010',
  PRODUCTION_TO_BE_CONFIRMED = '2020',
  // PENDING_CONTRACT 待签合同
  PRODUCTION_CONFIRMED = '2030',
  CONTRACT_TO_BE_SIGNED = '2040',
  FACTORY_SIGNING = '2050',
  IN_PROGRESS= '20',
  COMPLETED = '30',
  CLOSED = '50',
}
export const DEMAND_STATE_LIST = [
  { value: DEMAND_STATE_ENUM.DEMAND_TO_BE_CONFIRMED, label: '待确认需求' },
  { value: DEMAND_STATE_ENUM.FACTORY_MATCHING, label: '工厂匹配中' },
  { value: DEMAND_STATE_ENUM.PRODUCTION_TO_BE_CONFIRMED, label: '待确认生产' },
  { value: DEMAND_STATE_ENUM.PRODUCTION_CONFIRMED, label: '已确认生产' },
  { value: DEMAND_STATE_ENUM.CONTRACT_TO_BE_SIGNED, label: '待签署合同' },
  { value: DEMAND_STATE_ENUM.FACTORY_SIGNING, label: '工厂签署中' },
  { value: DEMAND_STATE_ENUM.COMPLETED, label: '已完成' },
  { value: DEMAND_STATE_ENUM.CLOSED, label: '已关闭' },
];

// 需求类型
export enum DEMAND_TYPE_ENUM {
  /** 自营款 */
  SELF_OPERATED_BUSINESS = '2',
  /** 客供款 */
  PLATFORM_BUSINESS = '1',
}

export const DEMAND_TYPE_LIST = [
  { value: DEMAND_TYPE_ENUM.SELF_OPERATED_BUSINESS, label: '自营款' },
  { value: DEMAND_TYPE_ENUM.PLATFORM_BUSINESS, label: '客供款' },
];

// 首单 返单
export enum ORDER_TYPE_ENUM {
  /** 首单 */
  FIRST_ORDER = '1',
  /** 返单 */
  RETURN_ORDER = '0',
}

export const ORDER_TYPE_LIST = [
  { value: ORDER_TYPE_ENUM.FIRST_ORDER, label: '首单' },
  { value: ORDER_TYPE_ENUM.RETURN_ORDER, label: '返单' },
];

// 订单状态
export enum ORDER_STATE_ENUM {
  /** 待发货 */
  WAIT_DELIVERY_GOODS = '10',
  /** 待收货 */
  WAIT_RECEIVE_GOODS = '20',
  /** 已收货 */
  RECEIVED_GOODS = '30',
  /** 待对账 */
  WAIT_CHECK_BILL = '40',
  /** 待付款 */
  WAIT_PAY = '50',
  /** 订单异常 */
  ORDER_ERROR = '60',
  /** 已完成 */
  FINISH = '70',
  /** 已取消 */
  CANCEL = '80',
}

export const ORDER_STATE_LIST = [
  { value: ORDER_STATE_ENUM.WAIT_DELIVERY_GOODS, label: '待发货' },
  { value: ORDER_STATE_ENUM.WAIT_RECEIVE_GOODS, label: '待收货' },
  { value: ORDER_STATE_ENUM.RECEIVED_GOODS, label: '已收货' },
  { value: ORDER_STATE_ENUM.WAIT_CHECK_BILL, label: '待对账' },
  { value: ORDER_STATE_ENUM.WAIT_PAY, label: '待付款' },
  { value: ORDER_STATE_ENUM.ORDER_ERROR, label: '订单异常' },
  { value: ORDER_STATE_ENUM.FINISH, label: '已完成' },
  { value: ORDER_STATE_ENUM.CANCEL, label: '已取消' },
];

// 订单异常状态
export enum ORDER_ERROR_STATE_ENUM {
  /** 已拒收 */
  REJECT_RECEIVE = '1',
  /** 差异处理中 */
  DIFFERENCE_HANDLING = '2',
  /** 待工厂对账 */
  WAIT_FACTORY_CHECK = '3',
  /** 平台确认中 */
  WAIT_PLATFORM_CHECK = '4',
}

export const ORDER_ERROR_STATE_LIST = [
  { value: ORDER_ERROR_STATE_ENUM.REJECT_RECEIVE, label: '已拒收' },
  { value: ORDER_ERROR_STATE_ENUM.DIFFERENCE_HANDLING, label: '差异处理中' },
  { value: ORDER_ERROR_STATE_ENUM.WAIT_FACTORY_CHECK, label: '待工厂对账' },
  { value: ORDER_ERROR_STATE_ENUM.WAIT_PLATFORM_CHECK, label: '平台确认中' },
];
