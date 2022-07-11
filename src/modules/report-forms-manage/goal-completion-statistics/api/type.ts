/**
 * 目标完成统计请求体
 */
export interface IFinishStatsPageReq {
  /**
   * 创建人
   */
  creatorName?: string;
  /**
   * 客户id
   */
  customerId?: string;
  /**
   * 生效开始日期
   */
  effectiveBeginDate?: string;
  /**
   * 生效结束日期
   */
  effectiveEndDate?: string;
  /**
   * 当前查询的页码
   */
  pageNum?: number;
  /**
   * 当前查询单页的数据量
   */
  pageSize?: number;
}

export interface IFinishStatsPageResListItem {
  /**
   * 目标id
   */
  targetId: string;
  /**
   * 目标名称
   */
  targetName: string;
  /**
   * 目标类型：1-接单GMV 2-回款金额
   */
  targetType: string;
  /**
   * 目标值
   */
  targetValue: string;
  /**
   * 目标单位
   */
  targetUnit: string;
  /**
   * 设置人
   */
  creatorName: string;
  /**
   * 区域
   */
  regionName: string;
  /**
   * 所属部门
   */
  orgName: string;
  /**
   * 设置对象
   */
  objectiveName: string;
  /**
   * 生效周期
   */
  effectivePeriod: 'NEXT_DAY' | 'THIS_WEEK' | 'NEXT_WEEK' | 'THIS_MONTH' | 'NEXT_MONTH';
  /**
   * 生效开始日期
   */
  effectiveBeginDate: string;
  /**
   * 目标完成额度
   */
  completedAmount: string;
  /**
   * 目标完成百分比
   */
  completedPercent: string;
  /**
   * 是否达标, 0-未完成，1-已完成
   */
  isAttainment: string;
}

/**
 * 目标完成统计返回体
 */
export interface IFinishStatsPageRes {
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
  list: IFinishStatsPageResListItem[];
}
