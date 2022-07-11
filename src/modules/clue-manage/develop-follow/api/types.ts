import { YES_OR_NO_NUMBER_ENUM, BUSINESS_MODE_NO_ENUM } from '@/constant/global';
import {
  TAB_TYPE_ENUM,
  CLUE_TYPE_ENUM,
  DEVELOP_STATE_ENUM,
  BD_OPERATE_TYPE_ENUM,
} from '@/modules/clue-manage/develop-follow/constant';

export interface ICustomerClueDevPageReq {
  /**
   * 客户名称
   */
  customerNameLike?: string;
  /**
   * 线索类型
   */
  clueType?: CLUE_TYPE_ENUM | '';
  /**
   * 开发状态
   */
  devStatus?: DEVELOP_STATE_ENUM | '';
  /**
   * 所属bd
   */
  bdNameLike?: string;
  /**
   * 分配开始时间
   */
  startDistributionTime?: string;
  /**
   * 分配结束时间
   */
  endDistributionTime?: string;
  /**
   * 创建人名字
   */
  clueCreatorNameLike?: string;
  /**
   * 流入开始时间
   */
  startPublicTime?: string;
  /**
   * 流入结束时间
   */
  endPublicTime?: string;
  /**
   * 要查询的页面类型 1.开发跟进,2.公海线索
   */
  devSpeedPageType: TAB_TYPE_ENUM;
  addressList?: {
    province: string;
    city: string;
    region: string;
  }[];
  /**
   * 区域code
   */
  regionCode?: string;
  /**
   * 当前查询的页码
   */
  pageNum?: number;
  /**
   * 当前查询单页的数据量
   */
  pageSize?: number;
}
export interface ICustomerClueDevPageResListItem {
  /**
   * 开发id(主键)
   */
  devId: string;
  /**
   * 列名客户id（与customer_info表的customerId不一样）
   */
  customerId: string;
  /**
   * 用来跳转的客户id
   */
  jumpCustomerId: string;
  /**
   * 客户名称
   */
  customerName: string;
  /**
  * 统一社会信用代码
  */
  socialCreditCode: string;
  /**
   * 开发状态
   */
  devState: DEVELOP_STATE_ENUM;
  /**
   * 开发进度
   */
  devSpeed: string;
  /**
   * 是否拜访反馈（0-否，1-是）
   */
  devVisitCode: YES_OR_NO_NUMBER_ENUM;
  /**
   * 分配时间
   */
  distributionTime: number;
  /**
   * 线索类型
   */
  clueType: CLUE_TYPE_ENUM;
  /**
   * 开发跟进中转换或无效时间
   */
  conversionTime: number;
  /**
   * 流入公海时间
   */
  publicTime: number;
  /**
   * 线索创建人id
   */
  clueCreatorId: string;
  /**
   * 线索创建人名字
   */
  clueCreatorName: string;
  /**
   * 区域
   */
  regionName: string;
  /**
   * 所属的bdId
   */
  ownerId: string;
  /**
   * 所属的bd名字
   */
  ownerName: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 是否流入公海(0:否,1:是)
   */
  isPublic: YES_OR_NO_NUMBER_ENUM;
  /**
   * 流入公海次数
   */
  publicCount: string;
  /**
   * 业务模式，1-自营业务，2-平台业务
   */
  businessType: BUSINESS_MODE_NO_ENUM;
  /**
   * 创建人名称
   */
  creatorName: string;
  /**
   * 创建人id
   */
  creatorId: string;
  /**
   * 创建时间
   */
  createdTime: string;
}
export interface ICustomerClueDevPageRes {
  /**
   * 当前页码, 主要给 web 端做分页校验
   */
  page: string;
  /**
   * 总数据量
   */
  total: string;
  /**
   * 分页数据
   */
  list: ICustomerClueDevPageResListItem[];
}

export interface ICustomerClueDevGetRes {
  /**
   * 开发id(主键)
   */
  devId: string;
  /**
   * 列名客户id（与customer_info表的customerId不一样）
   */
  customerId: string;
  /**
   * 用来跳转的客户id
   */
  jumpCustomerId: string;
  /**
   * 客户名称
   */
  customerName: string;
  /**
   * 统一社会信用代码
   */
  socialCreditCode: string;
  /**
   * 业务模式，1-自营业务，2-平台业务
   */
  businessType: BUSINESS_MODE_NO_ENUM;
  /**
   * 开发状态
   */
  devState: DEVELOP_STATE_ENUM;
  /**
   * 开发进度
   */
  devSpeed: string;
  /**
   * 分配时间
   */
  distributionTime: string;
  /**
   * 线索类型
   */
  clueType: CLUE_TYPE_ENUM;
  /**
   * 流入公海时间
   */
  publicTime: string;
  /**
   * 线索创建人id
   */
  clueCreatorId: string;
  /**
   * 线索创建人名字
   */
  clueCreatorName: string;
  /**
   * 所属的bdId
   */
  ownerId: string;
  /**
   * 所属的bd名字
   */
  ownerName: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 是否流入公海(0:否,1:是)
   */
  isPublic: string;
  /**
   * 流入公海次数
   */
  publicCount: string;
  /**
   * 客户注册地址
   */
  customerAddress: string;
  /**
   * 创建人名称
   */
  creatorName: string;
  /**
   * 创建人id
   */
  creatorId: string;
  /**
   * 创建时间
   */
  createdTime: string;
}

export interface ICustomerClueDevActivationReq {
  /**
   * 开发主键id集合
   */
  devIdList: string[];
}

export interface IBdInfoReq {
  /**
   * 开发主键id集合
   */
  devIdList: string[];
  /**
   * bdId
   */
  ownerId?: string;
  /**
   * bd名字
   */
  ownerName?: string;
  /**
   * bd操作(1:bd认领,2:bd分配,3:bd转移)
   */
  customerBdHandle?: BD_OPERATE_TYPE_ENUM;
}

export interface IDevFeedbackReq {
  /**
   * 开发id
   */
  devId?: string;
  /**
   * 开发情况
   */
  devSpeed?: string;
  /**
   * 备注内容
   */
  remark?: string;
}

export interface IDevFinishReq {
  /**
   * 开发主键id
   */
  devId: string;
  /**
   * 跟进结果 3.转换, 4.无效
   */
  customerDevStatus: string;
  /**
   * 客户名称
   */
  customerName?: string;
  /**
   * 社会统一征信代码
   */
  socialCreditCode?: string;
  /**
   * 业务类型
   */
  businessType?: BUSINESS_MODE_NO_ENUM | '';
  /**
   * 无效原因
   */
  invalidReason?: string;
  /**
  * 跟进备注
  */
  followRemark?: string;
}

export interface IDevPublicReq {
  /**
   * 开发主键id集合
   */
  devIdList: string[];
}

export interface IGetHistoryReq {
  /**
   * 开发跟进id
   */
  devId: string;
  /**
   * bdId集合
   */
  bdIdList?: string[];
}
export type IGetHistoryListResItem = {
  /**
   * 历程id（主键）
   */
  historyId: string;
  /**
   * 内容
   */
  devContent: string;
  /**
   * 开发历程
   */
  devSpeed: string;
  /**
   * 开发状态
   */
  devState: DEVELOP_STATE_ENUM;
  /**
   * 是否拜访反馈（0-否，1-是）
   */
  devVisitCode: YES_OR_NO_NUMBER_ENUM;
  /**
   * 所属bdId
   */
  bdId: string;
  /**
   * bd名字
   */
  bdName: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 创建人ID
   */
  creatorId: string;
  /**
   * 创建人名称
   */
  creatorName: string;
  /**
   * 创建时间
   */
  createdTime: string;
};

export type IClueBdListResItem = {
  /**
   * bdId
   */
  bdId: string;
  /**
   * bd名字
   */
  bdName: string;
};

export interface IOperationLogGetOperationListReq {
  /**
   * 业务id(客户id/集团id)
   */
  buzId: string;
}
export type IOperationLogGetOperationListResItem = {
  /**
   * 日志
   */
  logId: string;
  buzType: string;
  /**
   * 业务id
   */
  buzId: string;
  logType: string;
  /**
   * 日志内容
   */
  content: string;
  /**
   * 备注
   */
  targetRemark: string;
  /**
   * 开发进度
   */
  devSpeed: string;
  /**
   * 开发状态
   */
  devState: DEVELOP_STATE_ENUM;
  /**
   * 创建人ID
   */
  creatorId: string;
  /**
   * 创建人名称
   */
  creatorName: string;
  /**
   * 创建时间
   */
  createdTime: string;
};

export interface ICustomerClueDevGetCompanyProfileRes {
  /**
   * 主键
   */
  id: string;
  /**
   * 线索id，开发计划id等
   */
  targetId: string;
  /**
   * 1-线索，2--开发计划
   */
  targetType: string;
  /**
   * 社会统一征信代码
   */
  socialCreditCode: string;
  /**
   * 客户名称
   */
  customerName: string;
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
   * 企业状态
   */
  openState: string;
  /**
   * 公司类型
   */
  companyType: string;
  /**
   * 成立日期
   */
  establishmentDate: string;
  /**
   * 法人姓名
   */
  artificialPerson: string;
  /**
   * 实缴资本
   */
  actualPayCapital: string;
  /**
   * 注册资本
   */
  regCapital: string;
  /**
   * 注册资本币种
   */
  regCapitalCurrency: string;
  /**
   * 实缴资本币种
   */
  actualCapitalCurrency: string;
}

export interface ICustomerClueDevDetailResBusinessInfoModel {
  /**
   * 主键
   */
  id: string;
  /**
   * 线索id，开发计划id等
   */
  targetId: string;
  /**
   * 1-线索，2--开发计划
   */
  targetType: string;
  /**
   * 社会统一征信代码
   */
  socialCreditCode: string;
  /**
   * 客户名称
   */
  customerName: string;
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
   * 企业状态
   */
  openState: string;
  /**
   * 公司类型
   */
  companyType: string;
  /**
   * 成立日期
   */
  establishmentDate: string;
  /**
   * 法人姓名
   */
  artificialPerson: string;
  /**
   * 实缴资本
   */
  actualPayCapital: string;
  /**
   * 注册资本
   */
  regCapital: string;
  /**
   * 注册资本币种
   */
  regCapitalCurrency: string;
  /**
   * 实缴资本币种
   */
  actualCapitalCurrency: string;
  /**
   * 经营地址(包含省市区)
   */
  fullOperatingAddress: string;
}
export interface ICustomerClueDevDetailResShopInfoListItem {
  /**
   * 店铺id，再次编辑的时候需要回传
   */
  trackShopId: string;
  /**
   * 店铺名称
   */
  shopName: string;
  /**
   * 店铺网址
   */
  shopUrl: string;
  /**
   * 店铺等级
   */
  shopLevel: string;
  /**
   * 口碑情况
   */
  shopStar: string;
  /**
   * 店铺粉丝数,单位：万
   */
  shopFans: string;
  /**
   * 品牌名称
   */
  brandName: string;
  /**
   * 主营品类
   */
  mainCategory: string[][];
  /**
   * 最小售价
   */
  priceMin: string;
  /**
   * 最大售价
   */
  priceMax: string;
  /**
   * 月畅销款数
   */
  monthSellWell: string;
  /**
   * 备注
   */
  remark: string;
}
export interface ICustomerClueDevDetailResContactListItem {
  /**
   * 客户联系人id，再次
   */
  customerContactId: string;
  /**
   * 联系人名字
   */
  contactName: string;
  /**
   * 职务
   */
  post: string;
  /**
   * 电话
   */
  phone: string;
  /**
   * 微信联系
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
}
export interface ICustomerClueDevDetailResEcommercePlatformListItem {
  /**
   * 平台id，再次编辑时回传字段
   */
  platformId: string;
  /**
   * 平台类型描述，取字典值
   */
  ecommercePlatformDesc: string;
  /**
   * 电商平台类型枚举，取字典值
   */
  ecommercePlatformType: string;
  /**
   * 线索id
   */
  trackId: string;
  /**
   * 店铺列表
   */
  shopInfoList: ICustomerClueDevDetailResShopInfoListItem[];
}
export interface ICustomerClueDevDetailRes {
  /**
   * 开发id(主键)
   */
  devId: string;
  businessInfoModel: ICustomerClueDevDetailResBusinessInfoModel;
  /**
   * 电商平台列表
   */
  ecommercePlatformList: ICustomerClueDevDetailResEcommercePlatformListItem[];
  /**
   * 联系信息
   */
  contactList: ICustomerClueDevDetailResContactListItem[];
  /**
   * 主营品类汇总
   */
  mainCategorySum?: string;
  /**
   * 最小售价汇总
   */
  priceMinSum?: string;
  /**
   * 最大售价汇总
   */
  priceMaxSum?: string;
  /**
   * 月畅销款数汇总
   */
  monthSellSum?: string;
}
