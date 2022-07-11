import {
  LOG_TYPE_ENUM,
  LOG_OPERATE_TYPE_ENUM,
  YES_NO_ENUM,
  CUSTOMER_CREDIT_APPROVE_STATUS_ENUM,
  DESENSITIZE_DECRYPT_TYPE_ENUM,
  BUSINESS_MODE_ENUM,
} from '@/constant/global';

/**
 * 根据客户ID获取用户信息返回体
 */
interface IFileItem {
  /** 路径 */
  url: string;
  /** 文件名 */
  name: string;
}
export interface IGetCustomerDataByIDRes {
  /** 客户id */
  customerId: string;
  /** 客户编码 */
  customerCode: string;
  /** 客户全称 */
  customerName: string;
  /** 注册地址(包含省市区) */
  fullRegistrationAddress: string;
  /** 授信状态 */
  creditGrantingState: CUSTOMER_CREDIT_APPROVE_STATUS_ENUM | '';
  /** 授信审批编号 */
  grantingApproveCode: string;
  /** 总额度 */
  creditLimit: number;
  /** 归属集团id，为空表示未归属 */
  groupId: string;
  /** 归属集团名称 */
  groupName: string;
  /** 未完结的审批单 */
  unDoneCreditApplication: YES_NO_ENUM;
  /** 营业执照 */
  businessLicense: IFileItem[];
  /** 客户评分表 */
  customerScore: IFileItem[];
  /** 客户档案 */
  customerProfile: IFileItem[];
  /** 客户区域 */
  regionName: string;
  /** 客户区域编码 */
  regionCode: string;
}

/**
 * 操作日志返回体
 */
export interface IGetLogListRes {
  /** 日志 */
  logId: string;
  /** 日志类型 */
  buzType: LOG_TYPE_ENUM;
  /** 业务id */
  buzId: string;
  /** 日志类型 */
  logType: LOG_OPERATE_TYPE_ENUM;
  /** 备注 */
  remark: string;
  /** 创建人ID */
  creatorId: string;
  /** 创建人名称 */
  creatorName: string;
  /** 创建时间 */
  createdTime: string;
}

export interface ICustomerInfoBusinessLicenseOcrReq {
  /**
   * 创建人id
   */
  creatorId?: string;
  /**
   * 图片id
   */
  fileId?: string;
  /**
   * 文件名
   */
  name: string;
  /**
   * url
   */
  url?: string;
}
/**
 * 响应数据
 */
export interface ICustomerInfoBusinessLicenseOcrRes {
  /**
   * 注册地址
   */
  address: string;
  /**
   * 经营范围
   */
  business: string;
  /**
   * 成立日期
   */
  establishDate: string;
  /**
   * 法人
   */
  legalPerson: string;
  /**
   * 公司名称
   */
  name: string;
  /**
   * 统一社会信用代码
   */
  registerNumber: string;
  /**
   * 公司类型
   */
  type: string;
  /**
   * 营业期限
   * “29991231”表示“长期”
   */
  validPeriod: string;
}

export interface IDemandStyleDemandSpuInfoReq {
  /**
   * 要查询的spu
   */
  styleCodeLike?: string;
}
export type IDemandStyleDemandSpuInfoResItem = {
  /**
   * 款式id(主键)
   */
  styleId: string;
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 款式号spu
   */
  styleCode: string;
  /**
   * 款式品类(分类以-隔开)（如：code1-code2-code3）
   */
  categoryCode: string;
  /**
   * 款式品类名(分类以-隔开)（如：女装-上装-T恤）
   */
  categoryName: string;
  /**
   * 尺码类型code 如：chinese_size_code
   */
  sizeTypeCode: string;
  /**
   * 尺码类型名称 如：国际
   */
  sizeTypeName: string;
  /**
   * 图片
   */
  customerPicture: string;
  /**
   * 款式图片{多张以英文逗号分隔}
   */
  customerPictureList: string[];
  /**
   * 创建人姓名
   */
  creatorId: string;
  /**
   * 创建人名字
   */
  creatorName: string;
  /**
   * 创建时间
   */
  createdTime: string;
  /**
   * 修改人id
   */
  reviserId: string;
  /**
   * 修改人名字
   */
  reviserName: string;
  /**
   * 修改时间
   */
  revisedTime: string;
  /**
   * 逻辑删除 0 否 1是
   */
  isDeleted: string;
};

export type IRegionListResItem = {
  /**
   * 区域id
   */
  regionId: string;
  /**
   * 区域code
   */
  regionCode: string;
  /**
   * 区域名称
   */
  regionName: string;
  /**
   * 创建人id
   */
  creatorId: string;
  /**
   * 创建人姓名
   */
  creatorName: string;
  /**
   * 创建时间
   */
  createdTime: string;
  /**
   * 修改人id
   */
  reviserId: string;
  /**
   * 修改人名称
   */
  reviserName: string;
  /**
   * 更新时间
   */
  revisedTime: string;
};

export interface IDesensitizeDecryptReqDecryptReqListItem {
  /**
   * 业务id
   */
  businessId?: string;
  /**
   * 解密内容类型
   */
  dataType?: DESENSITIZE_DECRYPT_TYPE_ENUM;
  /**
   * 密文
   */
  cipherText?: string;
  /**
   * 页面url
   */
  pageUrl?: string;
  /**
   * 页面pageTab
   */
  pageTab?: string;
  /**
   * 解密字段
   */
  dateColumn?: string;
}
export interface IDesensitizeDecryptReq {
  decryptReqList: IDesensitizeDecryptReqDecryptReqListItem[];
}
export interface IDesensitizeDecryptRes {
  [propName: string]: string;
}

export interface ICustomerInfoQueryUserRegionRes {
  /**
   * 区域id
   */
  regionId?: string;
  /**
   * 区域code
   */
  regionCode?: string;
  /**
   * 区域名称
   */
  regionName?: string;
}

/**
 * 根据sso 用户id查询ops区域信息和部门信息返回体
 */
export interface IGetUserRegionAndDepartmentRes {
  /**
   * bd 对应的组织
   */
  bdOrgList: {
    /**
     * 部门id
     */
    departmentId: string;
    /**
     * 部门名称
     */
    departmentName: string;
  }[];
  /**
   * bd的id
   */
  bdId: string;
  /**
   * BD的名称
   */
  bdName: string;
  /**
   * BD所在区域code
   */
  bdRegionCode: string;
  /**
   * BD所在区域名称
   */
  bdRegionName: string;
}
export interface IGetCompanyBusinessInfoRes {
  /**
   * 客户编码
   */
  customerCode?: string;
  /**
   * 营业执照,只需一张
   */
  businessLicenseList: {
    /**
     * 创建人id
     */
    creatorId?: string;
    /**
     * 图片id
     */
    fileId?: string;
    /**
     * 文件名
     */
    name: string;
    /**
     * url
     */
    url: string;
    /**
     * targetId 不接受传值
     */
    targetId?: string;
  }[];
  /**
   * customer-optimization 改为不能修改
   * 客户全称
   */
  customerName?: string;
  /**
   * 社会统一征信代码
   */
  socialCreditCode: string;
  /**
   * 公司类型，枚举:CompanyTypeEnum
   */
  companyType: string;
  /**
   * 法人姓名
   */
  artificialPerson: string;
  /**
   * 企业状态
   */
  openState?: string;
  /**
   * 成立日期
   */
  establishmentDate: number;
  /**
   * 注册地址
   */
  registrationAddress: string;
  /**
   * 注册地址-省份
   */
  registrationProvince: string;
  /**
   * 注册地址-城市
   */
  registrationCity: string;
  /**
   * 注册地址-区/县
   *     @NotEmpty(message = "注册地址-区/县不能为空")
   */
  registrationRegion?: string;
  /**
   * 曾用名
   */
  beforeName?: string;
  /**
   * 天眼评分
   */
  tianyanScore?: string;
  /**
   * 核准日期
   */
  approvalDate?: number;
  /**
   * 营业期限-开始日期
   */
  businessTermSince?: number;
  /**
   * 营业期限-开始结束,null表示无固定期限
   */
  businessTermEnd?: number;
  /**
   * 经营范围
   */
  businessScope?: string;
  /**
   * 实缴资本
   */
  actualPayCapital?: string;
  /**
   * 注册资本
   */
  regCapital?: string;
  /**
   * 注册资本币种
   */
  regCapitalCurrency?: string;
  /**
   * 实缴资本币种
   */
  actualCapitalCurrency?: string;
  /**
   * 业务类型
   */
  businessType?: BUSINESS_MODE_ENUM;
}

/**
 * 查询角色列表
 * yapi地址：https://yapi.ibaibu.com/project/1656/interface/api/93332
 */
export interface IRolesQueryRolesReq {
  roleName?: string;
  companyCode?: string;
  companyId?: string;
  systemCodeArray?: string[];
  secretKey?: string;
  operatorUserCode?: string;
  operatorUserId?: string;
  systemCode?: string;
}

export interface IRolesQueryRolesResItem {
  id?: string;
  roleCode?: string;
  roleName?: string;
  companyName?: string;
  systemName?: string;
  systemCode?: string;
  status?: string;
  roleType?: string;
  statusName?: string;
  remark?: string;
  createBy?: string;
  createTime?: number;
  updateBy?: string;
  updateTime?: number;
}
export type IRolesQueryRolesRes = IRolesQueryRolesResItem[];

export interface IGetUserOrgOptions {
  /**
   * 区域列表
   */
  bdRegionList: {
    /**
     * 区域名称
     */
    regionName: string;
    isManager: boolean;
    orgModelList: {
      /**
       * 组织名称
       */
      orgName: string;
      /**
       * 组织Id
       */
      orgId: string;
      /**
       * 组织下的销售bd
       */
      bdModelList: {
        /**
         * bd姓名
         */
        bdName: string;
        /**
         * bd Id
         */
        bdId: string;
      }[];
    }[];
  }[];
}
