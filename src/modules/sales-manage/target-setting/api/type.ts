/**
 * 目标列表
 * yapi地址：https://yapi.ibaibu.com/project/2226/interface/api/157369
 */

/**
 * 设置范围
 */
export const enum ObjectiveTypeEnum {
  /**
   * 1
   */
  INNER_OBJECTIVE = 'INNER_OBJECTIVE',
  /**
   * 2
   */
  OUTER_OBJECTIVE = 'OUTER_OBJECTIVE'
}

/**
 * 目标类型
 */
export const enum TargetTypeEnum {
  /**
   * 1
   */
  ORDER_GMV = 'ORDER_GMV',
  /**
   * 2
   */
  PAYBACK_AMOUNT = 'PAYBACK_AMOUNT'
}

/**
 * 生效周期
 */
export const enum EffectivePeriodEnum {
  /**
   * next_day
   */
  NEXT_DAY = 'NEXT_DAY',
  /**
   * this_week
   */
  THIS_WEEK = 'THIS_WEEK',
  /**
   * next_week
   */
  NEXT_WEEK = 'NEXT_WEEK',
  /**
   * this_month
   */
  THIS_MONTH = 'THIS_MONTH',
  /**
   * next_month
   */
  NEXT_MONTH = 'NEXT_MONTH'
}

export interface ISaleTargetSaveReqObjectiveListItem {
  /**
   * 设置对象名称
   */
  objectiveName?: string;
  /**
   * 设置对象id
   */
  objectiveId?: string;
  /**
   * 类型：1个人，2组织，3客户
   */
  type?: string;
  /**
   * 组织路径
   */
  objectiveOrgPath?: string;
  /**
   * 部门负责人id
   */
  orgManagerId?: string;
}

// 目标状态
export enum TARGET_STATUS_ENUM {
  /** 未生效 */
  NOT_EFFECTIVE= '1',
  /** 生效中 */
  EFFECTIVE_PADDING = '2',
  /** 已失效 */
  EXPIRED = '3',
  /** 已撤销 */
  RESCINDED = '4'
}
export interface ISaleTargetPageReq {
  /**
   * 生效状态： 查全部则不传
   */
  effectiveState?: TARGET_STATUS_ENUM | string;
  /**
   * 对象名称
   */
  objectiveName?: string;
  /**
   * 目标类型
   */
  targetType?: TargetTypeEnum | string;
  /**
   * 创建人
   */
  creatorName?: string;
  /**
   * 创建时间：开始日期
   */
  createdBeginDate?: string;
  /**
   * 创建时间：结束日期
   */
  createdEndDate?: string;
  /**
   * 生效时间：开始日期
   */
  effectiveBeginDate?: string;
  /**
   * 生效时间：结束日期
   */
  effectiveEndDate?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface ISaleTargetPageResListItem {
  /**
   * 目标id
   */
  targetId?: string;
  /**
   * 目标名称
   */
  targetName?: string;
  /**
   * 目标类型：1-接单GMV 2-回款金额
   */
  targetType?: string;
  /**
   * 目标值
   */
  targetValue?: string;
  /**
   * 目标单位
   */
  targetUnit?: string;
  /**
   * 生效状态
   */
  effectiveState?: TARGET_STATUS_ENUM;
  /**
   * 设置时间
   */
  createdTime?: number;

  /**
   * 设置人
   */
  creatorName?: string;
  /**
   * 设置id
   */
  creatorId?: string;
  /**
   * 设置范围
   */
  objectiveType?: ObjectiveTypeEnum;
  /**
   * 设置对象
   */
   objectiveList?: ISaleTargetSaveReqObjectiveListItem[];
  /**
   * 生效周期
   */
  effectivePeriod?: EffectivePeriodEnum;
  /**
   * 生效开始日期
   */
  effectiveBeginDate?: number;
}

export interface ISaleTargetPageRes {
  page?: number;
  total?: number;
  list?: ISaleTargetPageResListItem[];
}
/**
 * 设置目标
 * yapi地址：https://yapi.ibaibu.com/project/2226/interface/api/157353
 */
export interface ISaleTargetSaveReq {
  /**
   * 目标主键ID
   */
  targetId?: string;
  /**
   * 目标名称
   */
  targetName: string;
  /**
   * 目标类型：1-接单GMV, 2-回款金额
   */
  targetType: string;
  /**
   * 设置范围：1-内部对象，2-外部对象
   */
  objectiveType: string;
  /**
   * 设置部门Id
   */
  objectiveOrgId?: string;
  /**
   * 设置部门名称
   */
  objectiveOrgName?: string;
  /**
   * 设置对象
   */
  objectiveList: ISaleTargetSaveReqObjectiveListItem[];
  /**
   * 目标值
   */
  targetValue: string;
  /**
   * 目标单位
   */
  targetUnit: string;
  /**
   * 生效周期
   */
  effectivePeriod: EffectivePeriodEnum | string;
  /**
   * 变更原因
   */
  reason?: string;
}
export type ISaleTargetSaveRes = null;

/**
 * 根据组织Id,查询直接下级组织列表和当前节点下的员工信息
 * yapi地址：https://yapi.ibaibu.com/project/2226/interface/api/157385
 */
export interface ISaleTargetNextOrgAndUserReq {
  /**
   * 组织id
   */
  orgId: string;
  /**
   * 对象名称,模糊搜索
   */
  objectiveName: string;
  pageNum?: number;
  pageSize?: number;
}

export interface ISaleTargetNextOrgAndUserResListItem {
  /**
   * 设置对象名称
   */
  objectiveName?: string;
  /**
   * 设置对象id
   */
  objectiveId?: string;
  /**
   * 类型：1-个人，2组织
   */
  type?: string;
  /**
   * 部门路径
   */
  objectiveOrgPath?: string;
}
export interface ISaleTargetNextOrgAndUserRes {
  page?: number;
  total?: number;
  list?: ISaleTargetNextOrgAndUserResListItem[];
}

export interface ISaleTargetManageOrgResItem {
  orgId?: string;
  orgName?: string;
}
export type ISaleTargetManageOrgRes = ISaleTargetManageOrgResItem[];

export interface IV1SaleTargetResRecordListItem {
  /**
   * 目标变更id
   */
  targetRecordId?: string;
  /**
   * 变更内容
   */
  changeContent?: string;
  /**
   * 变更时效
   */
  effectiveState?: string;
  /**
   * 变更原因
   */
  reason?: string;
  /**
   * 审核状态
   */
  auditState?: string;
  /**
   * 审核备注
   */
  remark?: string;
  /**
   * 审核人
   */
  auditor?: string;
  /**
   * 审核时间
   */
  auditTime?: number;
  /**
   * 操作时间
   */
  createdTime?: number;
  /**
   * 操作人
   */
  operator?: string;
}

export interface IV1SaleTargetResObjectiveListItem {
  /**
   * 设置对象名称
   */
  objectiveName?: string;
  /**
   * 设置对象id
   */
  objectiveId?: string;
  /**
   * 类型：1个人，2组织，3客户
   */
  type?: string;
  /**
   * 组织路径
   */
  objectiveOrgPath?: string;
  /**
   * 部门负责人id
   */
  orgManagerId?: string;
}

export interface IV1SaleTargetRes {
  /**
   * 目标id
   */
  targetId?: string;
  /**
   * 目标名称
   */
  targetName?: string;
  /**
   * 目标类型：1-接单GMV
   */
  targetType?: string;
  /**
   * 设置范围：1-内部对象，2-外部对象
   */
  objectiveType?: string;
  /**
   * 设置部门Id
   */
  objectiveOrgId?: string;
  /**
   * 设置部门名称
   */
  objectiveOrgName?: string;
  /**
   * 设置对象
   */
  objectiveList?: IV1SaleTargetResObjectiveListItem[];
  /**
   * 目标值
   */
  targetValue?: string;
  /**
   * 目标单位
   */
  targetUnit?: string;
  /**
   * 生效周期
   */
  effectivePeriod?: EffectivePeriodEnum;
  /**
   * 生效开始日期
   */
  effectiveBeginDate?: number;
  /**
   * 生效状态
   */
  effectiveState?: TARGET_STATUS_ENUM;
  /**
   * 审核状态
   */
  auditState?: string;
  /**
   * 设置时间
   */
  createdTime?: number;
  /**
   * 设置人
  */
  creatorName?: string;
   creatorId?: string;
  /**
   * 修改记录
   */
  recordList?: IV1SaleTargetResRecordListItem[];
}
