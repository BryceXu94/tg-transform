import {
  CUSTOMER_CREDIT_APPROVE_STATUS_ENUM,
  YES_NO_ENUM,
  CREDIT_SUBJECT_ENUM,
} from '@/constant/global';
import {
  APPROVE_STATUS_ENUM,
  CREDIT_APPLY_TYPE_ENUM,
  CREDIT_APPROVE_TYPE_ENUM,
  CREDIT_OPERATE_TYPE_ENUM,
} from '../constant';

/**
 * 授信申请列表请求体
 */
export interface IGetCreditApplicationListReq {
  /** 客户名称 */
  customerNameLike?: string;
  /** 申请人 */
  applyUserNameLike?: string;
  /** 申请时间 - 开始时间 */
  applyTimeStart?: string;
  /** 申请时间 - 结束时间 */
  applyTimeEnd?: string;
  /** 审批状态 */
  approvalState?: APPROVE_STATUS_ENUM|'';
  /**
   * 客户区域
  */
  regionCode?: string;
  pageNum: number;
  pageSize: number;
}

/**
 * 授信申请列表返回体
 */
export interface IGetCreditApplicationListRes {
  total: number;
  list: {
    /** 审批状态 */
    approvalState: APPROVE_STATUS_ENUM;
    /** 申请人 */
    applyUserName: string;
    /** 申请时间 */
    applyTime: string;
    /** 飞书审批编码 */
    approvalFeiShuCode: string;
    /** 申请类型 */
    applyType: CREDIT_APPROVE_TYPE_ENUM;
    /** 授信类型 */
    creditType: CREDIT_APPLY_TYPE_ENUM;
    /** 授信申请id */
    creditApplyId: string;
    /** 申请额度 */
    applyAmount: number;
    /** bd区域名称 */
    bdRegionName: string;
     /** bd区域编码 */
    bdRegionCode: string;
    crmCreditCustomer: {
      /** 客户名称 */
      customerName: string;
      /** 客户编码 */
      customerCode: string;
      /* 客户区域 */
      regionCode: string;
      /** 客户区域名称 */
      regionName: string;
      /* 客户id */
      /** 客户区域 */
      customerRegion: string;
      /** 客户id */
      customerId: string;
    };
  }[];
}

/**
 * 文件列表项
 */
export interface IFileItem {
  /** 路径 */
  url: string;
  /** 文件名 */
  name: string;
}

/**
 * 创建授信申请请求体
 */
export interface ICreateCreditApplicationReq {
  /** BD的id */
  bdId?: string;
  /** 部门id */
  departmentId?: string;
  /** 部门名称 */
  departmentName?: string;
  /** 区域编码 */
  regionCode?: string;
   /** 客户区域 */
  regionName?: string;
  /* 客户id */
  customerId?: string;
  /** 申请类型 */
  applyType?: CREDIT_APPROVE_TYPE_ENUM;
  /** 审批类型 */
  creditType?: CREDIT_APPLY_TYPE_ENUM;
  /** 申请额度 */
  applyAmount?: string | number;
  /** 申请说明 */
  applyDesc?: string;
  /** 营业执照 */
  licenseList?: IFileItem[];
  /** 客户档案 */
  customerProfilesList?: IFileItem[];
  /** 客户信息评分表 */
  scoringTableList?: IFileItem[];
  /**
   * 其他附件
  */
  otherAttachmentList?: IFileItem[];
}

/**
 * 授信申请详情返回体
 */
export interface IGetCreditApplicationDetailRes {
  /** 客户信息 */
  crmCreditCustomer: {
    /** 客户名称 === 全称 */
    customerName: string;
    /** 客户编码 */
    customerCode: string;
    /** 客户id */
    customerId: string;
    /* 客户区域 */
    regionName: string;
    /** 客户区域编码 */
    regionCode: string;
  };
  /** bd区域名称 */
  bdRegionName: string;
  /** bd区域区域 */
  bdRegionCode: string;
  /* bd名称 */
  bdName: string;
  /** bd编号 */
  bdCode: string;
  /** 部门名称 */
  departmentName: string;
  /** 授信申请id */
  creditApplyId: string;
  /** 审批状态 */
  approvalState: APPROVE_STATUS_ENUM;
  /** 审批 === 飞书code */
  approvalFeiShuCode: string;
  /** 申请类型 */
  applyType: CREDIT_APPROVE_TYPE_ENUM;
  /** 授信类型 */
  creditType: CREDIT_APPLY_TYPE_ENUM;
  /** 申请额度 === 元 */
  applyAmount: number | string;
  /** 申请说明 */
  applyDesc: string;
  /** 申请人 */
  applyUserName: string;
  /** 申请时间 */
  applyTime: string;
  /** 申请编号 */
  applyCode: string;
  /** 营业执照 */
  licenseList: IFileItem[];
  /** 客户档案 */
  customerProfilesList: IFileItem[];
  /** 客户信息评分表 */
  scoringTableList: IFileItem[];
  /* bdId */
  bdId: string;
  /* 部门id */
  departmentId: string;
}

/**
 * 授信申请进度返回体
 */
export interface IGetCreditApplicationProgressRes {
  /** 审批进度列表 */
  applyProgressLogList: {
    /** 操作时间 */
    operateTime: string;
    /** 操作人 */
    operateUser: string;
    /** 操作类型 */
    operateType: CREDIT_OPERATE_TYPE_ENUM;
    /** 操作备注 */
    operateDesc: string;
  }[];
}

/**
 * 根据客户ID获取用户信息（带BD信息）返回体
 */
export interface IGetCustomerDataWithBdByCustomerIdRes {
  /**
   * bd 对应的组织
   */
  bdOrgList: {
    /**
     * 部门id
     */
    departmentId?: string;
    /**
     * 部门名称
     */
    departmentName?: string;
  }[];
  /**
   * bd的id
   */
  bdId?: string;
  /**
   * BD的名称
   */
  bdName?: string;
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 客户编码
   */
  customerCode: string;
  /**
   * 客户全称
   */
  customerName: string;
  /**
   * 注册地址(包含省市区)
   */
  fullRegistrationAddress?: string;
  /**
   * 授信状态
   */
  creditGrantingState?: CUSTOMER_CREDIT_APPROVE_STATUS_ENUM;
  /**
   * 授信审批编号
   */
  grantingApproveCode?: string;
  /**
   * 总额度
   */
  creditLimit?: string;
  /**
   * 期初额度
   */
  initAmount?: string;
  /**
   * 可用额度
   */
  availableAmount?: string;
  /**
   * 归属集团id
   * 为空表示未归属
   */
  groupId?: string;
  /**
   * 归属集团名称
   */
  groupName?: string;
  /**
   * 未完结的审批单
   */
  unDoneCreditApplication?: YES_NO_ENUM;
  /**
   * 临时额度
   */
  tempAmount?: string;
  /**
   * BD区域编码
   */
  bdRegionCode?: string;
  /**
   * BD区域名字
   */
  bdRegionName?: string;
  /**
   * 营业执照
   */
  businessLicense: IFileItem[];
  /**
   * 客户评分表
   */
  customerScore: IFileItem[];
  /**
   * 客户档案
   */
  customerProfile: IFileItem[];
  /**
   * 授信主体
   */
  creditMark: CREDIT_SUBJECT_ENUM;
}

/**
 * 集团授信申请列表请求体
 */
export interface IGetGroupCreditApplicationListReq {
  /**
   * 审批状态
   */
  approvalState?: APPROVE_STATUS_ENUM|'';
  /**
   * 集团名称 - 模糊查询
   */
  groupNameLike?: string;
  /**
   * 申请人 - 模糊查询
   */
  applyUserNameLike?: string;
  /**
   * 申请时间 - 开始时间
   */
  applyTimeStart?: string;
  /**
   * 申请时间 - 结束时间
   */
  applyTimeEnd?: string;
  /**
   * 所属区域编码
   */
  regionCode?: string;
  pageNum: number;
  pageSize: number;
}

/**
 * 集团授信申请列表返回体
 */
export interface IGetGroupCreditApplicationListRes {
  page: number;
  total: number;
  list: {
    /**
     * 集团信息
     */
    crmGroupCreditCustomer: {
      /**
       * 集团名称 === 全称
       */
      groupName?: string;
      /**
       * 集团编码
       */
      groupCode?: string;
      /**
       * 集团id
       */
      groupId?: string;
    };
    /**
     * 审批状态
     */
    approvalState: APPROVE_STATUS_ENUM;
    /**
     * 申请人
     */
    applyUserName: string;
    /**
     * 申请时间
     */
    applyTime: string;
    /**
     * 审批 === 飞书code
     */
    approvalFeiShuCode: string;
    /**
     * 申请类型
     * CREDIT === 授信
     */
    applyType: CREDIT_APPROVE_TYPE_ENUM;
    /**
     * 授信类型
     * FIRST === 初次
     * ROUTINE === 常规
     * TEMPORARY === 临时
     */
    creditType: CREDIT_APPLY_TYPE_ENUM;
    /**
     * 授信申请id
     */
    creditApplyId: string;
    /**
     * 申请额度 === 元
     */
    applyAmount: string | number;
  };
}

/**
 * 创建集团授信申请请求体
 */
export interface IGroupCreditApplicationSubjectItem {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 客户名称
   */
  customerName: string;
  /**
   * 营业执照
   */
  licenseList: IFileItem[];
  /**
   * 客户档案
   */
  customerProfilesList: IFileItem[];
  /**
   * 客户信息评分表
   */
  scoringTableList: IFileItem[];
}
export interface ICreateGroupCreditApplicationReq {
  /**
   * BD的id
   */
  bdId?: string;
  /**
   * 集团id
   */
  groupId?: string;
  /**
   * 主体信息
   */
  subjectInfoDtoList?: IGroupCreditApplicationSubjectItem[];
  /**
   * 其他附件
   */
  otherAttachmentList?: IFileItem[];
  /**
   * 申请类型
   * CREDIT === 授信
   */
  applyType?: CREDIT_APPROVE_TYPE_ENUM;
  /**
   * 审批类型
   * FIRST === 初次
   * ROUTINE === 常规
   * TEMPORARY === 临时
   */
  creditType?: CREDIT_APPLY_TYPE_ENUM;
  /**
   * 申请额度 === 元
   */
  applyAmount?: string | number;
  /**
   * 申请说明
   */
  applyDesc?: string;
  /**
   * 部门id
   */
  departmentId?: string;
  /**
   * 部门名称
   */
  departmentName?: string;
  /**
   * BD所属区域
   * crmv0.1-4期新增字段
   */
  regionName?: string;
  /**
   * BD所属区域对应的编码
   */
  regionCode?: string;
}

/**
 * 集团授信申请详情返回体
 */
export interface IGetGroupCreditApplicationDetailRes {
  /**
   * 集团信息
   */
  crmGroupCreditVo?: {
    /**
     * 集团名称 === 全称
     */
    groupName?: string;
    /**
     * 集团编码
     */
    groupCode?: string;
    /**
     * 集团id
     */
    groupId?: string;
  };
  /**
   * 授信申请id
   */
  creditApplyId?: string;
  /**
   * 审批状态
   */
  approvalState: APPROVE_STATUS_ENUM;
  /**
   * 审批 === 飞书code
   */
  approvalFeiShuCode?: string;
  /**
   * 申请类型
   * CREDIT === 授信
   */
  applyType?: CREDIT_APPROVE_TYPE_ENUM;
  /**
   * 授信类型
   * FIRST === 初次
   * ROUTINE === 常规
   * TEMPORARY === 临时
   */
  creditType?: CREDIT_APPLY_TYPE_ENUM;
  /**
   * 申请额度 === 元
   */
  applyAmount: string | number;
  /**
   * 申请说明
   */
  applyDesc?: string;
  /**
   * 申请人
   */
  applyUserName?: string;
  /**
   * 申请时间
   */
  applyTime?: string;
  /**
   * 申请编号
   */
  applyCode?: string;
  /**
   * bdid
   */
  bdId?: string;
  /**
   * bd名称
   */
  bdName?: string;
  /**
   * bd编号
   */
  bdCode?: string;
  /**
   * bd所属区域名称
   */
  regionName?: string;
  /**
   * bd所属区域编码
   */
  regionCode?: string;
  /**
   * 部门id
   */
  departmentId?: string;
  /**
   * 部门名称
   */
  departmentName?: string;
  /**
   * 主体信息
   */
  subjectInfoDtoList: IGroupCreditApplicationSubjectItem[];
  /**
   * 其他附件
   */
  otherAttachmentList: IFileItem[];
}

/**
 * 集团授信申请进度返回体
 */
export interface IGetGroupCreditApplicationProgressRes {
  /** 审批进度列表 */
  applyProgressLogList: {
    /** 操作时间 */
    operateTime: string;
    /** 操作人 */
    operateUser: string;
    /** 操作类型 */
    operateType: CREDIT_OPERATE_TYPE_ENUM;
    /** 操作备注 */
    operateDesc: string;
  }[];
}
