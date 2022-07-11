import {
  ABNORMAL_STATE_ENUM,
  REGISTER_STATE_ENUM,
  FEEDBACK_STATE_ENUM,
  OPERATION_LOG_TYPE_ENUM,
  VISIT_TYPE_ENUM,
  CUSTOMER_TYPE_ENUM,
} from '../constant';

/**
 * 拜访记录列表请求体
 */
export interface ICustomerVisitPageReq {
  /**
   * 拜访类型
   */
  visitType?: VISIT_TYPE_ENUM | '';
  /**
   * 客户名称
   */
  customerName?: string;
   /**
   * 签到开始时间
   */
  clockTimeStart?: string;
  /**
   * 签到结束时间
   */
  clockTimeEnd?: string;
  /**
   * 拜访人名称
   */
  visitPersonName?: string;
  /**
   * 登记状态
   */
  isRegister?: REGISTER_STATE_ENUM | '';
  pageNum: number;
  pageSize: number;
}

export interface ICustomerVisitPageResSummaryVosItem {
  /**
   * 总结id
   */
  summaryId: string;
  /**
   * 拜访主表id
   */
  visitId: string;
  /**
   * 总结类型(字典crm_visit_summary_type)
   */
  summaryType: string;
  /**
   * 总结类型名称
   */
  summaryTypeName: string;
  /**
   * 总结内容
   */
  summaryContent: string;
}
export interface ICustomerVisitDetailResContactVosItem {
  /**
   * 拜访联系信息id
   */
  contactId: string;
  /**
   * 拜访记录id
   */
  visitId: string;
  /**
   * 企业名称
   */
  enterpriseName: string;
  /**
   * 联系人名称
   */
  contactName: string;
  /**
   * 联系人电话
   */
  phone: string;
  /**
   * 联系人职务
   */
  post: string;
  /**
   * 联系微信号
   */
  wechatNumber: string;
}
/**
 * 拜访记录列表返回体
 */
export interface ICustomerVisitPageRes {
  page: string;
  total: string;
  list: {
    /**
     * 拜访记录id
     */
    visitId: string;
    /**
     * 拜访类型
     */
    visitType: VISIT_TYPE_ENUM;
    /**
     * 客户id
     */
    customerId: string;
    /**
     * 客户编码
     */
    customerCode: string;
    /**
     * 客户名称
     */
    customerName: string;
    /**
     * 客户类型
     */
    customerType: CUSTOMER_TYPE_ENUM;
    /**
     * 签到时间
     */
    clockTime: string;
    /**
     * 签到位置
     */
    clockAddress: string;
    /**
     * 签到经度
     */
    clockLongitude: string;
    /**
     * 签到纬度
     */
    clockLatitude: string;
    /**
     * 拜访人id
     */
    visitPersonId: string;
    /**
     * 拜访人员
     */
    visitPersonName: string;
    /**
     * 拜访登记时间
     */
    registerTime: string;
    /**
     * 拜访总结
     */
    visitSummary: string;
    /**
     * 是否超过签到距离 0 否 1是
     */
    isOutRange: string;
    /**
     * 反馈状态
     */
    isFeedback: FEEDBACK_STATE_ENUM;
    /**
     * 登记状态
     */
    isRegister: REGISTER_STATE_ENUM;
    /**
     * 异常状态
     */
    isAbnormal: ABNORMAL_STATE_ENUM;
    /**
     * 总结信息
     */
    summaryVos: ICustomerVisitPageResSummaryVosItem[];
    /**
     * 陪访人员信息
     */
    accompanyingVos: {
      /**
       * 主键id
       */
      accompanyingId: string;
      /**
       * 拜访记录id
       */
      visitId: string;
      /**
       * 拜访陪同人员id
       */
      personId: string;
      /**
       * 拜访陪同人员工号
       */
      personCode: string;
      /**
       * 拜访陪同人员姓名
       */
      personName: string;
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
      /**
       * 最近修改者ID
       */
      reviserId: string;
      /**
       * 修改人名称
       */
      reviserName: string;
      /**
       * 最近修改时间
       */
      revisedTime: string;
      /**
       * 逻辑删除 0 否 1是
       */
      isDeleted: string;
    }[];
    /**
     * 拜访签到图片
     */
    clockPictureList: string[];
    /**
     * 拜访登记图片
     */
    visitPictureList: string[];
  }[];
}

/**
 * 拜访信息请求体
 */
export interface ICustomerVisitDetailReq {
  /**
   * 拜访记录id
   */
  visitId?: string;
}

/**
 * 拜访信息返回体
 */
export interface ICustomerVisitDetailRes {
  customerVisitFeedbackVo: {
    /**
     * 主键id
     */
    feedbackId: string;
    /**
     * 反馈内容
     */
    feedbackContent: string;
    /**
     * 拜访id
     */
    visitId: string;
  };
  /**
   * 反馈信息图片
   */
  feedbackPictureList: string[];
  /**
   * 拜访记录id
   */
  visitId: string;
  /**
   * 拜访类型
   */
  visitType: string;
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 客户编码
   */
  customerCode: string;
  /**
   * 客户名称
   */
  customerName: string;
  /**
   * 客户类型
   */
  customerType: string;
  /**
   * 签到参考地址
   */
  referenceAddress: string;
  /**
   * 打卡时间
   */
  clockTime: string;
  /**
   * 打卡位置
   */
  clockAddress: string;
  /**
   * 打卡经度
   */
  clockLongitude: string;
  /**
   * 打卡纬度
   */
  clockLatitude: string;
  /**
   * 拜访人id
   */
  visitPersonId: string;
  /**
   * 拜访人名称
   */
  visitPersonName: string;
  /**
   * 拜访登记时间
   */
  registerTime: string;
  /**
   * 总结信息
   */
  summaryVos: ICustomerVisitPageResSummaryVosItem[];
  /**
   * 是否超过签到距离 0 否 1是
   */
  isOutRange: string;
  /**
   * 是否已经反馈 0 否 1是
   */
  isFeedback: string;
  /**
   * 是否已经登记 0 否 1是
   */
  isRegister: REGISTER_STATE_ENUM;
  /**
   * 是否异常 0 否 1是
   */
  isAbnormal: ABNORMAL_STATE_ENUM;
  /**
   * 陪访人员信息
   */
  accompanyingVos: {
    /**
     * 主键id
     */
    accompanyingId: string;
    /**
     * 拜访记录id
     */
    visitId: string;
    /**
     * 拜访陪同人员id
     */
    personId: string;
    /**
     * 拜访陪同人员工号
     */
    personCode: string;
    /**
     * 拜访陪同人员姓名
     */
    personName: string;
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
    /**
     * 最近修改者ID
     */
    reviserId: string;
    /**
     * 修改人名称
     */
    reviserName: string;
    /**
     * 最近修改时间
     */
    revisedTime: string;
    /**
     * 逻辑删除 0 否 1是
     */
    isDeleted: string;
  }[];
  /**
   * 拜访联系信息
   */
  contactVos: ICustomerVisitDetailResContactVosItem[];
  /**
   * 打卡图片
   */
  clockPictureList: string[];
  /**
   * 拜访照片
   */
  visitPictureList: string[];
}

/**
 * 拜访信息-异常反馈请求体
 */
export interface ICustomerVisitFeedbackReq {
  /**
   * 拜访记录id
   */
  visitId: string;
  /**
   * 反馈内容
   */
  feedbackContent: string;
  /**
   * 反馈照片文件
   */
  files?: {
    /**
     * URL地址
     */
    url?: string;
    /**
     * 文件名
     */
    name?: string;
  }[];
}

/**
 * 操作日志返回体
 */
export type IOperationLogGetOperationListRes = {
  /**
   * 日志
   */
  logId: string;
  /**
   * 日志类型
   */
  buzType: 'GROUP_LOG';
  /**
   * 业务id
   */
  buzId: string;
  /**
   * 日志类型
   */
  logType: OPERATION_LOG_TYPE_ENUM;
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
}[];
