import { computed } from 'vue';
import { toThousands } from '@tiangong/utils';
import NP from 'number-precision';
import { ITableColumnsItem } from '@/components/tgo-table/package/type';
import {
  IBillSubListItem,
  IBillDeductionListItem,
  IBillBonusListItem,
  IBillDetailListItem,
} from '@/modules/financial-manage/customer-statement/api/types';
import { IBillSummaryListItem } from '../type';
import {
  RECOVERIES_STATUS_LIST,
  DEDUCTION_PAYMENT_TYPE_LIST,
  DEDUCTION_AND_BONUS_HANDLE_LIST,
  DEDUCTION_STATUS_LIST,
  BONUS_COLLECTION_TYPE_LIST,
  RECEIPT_TYPE_LIST,
  RECEIPT_STATUDS_LIST,
  RECEIPT_ACTUAL_STATUDS_LIST,
  COLLECTION_AND_PAYMENT_TYPE_LIST,
} from '@/modules/financial-manage/customer-statement/constant';
import { usePermissionConfig } from '@/modules/financial-manage/customer-statement/use-permission-config';

export const useTableColumns = (

) => {
  const {
    CAN_VIEW_BILL,
  } = usePermissionConfig();

  // 汇总
  const tableColumnsSummary: ITableColumnsItem<IBillSummaryListItem>[] = [
    {
      label: '总货款（元）',
      minWidth: '110',
      render: row => (
        <div>{toThousands(row.goodsAmount)}</div>
      ),
    },
    {
      label: '扣款金额（元）',
      minWidth: '125',
      render: row => (
        <div>{toThousands(row.deductAmount)}</div>
      ),
    },
    {
      label: '其他收款（元）',
      minWidth: '125',
      render: row => (
        <div>{toThousands(row.otherReceiptAmount)}</div>
      ),
    },
    {
      label: '实际结算货款（元）',
      minWidth: '155',
      render: row => (
        <div>{toThousands(row.actualSettleGoodsAmount)}</div>
      ),
    },
    {
      label: '账单金额（元）',
      minWidth: '125',
      render: row => (
        <div>{toThousands(row.billAmount)}</div>
      ),
    },
    {
      label: '应收金额（元）',
      minWidth: '125',
      render: row => (
        <div class="font-bold">{toThousands(row.preAmount)}</div>
      ),
    },
    {
      label: '已收定金（元）',
      minWidth: '125',
      render: row => (
        <div>{toThousands(row.preReceiptAmount)}</div>
      ),
    },
    {
      label: '已回款金额（元）',
      minWidth: '140',
      render: row => (
        <div class="font-bold color-success">{toThousands(row.paybackAmount)}</div>
      ),
    },
    {
      label: '待回款金额（元）',
      minWidth: '140',
      render: row => (
        <div class="font-bold color-warning">{toThousands(row.waitPaybackAmount)}</div>
      ),
    },
    {
      label: '回款状态',
      minWidth: '90',
      type: 'enum',
      prop: 'paybackState',
      options: RECOVERIES_STATUS_LIST,
    },
  ];

  // 子账单
  const tableColumnsSub = computed<ITableColumnsItem<IBillSubListItem>[]>(() => [
    {
      label: '子对账单号',
      minWidth: '145',
      prop: 'billDetailCode',
    },
    {
      label: '单号',
      minWidth: '170',
      render: row => (
        <div>
          <div>订单 {row.saleOrderCode}</div>
          <div>制单 {row.manufacturingOrderCode}</div>
          <div>客款 {row.customerStyleNumber}</div>
        </div>
      ),
    },
    {
      label: '订单数量（件）',
      minWidth: '125',
      prop: 'orderCount',
      render: row => (
        <div>{toThousands(row.orderCount)}</div>
      ),
    },
    {
      label: '发货数量（件）',
      minWidth: '125',
      prop: 'deliveryCount',
      render: row => (
        <div>{toThousands(row.deliveryCount)}</div>
      ),
    },
    {
      label: '总货款（元）',
      minWidth: '110',
      prop: 'goodsAmount',
      render: row => (
        <div>{toThousands(row.goodsAmount)}</div>
      ),
    },
    {
      label: '扣款明细（元）',
      minWidth: '125',
      prop: 'deductAmount',
      render: row => (
        <div>{toThousands(row.deductAmount)}</div>
      ),
    },
    {
      label: '其他收款（元）',
      minWidth: '125',
      prop: 'otherReceiptAmount',
      render: row => (
        <div>{toThousands(row.otherReceiptAmount)}</div>
      ),
    },
    {
      label: '实际结算货款（元）',
      minWidth: '155',
      prop: 'actualSettleGoodsAmount',
      render: row => (
        <div>{toThousands(row.actualSettleGoodsAmount)}</div>
      ),
    },
    {
      label: '已收定金（元）',
      minWidth: '125',
      prop: 'preReceiptAmount',
      render: row => (
        <div>{toThousands(row.preReceiptAmount)}</div>
      ),
    },
    {
      label: '已回货款（元）',
      minWidth: '125',
      prop: 'receiptedAmount',
      render: row => (
        <div>{toThousands(row.receiptedAmount)}</div>
      ),
    },
    {
      label: '待回货款（元）',
      minWidth: '125',
      prop: 'pendingReceiptedAmount',
      render: row => (
        <div>{toThousands(row.pendingReceiptedAmount)}</div>
      ),
    },
    {
      label: '回款状态',
      minWidth: '90',
      type: 'enum',
      prop: 'paybackState',
      options: RECOVERIES_STATUS_LIST,
    },
    {
      label: '操作',
      minWidth: '85',
      fixed: 'right',
      render: row => (
        <div class='flex flex-align-center'>
          {CAN_VIEW_BILL.value && (
            <router-link
              to={{
                name: 'FinancialManageCustomerStatementBillDetail',
                params: {
                  id: row?.billDetailCode,
                },
              }}
              target="_blank"
              class='margin-right-10'
            >
              <el-button type="text">查看明细</el-button>
            </router-link>
          )}
        </div>
      ),
    },
  ]);

  // 客户扣款
  const tableColumnsDeduction: ITableColumnsItem<IBillDeductionListItem>[] = [
    {
      label: '序号',
      type: 'index',
      minWidth: '80',
      width: '80',
    },
    {
      label: '子对账单号',
      minWidth: '145',
      prop: 'billDetailCode',
    },
    {
      label: '单号',
      minWidth: '170',
      render: row => (
        <div>
          <div>订单 {row.saleOrderCode}</div>
          <div>制单 {row.manufacturingOrderCode}</div>
          <div>客款 {row.customerStyleNumber}</div>
        </div>
      ),
    },
    {
      label: '收付类型',
      minWidth: '85',
      type: 'enum',
      prop: 'prType',
      options: DEDUCTION_PAYMENT_TYPE_LIST,
    },
    {
      label: '扣款登记日期',
      minWidth: '110',
      prop: 'recordDate',
      type: 'date',
      format: 'YYYY-MM-DD',
    },
    {
      label: '扣款金额（元）',
      minWidth: '125',
      prop: 'amount',
      render: row => (
        <div>{toThousands(row.amount)}</div>
      ),
    },
    {
      label: '扣款原因',
      minWidth: '180',
      prop: 'reason',
      ellipsis: true,
    },
    {
      label: '扣款处理方式',
      minWidth: '150',
      type: 'enum',
      prop: 'processType',
      options: DEDUCTION_AND_BONUS_HANDLE_LIST,
    },
    {
      label: '凭证',
      minWidth: '190',
      render: row => (
        <div class="flex flex-wrap">
          {row.voucherUrls.map((item, idx) => (
            <el-image
              key={`${idx}`}
              src={item}
              preview-src-list={row.voucherUrls}
              width={80}
              height={80}
              style={{ width: '50px', height: '50px' }}
              initialIndex={idx}
              fit="cover"
              preview-teleported
              class="margin-right-5 margin-bottom-5"
            />
          ))}
        </div>
      ),
    },
    {
      label: '登记人员',
      minWidth: '85',
      prop: 'recordName',
    },
    {
      label: '状态',
      minWidth: '85',
      type: 'enum',
      prop: 'state',
      options: DEDUCTION_STATUS_LIST,
    },
  ];

  // 客户奖励
  const tableColumnsBonus: ITableColumnsItem<IBillBonusListItem>[] = [
    {
      label: '序号',
      type: 'index',
      minWidth: '80',
      width: '80',
    },
    {
      label: '子对账单号',
      minWidth: '145',
      prop: 'billDetailCode',
    },
    {
      label: '单号',
      minWidth: '170',
      render: row => (
        <div>
          <div>订单 {row.saleOrderCode}</div>
          <div>制单 {row.manufacturingOrderCode}</div>
          <div>客款 {row.customerStyleNumber}</div>
        </div>
      ),
    },
    {
      label: '收付类型',
      minWidth: '85',
      type: 'enum',
      prop: 'prType',
      options: BONUS_COLLECTION_TYPE_LIST,
    },
    {
      label: '奖励登记日期',
      minWidth: '110',
      prop: 'recordDate',
      type: 'date',
      format: 'YYYY-MM-DD',
    },
    {
      label: '奖励金额（元）',
      minWidth: '125',
      prop: 'amount',
      render: row => (
        <div>{toThousands(row.amount)}</div>
      ),
    },
    {
      label: '奖励原因',
      minWidth: '180',
      prop: 'reason',
      ellipsis: true,
    },
    {
      label: '奖励处理方式',
      minWidth: '150',
      type: 'enum',
      prop: 'processType',
      options: DEDUCTION_AND_BONUS_HANDLE_LIST,
    },
    {
      label: '凭证',
      minWidth: '190',
      prop: 'certificate',
      render: row => (
        <div class="flex flex-wrap">
          {row.voucherUrls.map((item, idx) => (
            <el-image
              key={`${idx}`}
              src={item}
              preview-src-list={row.voucherUrls}
              width={80}
              height={80}
              style={{ width: '50px', height: '50px' }}
              initialIndex={idx}
              fit="cover"
              preview-teleported
              class="margin-right-5 margin-bottom-5"
            />
          ))}
        </div>
      ),
    },
    {
      label: '登记人员',
      minWidth: '85',
      prop: 'recordName',
    },
  ];

  // 收款明细
  const tableColumnsDetail = computed<ITableColumnsItem<IBillDetailListItem>[]>(() => [
    {
      label: '收款单号',
      minWidth: '145',
      prop: 'receiptCode',
    },
    {
      label: '单号',
      minWidth: '195',
      render: row => (
        <div>
          <div class="flex">
            <div style={{ width: '50px' }}>子账单</div>{row.billDetailCode}
          </div>
          <div class="flex">
            <div style={{ width: '50px' }}>订单</div>{row.saleOrderCode}
          </div>
          <div class="flex">
            <div style={{ width: '50px' }}>制单</div>{row.manufacturingOrderCode}
          </div>
          <div class="flex">
            <div style={{ width: '50px' }}>客款</div>{row.customerStyleNumber}
          </div>
        </div>
      ),
    },
    {
      label: '收款类型',
      minWidth: '85',
      type: 'enum',
      prop: 'receiptType',
      options: RECEIPT_TYPE_LIST,
    },
    {
      label: '收付类型',
      minWidth: '85',
      type: 'enum',
      prop: 'prType',
      options: COLLECTION_AND_PAYMENT_TYPE_LIST,
    },
    {
      label: '应收款日期',
      minWidth: '110',
      prop: 'receivableDate',
      type: 'date',
      format: 'YYYY-MM-DD',
    },
    {
      label: '申请人',
      minWidth: '85',
      prop: 'applicantName',
    },
    {
      label: '收款日期',
      minWidth: '110',
      prop: 'actualReceiptDate',
      type: 'date',
      format: 'YYYY-MM-DD',
    },
    {
      label: '账单金额比例',
      minWidth: '110',
      render: row => (
        <div>{NP.times(row.receiptPercent ?? 0, 100)}%</div>
      ),
    },
    {
      label: '应收金额（元）',
      minWidth: '125',
      prop: 'receiptAmount',
      render: row => (
        <div>{toThousands(row.receiptAmount)}</div>
      ),
    },
    {
      label: '实收金额（元）',
      minWidth: '125',
      prop: 'actualReceiptAmount',
      render: row => (
        <div>{toThousands(row.actualReceiptAmount)}</div>
      ),
    },
    {
      label: '收款单状态',
      minWidth: '100',
      type: 'enum',
      prop: 'receiptState',
      options: RECEIPT_STATUDS_LIST,
    },
    {
      label: '实际收款状态',
      minWidth: '110',
      type: 'enum',
      prop: 'actualReceiptState',
      options: RECEIPT_ACTUAL_STATUDS_LIST,
    },
    {
      label: '收款备注',
      minWidth: '200',
      prop: 'receiptRemark',
      ellipsis: true,
    },
  ]);

  return {
    tableColumnsSummary,
    tableColumnsSub,
    tableColumnsDeduction,
    tableColumnsBonus,
    tableColumnsDetail,
  };
};
