import { DAYS_UNIT_ENUM } from '../constant';
/**
 * 天工金条列表请求体
 */
export interface IGetTgoBullionListReq {
  /**
   * 客户名称
   */
  customerName?: string;
  /**
   * 区域编码
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

/**
 * 天工金条列表返回体
 */
export interface IGetTgoBullionListRes {
  /**
   * 当前页码, 主要给 web 端做分页校验
   */
  page: number;
  /**
   * 总数据量
   */
  total: number;
  list: {
    /**
     * 客户名称
     */
    customerName: string;
    /**
     * 总额度
     */
    setingAmount: string;
    /**
     * 可用额度
     */
    creditUsableAmount: string;
    /**
     * 锁定额度
     */
    creditCheckAmount: string;
    /**
     * 已用额度
     */
    creditUsedAmount: string;
    /**
     * 贷款期限值
     */
    days: string;
    /**
     * 贷款期限单位 1:天 2：月
     */
    deadline: DAYS_UNIT_ENUM;
    /**
     * 区域名称
     */
    regionName: string;
  }[];
}
