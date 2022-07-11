/*
* 系统枚举
* */
export enum SYSTEM_ENUM {
  /** 客户授信系统 */
  CCS = 'CCS',
}
/*
* SSO url 返回授权code 字段名称
* */
export const SSO_AUTHORIZATION_CODE = 'code';

/**
 * 接收到superset消息类型
 */
export enum RECEIVE_POST_MESSAGE_ENUM {
  /**
   * 接受:
   * 页面组件加载完成
   */
  SSO_COMPONENT_DID_MOUNT = 'SSO_COMPONENT_DID_MOUNT',
}

/**
 * 发送到superset消息类型
 */
export enum SEND_POST_MESSAGE_ENUM {
  /**
   * 发送:
   * sso权限
   */
  SSO_PERMISSION = 'SSO_PERMISSION',
}

/**
 * 文件类型（图片）
*/
export enum FILE_TYPE_ENUM {
  /** 营业执照 */
  CUSTOMER_BUSINESS_LICENSE = 'CUSTOMER_BUSINESS_LICENSE',
  /** 客户付款证明 */
  CUSTOMER_PAYMENT_PROOF = 'CUSTOMER_PAYMENT_PROOF',
  /** 客户合同文件 */
  CUSTOMER_CONTRACT = 'CUSTOMER_CONTRACT',
  /** 客户法人身份证照片 */
  CUSTOMER_LEGAL_PERSON_ID_CARD = 'CUSTOMER_LEGAL_PERSON_ID_CARD',
  /** 客户评分表文件 */
  CUSTOMER_CUSTOMER_SCORE = 'CUSTOMER_CUSTOMER_SCORE',
  /** 客户资产证明文件 */
  CUSTOMER_ASSETS_PROOF = 'CUSTOMER_ASSETS_PROOF'
}

/**
 * 客户状态
 */
export enum CUSTOMER_STATUS_ENUM {
  /** 待启用 */
  INIT = 'INIT',
  /** 已启用 */
  ENABLE = 'ENABLE',
  /** 已禁用 */
  DISABLE = 'DISABLE',
  /** 未准入 */
  ALLOW_REJECTED = 'ALLOW_REJECTED'
}
export enum CUSTOMER_STATUS_NUMBER_ENUM {
  /** 待启用 */
  INIT = '1',
  /** 已启用 */
  ENABLE = '2',
  /** 已禁用 */
  DISABLE = '4',
  /** 未准入 */
  ALLOW_REJECTED = '3'
}

/**
 * 客户授信状态
 */
export enum CUSTOMER_CREDIT_APPROVE_STATUS_ENUM {
  /** 未准入 */
  WAIT_PROFILE_AUDIT = 'WAIT_PROFILE_AUDIT',
  /** 待授信 */
  WAIT_CREDIT_GRANTING = 'WAIT_CREDIT_GRANTING',
  /** 启用 */
  ENABLE = 'ENABLE',
  /** 停用 */
  DISABLED = 'DISABLED',
}

/**
 * yes / no
*/
export enum YES_NO_ENUM {
  YES = 'YES',
  NO = 'NO'
}
export const YES_NO_LIST = [
  { value: YES_NO_ENUM.YES, label: '是' },
  { value: YES_NO_ENUM.NO, label: '否' },
];
export const ENABLE_DISABLE_LIST = [
  { value: YES_NO_ENUM.YES, label: '启用' },
  { value: YES_NO_ENUM.NO, label: '停用' },
];
export const OPEN_CLOSE_LIST = [
  { value: YES_NO_ENUM.YES, label: '已开通' },
  { value: YES_NO_ENUM.NO, label: '未开通' },
];

/** 数字 是否 */
export enum YES_OR_NO_NUMBER_ENUM {
  YES = '1',
  NO = '0',
}
export const ENABLE_DISABLE_NO_LIST = [
  { value: YES_OR_NO_NUMBER_ENUM.YES, label: '启用' },
  { value: YES_OR_NO_NUMBER_ENUM.NO, label: '禁用' },
];

export const YES_OR_NO_NUMBER_LIST = [
  { value: YES_OR_NO_NUMBER_ENUM.YES, label: '是' },
  { value: YES_OR_NO_NUMBER_ENUM.NO, label: '否' },
];

/**
 * 账户类型（对公 / 对私）
*/
export enum ACCOUNT_TYPE_ENUM {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}
export const ACCOUNT_TYPE_LIST = [
  { value: ACCOUNT_TYPE_ENUM.PUBLIC, label: '公账' },
  { value: ACCOUNT_TYPE_ENUM.PRIVATE, label: '私账' },
];

// 操作日志-日志类型
export enum LOG_TYPE_ENUM {
  /** 客户管理 */
  CUSTOMER_LOG = 'CUSTOMER_LOG',
  /** 集团管理 */
  GROUP_LOG = 'GROUP_LOG',
}

// 操作日志-操作类型
export enum LOG_OPERATE_TYPE_ENUM {
  /** 创建 */
  ADD = 'ADD',
  /** 编辑 */
  UPDATE = 'UPDATE',
}
export const LOG_OPERATE_TYPE_LIST = [
  { value: LOG_OPERATE_TYPE_ENUM.ADD, label: '创建' },
  { value: LOG_OPERATE_TYPE_ENUM.UPDATE, label: '编辑' },
];

// 发票类型
export enum INVOICE_TYPE_ENUM {
  /** 增值税专用发票 */
  GST = 'GST'
}
export const INVOICE_TYPE_LIST = [
  { value: INVOICE_TYPE_ENUM.GST, label: '增值税专用发票' },
];

// 业务模式
export enum BUSINESS_MODE_ENUM {
  /** 自营业务 */
  SELF_OPERATED_BUSINESS = 'SELF_OPERATED_BUSINESS',
  /** 平台业务 */
  PLATFORM_BUSINESS = 'PLATFORM_BUSINESS'
}
export enum BUSINESS_MODE_NO_ENUM {
  /** 自营业务 */
  SELF_OPERATED_BUSINESS = '1',
  /** 平台业务 */
  PLATFORM_BUSINESS = '2'
}
export const BUSINESS_MODE_LIST = [
  { value: BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS, label: '自营业务' },
  { value: BUSINESS_MODE_ENUM.PLATFORM_BUSINESS, label: '平台业务' },
];
export const BUSINESS_MODE_NO_LIST = [
  { value: BUSINESS_MODE_NO_ENUM.SELF_OPERATED_BUSINESS, label: '自营业务' },
  { value: BUSINESS_MODE_NO_ENUM.PLATFORM_BUSINESS, label: '平台业务' },
];
export const BUSINESS_MODE_DESC_LIST = [
  { value: BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS, label: '自营' },
  { value: BUSINESS_MODE_ENUM.PLATFORM_BUSINESS, label: '平台' },
];

// 订单类型
export enum ORDER_MODE_ENUM {
  /** 自营订单 */
  SELF_OPERATED_ORDER = '1',
  /** 平台订单 */
  PLATFORM_ORDER = '2'
}
export const ORDER_MODE_LIST = [
  { value: ORDER_MODE_ENUM.SELF_OPERATED_ORDER, label: '自营订单' },
  { value: ORDER_MODE_ENUM.PLATFORM_ORDER, label: '平台订单' },
];

// 来源类型
export enum SOURCE_TYPE_ENUM {
  /** CRM后台 */
  WEB = 'WEB',
  /** 客户小程序 */
  MINI_APP = 'MINI_APP',
  /** 天工 */
  TIANGONG = 'TIANGONG',
  /** APP */
  APP = 'APP'
}
export const SOURCE_TYPE_LIST = [
  { value: SOURCE_TYPE_ENUM.WEB, label: 'CRM后台' },
  { value: SOURCE_TYPE_ENUM.MINI_APP, label: '客户小程序' },
  { value: SOURCE_TYPE_ENUM.TIANGONG, label: '天工' },
  { value: SOURCE_TYPE_ENUM.APP, label: 'APP' },
];

export enum CUSTOMER_ADDRESS_TYPE_ENUM {
  /** 大货地址 */
  BULK_ADDRESS = 'bulk_address',
  /** 样衣地址 */
  SAMPLE_ADDRESS = 'sample_address',
}

export enum DESENSITIZE_DECRYPT_TYPE_ENUM {
  /** 全脱敏 */
  FULLY_DESENSITIZE = 'FULLY_DESENSITIZE',
  /** 电话 */
  PHONE = 'PHONE',
  /** 身份证  */
  ID_CARD = 'ID_CARD',
  /** 地址 */
  ADDRESS = 'ADDRESS',
  /** 姓名 */
  NAME = 'NAME',
  /** 邮箱 */
  EMAIL = 'EMAIL',
  /** 护照 */
  NATIONAL_PASSPORT = 'NATIONAL_PASSPORT',
  /** 银行账号 */
  BACK_ACCOUNT_NO = 'BACK_ACCOUNT_NO',
  /** 银行支行 */
  BACK_ACCOUNT_NAME = 'BACK_ACCOUNT_NAME',
}

// 集团授信状态（null代表未授信）
export const enum GROUP_CREDIT_APPROVE_STATUS_ENUM {
  /**
   * 停用
   */
  DISABLE = '0',
  /**
   * 启用
   */
  ENABLE = '1',
  /**
   * 异常状态
   */
  OTHER = '-1'
}

// 授信主体类型
export enum CREDIT_SUBJECT_ENUM {
  /** 客户维度 */
  CUSTOMER = '1',
  /** 集团维度 */
  GROUP = '2',
}
export const CREDIT_SUBJECT_LIST = [
  { value: CREDIT_SUBJECT_ENUM.CUSTOMER, label: '客户维度' },
  { value: CREDIT_SUBJECT_ENUM.GROUP, label: '集团维度' },
];
// 授信主体类型-路由
export enum CREDIT_SUBJECT_ROUTE_ENUM {
  /** 客户维度 */
  CUSTOMER = 'customer',
  /** 集团维度 */
  GROUP = 'group',
}

/** 颜色主题枚举 */
export enum GLOBAL_COLOR_TYPE_ENUM {
  PRIMARY = '',
  ERROR = 'danger',
  DANGER = 'danger',
  WARNING = 'warning',
  SUCCESS = 'success',
  INFO = 'info',
}

// 禁用/启用
export enum ENABLE_DISABLE_ENUM {
  /** 禁用 */
  DISABLE = 'disable',
  /** 启用 */
  ENABLE = 'enable'
}
