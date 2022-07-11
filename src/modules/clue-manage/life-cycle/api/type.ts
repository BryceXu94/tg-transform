import { LIFE_CYCLE_STEP_CODE_ENUM } from '../constant';

export interface IGetCluesLifeCycleBarDataReq {
  /** 是否是区域的负责人 */
  isManager: boolean;
  /**
   * 销售id
   */
   userIds: string[];
  /**
   * 对比时间前者开始时间
   */
  formerBeginDate?: string;
  /**
   * 对比时间前者结束时间
   */
  formerEndDate?: string;
  /**
   * 对比时间后者开始时间
   */
  latterBeginDate?: string;
  /**
   * 对比时间后者结束时间
   */
  latterEndDate?: string;
}
export interface IGetCluesLifeCycleBarDataRes {
  /**
   * 生命周期
   * 按排序返回
   */
  lifeCycleList: {
    /**
     * 生命这期前置明细
     */
    formerList: {
      /**
       * 统计数量
       */
      count: string;
      /**
       * 统计描述
       */
      desc: string;
    }[];
    /**
     * 生命这期后者明细
     */
    latterList: {
      /**
       * 统计数量
       */
      count: string;
      /**
       * 统计描述
       */
      desc: string;
    }[];
    /**
     * 阶段枚举
     */
    lifeCycleStepCode: LIFE_CYCLE_STEP_CODE_ENUM;
    /**
     * 阶段枚举描述
     */
    lifeCycleStepDesc: string;
  }[];
}

export interface IGetCluesLifeCycleFunnelDataReq {
  /** 是否是区域的负责人 */
  isManager: boolean;
  /**
   * 销售id
   */
   userIds?: string[];
  /**
   * 开始日期
   */
  beginDate?: string;
  /**
   * 结束日期
   */
  endDate?: string;
}

export interface IGetCluesLifeCycleFunnelDataRes {
  lifeCycleModelList: {
    /**
     * 数量
     */
    totalCount: string;
    /**
     * 阶段枚举
     */
    lifeCycleStepCode: LIFE_CYCLE_STEP_CODE_ENUM;
    /**
     * 阶段枚举描述
     */
    lifeCycleStepDesc: string;
    /**
     * 明细
     */
    lifeCycleDetailList: {
      /**
       * 统计数量
       */
      count: string;
      /**
       * 统计描述
       */
      desc: string;
    }[];
  }[];
}

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
