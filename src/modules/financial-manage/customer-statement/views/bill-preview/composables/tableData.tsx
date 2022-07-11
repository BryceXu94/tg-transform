import { toThousands, formatTime } from '@tiangong/utils';
import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { IStatementListItem } from '../types';

export const renderColumns = (
): IColumnsItem<IStatementListItem>[] => [
  {
    label: '序号',
    width: '80',
    type: 'index',
  },
  {
    label: '制单号',
    minWidth: '145px',
    prop: 'manufacturingOrderCode',
  },
  {
    label: '客户款号',
    minWidth: '145px',
    prop: 'customerStyleNumber',
  },
  {
    label: '批次',
    minWidth: '100px',
    prop: 'batchNo',
  },
  {
    label: '颜色',
    minWidth: '100px',
    prop: 'color',
  },
  {
    label: '订单数量',
    minWidth: '100px',
    prop: 'orderCount',
  },
  {
    label: '发货数量',
    minWidth: '100px',
    prop: 'deliveryCount',
  },
  {
    label: '结算单价(元)',
    minWidth: '110px',
    prop: 'settlePrice',
    render: row => (
      <div>{toThousands(row.settlePrice)}</div>
    ),
  },
  {
    label: '总货款(元)',
    minWidth: '100px',
    prop: 'goodsAmount',
    render: row => (
      <div>{toThousands(row.goodsAmount)}</div>
    ),
  },
  {
    label: '实际收货日期',
    minWidth: '120px',
    prop: 'realReceiptDate',
    render: row => (
      <div>{formatTime(row.realReceiptDate, 'YYYY-MM-DD')}</div>
    ),
  },
  {
    label: '扣款明细(元)',
    minWidth: '110px',
    prop: 'deductAmount',
    render: row => (
      <div>{toThousands(row.deductAmount)}</div>
    ),
  },
  {
    label: '其他收款(元)',
    minWidth: '110px',
    prop: 'otherReceiptAmount',
    render: row => (
      <div>{toThousands(row.otherReceiptAmount)}</div>
    ),
  },
  {
    label: '实际结算货款(元)',
    minWidth: '140px',
    prop: 'actualSettleGoodsAmount',
    render: row => (
      <div>{toThousands(row.actualSettleGoodsAmount)}</div>
    ),
  },
  {
    label: '已收定金(元)',
    minWidth: '110px',
    prop: 'preReceiptAmount',
    render: row => (
      <div>{toThousands(row.preReceiptAmount)}</div>
    ),
  },
  {
    label: '已回货款(元)',
    minWidth: '110px',
    prop: 'receiptedAmount',
    render: row => (
      <div>{toThousands(row.receiptedAmount)}</div>
    ),
  },
  {
    label: '备注',
    minWidth: '140px',
    prop: 'remark',
  },
];
