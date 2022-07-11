import {
  YES_OR_NO_NUMBER_ENUM,
  CUSTOMER_STATUS_NUMBER_ENUM,
} from '@/constant';

/**
 * 集团管理列表请求体
 */
export interface IGetGroupListReq {
  /** 集团名称 */
  groupName?: string;
  /** 创建开始时间 */
  createdTimeStart?: string;
  /** 创建结束时间 */
  createdTimeEnd?: string;
  pageNum: number;
  pageSize: number;
}

/**
 * 集团管理列表返回体
 */
export interface IGetGroupListRes {
  total: number;
  list: {
    /** 集团id */
    groupId: string;
    /** 集团名称 */
    groupName: string;
    /** 集团编码 */
    groupCode: string;
    /** 联系人名称 */
    contactName: string;
    /** 联系电话 */
    contactPhone: string;
    /** 联系邮箱 */
    contaceEmail: string;
    /** 职务名称 */
    positionName: string;
    /** 职务编码 */
    positionCode: string;
    /** 备注 */
    remark: string;
    /** 实体数量 */
    customerNum: string;
    /** 创建时间 */
    createdTime: string;
    /** 创建人员 */
    creatorName: string;
  }[];
}

/**
 * 集团管理详情返回体
 */
interface IFileItem {
  /** 路径 */
  url: string;
  /** 文件名 */
  name: string;
}
export interface IGetGroupDetailRes {
  /** 集团id */
  groupId: string;
  /** 集团名称 */
  groupName: string;
  /** 集团编码 */
  groupCode: string;
  /** 联系人名称 */
  contactName: string;
  /** 联系电话 */
  contactPhone: string;
  /** 联系邮箱 */
  contaceEmail: string;
  /** 职务名称 */
  positionName: string;
  /** 职务编码 */
  positionCode: string;
  /** 备注 */
  remark: string;
  /** 管理客户list */
  customerVoList: {
    /** 客户id */
    customerId: string;
    /** 客户编码 */
    customerCode: string;
    /** 客户全称 */
    customerName: string;
    /** 注册地址 */
    registrationAddress: string;
    /** 授信使用记录 1--使用，0-未使用 */
    isCreditUseRecord: YES_OR_NO_NUMBER_ENUM;
    /** 客户状态 */
    customerState?: CUSTOMER_STATUS_NUMBER_ENUM;
    /** 营业执照 */
    businessLicenseList?: IFileItem[];
  }[];
  /**
   * 集团下的客户是否有存在已通过主体授信的客户
   */
  ifExistCustomerCredit?: boolean;
  /**
   * 集团是否存在初次授信
   */
  groupIfInitAmount: boolean;
}

/**
 * 创建集团请求体
 */
export interface ICreateGroupReq {
  /** 集团id */
  groupId?: string;
  /** 集团名称 */
  groupName: string;
  /** 集团编码 */
  groupCode?: string;
  /** 联系人名称 */
  contactName?: string;
  /** 联系电话 */
  contactPhone?: string;
  /** 联系邮箱 */
  contaceEmail?: string;
  /** 职务名称 */
  positionName?: string;
  /** 职务编码 */
  positionCode?: string;
  /** 备注 */
  remark?: string;
  /** 管理客户idList */
  customerIdList?: string[];
}
