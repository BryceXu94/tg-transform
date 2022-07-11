import { computed, ref } from 'vue';
import { toThousands } from '@tiangong/utils';
import NP from 'number-precision';
import { ITableColumnsItem } from '@/components/tgo-table/package/type';
import {
  ISubBillDeductionListItem,
  ISubBillBonusListItem,
  ISubBillCollectionListItem,
  ISubBillShipListItem,
} from '@/modules/financial-manage/customer-statement/api/types';
import { ISizeConfigItem } from '../type';
import {
  DEDUCTION_PAYMENT_TYPE_LIST,
  DEDUCTION_AND_BONUS_HANDLE_LIST,
  DEDUCTION_STATUS_LIST,
  BONUS_COLLECTION_TYPE_LIST,
  RECEIPT_TYPE_LIST,
  RECEIPT_STATUDS_LIST,
  RECEIPT_ACTUAL_STATUDS_LIST,
  COLLECTION_AND_PAYMENT_TYPE_LIST,
  DELIVERY_TYPE_LIST,
} from '@/modules/financial-manage/customer-statement/constant';

export const useTableColumns = (
) => {
  const sizeConfig = ref<ISizeConfigItem[]>([]);
  // 客户扣款
  const tableColumnsDeduction: ITableColumnsItem<ISubBillDeductionListItem>[] = [
    {
      label: '序号',
      type: 'index',
      minWidth: '80',
      width: '80',
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
      prop: 'voucherUrls',
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
  const tableColumnsBonus: ITableColumnsItem<ISubBillBonusListItem>[] = [
    {
      label: '序号',
      type: 'index',
      minWidth: '80',
      width: '80',
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
      prop: 'voucherUrls',
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
  const tableColumnsCollection: ITableColumnsItem<ISubBillCollectionListItem>[] = [
    {
      label: '收款单号',
      minWidth: '145',
      prop: 'receiptCode',
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
  ];

  // 发货明细
  const tableColumnsShip = computed<ITableColumnsItem<ISubBillShipListItem>[]>(() => {
    const front: ITableColumnsItem<ISubBillShipListItem>[] = [
      {
        label: '发货/退货单号',
        minWidth: '150',
        prop: 'deliveryReturnCode',
      },
      {
        label: '生产跟单',
        minWidth: '100',
        prop: 'merchandiserName',
      },
      {
        label: '类型',
        minWidth: '85',
        type: 'enum',
        prop: 'type',
        options: DELIVERY_TYPE_LIST,
      },
      {
        label: '批次',
        minWidth: '100',
        prop: 'batchNo',
      },
      {
        label: '颜色',
        minWidth: '100',
        prop: 'color',
      },
    ];
    const back: ITableColumnsItem<ISubBillShipListItem>[] = [
      {
        label: '数量小计（件）',
        minWidth: '125',
        prop: 'totalCount',
      },
      {
        label: '结算单价（元）',
        minWidth: '125',
        prop: 'price',
        render: row => (
          <div>{row.applyPrice ? toThousands(row.applyPrice) : toThousands(row.orderPrice)}</div>
        ),
      },
      {
        label: '金额小计（含税）',
        minWidth: '140',
        prop: 'deliveryAmount',
        render: row => (
          <div>{toThousands(row.deliveryAmount)}</div>
        ),
      },
      {
        label: '要求交期',
        minWidth: '110',
        prop: 'requiredDeliveryDate',
        type: 'date',
        format: 'YYYY-MM-DD',
      },
      {
        label: '实际交期/退货日期',
        minWidth: '145',
        prop: 'actualDeliveryDate',
        type: 'date',
        format: 'YYYY-MM-DD',
      },
    ];

    const sizes: ITableColumnsItem<ISubBillShipListItem>[] = sizeConfig.value.map(item => ({
      label: item.size,
      minWidth: 100,
      prop: item.prop,
    }));

    return [...front, ...sizes, ...back];
  });

  return {
    sizeConfig,
    tableColumnsDeduction,
    tableColumnsBonus,
    tableColumnsCollection,
    tableColumnsShip,
  };
};
