import { IGetCustomerStatementDetailRes } from '../../api/types';
import { RECOVERIES_STATUS_ENUM } from '../../constant';

export type IListItem = IGetCustomerStatementDetailRes['details'][0]
export interface IStatementListItem extends IListItem {
  groupSize: number;
}

// 汇总列表项
export interface IBillSummaryListItem {
  /**
   * 总货款
   */
  goodsAmount: string;
  /**
   * 扣款金额
   */
  deductAmount: string;
  /**
   * 其它收款
   */
  otherReceiptAmount: string;
  /**
   * 实际结算货款
   */
  actualSettleGoodsAmount: string;
  /**
   * 账单金额
   */
  billAmount: string;
  /**
   * 应收金额
   */
  preAmount: string;
  /**
   * 已收定金
   */
  preReceiptAmount: string;
  /**
   * 已回款金额
   */
  paybackAmount: string;
  /**
   * 待回款金额
   */
  waitPaybackAmount: string;
  /**
   * 回款状态 10-待回款，20-部分回款，30-已回款
   */
  paybackState?: RECOVERIES_STATUS_ENUM | '';
}
