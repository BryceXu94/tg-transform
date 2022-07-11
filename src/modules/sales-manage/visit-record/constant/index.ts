import { GLOBAL_COLOR_TYPE_ENUM } from '@/constant/global';

// 客户异常状态
export enum ABNORMAL_STATE_ENUM{
    /** 无异常 */
    WITHOUT = '0',
    /** 异常 */
    WITH = '1'
}

export const ABNORMAL_STATE_LIST = [
  { value: ABNORMAL_STATE_ENUM.WITHOUT, label: '无异常' },
  { value: ABNORMAL_STATE_ENUM.WITH, label: '异常' },
];

// 客户登记状态
export enum REGISTER_STATE_ENUM {
  /** 未登记 */
  REGISTRATION_NONE = '0',
  /** 已登记 */
  REGISTRATION_ALREADY = '1',
}

export const REGISTER_STATE_LIST = [
  { value: REGISTER_STATE_ENUM.REGISTRATION_NONE, label: '未登记' },
  { value: REGISTER_STATE_ENUM.REGISTRATION_ALREADY, label: '已登记' },
];

// 客户反馈状态
export enum FEEDBACK_STATE_ENUM {
  /** 未反馈 */
  FEEDBACK_NONE = '0',
  /** 已反馈 */
  FEEDBACK_ALREADY = '1',
}

/**
 * 操作日志类型
 */
export enum OPERATION_LOG_TYPE_ENUM {
  // 签到打卡
  CLOCK = 'CLOCK',
  // 拜访登记
  REGISTER = 'REGISTER',
  // 异常反馈
  FEEDBACK = 'FEEDBACK',
}
export const OPERATION_LOG_TYPE_LIST = [
  { value: OPERATION_LOG_TYPE_ENUM.CLOCK, label: '签到打卡' },
  { value: OPERATION_LOG_TYPE_ENUM.REGISTER, label: '拜访登记' },
  { value: OPERATION_LOG_TYPE_ENUM.FEEDBACK, label: '异常反馈' },
];

// 拜访类型
export enum VISIT_TYPE_ENUM {
  /** 上门拜访 */
  DOOR_VISIT = '1',
  /** 电话拜访 */
  PHONE_VISIT = '2',
  /** 客户来访 */
  CUSTOMER_VISIT = '3',
  /** 陪同拜访 */
  ESCORT_VISIT = '4',
  /** 上门陌拜 */
  STRANGER_VISIT = '5',
}

export const VISIT_TYPE_LIST = [
  { value: VISIT_TYPE_ENUM.DOOR_VISIT, label: '上门拜访' },
  { value: VISIT_TYPE_ENUM.PHONE_VISIT, label: '电话拜访' },
  { value: VISIT_TYPE_ENUM.CUSTOMER_VISIT, label: '客户来访' },
  { value: VISIT_TYPE_ENUM.ESCORT_VISIT, label: '陪同拜访' },
  { value: VISIT_TYPE_ENUM.STRANGER_VISIT, label: '上门陌拜' },
];

// 客户类型
export enum CUSTOMER_TYPE_ENUM {
  /** 客户档案 */
  CUSTOMER_PROFILE = '1',
  /** 开发计划 */
  DEVELOPMENT_PLAN = '2',
  /** 电商线索 */
  E_COMMERCE_CLUE = '3',
  /** 陌拜线索 */
  STRANGER_VISIT_CLUE = '5',
}

export const CUSTOMER_TYPE_LIST = [
  { value: CUSTOMER_TYPE_ENUM.CUSTOMER_PROFILE, label: '客户档案', color: GLOBAL_COLOR_TYPE_ENUM.WARNING },
  { value: CUSTOMER_TYPE_ENUM.DEVELOPMENT_PLAN, label: '开发计划', color: GLOBAL_COLOR_TYPE_ENUM.PRIMARY },
  { value: CUSTOMER_TYPE_ENUM.E_COMMERCE_CLUE, label: '电商线索', color: GLOBAL_COLOR_TYPE_ENUM.SUCCESS },
  { value: CUSTOMER_TYPE_ENUM.STRANGER_VISIT_CLUE, label: '陌拜线索', color: GLOBAL_COLOR_TYPE_ENUM.WARNING },
];
