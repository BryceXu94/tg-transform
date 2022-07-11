// 合同状态
export enum CONTRACT_STATE_ENUM {
  /** 待客户签署 */
  WAIT_CUSTOMER_SIGN = '2040',
  /** 待工厂签署 */
  WAIT_FACTORY_SIGN = '2050',
  /** 已签署 */
  SIGNED = '30'
}

export const CONTRACT_STATE_LIST = [
  { value: CONTRACT_STATE_ENUM.WAIT_CUSTOMER_SIGN, label: '待客户签署' },
  { value: CONTRACT_STATE_ENUM.WAIT_FACTORY_SIGN, label: '待工厂签署' },
  { value: CONTRACT_STATE_ENUM.SIGNED, label: '已签署' },
];
