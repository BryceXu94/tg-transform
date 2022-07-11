import { YES_OR_NO_NUMBER_ENUM } from '@/constant';
import {
  BILL_TYPE_ENUM,
  RECONCILE_STATUS_ENUM,
  RECOVERIES_STATUS_ENUM,
  EXPAND_STATUS_ENUM,
  OUTGOING_TYPE_ENUM,
  OPERATE_TYPE_ENUM,
  REPAY_STATUS_ENUM,
  DEDUCTION_PAYMENT_TYPE_ENUM,
  DEDUCTION_AND_BONUS_HANDLE_ENUM,
  DEDUCTION_STATUS_ENUM,
  BONUS_COLLECTION_TYPE_ENUM,
  RECEIPT_TYPE_ENUM,
  COLLECTION_AND_PAYMENT_TYPE_ENUM,
  RECEIPT_STATUDS_ENUM,
  RECEIPT_ACTUAL_STATUDS_ENUM,
  DELIVERY_TYPE_ENUM,
} from '../constant';
/**
 * 客户对账单列表请求体
 */
export interface IGetCustomerStatementListReq {
  /**
   * 客户名称
   */
  customerName?: string;
  /**
   * 客户账单号
   */
  billCode?: string;
  /**
   * 账单开始月份
   */
  billStartMonth?: string;
  /**
   * 账单结束月份
   */
  billEndMonth?: string;
  /**
   * 对账类型 1-自然月，2-合同月，3-订单签收
   */
  statementType?: OUTGOING_TYPE_ENUM | '';
  /**
   * 创建开始时间
   */
  createdStartTime?: string;
  /**
   * 创建结束时间
   */
  createdEndTime?: string;
  /**
   * bd名称【销售BD】
   */
  bdName?: string;
  /**
   * 账单类型 1-普通账单 2-金融账单
   */
  billType?: BILL_TYPE_ENUM | '';
  /**
   * 对账状态 10-待对账（内部），20待对账（客户），30-已对账，40-已驳回，50-已取消
   */
  statementState?: RECONCILE_STATUS_ENUM | '';
  /**
   * 回款状态 10-待回款，20-部分回款，30-已回款
   */
  paybackState?: RECOVERIES_STATUS_ENUM | '';
  /**
   * 支用状态 10-待支用，20-支用中，30-已支用，40-支用失败 (金融)
   */
  supportState?: EXPAND_STATUS_ENUM | '';
  /**
   * 是否逾期 0-不逾期，1-逾期
   */
  isOverdue: YES_OR_NO_NUMBER_ENUM | '';
  /**
   * 区域编码
   */
  regionCode?: string;
  /**
   * cm名称
   */
  cmName?: string;
  /**
   * 当前查询的页码
   */
  pageNum: number;
  /**
   * 当前查询单页的数据量
   */
  pageSize: number;
}

/**
 * 客户对账单列表返回体
 */
export interface IGetCustomerStatementListRes {
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
     * 账单id
     */
    billId: string;
    /**
     * 客户账单号
     */
    billCode: string;
    /**
     * 账单月份
     */
    billMonth: string;
    /**
     * 账单类型 1-普通账单 2-金融账单
     */
    billType: BILL_TYPE_ENUM;
    /**
     * 客户名称
     */
    customerName: string;
    /**
     * 对账类型 1-自然月，2-合同月，3-订单签收
     */
    statementType: string;
    /**
     * 账单金额
     */
    billAmount: string;
    /**
     * 已回款金额
     */
    paybackAmount: string;
    /**
     * 待回款金额
     */
    waitPaybackAmount: string;
    /**
     * bd名称【销售BD】
     */
    bdName: string;
    /**
     * 审核人员
     */
    auditOperator: string;
    /**
     * 生产跟单人名称
     */
    merchandiserName: string;
    /**
     * 对账状态 10-待对账（内部），20待对账（客户），30-已对账，40-已驳回，50-已取消
     */
    statementState: RECONCILE_STATUS_ENUM;
    /**
     * 回款状态 10-待回款，20-部分回款，30-已回款
     */
    paybackState: RECOVERIES_STATUS_ENUM;
    /**
     * 支用状态 10-待支用，20-支用中，30-已支用，40-支用失败 (金融)
     */
    supportState: EXPAND_STATUS_ENUM;
    /**
     * 创建时间
     */
    createdTime: number;
    /**
     * 是否逾期 0-不逾期，1-逾期
     */
    isOverdue: YES_OR_NO_NUMBER_ENUM;
    /**
     * 所在区域名称
     */
    regionName: string;
    /**
     * 已收定金
     */
    preReceiptAmount: string;
    /**
     * cm名称
     */
    cmName: string;
  }[];
}

/**
 * 更改账单类型请求体
 * yapi地址：https://yapi.ibaibu.com/project/2286/interface/api/131246
 */
export interface IUpdateCustomerStatementTypeReq {
  /**
   * 账单id
   */
  billId: string;
  /**
   * 账单类型
   */
  billType: BILL_TYPE_ENUM | '';
}

/**
 * 客户对账单详情返回体
 */
export interface IGetCustomerStatementDetailRes {
  /**
   * 收款账号、对账单表头
   */
  collectingAccount: string;
  /**
   * 客户名称
   */
  customerName: string;
  /**
   * 客户账单号
   */
  billCode: string;
  /**
   * 对账类型 1-自然月，2-合同月，3-订单签收
   */
  statementType: string;
  /**
   * 账单类型 1-普通账单 2-金融账单
   */
  billType: BILL_TYPE_ENUM;
  /**
   * 对账周期开始时间
   */
  billStartTime: number;
  /**
   * 对账周期结束时间
   */
  billEndTime: number;
  /**
   * 账单金额
   */
  billAmount: string;
  /**
   * 对账状态 10-待对账（内部），20待对账（客户），30-已对账，40-已驳回，50-已取消
   */
  statementState: RECONCILE_STATUS_ENUM;
  /**
   * 回款状态 10-待回款，20-部分回款，30-已回款
   */
  paybackState: RECOVERIES_STATUS_ENUM;
  /**
   * 支用状态 10-待支用，20-支用中，30-已支用，40-支用失败 (金融)
   */
  supportState: EXPAND_STATUS_ENUM;
  /**
   * 对账单详情
   */
  details: {
    /**
     * 制单号
     */
    manufacturingOrderCode: string;
    /**
     * 客户款号
     */
    customerStyleNumber: string;
    /**
     * 款式品类code(分类以"-"隔开)（如：code1-code2-code3）
     */
    categoryCode: string;
    /**
     * 款式品类名(分类以"-"隔开)（如：女装-上装-T恤）
     */
    categoryName: string;
    /**
     * 批次
     */
    batchNo: string;
    /**
     * 颜色
     */
    color: string;
    /**
     * 订单数量
     */
    orderCount: string;
    /**
     * 发货数量
     */
    deliveryCount: string;
    /**
     * 结算单价
     */
    settlePrice: string;
    /**
     * 总货款
     */
    goodsAmount: string;
    /**
     * 实际收货日期
     */
    realReceiptDate: number;
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
     * 已收定金
     */
    preReceiptAmount: string;
    /**
     * 已回货款
     */
    receiptedAmount: string;
    /**
     * 备注
     */
    remark: string;
  }[];
}

/**
 * 客户对账单确认/驳回请求体
 * yapi地址：https://yapi.ibaibu.com/project/2286/interface/api/131251
 */
export interface IConfirmOrRejectStatementReq {
  /**
   * 账单id
   */
  billId: string;
  /**
   * 操作类型
   */
  operate: OPERATE_TYPE_ENUM;
}

// 操作日志返回体
export interface IGetLogListRes {
  /**
   * 日志类型
   */
  logType: OPERATE_TYPE_ENUM;
  /**
   * 操作人类型
   */
  operatorType: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 操作人名字
   */
  creatorName: string;
  /**
   * 操作时间
   */
  createdTime: number;
}

/**
 * 账单信息返回体
 */
// 子账单列表
export interface IBillSubListItem {
  /**
   * 账单详情id
   */
  billDetailId: string;
  /**
   * 子账单号
   */
  billDetailCode: string;
  /**
   * 订单号
   */
  saleOrderCode: string;
  /**
   * 制单号
   */
  manufacturingOrderCode: string;
  /**
   * 客户款号
   */
  customerStyleNumber: string;
  /**
   * 订单数量
   */
  orderCount: string;
  /**
   * 发货数量
   */
  deliveryCount: string;
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
   * 已收定金
   */
  preReceiptAmount: string;
  /**
   * 已回货款
   */
  receiptedAmount: string;
  /**
   * 待回货款 = 实际结算货款-已收定金-已回货款
   */
  pendingReceiptedAmount: string;
  /**
   * 回款状态 10-待回款，20-部分回款，30-已回款
   */
  paybackState: RECOVERIES_STATUS_ENUM;
}

// 客户扣款列表
export interface IBillDeductionListItem {
  /**
   * 子帐单id
   */
  billDetailId: string;
  /**
   * 子账单号
   */
  billDetailCode: string;
  /**
   * 订单号
   */
  saleOrderCode: string;
  /**
   * 制单号
   */
  manufacturingOrderCode: string;
  /**
   * 客户款号
   */
  customerStyleNumber: string;
  /**
   * 奖励收付类型:1-其他加款，2-客户奖励，3-包装辅料代采
   * 扣款收付类型:1-大货质量扣款、2-大货延期扣款，3-包装辅料费用，4-客户打折收货
   */
  prType: DEDUCTION_PAYMENT_TYPE_ENUM;
  /**
   * 扣款登记日期
   */
  recordDate: number;
  /**
   * 扣款/奖励金额
   */
  amount: string;
  /**
   * 扣款/奖励原因
   */
  reason: string;
  /**
   * 扣款/奖励处理方式: 11-线下退款，12-账单扣款，21-线下付款，22-账单加款
   */
  processType: DEDUCTION_AND_BONUS_HANDLE_ENUM;
  /**
   * 凭证图片url
   */
  voucherUrls: string[];
  /**
   * 记录人名字
   */
  recordName: string;
  /**
   * 0-未提交；1-待确认；2-已确认；3-驳回
   */
  state: DEDUCTION_STATUS_ENUM;
}

// 客户奖励列表
export interface IBillBonusListItem {
  /**
   * 子帐单id
   */
  billDetailId: string;
  /**
   * 子账单号
   */
  billDetailCode: string;
  /**
   * 订单号
   */
  saleOrderCode: string;
  /**
   * 制单号
   */
  manufacturingOrderCode: string;
  /**
   * 客户款号
   */
  customerStyleNumber: string;
  /**
   * 奖励收付类型:1-其他加款，2-客户奖励，3-包装辅料代采
   * 扣款收付类型:1-大货质量扣款、2-大货延期扣款，3-包装辅料费用，4-客户打折收货
   */
  prType: BONUS_COLLECTION_TYPE_ENUM;
  /**
   * 扣款登记日期
   */
  recordDate: number;
  /**
   * 扣款/奖励金额
   */
  amount: string;
  /**
   * 扣款/奖励原因
   */
  reason: string;
  /**
   * 扣款/奖励处理方式: 11-线下退款，12-账单扣款，21-线下付款，22-账单加款
   */
  processType: DEDUCTION_AND_BONUS_HANDLE_ENUM;
  /**
   * 凭证图片url
   */
  voucherUrls: string[];
  /**
   * 记录人名字
   */
  recordName?: string;
  /**
   * 0-未提交；1-待确认；2-已确认；3-驳回
   */
  state: DEDUCTION_STATUS_ENUM;
}

// 收款明细列表
export interface IBillDetailListItem {
  /**
   * 记录ID
   */
  receiptBillId: string;
  /**
   * 收款单号
   */
  receiptCode: string;
  /**
   * 子账单编码
   */
  billDetailCode: string;
  /**
   * 订单号
   */
  saleOrderCode: string;
  /**
   * 制单号
   */
  manufacturingOrderCode: string;
  /**
   * 客户款号
   */
  customerStyleNumber: string;
  /**
   * 收款单类型：1-预收款单，2-收款单
   */
  receiptType: RECEIPT_TYPE_ENUM;
  /**
   * 收付类型:1供应商退款,2大货回款
   */
  prType: COLLECTION_AND_PAYMENT_TYPE_ENUM;
  /**
   * 应收款日期
   */
  receivableDate: number;
  /**
   * 申请人名字
   */
  applicantName: string;
  /**
   * 实际收款日期
   */
  actualReceiptDate: number;
  /**
   * 收款比例
   */
  receiptPercent: string;
  /**
   * 收款金额
   */
  receiptAmount: string;
  /**
   * 实际收款金额ReceiptBillSyncDto
   */
  actualReceiptAmount: string;
  /**
   * 收款单状态：1-未提交，2-已提交，3-已确认，4-已作废
   */
  receiptState: RECEIPT_STATUDS_ENUM;
  /**
   * 实际收款单状态 1 待确认 2 已确认 -1作废 -2 超时取消
   */
  actualReceiptState: RECEIPT_ACTUAL_STATUDS_ENUM;
  /**
   * 收款备注
   */
  receiptRemark: string;
}
export interface IGetCustomerBillDetailRes {
  /**
   * id
   */
  billId?: string;
  /**
   * 客户账单号
   */
  billCode?: string;
  /**
   * 账单月份
   */
  billMonth?: string;
  /**
   * 客户名称
   */
  customerName?: string;
  /**
   * 对账类型 1-订单，2-自然月
   */
  statementType?: OUTGOING_TYPE_ENUM;
  /**
   * 出账日
   */
  chargeOffDate?: string;
  /**
   * 对账周期开始时间
   */
  billStartTime?: number;
  /**
   * 对账周期结束时间
   */
  billEndTime?: number;
  /**
   * 账单金额
   */
  billAmount?: string;
  /**
   * 总货款
   */
  goodsAmount?: string;
  /**
   * 应收金额
   */
  preAmount?: string;
  /**
   * 已收定金
   */
  preReceiptAmount?: string;
  /**
   * 扣款金额
   */
  deductAmount?: string;
  /**
   * 其它收款
   */
  otherReceiptAmount?: string;
  /**
   * 实际结算货款
   */
  actualSettleGoodsAmount?: string;
  /**
   * 逾期日期（金融）
   */
  overdueDate?: number;
  /**
   * 对账状态 10-待对账（内部），20待对账（客户），30-已对账，40-已驳回，50-已取消
   */
  statementState?: RECONCILE_STATUS_ENUM;
  /**
   * 回款状态 10-待回款，20-部分回款，30-已回款
   */
  paybackState?: RECOVERIES_STATUS_ENUM;
  /**
   * 创建时间
   */
  createdTime?: number;
  /**
   * 已回款金额
   */
  paybackAmount?: string;
  /**
   * 待回款金额
   */
  waitPaybackAmount?: string;
  /**
   * 还款状态 1-待还款，2-部分还款，3-已还款
   */
  repayState?: REPAY_STATUS_ENUM;
  /**
   * PIMS的建单时间
   */
  pimsCreatedTime?: number;
  /**
   * 子帐单
   */
  subBill: IBillSubListItem[];
  /**
   * 客户扣款
   */
  deducts: IBillDeductionListItem[];
  /**
   * 客户奖励
   */
  rewards: IBillBonusListItem[];
  /**
   * 账单明细
   */
  receipts: IBillDetailListItem[];
}

/**
 * 子账单明细返回体
 */
// 客户扣款列表
export interface ISubBillDeductionListItem {
  /**
   * 子帐单id
   */
  billDetailId: string;
  /**
   * 子账单号
   */
  billDetailCode: string;
  /**
   * 订单号
   */
  saleOrderCode: string;
  /**
   * 制单号
   */
  manufacturingOrderCode: string;
  /**
   * 客户款号
   */
  customerStyleNumber: string;
  /**
   * 奖励收付类型:1-其他加款，2-客户奖励，3-包装辅料代采
   * 扣款收付类型:1-大货质量扣款、2-大货延期扣款，3-包装辅料费用，4-客户打折收货
   */
  prType: DEDUCTION_PAYMENT_TYPE_ENUM;
  /**
   * 扣款登记日期
   */
  recordDate: number;
  /**
   * 扣款/奖励金额
   */
  amount: string;
  /**
   * 扣款/奖励原因
   */
  reason: string;
  /**
   * 扣款/奖励处理方式: 11-线下退款，12-账单扣款，21-线下付款，22-账单加款
   */
  processType: DEDUCTION_AND_BONUS_HANDLE_ENUM;
  /**
   * 凭证图片url
   */
  voucherUrls: string[];
  /**
   * 记录人名字
   */
  recordName: string;
  /**
   * 0-未提交；1-待确认；2-已确认；3-驳回
   */
  state: DEDUCTION_STATUS_ENUM;
}
// 客户奖励列表
export interface ISubBillBonusListItem {
  /**
   * 子帐单id
   */
  billDetailId: string;
  /**
   * 子账单号
   */
  billDetailCode: string;
  /**
   * 订单号
   */
  saleOrderCode: string;
  /**
   * 制单号
   */
  manufacturingOrderCode: string;
  /**
   * 客户款号
   */
  customerStyleNumber: string;
  /**
   * 奖励收付类型:1-其他加款，2-客户奖励，3-包装辅料代采
   * 扣款收付类型:1-大货质量扣款、2-大货延期扣款，3-包装辅料费用，4-客户打折收货
   */
  prType: BONUS_COLLECTION_TYPE_ENUM;
  /**
   * 扣款登记日期
   */
  recordDate: number;
  /**
   * 扣款/奖励金额
   */
  amount: string;
  /**
   * 扣款/奖励原因
   */
  reason: string;
  /**
   * 扣款/奖励处理方式: 11-线下退款，12-账单扣款，21-线下付款，22-账单加款
   */
  processType: string;
  /**
   * 凭证图片url
   */
  voucherUrls: string[];
  /**
   * 记录人名字
   */
  recordName: string;
  /**
   * 0-未提交；1-待确认；2-已确认；3-驳回
   */
  state: DEDUCTION_STATUS_ENUM;
}
// 收款明细列表
export interface ISubBillCollectionListItem {
  /**
   * 记录ID
   */
  receiptBillId: string;
  /**
   * 收款单号
   */
  receiptCode: string;
  /**
   * 子账单编码
   */
  billDetailCode: string;
  /**
   * 订单号
   */
  saleOrderCode: string;
  /**
   * 制单号
   */
  manufacturingOrderCode: string;
  /**
   * 客户款号
   */
  customerStyleNumber: string;
  /**
   * 收款单类型：1-预收款单，2-收款单
   */
  receiptType: RECEIPT_TYPE_ENUM;
  /**
   * 收付类型:1供应商退款,2大货回款
   */
  prType: COLLECTION_AND_PAYMENT_TYPE_ENUM;
  /**
   * 应收款日期
   */
  receivableDate: number;
  /**
   * 申请人名字
   */
  applicantName: string;
  /**
   * 实际收款日期
   */
  actualReceiptDate: number;
  /**
   * 收款比例
   */
  receiptPercent: string;
  /**
   * 收款金额
   */
  receiptAmount: string;
  /**
   * 实际收款金额ReceiptBillSyncDto
   */
  actualReceiptAmount: string;
  /**
   * 收款单状态：1-未提交，2-已提交，3-已确认，4-已作废
   */
  receiptState: RECEIPT_STATUDS_ENUM;
  /**
   * 实际收款单状态 1 待确认 2 已确认 -1作废 -2 超时取消
   */
  actualReceiptState: RECEIPT_ACTUAL_STATUDS_ENUM;
  /**
   * 收款备注
   */
  receiptRemark: string;
}
// 发货明细列表
export interface ISubBillShipListItem {
  /**
   * 发货/退货单号
   */
  deliveryReturnCode: string;
  /**
   * 记录类型：1-发货，2-退货
   */
  type: DELIVERY_TYPE_ENUM;
  /**
   * 生产跟单人名称
   */
  merchandiserName: string;
  /**
   * 批次
   */
  batchNo: string;
  /**
   * 颜色
   */
  color: string;
  /**
   * 尺码信息json，格式：[{"size":"M","num":"80","sizeSort":"1"},{"size":"L","num":"90","sizeSort":"2"}]
   */
  sizeDetail: string;
  /**
   * 数量合计
   */
  totalCount: string;
  /**
   * 订单单价
   */
  orderPrice: string;
  /**
   * 异议申请单价
   */
  applyPrice: string;
  /**
   * 金额小计
   */
  deliveryAmount: string;
  /**
   * 要求交期
   */
  requiredDeliveryDate: number;
  /**
   * 实际交期
   */
  actualDeliveryDate: number;
}
export interface IGetCustomerSubBillDetailRes {
  /**
   * 子账单号
   */
  billDetailCode?: string;
  /**
   * 制单号
   */
  manufacturingOrderCode?: string;
  /**
   * 订单code
   */
  saleOrderCode?: string;
  /**
   * 生产款号
   */
  styleNumber?: string;
  /**
   * 客户款号
   */
  customerStyleNumber?: string;
  /**
   * 客户扣款
   */
  deducts: ISubBillDeductionListItem[];
  /**
   * 客户奖励
   */
  rewards: ISubBillBonusListItem[];
  /**
   * 收款明细
   */
  receipts: ISubBillCollectionListItem[];
  /**
   * 发货明细
   */
  deliveryReturns: ISubBillShipListItem[];
  /**
   * 尺码顺序
   */
  sizeSort: string[];
}
