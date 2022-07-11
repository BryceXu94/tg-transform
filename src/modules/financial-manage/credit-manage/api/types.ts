import { CREDIT_SUBJECT_ENUM } from '@/constant';
import {
  STATUS_ENUM,
  UPDATE_REDIT_TYPE_ENUM,
  CREDIT_OPERATE_TYPE_ENUM,
  STATUS_NUMBER_ENUM,
} from '../constant';

/**
 * 授信管理客户列表请求体
 */
export interface IGetCreditCustomerListReq {
  /** 客户名称 */
  customerName?: string;
  /** 启用状态 */
  amountStatus?: STATUS_ENUM | '';
  /* 客户区域 */
  regionCode?: string;
  pageNum: number;
  pageSize: number;
}

/**
 * 授信管理客户列表返回体
 */
export interface IGetCreditCustomerListRes {
  total: number;
  list: {
    /** 客户ID */
    customerId: string;
    /** 客户编码 */
    customerCode: string;
    /** 客户名称 */
    customerName: string;
    /** 客户区域 */
    regionName: string;
    /** 区域编码 */
    regionCode: string;
    /* 总额度/元 */
    totalAmount: string;
    /** 可用额度/元 */
    availableAmount: string;
    /** 临时额度/元 */
    tempAmount: string;
    /** 启用状态 */
    amountStatus: STATUS_ENUM;
    /** 是否存在未回款, true=存在未回款,false=不存在未回款 */
    existUncollectedAmount: boolean;
    /** 授信标识 */
    creditMark: CREDIT_SUBJECT_ENUM;
    /** 是否逾期 */
    isOverdue: boolean;
    /** 逾期天数 */
    overdueDays: number;
  }[];
}

/**
 * 授信管理集团列表请求体
 */
export interface IGetCreditGroupListReq {
  /** 集团名称 */
  groupName?: string;
  /** 客户名称（集团下） */
  customerName?: string;
  /** 启用状态 */
  amountStatus?: STATUS_NUMBER_ENUM | '';
  pageNum: number;
  pageSize: number;
}

/**
 * 授信管理集团列表返回体
 */
export interface IGetCreditGroupListRes {
  total: number;
  list: {
    /** 集团id */
    groupId: string;
    /** 集团编码 */
    groupCode: string;
    /** 集团名称 */
    groupName: string;
    /** 旗下客户数量 */
    customerCount: string;
    /** 总额度/元 */
    totalAmount: string;
    /** 可用额度/元 */
    availableAmount: string;
    /** 临时额度/元 */
    tempAmount: string;
    /** 启用状态 */
    amountStatus: STATUS_NUMBER_ENUM;
    /** 是否存在未回款, true=存在未回款,false=不存在未回款 */
    existUncollectedAmount: boolean;
  }[];
}

/**
 * 授信管理使用明细列表请求体
 */
export interface IGetCreditUsageListReq {
  /** 客户id */
  customerId: string;
  /** 单据编号 */
  billCode?: string;
  /** 单据名称 */
  billName?: string;
  /** 开始创建时间 */
  startTime?: string;
  /** 结束创建时间 */
  endTime?: string;
  /** 客户类型 */
  creditMark: CREDIT_SUBJECT_ENUM;
  /** 操作人 */
  sourceOperator?: string;
  pageNum: number;
  pageSize: number;
}

/**
 * 授信管理使用明细列表返回体
 */
export interface IGetCreditUsageListRes {
  total: number;
  list: {
    /** 来源系统编码 */
    sourceSystemCode: string;
    /** 来源系统名称 */
    sourceSystemName: string;
    /** 单据编号 */
    billCode: string;
    /** 单据名称 */
    billName: string;
    /** 关联主体名称 */
    sourceCustomerName: string;
    /** 发生金额 */
    adjustAmount: string;
    /** 创建时间 */
    createdTime: string;
    /** 操作人 */
    sourceOperator: string;
    /** 备注 */
    remark: string;
  }[];
}

/**
 * 授信管理初始授信额度请求体
 */
export interface IInitialCreditLineReq {
  /** 授信标识 */
  creditMark: CREDIT_SUBJECT_ENUM;
  /** 客户id */
  customerId: string;
  /** 客户名称 */
  customerName: string;
  /** 初始金额 */
  initAmount: string | number;
  /** 备注 */
  remark: string;
}

/**
 * 授信管理调整额度请求体
 */
export interface IUpdateCreditLineReq {
  /** 授信标识 */
  creditMark: CREDIT_SUBJECT_ENUM;
  /** 客户id */
  customerId: string;
  /** 调整类型 */
  adjustType: UPDATE_REDIT_TYPE_ENUM;
  /** 调整金额 */
  adjustAmount: string | number;
  /** 调整原因 */
  adjustReason: string;
  /** 备注 */
  remark: string;
}

/**
 * 授信管理启用禁用请求体
 */
export interface IUpdateCreditStatusReq {
  /** 授信标识 */
  creditMark: CREDIT_SUBJECT_ENUM;
  /** 客户id */
  customerId: string;
  /** 操作标识 */
  operateType: STATUS_ENUM;
}

/**
 * 授信管理详情返回体
 */
export interface IGetCreditDetailRes {
  /** 所属集团名称 */
  groupName: string;
  /** 总额度 */
  totalAmount: string;
  /** 可用额度 */
  availableAmount: string;
  /** 旗下主体额度信息 */
  customerAmountDetailList: {
    /** 客户id */
    customerId: string;
    /** 客户名称 */
    customerName: string;
    /** 初次授信额度 */
    initAmount: string;
    /** 总额度 */
    totalAmount: string;
    /** 可用额度 */
    availableAmount: string;
    /** 临时额度 */
    tempAmount: string;
    /** 启用状态 */
    amountStatus: STATUS_ENUM;
  }[];
}

/**
 * 授信管理审批进度返回体
 */
export interface IGetCreditProgressListRes {
  /** 操作时间 */
  adjustTime: string;
  /** 操作人 */
  sourceOperator: string;
  /** 操作项 */
  adjustType: CREDIT_OPERATE_TYPE_ENUM;
}

/**
 * 导出客户授信信息
 * yapi地址：https://yapi.ibaibu.com/project/2130/interface/api/129298
 */
export interface ICustomerCreditManagerExportCreditInfoReq {
  /**
   * 客户id
   * 客户id为空，则导出全部客户授信信息
   */
  customerId?: string;
  /**
   * 导出类型
   */
  exportType: string;
  /**
   * 开始创建时间(包含)
   */
  startTime?: string;
  /**
   * 结束创建时间(包含)
   */
  endTime?: string;
}
