import { AUDIT_STATE_ENUM } from '@/modules/customer-manage/develop-plan/constant';
import { BUSINESS_MODE_NO_ENUM } from '@/constant/global';

export interface IColumnCustomerInfoPageReq {
  /**
   * 客户名称 模糊搜索
   */
  columnCustomerName?: string;
  /**
   * 列名审核状态
   */
  auditState: AUDIT_STATE_ENUM | '';
  /**
   * 创建开始时间
   */
  createdTimeBegin?: string;
  /**
   * 创建结束时间
   */
  createdTimeEnd?: string;
  /**
   * 创建人名称-模糊搜索
   */
  creatorName?: string;
  /**
   * 创建人id
   */
  creatorId?: string;
  pageNum: number;
  pageSize: number;
}
export interface IColumnCustomerInfoPageListItem {
  /**
   * 列名客户id（主键）
   */
  columnCustomerId: string;
  /**
   * 列名名称
   */
  columnCustomerName: string;
  /**
   * 社会统一征信代码
   */
  socialCreditCode: string;
  /**
   * 业务模式，1-自营业务，2-平台业务
   */
  businessType: BUSINESS_MODE_NO_ENUM;
  /**
   * 列名审核结果，0-未标记，1-列名通过，2-列名剔除
   */
  auditState: AUDIT_STATE_ENUM;
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
}
export interface IColumnCustomerInfoPageRes {
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
  list: IColumnCustomerInfoPageListItem[];
}

export type IColumnCustomerInfoListResItem = {
  /**
   * 列名审核记录id
   */
  columnAuditId: string;
  /**
   * 列名客户id
   */
  columnCustomerId: string;
  /**
   * 列名结果，1-列名通过，2-列名剔除
   */
  auditState: AUDIT_STATE_ENUM;
  auditorCode: string;
  /**
   * 备注信息
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
