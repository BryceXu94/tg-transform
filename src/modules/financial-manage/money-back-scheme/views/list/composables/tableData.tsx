import { toThousands } from '@tiangong/utils';
import NP from 'number-precision';
import { filters } from '@/core/plugins/filter';
import { YES_OR_NO_NUMBER_ENUM } from '@/constant';
import { IColumnsItem } from '@/components/custom-table/package/type.d';
import {
  RECOVERIES_STATUS_ENUM,
  RECOVERIES_STATUS_LIST,
  RECOVERIES_STATUS_COLOR,
  BILL_TYPE_ENUM,
} from '../../../constant';
import { IListItem } from '../types';

export const renderColumns = (
  handleSetDate: (row: IListItem) => void,
  CAN_VIEW_DETAIL: boolean,
  CAN_SET_MONEY_BACK_DATE: boolean,
): IColumnsItem<IListItem>[] => [
  {
    label: '月份',
    minWidth: '90px',
    prop: 'planMonth',
  },
  {
    label: '账单号',
    minWidth: '170px',
    prop: 'billCode',
    render: row => (
      <div>
        <copy-text>
          {CAN_VIEW_DETAIL ? (
            <router-link
              to={{
                name: 'FinancialManageCustomerStatementDetail',
                params: {
                  id: row.billId,
                },
              }}
            >
              <el-button type="text">
                {row.billCode}
              </el-button>
            </router-link>
          ) : (
            <div>{row.billCode}</div>
          )}
        </copy-text>
        {row.regionName && (
          <el-tag
            effect="plain"
            type="warning"
            class="margin-bottom-5"
          >
            {row.regionName}
          </el-tag>
        )}
        {row.billType === BILL_TYPE_ENUM.FINANCE && (
          <el-tag
            effect="plain"
            class="margin-left-5 margin-bottom-5"
          >
            金条
          </el-tag>
        )}
        {row.isOverdue === YES_OR_NO_NUMBER_ENUM.YES && (
            <el-tag
            effect="plain"
            type="danger"
            class="margin-left-5 margin-bottom-5"
          >
            逾期{row.overdueDays}天
          </el-tag>
        )}
      </div>
    ),
  },
  {
    label: '客户名称',
    minWidth: '150px',
    prop: 'customerName',
    render: row => (
      <div>
        <div>{row.customerName}</div>
        <div class="color-grey">BD：{row.bdName}</div>
      </div>
    ),
  },
  {
    label: '日期信息',
    minWidth: '200px',
    prop: 'billDate',
    render: row => (
      <div>
        <div class="flex">
          <div style={{ width: '90px' }}>出账日：</div>{filters.formatTime(row.billDate, 'YYYY-MM-DD')}
        </div>
        <div class="flex">
          <div style={{ width: '90px' }}>逾期日：</div>{filters.formatTime(row.overdueDate, 'YYYY-MM-DD')}
        </div>
        <div class="flex">
          <div style={{ width: '90px' }}>计划回款日：</div>{filters.formatTime(row.planRepaymentDate, 'YYYY-MM-DD')}
        </div>
      </div>
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
    label: '账单金额(元)',
    minWidth: '110px',
    prop: 'billAmount',
    render: row => (
      <div>{toThousands(row.billAmount)}</div>
    ),
  },
  {
    label: '本期计划回款(元)',
    minWidth: '140px',
    prop: 'currentPlanRepaymentAmount',
    render: row => (
      <div>
        <div style={{ whiteSpace: 'nowrap' }}>
          {toThousands(row.currentPlanRepaymentAmount)}（{NP.times(row.returnPercent ?? 0, 100)}%）
        </div>
        {row.totalRepaymentPeriod && <div>（{row.currentRepaymentPeriod}/{row.totalRepaymentPeriod}期）</div>}
        {row.isAdvancePayment === YES_OR_NO_NUMBER_ENUM.YES && (
          <el-tag
            effect="plain"
            type="warning"
          >
            预付定金
          </el-tag>
        )}
      </div>
    ),
  },
  {
    label: '本期实际回款(元)',
    minWidth: '140px',
    prop: 'currentActualRepaymentAmount',
    render: row => (
      <div>{toThousands(row.currentActualRepaymentAmount)}</div>
    ),
  },
  {
    label: '本期待回款(元)',
    minWidth: '120px',
    prop: 'currentWaitRepaymentAmount',
    render: row => (
      <div>{toThousands(row.currentWaitRepaymentAmount)}</div>
    ),
  },
  {
    label: '回款及时率',
    minWidth: '100px',
    prop: 'waitPaybackAmount',
    render: row => (
      <div>{NP.times(row.timelyRepaymentRate ?? 0, 100)}%</div>
    ),
  },
  {
    label: '回款状态',
    minWidth: '90px',
    prop: 'amount',
    render: row => (
      <div class={`color-${RECOVERIES_STATUS_COLOR[row.paybackState]}`}>
        {filters.getEnumLabel(RECOVERIES_STATUS_LIST, row.paybackState)}
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
    width: '120px',
    fixed: 'right',
    render: row => (
      <div>
        {row.paybackState === RECOVERIES_STATUS_ENUM.WAIT_BACK && CAN_SET_MONEY_BACK_DATE && (
          <el-button type="text" onClick={() => handleSetDate(row)}>
            设置预计回款日
          </el-button>
        )}
      </div>
    ),
  },
];
