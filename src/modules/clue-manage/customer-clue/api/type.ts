import { AUDIT_RESULT_ENUM, TRACK_STATE_ENUM, OPERATION_LOG_TYPE_ENUM, AUDIT_LOG_TYPE_ENUM } from '../constant';

export interface IGetCluesListReq {
  /**
   * 客户名称
   */
  customerName: string;
  /**
   * 审核结果 1-审核通过 审核驳回：2-不符合画像 3-资料填写太少 4-其他原因
   */
  auditResult: AUDIT_RESULT_ENUM | '';
  /**
   * 创建人名称
   */
  creatorName: string;
  /**
   * 创建开始时间
   */
  createdStartTime?: string;
  /**
   * 创建结束时间
   */
  createdEndTime?: string;
  /**
   * 主营品类
   */
   mainCategory?: Array<string[]>;
  /**
   * 月畅销款数
   */
  monthSellWell: string;
  /**
   * 最小售价
   */
  priceMin: string;
  /**
   * 最大售价
   */
  priceMax: string;
  /**
   * 线索状态 1-待提交 2-待审核 3-审核通过 4-审核驳回
   */
  trackState: TRACK_STATE_ENUM | '';
  /**
   * 当前查询的页码
   */
  pageNum: number;
  /**
   * 当前查询单页的数据量
   */
  pageSize: number;
}
export interface IGetCluesListRes {
  /**
   * 当前页码, 主要给 web 端做分页校验
   */
  page: number;
  /**
   * 总数据量
   */
  total: number;
  /**
   * 分页数据
   */
  list: {
    /**
     * 客户线索id
     */
    trackId?: string;
    /**
     * 客户名称
     */
    customerName?: string;
    /**
     * 线索状态 1-待提交 2-待审核 3-审核通过 4-审核驳回
     */
    trackState?: TRACK_STATE_ENUM;
    /**
     * 审核备注
     */
    auditRemark?: string;
    /**
     * 审核结果 1-审核通过 审核驳回：2-不符合画像 3-资料填写太少 4-其他原因
     */
    auditResult?: AUDIT_RESULT_ENUM;
    /**
     * 主营品类汇总
     */
    mainCategorySum?: string;
    /**
     * 主营品类汇总列表
     */
    mainCategoryList?: string[];
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
    /**
     * 创建人名称
     */
    creatorName?: string;
    /**
     * 创建时间
     */
    createdTime?: number;
  }[];
}

interface IBusinessInfo {
  /**
   * 社会统一征信代码
   */
  socialCreditCode?: string;
  /**
   * 客户名称
   */
  customerName?: string;
  /**
   * 注册地址
   */
  registrationAddress?: string;
  /**
   * 注册地址-省份
   */
  registrationProvince?: string;
  /**
   * 注册地址-城市
   */
  registrationCity?: string;
  /**
   * 注册地址-区/县
   */
  registrationRegion?: string;
  /**
   * 企业状态
   */
  openState?: string;
  /**
   * 公司类型
   */
  companyType?: string;
  /**
   * 成立日期
   */
  establishmentDate?: string;
  /**
   * 法人姓名
   */
  artificialPerson?: string;
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
   * 经营地址(包含省市区)
   */
  fullOperatingAddress?: string;
}
interface IPlatformItem {
  /**
   * 平台id，再次编辑时回传字段
   */
  platformId?: string;
  /**
   * 平台类型描述
   */
  ecommercePlatformDesc?: string;
  /**
   * 电商平台类型枚举
   */
  ecommercePlatformType?: string;
  /**
   * 线索id
   */
  trackId?: string;
  shopInfoList: {
    /**
     * 店铺id，再次编辑的时候需要回传
     */
    trackShopId?: string;
    /**
     * 店铺名称
     */
    shopName?: string;
    /**
     * 店铺网址
     */
    shopUrl?: string;
    /**
     * 店铺等级
     */
    shopLevel?: string;
    /**
     * 口碑情况
     */
    shopStar?: string;
    /**
     * 店铺粉丝数
     */
    shopFans?: string;
    /**
     * 品牌名称
     */
    brandName?: string;
    /**
     * 主营品类
     */
    mainCategory?: Array<string[]>;
    /**
     * 最小售价
     */
    priceMin?: string;
    /**
     * 最大售价
     */
    priceMax?: string;
    /**
     * 月畅销款数
     */
    monthSellWell?: string;
    /**
     * 备注
     */
    remark?: string;
  }[];
}
interface IContactItem {
  /**
   * 客户联系人id
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
   * 微信联系
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
}
export interface IGetCluesDetailRes {
  /**
   * 客户线索id
   */
  trackId?: string;
  /**
   * 线索状态
   */
  trackState?: TRACK_STATE_ENUM;
  auditResult?: AUDIT_RESULT_ENUM;
  /**
   * 审核备注
   */
  auditRemark?: string;
  /**
   * 工商信息
   */
  businessInfoModel: IBusinessInfo;
  /**
   * 店铺信息
   */
  ecommercePlatformList: IPlatformItem[];
  /**
   * 联系信息
   */
  contactList: IContactItem[];
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

export interface IConfirmCluesReq {
  /**
   * 客户线索id,再次编辑时回传字段
   */
  trackId: string;
  /**
   * 工商信息
   */
  businessInfo: IBusinessInfo;
  /**
   * 电商平台列表
   */
  ecommercePlatformList: IPlatformItem[];
  /**
   * 联系信息
   */
  contactInfoList: IContactItem[];
}

export interface IConfirmCluesRes {
  /**
   * 客户线索id
   */
  customerTrackId?: string;
}

export interface IGetCluesAuditLogsRes {
  /**
   * 日志
   */
  logId?: string;
  /**
   * 业务id
   */
  buzId?: string;
  /**
   * 日志类型
   */
  logType?: AUDIT_LOG_TYPE_ENUM;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 创建人ID
   */
  creatorId?: string;
  /**
   * 创建人名称
   */
  creatorName?: string;
  /**
   * 创建时间
   */
  createdTime?: number;
}

export interface IBatchAuditCluesReq {
  /**
   * 客户线索id
   */
  trackIdList: string[];
  /**
   * 审核结果 1-审核通过 审核驳回：2-不符合画像 3-资料填写太少 4-其他原因
   */
  auditResult: AUDIT_RESULT_ENUM;
  /**
   * 审核备注
   */
  auditRemark: string;
}

export interface IGetCluesStatisticalReq {
  /**
   * 客户名称
   */
  customerName: string;
  /**
   * 审核结果 1-审核通过 审核驳回：2-不符合画像 3-资料填写太少 4-其他原因
   */
  auditResult: AUDIT_RESULT_ENUM | '';
  /**
   * 创建人名称
   */
  creatorName: string;
  /**
   * 创建开始时间
   */
  createdStartTime?: string;
  /**
   * 创建结束时间
   */
  createdEndTime?: string;
  /**
   * 主营品类
   */
   mainCategoryList?: Array<string[]>;
  /**
   * 月畅销款数
   */
  monthSellWell: string;
  /**
   * 最小售价
   */
  priceMin: string;
  /**
   * 最大售价
   */
  priceMax: string;
}

export interface IGetCluesStatisticalRes {
  /**
   * 线索状态
   */
  trackStateCountList: {
    /**
     * 数量统计
     */
    count: string;
    /**
     * 统计状态
     */
    trackState: TRACK_STATE_ENUM;
  }[];
}

export interface IGetCluesOperationLogsRes{
  /**
   * 日志
   */
   logId?: string;
   /**
    * 日志类型
    */
   buzType?: any;
   /**
    * 业务id
    */
   buzId?: string;
   /**
    * 日志类型
    */
   logType?: OPERATION_LOG_TYPE_ENUM;
   /**
    * 备注
    */
   remark?: string;
   /**
    * 创建人ID
    */
   creatorId?: string;
   /**
    * 创建人名称
    */
   creatorName?: string;
   /**
    * 创建时间
    */
   createdTime?: number;
}
