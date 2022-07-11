// 客户管理列表
/**
 * 发票
 */

import {
  INVOICE_TYPE_ENUM,
  BUSINESS_MODE_ENUM,
  YES_NO_ENUM,
} from '@/constant/global';
import {
  PROFILE_STATE_ENUM,
  CUSTOMER_STATE_ENUM,
  AUDIT_MESSAGE_ENUM,
  DISCOUNT_GRADE_ENUM,
  FINANCE_CREDIT_STATE_ENUM,
  ARCHIVES_AUDIT_STATE,
} from '@/modules/customer-manage/customer-manage/constant';

export interface ICustomerInfoPageReq {
  /**
   * 客户档案状态
   */
  profileState?:
    ''
    | 'INIT'
    | 'WAIT_BDM_AUDIT'
    | 'WAIT_PROFILE_COMPLETE'
    | 'WAIT_CM_AUDIT'
    | 'WAIT_FINANCE_AUDIT'
    | 'AUDIT_PASSED'
    | 'AUDIT_FAILED';
  /**
   * 客户状态
   */
  customerState?: 'INIT' | 'ENABLE' | 'DISABLE' | 'ALLOW_REJECTED' | '';
  /**
   * 业务模式
  */
  businessType?: string;
  /**
   * 客户名称 模糊搜索
   */
  customerName?: string;
  /**
   * 创建开始时间
   */
  createdTimeBegin?: string;
  /**
   * 创建结束时间
   */
  createdTimeEnd?: string;
  /** 创建人 */
  creatorName?: string;
  bdName?: string;
  /**
   * 客户区域
  */
  regionCode?: string;
  pageNum: number;
  pageSize: number;
}

export interface ICustomerInfoPageListItem {
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
  createdTime: string;
  /**
   * 客户状态
   */
  // customerState: 'INIT' | 'ENABLE' | 'DISABLE' | 'ALLOW_REJECTED';
  customerState: CUSTOMER_STATE_ENUM;
  /**
   * 客户档案状态
   */
  profileState: PROFILE_STATE_ENUM;
  /**
   * 创建人名称
   */
  creatorName: string;
  /**
   * 所属bd
   */
  bdName: string;
  /** 业务类型 */
  businessType: string;
  /** 客户区域 */
  regionName: string;
  /** 订单类型 */
  allowedOrderType: string;
}

export interface ICustomerInfoPageRes {
  page: string;
  total: string;
  list: ICustomerInfoPageListItem[];
}

// 创建客户
/**
 * 营业执照
 * fileType=CUSTOMER_BUSINESS_LICENSE
 */
export interface IInitCustomerSaveBusinessLicense {
  /**
   * 创建人id
   */
  creatorId?: string;
  /**
   * 图片id
   */
  fileId?: string;
  fileType?:
    | 'CUSTOMER_BUSINESS_LICENSE'
    | 'CUSTOMER_PAYMENT_PROOF'
    | 'CUSTOMER_CONTRACT'
    | 'CUSTOMER_LEGAL_PERSON_ID_CARD'
    | 'CUSTOMER_CUSTOMER_SCORE'
    | 'CUSTOMER_ASSETS_PROOF';
  /**
   * url
   */
  url?: string;
}

export interface IInitCustomerSaveReq {
  businessLicenseList?: IInitCustomerSaveBusinessLicense[];
  /**
   * 客户全称
   */
  customerName: string;
  /**
   * 社会统一征信代码
   */
  socialCreditCode: string;
  /**
   * 业务类型
   */
  businessType: BUSINESS_MODE_ENUM | '';
}

export interface IInitCustomerSaveRes {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 是否所有资料编辑完成
   */
  isAllCompleted: boolean;
  /**
   * 社会统一征信代码
   */
  socialCreditCode: string;
}

// 客户详情-基本信息
/**
 * 工商信息
 */
export interface IDetailBaseInfoCompanyInfo {
  businessType: string;
  businessLicenseList: {
  url: string;
  }[];
  /**
   * 客户编码
   */
  customerCode: string;
  /**
   * 客户全称
   */
  customerName: string;
  regCapital: string;
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
   * 成立日期
   */
  establishmentDate: string;
  /**
   * 成立日期
   */
  approvalDate: string;
  /**
   * 营业期限-开始日期
   */
  businessTermSince: string;
  /**
   * 营业期限-开始结束,null表示无固定期限
   */
  businessTermEnd: string;
  actualCapitalCurrency: string;
  /**
   * 曾用名
   */
  beforeName: string;
  /**
   * 实缴资本
   */
  actualPayCapital: string;
  /**
   * 天眼评分
   */
  tianyanScore: string;
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
   */
  registrationRegion: string;
  /**
   * 经营范围
   */
  businessScope: string;
  openState?: string;
  businessTerm?: string[];
  capital?: string;
  regCapitalCurrency: string;
}
/**
 * 人员规模
 */
export interface IDetailBaseInfoCustomerScale {
  /**
   * 在职人数
   */
   servingStaffMin: string;
   servingStaffMax: string;
   annualCooperationScale: string;
  /**
   * 规模信息备注
   */
  selfDesignerRemark: string;
  selfFactoryRemark: string;
  /**
   * 自有设计师
   * 1--有，0--无
   */
  selfDesigner: string;
  /**
   * 自有工厂
   * 1--有，0--无
   */
  selfFactory: string;
  /**
   * 年营业额/万元
   */
  annualTurnover: string;
  /**
   * 年销售量/万件
   */
  annualSaleVolume?: string;
  /**
   * 销售倍率
   */
  saleRate: string;
  turnoverUnit: string;
  cooperationScaleUnit: string;
  saleVolumeUnit: string;
}
/**
 * 基本信息-其他-经营地址
 */
export interface IBaseInfoCustomerAddressItem {
  /**
   * 是否默认
   */
  isDefault: YES_NO_ENUM;
  /**
   * 客户地址id，回传字段
   * 编辑时后端有返回就回传
   */
  customerAddressId?: string;
  /**
   * 省份
   */
  province: string;
  /**
   * 城市
   */
  city: string;
  /**
   * 区域
   *     @NotEmpty(message = "区域不能为空")
   */
  region: string;
  /**
   * 街道详细地址
   */
  addressDetail: string;
}
/**
 * 客户基本资料-其它信息
 */
export interface IDetailBaseInfoCustomerOther {
  /**
   * 纳税人类型,TaxpayerTypeEnum
   */
  taxpayerType: string;
  /**
   * 法人身份证
   */
  artificialPersonIdCard?: string;
  /**
   * 法人联系电话
   */
  artificialPersonPhone: string;
  /**
   * 备注信息
   */
  remark: string;
  customerType: string;
  /** 订单类型 */
  allowedOrderType: string;
  /**
   * 经营地址列表
   */
  operatingAddressList: IBaseInfoCustomerAddressItem[];
  /**
   * 是否允许上传合同:0-否,1-是
  */
  isUploadContract: string;
}

export interface IDetailBaseInfoRes {
  /**
   * 客户id
   */
  customerId: string;
  businessType: string;
  companyInfo: IDetailBaseInfoCompanyInfo;
  customerScale: IDetailBaseInfoCustomerScale;
  customerOther: IDetailBaseInfoCustomerOther;
}

// 联系管理
/**
 * 响应数据
 */
export interface IDetailContactsCustomerContactListItem {
  /**
   * 联系人id，(编辑已存在的联系人id时,不能为空)
   */
  customerContactId: string;
  /**
   * 联系人名字
   */
  contactName: string;
  /**
   * 类型来源
  */
  sourceType: string;
  /**
   * 职务
   */
  post: string;
  /**
   * 电话
   */
  phone: string;
  /**
   * 微信
   */
  weChatId: string;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 备注
   */
  remark: string;
  enable: string;
}

export type IDetailContactsRes = {
  /**
   * 客户id
   */
  customerId: string;
  businessType: string;
  /**
   * 联系人信息列表
   */
  customerContactList: IDetailContactsCustomerContactListItem[];
};

// 货款帐期
export interface IDetailAccountingPeriodCustomerShippingAddressListItem {
  /**
   * 客户地址id，回传字段
   * 编辑时后端有返回就回传
   */
  customerAddressId: string;
  /**
   * 收件人
   */
  recipient: string;
  /**
   * 收件人电话
   */
  recipientPhone: string;
  /**
   * 省份
   */
  province: string;
  /**
   * 城市
   */
  city: string;
  /**
   * 区域
   */
  region: string;
  /**
   * 街道详细地址
   */
  addressDetail: string;
  email: string;
}
export interface IDetailAccountingPeriodBankAccountListItem {
  /**
   * 银行code不能为空
   */
  bankCode: string;
  bankName: string;
  /**
   * 开户支行名称
   */
  subBankName: string;
  /**
   * 开户人
   */
  accountHolder: string;
  /**
   * 卡号
   */
  accountNo: string;
  /**
   * 银行卡类型，1--对公，2--私户
   */
  accountType: string;
}

export interface IDetailAccountingPeriodCustomerAccountingPeriodListItem {
  settlementPeriodDays: string;
  returnPercent: string;
}

export interface IDetailAccountingPeriodInvoice {
  /**
   * 发票类型
   * 默认增值税专用发票
   */
  invoiceType: INVOICE_TYPE_ENUM;
  /**
   * 发票抬头
   */
  invoiceHeader: string;
  /**
   * 开户支行
   */
  subBank: string;
  /**
   * 银行账号
   */
  accountNo: string;
  /**
   * 开户支行省
   */
  subBankProvince: string;
  /**
   * 开户支行城市
   */
  subBankCity: string;
  /**
   * 开户支行区/县
   */
  subBankRegion: string;
  /**
   * 纳税人识别码
   */
  taxpayerCode: string;
  /**
   * 联系人电话
   */
  contactPhone: string;
  addressDetail: string;
  /**
   * 发票邮寄地址
   */
  customerShippingAddressList: IDetailAccountingPeriodCustomerShippingAddressListItem[];
}

/**
 * 账期model
 */
export interface IDetailAccountingPeriodCustomerAccountingPeriod {
  /**
   * 出账类型
   */
  billingDate: string;
  /**
   * 出账日设置
   */
  periodDate: string;
  /**
   * tag CRM-V0.6
   * 优惠档次
   */
  preferentialGrade: DISCOUNT_GRADE_ENUM | '';
  /**
   * 金融授信结果,0未开通,1开通失败,2开通成功
   */
  financeGrantingState: FINANCE_CREDIT_STATE_ENUM | '';
  /**
   * 是否预付定金
   * YES--是，NO--不是
   */
  isAdvancePayment: 'YES' | 'NO';
  /**
   * 预付定金比例
   */
  advancePaymentRatio: string;
  isOpenYizubaoAccount: string;
  yizubaoAccountNo: string;
  /**
   * 结算周期
   */
  customerSettlementPeriodList?: IDetailAccountingPeriodCustomerAccountingPeriodListItem[];
  /**
   * 平均账期
   */
  averagePeriod: string;
}

/**
 * 响应数据
 */
export interface IDetailAccountingPeriodRes {
  /**
   * 本系统客户ID
   */
  customerId: string;
  businessType: string;
  customerAccountingPeriod: IDetailAccountingPeriodCustomerAccountingPeriod;
  invoice: IDetailAccountingPeriodInvoice;
  /**
   * 银行卡
   */
  bankAccountList: IDetailAccountingPeriodBankAccountListItem[];
}

// 风险信息
/**
 * 响应数据
 */
export interface IDetailRiskInfoFileReqListItem {
  /**
   * 创建人id
   */
  creatorId: string;
  /**
   * 图片id
   */
  fileId: string;
  fileType:
    | 'CUSTOMER_BUSINESS_LICENSE'
    | 'CUSTOMER_PAYMENT_PROOF'
    | 'CUSTOMER_CONTRACT'
    | 'CUSTOMER_LEGAL_PERSON_ID_CARD'
    | 'CUSTOMER_CUSTOMER_SCORE'
    | 'CUSTOMER_ASSETS_PROOF';
  /**
   * url
   */
  url: string;
}
export interface IDetailRiskInfoRes {
  /**
   * 客户id
   */
  customerId: string;
  businessType: string;
  /**
   * 自身风险数
   */
  selfRiskCount: string;
  /**
   * 周边风险数
   */
  aroundRiskCount: string;
  /**
   * 历史风险数
   */
  historyRiskCount: string;
  /**
   * 预警提醒数
   */
  earlyWarningRiskCount: string;
  /**
   * 法律诉讼数
   */
  lawsuitCount: string;
  /**
   * 失信执行数
   */
  zhixingCount: string;
  /**
   * 限制消费数
   */
  consumptionRestrictionCount: string;
  /**
   * 风险截图附件
   */
  fileReqList: IDetailRiskInfoFileReqListItem[];
}

// 审核信息
export interface IAuditProcessAuditListRes {
  /**
  * 详情id
  */
  detailId: string;
  /**
    * 处理人Id
    */
  operationId: string;
  /**
    * 处理人名称
    */
  operationName: string;
  /**
    * 操作描述枚举
    */
  message: AUDIT_MESSAGE_ENUM;
  /**
    * 操作描述
    */
  messageInfo: string;
  /**
    * 状态枚举
    */
  auditProcessState: ARCHIVES_AUDIT_STATE;
  /**
    * 状态描述
    */
  auditProcessStateInfo: string;
  /**
    * 备注信息
    */
  remark: string;
  /**
    * 档案创建时间
    */
  operationTime: string;
}

// 更新天眼查
export interface IRiskInfoRes {
  customerId: string; // 客户id
  isAllCompleted: boolean;
  socialCreditCode: string; // 社会统一征信代码
}

// 编辑基本信息
/**
 * 营业执照
 */
export interface IBaseInfoUpdateBusinessLicense {
  /**
   * 创建人id
   */
  creatorId?: string;
  /**
   * 图片id
   */
  fileId?: string;
  /**
   * url
   */
  url?: string;
}
/**
 * 人员规模
 */
export interface IBaseInfoUpdateCustomerScale {
  /**
   * 自有设计师备注
   */
  selfDesignerRemark?: string;
  /**
   * 自有设计师
   * YES--有，NO--无
   */
  selfDesigner?: string;
  /**
   * 自有工厂备注
   */
  selfFactoryRemark?: string;
  /**
   * 自有工厂
   * YES--有，NO--无
   */
  selfFactory?: string;
  /**
   * 年营业额/万元
   */
  annualTurnover: string;
  /**
   * 年销售量/万件
   */
  annualSaleVolume?: string;
  /**
   * 销售倍率
   */
  saleRate?: string;
  servingStaffMin?: string;
  servingStaffMax?: string;
  annualCooperationScale?: string;
  /** 营业额单位 */
  turnoverUnit: string;
  /** 预估合作规模单位 */
  cooperationScaleUnit: string;
  /** 年销售量单位 */
  saleVolumeUnit: string;
}
/**
 * 基本信息-其他-经营地址
 */
export interface IBaseInfoUpdateCustomerAddressItem {
  /**
   * 是否默认
   */
  isDefault: YES_NO_ENUM;
  /**
   * 客户地址id，回传字段
   * 编辑时后端有返回就回传
   */
  customerAddressId?: string;
  /**
   * 省份
   */
  province: string;
  /**
   * 城市
   */
  city: string;
  /**
   * 区域
   *     @NotEmpty(message = "区域不能为空")
   */
  region?: string;
  /**
   * 街道详细地址
   */
  addressDetail: string;
}
/**
 * 客户基本资料-其它信息
 */
export interface IBaseInfoUpdateCustomerOther {
  /**
   * 纳税人类型,TaxpayerTypeEnum
   */
  taxpayerType: string;
  /**
   * 法人身份证
   */
  artificialPersonIdCard?: string;
  /**
   * 法人联系电话
   */
  artificialPersonPhone?: string;
  /**
   * 备注信息
   */
  remark?: string;
  customerType: string;
  /** 订单类型 */
  allowedOrderType: string;
  /**
   * 是否允许上传合同:0-否,1-是
  */
  isUploadContract?: string;
  /**
   * 经营地址列表
   */
  operatingAddressList?: IBaseInfoUpdateCustomerAddressItem[];
}
/**
 * 响应数据
 */
export interface IBaseInfoUpdateRes {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 是否所有资料编辑完成
   */
  isAllCompleted: boolean;
  /**
   * 社会统一征信代码
   */
  socialCreditCode: string;
}
/**
 * 工商信息
 */
export interface IBaseInfoUpdateCompanyInfo {
  /**
   * 客户编码
   */
  customerCode?: string;
  businessLicenseList?: IBaseInfoUpdateBusinessLicense[];
  businessType?: string; // 业务类型
  /**
   * 客户全称
   */
  customerName: string;
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
   * 成立日期
   */
  establishmentDate?: string;
  /**
   * 成立日期
   */
  approvalDate?: string;
  /**
   * 营业期限-开始日期
   */
  businessTermSince?: string;
  /**
   * 营业期限-开始结束,null表示无固定期限
   */
  businessTermEnd?: string;
  /**
   * 曾用名
   */
  beforeName?: string;

  /**
   * 实缴资本
   */
  actualPayCapital?: string;
  /**
   * 天眼评分
   */
  tianyanScore?: string;
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
   */
  registrationRegion: string;
  /**
   * 经营范围
   */
  businessScope?: string;
  openState?: string;
  businessTerm?: string[];
  regCapital?: string;
  businessLicenseImage?: [];
  regCapitalCurrency: string;
  actualCapitalCurrency: string;
}
export interface IBaseInfoUpdateReq {
  companyInfo?: IBaseInfoUpdateCompanyInfo;
  customerScale?: IBaseInfoUpdateCustomerScale;
  customerOther?: IBaseInfoUpdateCustomerOther;
  customerId: string;
  /**
   * web端编辑不能为空集合
   * 编辑的模块
   */
  editModuleList: (
    | 'COMPANY_INFO'
    | 'CUSTOMER_SCALE'
    | 'CUSTOMER_OTHER'
    | 'BRAND'
    | 'SHIPPING_ADDRESS'
    | 'CONTACTS'
    | 'ACCOUNTING_PERIOD'
    | 'INVOICE'
    | 'BANK_ACCOUNT'
    | 'RISK_INFO'
    | 'PROFILE_FILES'
    | 'EXTERNAL_RELATION'
  )[];
}
/**
 * 响应数据
 */
export interface IBusinessInfoSaveRes {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 是否所有资料编辑完成
   */
  isAllCompleted: boolean;
  /**
   * 社会统一征信代码
   */
  socialCreditCode: string;
}

// 联系管理
export interface IContactSaveCustomerContactListItem {
  /**
   * 联系人id，回传字段
   * 编辑时后端有返回就回传
   */
  customerContactId?: string;
  /**
   * 联系人名字
   */
  contactName?: string;
  /**
   * 职务
   */
  post?: string;
  /**
   * 电话
   */
  phone?: string;
  /**
   * 微信
   */
  weChatId?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 是否启用
   * YES-启用，NO-禁用
   */
  enable?: string;
}
export interface IContactSaveReq {
  /**
   * 联系人信息列表
   */
  customerContactList?: IContactSaveCustomerContactListItem[];
  customerId: string;
  /**
   * web端编辑不能为空集合
   * 编辑的模块
   */
  editModuleList: (
    | 'COMPANY_INFO'
    | 'CUSTOMER_SCALE'
    | 'CUSTOMER_OTHER'
    | 'BRAND'
    | 'SHIPPING_ADDRESS'
    | 'CONTACTS'
    | 'ACCOUNTING_PERIOD'
    | 'INVOICE'
    | 'BANK_ACCOUNT'
    | 'RISK_INFO'
    | 'PROFILE_FILES'
    | 'EXTERNAL_RELATION'
  )[];
}
/**
 * 响应数据
 */
export interface IContactSaveRes {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 是否所有资料编辑完成
   */
  isAllCompleted: boolean;
  /**
   * 社会统一征信代码
   */
  socialCreditCode: string;
}

// 货款帐期

export interface IAccountingPeriodSaveCustomerAccountingPeriodListItem {
  settlementPeriodDays: string;
  returnPercent: string;
}
/**
 * 发票
 */
export interface IAccountingPeriodSaveCustomerShippingAddressListItem {
  /**
   * 客户地址id，回传字段
   * 编辑时后端有返回就回传
   */
  customerAddressId?: string;
  /**
   * 收件人
   */
  recipient: string;
  /**
   * 收件人电话
   */
  recipientPhone: string;
  /**
   * 省份
   */
  province: string;
  /**
   * 城市
   */
  city: string;
  /**
   * 区域
   */
  region: string;
  /**
   * 街道详细地址
   */
  addressDetail: string;
  /**
   * 接收者邮箱
   */
  email?: string;
}
export interface IAccountingPeriodSaveInvoice {
  /**
   * 发票类型
   * 默认增值税专用发票
   */
  invoiceType?: string;
  /**
   * 发票抬头
   */
  invoiceHeader?: string;
  /**
   * 开户支行
   */
  subBank?: string;
  /**
   * 银行账号
   */
  accountNo?: string;
  /**
   * 开户支行省
   */
  subBankProvince?: string;
  /**
   * 开户支行城市
   */
  subBankCity?: string;
  /**
   * 开户支行区/县
   */
  subBankRegion?: string;
  /**
   * 纳税人识别码
   */
  taxpayerCode?: string;
  /**
   * 联系人电话
   */
  contactPhone?: string;
  /**
   * 发票邮寄地址
   */
  customerShippingAddressList?: IAccountingPeriodSaveCustomerShippingAddressListItem[];
}
export interface IAccountingPeriodSaveBankAccountListItem {
  /**
   * 银行账户id,回传字段
   * 编辑时后端有返回就回传
   */
  bankAccountId?: string;
  /**
   * 银行code不能为空
   */
  bankCode: string;
  bankName: string;
  /**
   * 开户支行名称
   */
  subBankName: string;
  /**
   * 开户人
   */
  accountHolder: string;
  /**
   * 卡号
   */
  accountNo: string;
  /**
   * 银行卡类型
   */
  accountType: string;
  /**
   * 启用状态
   */
  enableState?: string;
}

/**
 * 账期model
 */
export interface IAccountingPeriodSaveCustomerAccountingPeriod {
  /**
   * 结算周期id，回传字段
   * 编辑时后端有返回就回传
   */
  settlementId?: string;
  /**
   * 出账类型
   */
  billingDate: string;
  /**
   * 出账日设置
   */
  periodDate: string;
  /**
   * tag CRM-V0.6
   * 优惠档次
   */
  preferentialGrade?: DISCOUNT_GRADE_ENUM | '';
  /**
   * 是否预付定金
   * YES--是，NO--不是
   */
  isAdvancePayment: string;
  /**
   * 预付定金比例
   */
  advancePaymentRatio?: string;
  /**
   * 结算周期
   */
  customerAccountingPeriodList?: IAccountingPeriodSaveCustomerAccountingPeriodListItem[];
}
export interface IAccountingPeriodSaveReq {
  customerAccountingPeriod?: IAccountingPeriodSaveCustomerAccountingPeriod;
  invoice?: IAccountingPeriodSaveInvoice;
  /**
   * 银行卡
   */
  bankAccountList?: IAccountingPeriodSaveBankAccountListItem[];
  customerId: string;
  /**
   * web端编辑不能为空集合
   * 编辑的模块
   */
  editModuleList: (
    | 'COMPANY_INFO'
    | 'CUSTOMER_SCALE'
    | 'CUSTOMER_OTHER'
    | 'BRAND'
    | 'SHIPPING_ADDRESS'
    | 'CONTACTS'
    | 'ACCOUNTING_PERIOD'
    | 'INVOICE'
    | 'BANK_ACCOUNT'
    | 'RISK_INFO'
    | 'PROFILE_FILES'
    | 'EXTERNAL_RELATION'
  )[];
}
/**
 * 响应数据
 */
export interface IAccountingPeriodSaveRes {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 是否所有资料编辑完成
   */
  isAllCompleted: boolean;
  /**
   * 社会统一征信代码
   */
  socialCreditCode: string;
}

// 风险信息
export interface IRiskSaveFileReqListItem {
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
  name?: string;
  /**
   * url
   */
  url?: string;
}

export interface IRiskSave {
  /**
   * 自身风险数
   */
   selfRiskCount: string;
   /**
    * 周边风险数
    */
   aroundRiskCount: string;
   /**
    * 历史风险数
    */
   historyRiskCount: string;
   /**
    * 预警提醒数
    */
   earlyWarningRiskCount: string;
   /**
    * 法律诉讼数
    */
   lawsuitCount: string;
   /**
    * 失信执行数
    */
   zhixingCount: string;
   /**
    * 限制消费数
    */
   consumptionRestrictionCount: string;
   /**
    * 风险截图附件
    */
    fileReqList?: IRiskSaveFileReqListItem[];
}

export interface IRiskSaveReq {
  /**
   * 自身风险数
   */
  selfRiskCount: string;
  /**
   * 周边风险数
   */
  aroundRiskCount: string;
  /**
   * 历史风险数
   */
  historyRiskCount: string;
  /**
   * 预警提醒数
   */
  earlyWarningRiskCount: string;
  /**
   * 法律诉讼数
   */
  lawsuitCount: string;
  /**
   * 失信执行数
   */
  zhixingCount: string;
  /**
   * 限制消费数
   */
  consumptionRestrictionCount: string;
  /**
   * 风险截图附件
   */
  fileReqList?: IRiskSaveFileReqListItem[];
  customerId: string;
  /**
   * web端编辑不能为空集合
   * 编辑的模块
   */
  editModuleList: (
    | 'COMPANY_INFO'
    | 'CUSTOMER_SCALE'
    | 'CUSTOMER_OTHER'
    | 'BRAND'
    | 'SHIPPING_ADDRESS'
    | 'CONTACTS'
    | 'ACCOUNTING_PERIOD'
    | 'INVOICE'
    | 'BANK_ACCOUNT'
    | 'RISK_INFO'
    | 'PROFILE_FILES'
    | 'EXTERNAL_RELATION'
  )[];
}
/**
 * 响应数据
 */
export interface IRiskSaveRes {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 是否所有资料编辑完成
   */
  isAllCompleted: boolean;
  /**
   * 社会统一征信代码
   */
  socialCreditCode: string;
}

// 系统关联
export interface IExternalRelationSaveExternalRelationListItem {
  /**
   * 本系统客户ID
   */
  customerId?: string;
  /**
   * 外部系统客户编码
   */
  sourceCustomerCode: string;
  /**
   * 外部系统客户全称
   */
  sourceCustomerName: string;
  /**
   * 来源系统编码
   */
  sourceSystemCode: string;
  /**
   * 来源系统名称
   */
  sourceSystemName: string;
}
export interface IExternalRelationSaveReq {
  /**
   * 外部系统关联关系
   */
  externalRelationList: IExternalRelationSaveExternalRelationListItem[];
  customerId: string;
  /**
   * web端编辑不能为空集合
   * 编辑的模块
   */
  editModuleList: (
    | 'COMPANY_INFO'
    | 'CUSTOMER_SCALE'
    | 'CUSTOMER_OTHER'
    | 'BRAND'
    | 'SHIPPING_ADDRESS'
    | 'CONTACTS'
    | 'ACCOUNTING_PERIOD'
    | 'INVOICE'
    | 'BANK_ACCOUNT'
    | 'RISK_INFO'
    | 'PROFILE_FILES'
    | 'EXTERNAL_RELATION'
  )[];
}
/**
 * 响应数据
 */
export interface IExternalRelationSaveRes {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 是否所有资料编辑完成
   */
  isAllCompleted: boolean;
  /**
   * 社会统一征信代码
   */
  socialCreditCode: string;
}

// 资料文件
export interface IProfileFilesSavePaymentProofImageListItem {
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
export interface IProfileFilesSaveContractFileListItem {
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
export interface IProfileFilesSaveIdCardImageListItem {
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
export interface IProfileFilesSaveCustomerScoreFileListItem {
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
export interface IProfileFilesSaveAssetsProofFileListItem {
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

export interface IProfileFilesSave {
  /**
   * 付款证明--图片
   * fileType=CUSTOMER_PAYMENT_PROOF
   */
   paymentProofImageList: IProfileFilesSavePaymentProofImageListItem[];
   businessLicenseList: IProfileFilesSavePaymentProofImageListItem[];
   /**
    * 框架合同文件--文件
    * fileType=CUSTOMER_CONTRACT
    */
   contractFileList: IProfileFilesSaveContractFileListItem[];
   /**
    * 法人身份证--图片
    * fileType=CUSTOMER_LEGAL_PERSON_ID_CARD
    */
    idCardImageList: IProfileFilesSaveIdCardImageListItem[];
   /**
    * 客户评分表--文件
    * fileType=CUSTOMER_CUSTOMER_SCORE
    */
   customerScoreFileList: IProfileFilesSaveCustomerScoreFileListItem[];
   /**
    * 资产证明--文件
    * fileType=CUSTOMER_ASSETS_PROOF
    */
   assetsProofFileList: IProfileFilesSaveAssetsProofFileListItem[];
}
export interface IProfileFilesSaveReq {
  /**
   * 付款证明--图片
   * fileType=CUSTOMER_PAYMENT_PROOF
   */
  paymentProofImageList: IProfileFilesSavePaymentProofImageListItem[];
  /**
   * 框架合同文件--文件
   * fileType=CUSTOMER_CONTRACT
   */
  contractFileList: IProfileFilesSaveContractFileListItem[];
  /**
   * 法人身份证--图片
   * fileType=CUSTOMER_LEGAL_PERSON_ID_CARD
   */
   idCardImageList: IProfileFilesSaveIdCardImageListItem[];
  /**
   * 客户评分表--文件
   * fileType=CUSTOMER_CUSTOMER_SCORE
   */
  customerScoreFileList: IProfileFilesSaveCustomerScoreFileListItem[];
  /**
   * 资产证明--文件
   * fileType=CUSTOMER_ASSETS_PROOF
   */
  assetsProofFileList: IProfileFilesSaveAssetsProofFileListItem[];
  customerId: string;
  /**
   * web端编辑不能为空集合
   * 编辑的模块
   */
  editModuleList: (
    | 'COMPANY_INFO'
    | 'CUSTOMER_SCALE'
    | 'CUSTOMER_OTHER'
    | 'BRAND'
    | 'SHIPPING_ADDRESS'
    | 'CONTACTS'
    | 'ACCOUNTING_PERIOD'
    | 'INVOICE'
    | 'BANK_ACCOUNT'
    | 'RISK_INFO'
    | 'PROFILE_FILES'
    | 'EXTERNAL_RELATION'
  )[];
}
/**
 * 响应数据
 */
export interface IProfileFilesSaveRes {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 是否所有资料编辑完成
   */
  isAllCompleted: boolean;
  /**
   * 社会统一征信代码
   */
  socialCreditCode: string;
}

export interface ITabItem {
  props: {
    name: string;
  };
}

/**
 * 请求参数对象
 */
export interface IAuditProcessAddAuditReq {
  /**
   * 业务id（新建客户审核：客户id）
   */
  businessId: string;
  /**
   * bdmId
   */
  bdmId?: string;
  /**
   * bdm名字
   */
  bdmName?: string;
  /**
   * cmId
   */
  cmId?: string;
  /**
   * cm名字
   */
  cmName?: string;
  /**
   * bdid
   */
  bdId?: string;
  /**
   * bd名称
   */
  bdName?: string;
}

// 资料文件
export interface IDetailProfileFilesPaymentProofImageListItem {
  /**
   * 创建人id
   */
  creatorId: string;
  /**
   * 图片id
   */
  fileId: string;
  /**
   * 文件名
   */
  name: string;
  /**
   * url
   */
  url: string;
}
export interface IDetailProfileFilesContractFileListItem {
  /**
   * 创建人id
   */
  creatorId: string;
  /**
   * 图片id
   */
  fileId: string;
  /**
   * 文件名
   */
  name: string;
  /**
   * url
   */
  url: string;
}
export interface IDetailProfileFilesIdCardImageListItem {
  /**
   * 创建人id
   */
  creatorId: string;
  /**
   * 图片id
   */
  fileId: string;
  /**
   * 文件名
   */
  name: string;
  /**
   * url
   */
  url: string;
}
export interface IDetailProfileFilesCustomerScoreFileListItem {
  /**
   * 创建人id
   */
  creatorId: string;
  /**
   * 图片id
   */
  fileId: string;
  /**
   * 文件名
   */
  name: string;
  /**
   * url
   */
  url: string;
}
export interface IDetailProfileFilesAssetsProofFileListItem {
  /**
   * 创建人id
   */
  creatorId: string;
  /**
   * 图片id
   */
  fileId: string;
  /**
   * 文件名
   */
  name: string;
  /**
   * url
   */
  url: string;
}
/**
 * 响应数据
 */
export interface IDetailProfileFilesRes {
  customerId: string;
  businessType: string;
  /**
   * 付款证明--图片
   * fileType=CUSTOMER_PAYMENT_PROOF
   */
  paymentProofImageList: IDetailProfileFilesPaymentProofImageListItem[];
  businessLicenseList: IDetailProfileFilesPaymentProofImageListItem[];
  /**
   * 框架合同文件--文件
   * fileType=CUSTOMER_CONTRACT
   */
  contractFileList: IDetailProfileFilesContractFileListItem[];
  /**
   * 法人身份证--图片
   * fileType=CUSTOMER_LEGAL_PERSON_ID_CARD
   */
   idCardImageList: IDetailProfileFilesIdCardImageListItem[];
  /**
   * 客户评分表--文件
   * fileType=CUSTOMER_CUSTOMER_SCORE
   */
  customerScoreFileList: IDetailProfileFilesCustomerScoreFileListItem[];
  /**
   * 资产证明--文件
   * fileType=CUSTOMER_ASSETS_PROOF
   */
  assetsProofFileList: IDetailProfileFilesAssetsProofFileListItem[];
}
/**
 * 响应数据
 */
export interface IDetailExternalRelationRes {
  /**
   * 本系统客户ID
   */
   customerId: string;
   /**
    * 外部系统客户编码
    */
   sourceCustomerCode: string;
   /**
    * 外部系统客户全称
    */
   sourceCustomerName: string;
   /**
    * 来源系统编码
    */
   sourceSystemCode: string;
   /**
    * 来源系统名称
    */
   sourceSystemName: string;
}[];

// 平台业务（基本信息）

export interface IBaseInfoSaveBusinessLicenseListItem {
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
}
/**
 * 工商信息
 */
export interface IBaseInfoSaveCompanyInfo {
  /**
   * 客户编码
   */
  customerCode?: string;
  /**
   * 营业执照,只需一张
   */
  businessLicenseList?: IBaseInfoSaveBusinessLicenseListItem[];
  /**
   * 客户全称
   */
  customerName: string;
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
  establishmentDate: string;
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
}
/**
 * 人员规模
 */
export interface IBaseInfoSaveCustomerScale {
  /**
   * 在职人数范围-小
   */
  servingStaffMin?: string;
  /**
   * 在职人数范围-大
   */
  servingStaffMax?: string;
  /**
   * 自有设计师备注
   */
  selfDesignerRemark?: string;
  /**
   * 自有设计师
   * YES--有，NO--无
   */
  selfDesigner?: string;
  /**
   * 自有工厂备注
   */
  selfFactoryRemark?: string;
  /**
   * 自有工厂
   * YES--有，NO--无
   */
  selfFactory?: string;
  /**
   * 年营业额/万元
   */
  annualTurnover: string;
  /**
   * 预估合作规模/年
   */
  annualCooperationScale?: string;
  /**
   * 年销售量/万件
   */
  annualSaleVolume?: string;
  /**
   * 销售倍率
   */
  saleRate?: string;
}
/**
 * 客户基本资料-其它信息
 */
export interface IBaseInfoSaveCustomerOther {
  /**
   * 法人身份证
   */
  artificialPersonIdCard?: string;
  /**
   * 纳税人类型,TaxpayerTypeEnum
   */
  taxpayerType: string;
  /**
   * 法人联系电话
   */
  artificialPersonPhone?: string;
  /**
   * 备注信息
   */
  remark?: string;
  customerType: string;
  /** 订单类型 */
  allowedOrderType: string;
  /**
   * 经营地址列表
   */
  operatingAddressList: IBaseInfoCustomerAddressItem[];
}
export interface IBaseInfoSaveRes {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 社会统一征信代码
   */
  socialCreditCode: string;
}

export interface IBaseInfoSaveReq {
  companyInfo?: IBaseInfoSaveCompanyInfo;
  customerScale?: IBaseInfoSaveCustomerScale;
  customerOther?: IBaseInfoSaveCustomerOther;
  customerId: string;
  /**
   * web端编辑不能为空集合
   * 编辑的模块
   */
  editModuleList: (
    | 'COMPANY_INFO'
    | 'CUSTOMER_SCALE'
    | 'CUSTOMER_OTHER'
    | 'BRAND'
    | 'SHIPPING_ADDRESS'
    | 'CONTACTS'
    | 'ACCOUNTING_PERIOD'
    | 'INVOICE'
    | 'BANK_ACCOUNT'
    | 'RISK_INFO'
    | 'PROFILE_FILES'
    | 'EXTERNAL_RELATION'
  )[];
}

// 平台业务（账期）
export interface IAccountingSaveReq {
  customerAccountingPeriod?: IAccountingPeriodSaveCustomerAccountingPeriod;
  /**
   * 银行卡
   */
  bankAccountList?: IAccountingPeriodSaveBankAccountListItem[];
  customerId: string;
  /**
   * web端编辑不能为空集合
   * 编辑的模块
   */
  editModuleList: (
    | 'COMPANY_INFO'
    | 'CUSTOMER_SCALE'
    | 'CUSTOMER_OTHER'
    | 'BRAND'
    | 'SHIPPING_ADDRESS'
    | 'CONTACTS'
    | 'ACCOUNTING_PERIOD'
    | 'INVOICE'
    | 'BANK_ACCOUNT'
    | 'RISK_INFO'
    | 'PROFILE_FILES'
    | 'EXTERNAL_RELATION'
  )[];
}

export interface IAccountingPeriodSaveCustomerSettlementPeriodListItem {
  /**
   * 结算周期id，回传字段
   * 编辑时后端有返回就回传
   */
  settlementId?: string;
  /**
   * 结算周期天数
   */
  settlementPeriodDays: string;
  /**
   * 回款百分比，如30%,整数
   */
  returnPercent: string;
}
export interface IAccountingPeriodSaveCustomerSettlementListItem {
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 客户地址id，回传字段
   * 编辑时后端有返回就回传
   */
  customerAddressId?: string;
  /**
   * 收件人
   */
  recipient: string;
  /**
   * 收件人电话
   */
  recipientPhone: string;
  /**
   * 省份
   */
  province: string;
  /**
   * 城市
   */
  city: string;
  /**
   * 区域
   *     @NotEmpty(message = "区域不能为空")
   */
  region?: string;
  /**
   * 街道详细地址
   */
  addressDetail: string;
}
export interface IAccountingPeriodSaveBankListItem {
  /**
   * 银行账户id,回传字段
   * 编辑时后端有返回就回传
   */
  bankAccountId?: string;
  /**
   * 银行code不能为空
   */
  bankCode: string;
  /**
   * 银行名称不能为空
   */
  bankName: string;
  /**
   * 开户支行名称
   */
  subBankName: string;
  /**
   * 开户人
   */
  accountHolder: string;
  /**
   * 卡号
   */
  accountNo: string;
  /**
   * 银行卡类型
   */
  accountType: 'PRIVATE' | 'PUBLIC';
  /**
   * 启用状态
   */
  enableState?: 'YES' | 'NO';
}

/**
 * 账期model
 */
export interface IAccountingPeriodSaveCustomerAccounting {
  /**
   * 出账类型
   */
  billingDate: string;
  /**
   * 出账日设置
   */
  periodDate: string;
  /**
   * tag CRM-V0.6
   * 优惠档次
   */
  preferentialGrade?: DISCOUNT_GRADE_ENUM | '';
  /**
   * 是否预付定金
   * YES--是，NO--不是
   */
  isAdvancePayment: 'YES' | 'NO';
  /**
   * 预付定金比例
   */
  advancePaymentRatio?: string;
  /**
   * 结算周期
   */
  customerSettlementPeriodList?: IAccountingPeriodSaveCustomerSettlementListItem[];
}

/**
 * 允许下单类型修改
 * yapi地址：https://yapi.ibaibu.com/project/2106/interface/api/130096
 */
export interface ICustomerAllowedOrderTypeReq {
  /**
   * 允许下单类型
   */
  allowedOrderType: string;
  customerId: string;
}

// 删除客户请求体
export interface IDeleteCustomerReq {
  /**
   * 删除备注
   */
  remark: string;
  /**
   * 删除原因，传入中文值
   */
  reason: string;
  customerId: string;
}

// 转交审核人请求体
export interface ITransferReviewReq {
  /**
   * 记录id
   */
  detailId: string;
  /**
   * 转移目标用户id
   */
  targetUserId: string;
  /**
   * 转移目标用户名
   */
  targetUserName: string;
  /**
   * 原审核用户id
   */
  originUserId: string;
  /**
   * 备注
   */
  remark: string;
}

/**
 * 搜索客户（主体关联）返回体
 */
export interface IGetCustomerOptionsByRelationRes {
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
   * 客户业务类型
   */
  businessType: BUSINESS_MODE_ENUM;
  /**
   * 区域code
   */
  regionCode: string;
  /**
   * 区域名称
   */
  regionName: string;
}

/**
 * 客户编辑-主体关联请求体
 */
export interface IUpdateCustomerRelationReq {
  /**
   * 客户id
   */
  customerIdList: string[];
  customerId: string;
}

/**
 * 客户详情-主体关联返回体
 */
export interface IGetCustomerRelationRes {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 客户名称
   */
  customerName: string;
  /**
   * 客户code
   */
  customerCode: string;
}

/**
 * 客户管理-运营信息编辑
 * yapi地址：https://yapi.ibaibu.com/project/2106/interface/api/120816
 */

/**
 * 是否默认
 */
export const enum IsDefaultEnum {
  /**
   * 是
   */
  YES = 'YES',
  /**
   * 不是
   */
  NO = 'NO'
}

/**
 * tag-v0.2
 * 来源类型
 */
export const enum SOURCE_TYPE_ENUM {
  /**
   * CRM-后台
   */
  WEB = 'WEB',
  /**
   * 小程序
   */
  MINI_APP = 'MINI_APP',
  /**
   * 天工
   */
  TIANGONG = 'TIANGONG',
  /**
   * 小程序
   */
  APP = 'APP'
}

/**
 * 业务类型
 */
export const enum BusinessTypeEnum {
  /**
   * 自营业务
   */
  SELF_OPERATED_BUSINESS = 'SELF_OPERATED_BUSINESS',
  /**
   * 平台业务
   */
  PLATFORM_BUSINESS = 'PLATFORM_BUSINESS'
}

/**
 * 检测方式
 */
export const enum CheckWayEnum {
  /**
   * 需要外检
   */
  EXTERNAL_CHECK = '1',
  /**
   * 无需检测
   */
  NOT_REQUIRED_CHECK = '2',
  /**
   * 天工自检
   */
  TIANGONG_CHECK = '3'
}

/**
 * 面辅料检测支付
 */
export const enum FabricPaymentWayEnum {
  /**
   * 客户支付
   */
  CUSTOMER_PAY = '1',
  /**
   * 天工支付
   */
  TIANGONG_PAY = '2'
}

/**
 * 成衣检测支付
 */
export const enum ProductPaymentWayEnum {
  /**
   * 客户支付
   */
  CUSTOMER_PAY = '1',
  /**
   * 天工支付
   */
  TIANGONG_PAY = '2'
}

/**
 * 包装支付支付
 */
export const enum PackagePaymentEnum {
  /**
   * 客户支付
   */
  CUSTOMER_PAY = '1',
  /**
   * 天工支付
   */
  TIANGONG_PAY = '2'
}

/**
 * 运费支付方式
 */
export const enum ShippingFeePaymentEnum {
  /**
   * 客户支付
   */
  CUSTOMER_PAY = '1',
  /**
   * 天工支付
   */
  TIANGONG_PAY = '2'
}

export interface IBusinessInfoSaveReqBrandListItemCheckRequirementModelPackageRequirementItem {
  /**
   * 包装要求 ,字典code
   */
  packageRequireList?: string[];
  /**
   * 包装供给方
   */
  packageProvider?: string;
}

export interface IBusinessInfoSaveReqBrandListItemCheckRequirementModel {
  /**
   * 主键
   */
  requirementId?: string;
  /**
   * 品牌id
   */
  brandId?: string;
  /**
   * 检测方式
   */
  checkWay: CheckWayEnum | string;
  /**
   * 面辅料检测要求,来源字典
   */
  fabricRequirement?: string[];
  /**
   * 成衣检测要求，来源字典
   */
  productRequirement?: string[];
  /**
   * 面辅料检测支付
   */
  fabricPaymentWay?: FabricPaymentWayEnum | string;
  /**
   * 成衣检测支付
   */
  productPaymentWay?: ProductPaymentWayEnum | string;
  /**
   * 包装要求json串
   */
  packageRequirement?: IBusinessInfoSaveReqBrandListItemCheckRequirementModelPackageRequirementItem[];
  /**
   * 包装支付支付
   */
  packagePayment?: PackagePaymentEnum | string;
  /**
   * 运输方式,来源字典
   */
   deliveryWay?: string[];
  /**
   * 运费支付方式
   */
  shippingFeePayment?: ShippingFeePaymentEnum | string;
  reviserId?: string;
  revisedTime?: string;
  isDeleted?: string;
  creatorId?: string;
  createdTime?: string;
}

export interface IBusinessInfoSaveReqBrandListItemProductPeriod {
  /**
   * 产品周期id，回传字段
   * 编辑时后端有返回就回传
   */
  productPeriodId?: string;
  /**
   * 选版周期-单位
   */
  prototypePeriodUnit?: string;
  /**
   * 选版周期-单位数量
   */
  prototypePeriod?: string;
  /**
   * 选版周期-周期内选版次数
   */
  prototypePeriodTimes?: string;
  /**
   * 生产周期-单位
   */
  producePeriodUnit?: string;
  /**
   * 生产周期-单位数量
   */
  producePeriod?: string;
  /**
   * 生产周期-周期内选版次数
   */
  producePeriodTimes?: string;
  /**
   * 首单生产件数
   */
  firstOrderPiece: string;
  /**
   * 返单件数
   */
  reworkOrderPiece: string;
  /**
   * 首单生产周期最小天数
   */
  firstOrderProducePeriodMin: string;
  /**
   * 首单生产周期最大天数
   */
  firstOrderProducePeriodMax: string;
  /**
   * 返单生产周期最小天数
   */
  reworkOrderProducePeriodMin: string;
  /**
   * 返单生产周期最大天数
   */
  reworkOrderProducePeriodMax: string;
  /**
   * 样板开发周期最小天数
   */
  prototypeDevelopmentPeriodMin?: string;
  /**
   * 样板开发周期最大天数
   */
  prototypeDevelopmentPeriodMax?: string;
  /**
   * 客户验货标准
   */
  customerInspectionLevel?: string;
  /**
   * 产前样要求
   */
  sampleRequirement?: string;
}

export interface IBusinessInfoSaveReqBrandListItemCoreCategoryListItem {
  /**
   * 核心品类id，回传字段
   * 编辑时后端有返回就回传
   */
  customerCoreCategoryId?: string;
  /**
   * 类目 数组
   */
  category: string[];
  /**
   * 品类占比
   */
  ratio: string;
  /**
   * 加工均价/元
   */
  machiningAveragePrice?: string;
  /**
   * 客单价
   */
  perTicketSales?: string;
}

export interface IBusinessInfoSaveReqBrandListItemCooperationModeListItem {
  /**
   * 合作模式id,回传字段
   * 编辑时后端有返回就回传
   */
  cooperationModeId?: string;
  /**
   * 合作模式code
   */
  cooperationType: string;
  /**
   * 模式占比
   */
  cooperationRatio: string;
}

export interface IBusinessInfoSaveReqBrandListItemSaleChannelListItem {
  /**
   * 销售渠道id，回传字段
   * 编辑时后端有返回就回传
   */
  saleChannelId?: string;
  /**
   * 销售通道
   */
  channelCode: string;
  /**
   * 销售占比
   */
  salesRatio: string;
}

export interface IBusinessInfoSaveReqShippingAddressItem {
  /**
   * 地址类型，来自字典表
   */
  type: string;
  /**
   * 是否默认
   */
  isDefault: YES_NO_ENUM;
  /**
   * 收件人
   */
  recipient: string;
  /**
   * 收件人电话
   */
  recipientPhone: string;
  /**
   * 接收者邮箱
   */
  email?: string;
  /**
   * tag-v0.2
   * 来源类型
   */
  sourceType: keyof typeof SOURCE_TYPE_ENUM;
  /**
   * 客户地址id，回传字段
   * 编辑时后端有返回就回传
   */
  customerAddressId?: string;
  /**
   * 省份
   */
  province: string;
  /**
   * 城市
   */
  city: string;
  /**
   * 区域
   *     @NotEmpty(message = "区域不能为空")
   */
  region?: string;
  /**
   * 街道详细地址
   */
  addressDetail: string;
}
// 档案审核
export interface IAuditProcessPassAuditReq {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 审核结果（1-待审核、2-通过、3-驳回）
   */
  state?: string;
  /**
   * 备注
   */
  remark?: string;
}

export interface IAuditProcessGetAuditInfoReturnInfoListItem {
  /**
   * 结算周期天数
   */
  settlementPeriodDays: string;
  /**
   * 回款百分比
   */
  returnPercent: string;
}
export interface IAuditProcessGetAuditInfoRes {
  /**
   * 客户id
   */
  customerId: string;
  businessType: string;
  /**
   * 客户编码
   */
  customerCode: string;
  /**
   * 客户名称
   */
  customerName: string;
  /**
   * 是否全部编辑完成
   */
  isAllCompleted: boolean;
  /**
   * 客户状态；0:禁用，1：启用
   * {@link CustomerStateEnum}
   */
  customerStateEnum: 'INIT' | 'ENABLE' | 'ALLOW_REJECTED' | 'DISABLE';
  /**
   * 客户档案状态
   * {@link CustomerProfileStateEnum}
   */
  profileStateEnum: PROFILE_STATE_ENUM;
  /**
   * 预付定金比例
   */
  advancePaymentRatio: string;
  /**
   * 回款信息
   */
  returnInfoList: IAuditProcessGetAuditInfoReturnInfoListItem[];
  /**
   * 备注
   */
  remark: string;
  isAdvancePayment: string;
  ownerId: string; // bd的id
  ownerName: string; // bd名称
  ownerCode: string; // code
}

export interface IBusinessInfoSaveReqBrandListItem {
  /**
   * 品牌id，回传字段
   * 编辑时后端有返回就回传
   */
  brandId?: string;
  /**
   * 品牌名称
   */
  brandName: string;
  /**
   * 变为数组 customer-optimization
   * 品牌类型
   */
  brandType: string[];
  /**
   * 对标品牌
   */
  benchmarkingBrand?: string;
  /**
   * 品质要求
   */
  qualityRequirement: string;
  /**
   * 产品风格
   */
  productStyle: string[];
  /**
   * 消费年龄
   */
  consumerAgeList: string[];
  saleChannelList: IBusinessInfoSaveReqBrandListItemSaleChannelListItem[];
  /**
   * 合作模式
   */
  cooperationModeList: IBusinessInfoSaveReqBrandListItemCooperationModeListItem[];
  /**
   * 核心品类
   */
  coreCategoryList: IBusinessInfoSaveReqBrandListItemCoreCategoryListItem[];
  /**
   * 产品周期
   */
  productPeriod: IBusinessInfoSaveReqBrandListItemProductPeriod;
  /**
   * 面料检测内容
   */
  checkRequirementModel: IBusinessInfoSaveReqBrandListItemCheckRequirementModel;
  /**
   * 面料级别-来源字典配置
   */
  fabricLevel?: string;
  /**
   * 工艺级别-来源字典配置
   */
  craftLevel?: string;
  /**
   * 供应链服务级别-来源字典配置
   */
  supplyChainLevel?: string;
}
export interface IBusinessInfoSaveReq {
  /**
   * 品牌列表
   */
  brandList?: IBusinessInfoSaveReqBrandListItem[];
  /**
   * 客户收货址
   */
  shippingAddress?: IBusinessInfoSaveReqShippingAddressItem[];
  customerId: string;
  /**
   * web端编辑不能为空集合
   * 编辑的模块
   */
  editModuleList: string[];
}

/**
 * 客户详情-运营信息
 * yapi地址：https://yapi.ibaibu.com/project/2106/interface/api/116530
 */
export interface IDetailBusinessInfoReq {
  /**
   * 客户id
   */
  customerId: string;
}

/**
 * 允许下单类型
 * tag - self_cuohe_order
 */
export const enum AllowedOrderTypeEnum {
  /**
   * 自营订单
   */
  SELF_OPERATED_ORDER = '1',
  /**
   * 平台订单
   */
  PLATFORM_ORDER = '2'
}

export interface IDetailBusinessInfoPackageRequirementItem {
  /**
   * 包装要求 ,字典code
   */
  packageRequireList?: string[];
  /**
   * 包装供给方
   */
  packageProvider?: string;
}

export interface IDetailBusinessInfoResBrandListItemCheckRequirementModel {
  /**
   * 主键
   */
  requirementId?: string;
  /**
   * 品牌id
   */
  brandId?: string;
  /**
   * 检测方式
   */
  checkWay: CheckWayEnum | string;
  /**
   * 面辅料检测要求,来源字典
   */
  fabricRequirement?: string[];
  /**
   * 成衣检测要求，来源字典
   */
  productRequirement?: string[];
  /**
   * 面辅料检测支付
   */
  fabricPaymentWay?: FabricPaymentWayEnum | string;
  /**
   * 成衣检测支付
   */
  productPaymentWay?: ProductPaymentWayEnum | string;
  /**
   * 包装要求json串
   */
  packageRequirement?: IDetailBusinessInfoPackageRequirementItem[];
  /**
   * 包装支付支付
   */
  packagePayment?: PackagePaymentEnum | string;
  /**
   * 运输方式,来源字典
   */
   deliveryWay?: string[];
  /**
   * 运费支付方式
   */
  shippingFeePayment?: ShippingFeePaymentEnum | string;
  reviserId?: string;
  revisedTime?: number;
  isDeleted?: string;
  creatorId?: string;
  createdTime?: number;
}

export interface IDetailBusinessInfoResBrandListItemProductPeriod {
  /**
   * 产品周期id，回传字段
   * 编辑时后端有返回就回传
   */
  productPeriodId?: string;
  /**
   * 选版周期-单位
   */
  prototypePeriodUnit?: string;
  /**
   * 选版周期-单位数量
   */
  prototypePeriod?: string;
  /**
   * 选版周期-周期内选版次数
   */
  prototypePeriodTimes?: string;
  /**
   * 生产周期-单位
   */
  producePeriodUnit?: string;
  /**
   * 生产周期-单位数量
   */
  producePeriod?: string;
  /**
   * 生产周期-周期内选版次数
   */
  producePeriodTimes?: string;
  /**
   * 首单生产件数
   */
  firstOrderPiece: string;
  /**
   * 返单件数
   */
  reworkOrderPiece: string;
  /**
   * 首单生产周期最小天数
   */
  firstOrderProducePeriodMin: string;
  /**
   * 首单生产周期最大天数
   */
  firstOrderProducePeriodMax: string;
  /**
   * 返单生产周期最小天数
   */
  reworkOrderProducePeriodMin: string;
  /**
   * 返单生产周期最大天数
   */
  reworkOrderProducePeriodMax: string;
  /**
   * 样板开发周期最小天数
   */
  prototypeDevelopmentPeriodMin?: string;
  /**
   * 样板开发周期最大天数
   */
  prototypeDevelopmentPeriodMax?: string;
  /**
   * 客户验货标准
   */
  customerInspectionLevel?: string;
  /**
   * 产前样要求
   */
  sampleRequirement?: string;
}

export interface IDetailBusinessInfoResBrandListItemCoreCategoryListItem {
  /**
   * 核心品类id，回传字段
   * 编辑时后端有返回就回传
   */
  customerCoreCategoryId?: string;
  /**
   * 类目 数组
   */
  category: string[];
  /**
   * 品类占比
   */
  ratio: string;
  /**
   * 加工均价/元
   */
  machiningAveragePrice?: string;
  /**
   * 客单价
   */
  perTicketSales?: string;
}

export interface IDetailBusinessInfoResBrandListItemCooperationModeListItem {
  /**
   * 合作模式id,回传字段
   * 编辑时后端有返回就回传
   */
  cooperationModeId?: string;
  /**
   * 合作模式code
   */
  cooperationType: string;
  /**
   * 模式占比
   */
  cooperationRatio: string;
}

export interface IDetailBusinessInfoResBrandListItemSaleChannelListItem {
  /**
   * 销售渠道id，回传字段
   * 编辑时后端有返回就回传
   */
  saleChannelId?: string;
  /**
   * 销售通道
   */
  channelCode: string;
  /**
   * 销售占比
   */
  salesRatio: string;
}

export interface IDetailBusinessInfoResBrandListItem {
  /**
   * 品牌id，回传字段
   * 编辑时后端有返回就回传
   */
  brandId?: string;
  /**
   * 品牌名称
   */
  brandName: string;
  /**
   * 变为数组 customer-optimization
   * 品牌类型
   */
  brandType: string[];
  /**
   * 对标品牌
   */
  benchmarkingBrand?: string;
  /**
   * 品质要求
   */
  qualityRequirement: string;
  /**
   * 产品风格
   */
  productStyle: string[];
  /**
   * 消费年龄
   */
  consumerAgeList: string[];
  saleChannelList: IDetailBusinessInfoResBrandListItemSaleChannelListItem[];
  /**
   * 合作模式
   */
  cooperationModeList: IDetailBusinessInfoResBrandListItemCooperationModeListItem[];
  /**
   * 核心品类
   */
  coreCategoryList: IDetailBusinessInfoResBrandListItemCoreCategoryListItem[];
  /**
   * 产品周期
   */
  productPeriod: IDetailBusinessInfoResBrandListItemProductPeriod;
  /**
   * 面料检测内容
   */
  checkRequirementModel: IDetailBusinessInfoResBrandListItemCheckRequirementModel;
  /**
   * 面料级别-来源字典配置
   */
  fabricLevel?: string;
  /**
   * 工艺级别-来源字典配置
   */
  craftLevel?: string;
  /**
   * 供应链服务级别-来源字典配置
   */
  supplyChainLevel?: string;
}

export interface IDetailBusinessInfoResShippingAddressItem {
  /**
   * 地址类型，来自字典表
   */
  type: string;
  /**
   * 是否默认
   */
  isDefault: keyof typeof IsDefaultEnum;
  /**
   * 收件人
   */
  recipient: string;
  /**
   * 收件人电话
   */
  recipientPhone: string;
  /**
   * 接收者邮箱
   */
  email?: string;
  /**
   * tag-v0.2
   * 来源类型
   */
  sourceType: keyof typeof SOURCE_TYPE_ENUM;
  /**
   * 客户地址id，回传字段
   * 编辑时后端有返回就回传
   */
  customerAddressId?: string;
  /**
   * 省份
   */
  province: string;
  /**
   * 城市
   */
  city: string;
  /**
   * 区域
   *     @NotEmpty(message = "区域不能为空")
   */
  region?: string;
  /**
   * 街道详细地址
   */
  addressDetail: string;
}

export interface IDetailBusinessInfoRes {
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 品牌列表
   */
  brandList?: IDetailBusinessInfoResBrandListItem[];
  /**
   * 客户收货址
   */
  shippingAddress?: IDetailBusinessInfoResShippingAddressItem[];
  /**
   * tag-v0.2
   * 客户业务类型 不为空
   */
  businessType?: BusinessTypeEnum;
  /**
   * 允许下单类型
   * tag - self_cuohe_order
   */
  allowedOrderType: AllowedOrderTypeEnum;
}

/**
 * 禁用客户
 * yapi地址：https://yapi.ibaibu.com/project/2106/interface/api/117658
 */
export interface ICustomerDisableReq {
  /**
   * 停用原因,来源字典配置
   */
  reason: string;
  /**
   * 备注
   */
  remark: string;
  customerId: string;
}

export interface ICustomerDisableRes {
  /**
   * 客户id
   */
  customerId?: string;
  /**
   * 社会统一征信代码
   */
  socialCreditCode?: string;
  /**
   * 业务类型
   */
  businessType?: BusinessTypeEnum;
}
