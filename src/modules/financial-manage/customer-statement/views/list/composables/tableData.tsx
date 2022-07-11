import { toThousands } from '@tiangong/utils';
import { filters } from '@/core/plugins/filter';
import { YES_OR_NO_NUMBER_ENUM } from '@/constant';
import { IColumnsItem } from '@/components/custom-table/package/type.d';
import {
  BILL_TYPE_ENUM,
  RECOVERIES_STATUS_ENUM,
  RECONCILE_STATUS_ENUM,
  EXPAND_STATUS_ENUM,
  OUTGOING_TYPE_LIST,
  BILL_TYPE_LIST,
  RECONCILE_STATUS_LIST,
  RECOVERIES_STATUS_LIST,
  EXPAND_STATUS_LIST,
  RECONCILE_STATUS_COLOR,
  RECOVERIES_STATUS_COLOR,
  EXPAND_STATUS_COLOR,
} from '../../../constant';
import { IListItem } from '../types';

export const renderColumns = (
  handleChangeType: (row: IListItem) => void,
  CAN_VIEW_DETAIL: boolean,
  CAN_CHANGE_TYPE: boolean,
): IColumnsItem<IListItem>[] => [
  {
    label: '账单月份',
    minWidth: '90px',
    prop: 'billMonth',
  },
  {
    label: '客户账单号',
    minWidth: '150px',
    prop: 'billCode',
    render: row => (
      <div>
        <div>{row.billCode}</div>
        {row.statementType && <el-tag
          effect="plain"
          class="margin-right-5 margin-bottom-5"
        >
          {filters.getEnumLabel(OUTGOING_TYPE_LIST, row.statementType)}
        </el-tag>}
        {row.regionName && (
          <el-tag
            effect="plain"
            type="warning"
            class="margin-right-5 margin-bottom-5"
          >
            {row.regionName}
          </el-tag>
        )}
        {row.isOverdue === YES_OR_NO_NUMBER_ENUM.YES && (
          <el-tag
            effect="plain"
            type="danger"
          >
            逾期
          </el-tag>
        )}
      </div>
    ),
  },
  {
    label: '客户名称',
    minWidth: '150px',
    prop: 'customerName',
  },
  {
    label: '账单类型',
    minWidth: '90px',
    prop: 'billType',
    render: row => (
      <div>{filters.getEnumLabel(BILL_TYPE_LIST, row.billType)}</div>
    ),
  },
  {
    label: '账单金额(元)',
    minWidth: '110px',
    prop: 'billAmount',
    render: row => (
      <div>{toThousands(row.billAmount)}</div>
    ),
  },
  {
    label: '应收金额(元)',
    minWidth: '110px',
    prop: 'billAmount',
    render: row => (
      <div>{toThousands(row.billAmount)}</div>
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
    label: '已回款金额(元)',
    minWidth: '120px',
    prop: 'paybackAmount',
    render: row => (
      <div>{toThousands(row.paybackAmount)}</div>
    ),
  },
  {
    label: '待回款金额(元)',
    minWidth: '120px',
    prop: 'waitPaybackAmount',
    render: row => (
      <div>{toThousands(row.waitPaybackAmount)}</div>
    ),
  },
  {
    label: '状态',
    minWidth: '170px',
    prop: 'amount',
    render: row => (
      <div>
        <div>
          对账：
          <span class={`color-${RECONCILE_STATUS_COLOR[row.statementState]}`}>
            {filters.getEnumLabel(RECONCILE_STATUS_LIST, row.statementState)}
          </span>
        </div>
        {row.billType === BILL_TYPE_ENUM.FINANCE && <div>
          支用：
          <span class={`color-${EXPAND_STATUS_COLOR[row.supportState]}`}>
            {filters.getEnumLabel(EXPAND_STATUS_LIST, row.supportState)}
          </span>
        </div>}
        <div>
          回款：
          <span class={`color-${RECOVERIES_STATUS_COLOR[row.paybackState]}`}>
            {filters.getEnumLabel(RECOVERIES_STATUS_LIST, row.paybackState)}
          </span>
        </div>
      </div>
    ),
  },
  {
    label: '审核人',
    minWidth: '80px',
    prop: 'auditOperator',
  },
  {
    label: 'BD',
    minWidth: '120px',
    prop: 'bdName',
    render: row => (
      <div>
        <div>{row.bdName}</div>
        {row.cmName && <div style={{ color: '#999' }}>(CM：{row.cmName})</div>}
      </div>

    ),
  },
  {
    label: '创建时间',
    minWidth: '170px',
    prop: 'createdTime',
    render: row => (
      <div>{filters.formatTime(row.createdTime)}</div>
    ),
  },
  {
    label: '操作',
    width: '110px',
    fixed: 'right',
    render: row => (
      <div>
        {CAN_VIEW_DETAIL && (
          <router-link
            to={{
              name: 'FinancialManageCustomerStatementDetail',
              params: {
                id: row.billId,
              },
            }}
            target="_blank"
          >
            <el-button type="text">
              查看详情
            </el-button>
          </router-link>
        )}
        {((row.billType === BILL_TYPE_ENUM.COMMON
            && (row.statementState === RECONCILE_STATUS_ENUM.TO_STATEMENT_CUSTOMER
              || (row.statementState === RECONCILE_STATUS_ENUM.STATEMENT_COMPLETE
                && row.paybackState === RECOVERIES_STATUS_ENUM.WAIT_BACK)
            )
            && +row.billAmount >= 1000
        )
          || (row.billType === BILL_TYPE_ENUM.FINANCE
            && (row.statementState === RECONCILE_STATUS_ENUM.TO_STATEMENT_CUSTOMER
              || (row.statementState === RECONCILE_STATUS_ENUM.STATEMENT_COMPLETE
                && [EXPAND_STATUS_ENUM.WAIT_SUPPORT, EXPAND_STATUS_ENUM.SUPPORT_FAIL].includes(row.supportState)
              )
            )
          )
        ) && CAN_CHANGE_TYPE && (
          <el-button type="text" class='margin-right-10' onClick={() => handleChangeType(row)}>
            更改账单类型
          </el-button>
        )
        }
      </div>
    ),
  },
];
