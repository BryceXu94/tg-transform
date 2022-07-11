import { toThousands } from '@tiangong/utils';
import { filters } from '@/core/plugins/filter';
import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { CREDIT_SUBJECT_ROUTE_ENUM, DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant';
import {
  CREDIT_APPLY_TYPE_LIST,
  APPROVE_STATUS_LIST,
  APPROVE_STATUS_ENUM,
  CREDIT_APPROVE_TYPE_LIST,
} from '../../../constant';
import { IListItem, IListItemGroup } from '../types';

export const renderColumns = (
  handleRevoke: (row: IListItem) => void,
  CAN_VIEW: boolean,
  CAN_VIEW_CUSTOMER: boolean,
  CAN_REVOKE: boolean,
  CAN_RESUBMIT: boolean,
): IColumnsItem<IListItem>[] => [
  {
    label: '飞书审批编码',
    minWidth: '130px',
    prop: 'approvalFeiShuCode',
    render: row => (
      <div>
        {CAN_VIEW ? (
          <router-link
            to={{
              name: 'ApprovalManageCreditApplicationDetail',
              params: {
                id: row.creditApplyId,
                type: CREDIT_SUBJECT_ROUTE_ENUM.CUSTOMER,
              },
            }}
          >
            <el-button type="text">{row.approvalFeiShuCode}</el-button>
          </router-link>
        ) : (
          <div>{row.approvalFeiShuCode}</div>
        )}
      </div>
    ),
  },
  {
    label: '客户名称',
    minWidth: '200px',
    prop: 'crmCreditCustomer.customerName',
    render: row => (
      <div>
        <div>{row.crmCreditCustomer.customerName}</div>
        <div class='margin-top-5'>
          {row.crmCreditCustomer.regionName && (
            <el-tag type="warning" class="margin-right-10">{row.crmCreditCustomer.regionName}</el-tag>
          )}
          <el-tag type="success">
            {filters.getEnumLabel(CREDIT_APPROVE_TYPE_LIST, row.applyType)}-
            {filters.getEnumLabel(CREDIT_APPLY_TYPE_LIST, row.creditType)}
          </el-tag>
        </div>
      </div>
    ),
  },
  {
    label: '客户编码',
    minWidth: '120px',
    prop: 'crmCreditCustomer.customerCode',
    render: row => (
      <div>
        {CAN_VIEW_CUSTOMER ? (
          <router-link
            to={{
              name: 'CustomerManageCustomerDetail',
              params: {
                id: row.crmCreditCustomer.customerId,
              },
            }}
          >
            <el-button type="text">{row.crmCreditCustomer.customerCode}</el-button>
          </router-link>
        ) : (
          <div>{row.crmCreditCustomer.customerCode}</div>
        )}
      </div>
    ),
  },
  {
    label: '申请额度(元)',
    minWidth: '135px',
    prop: 'applyAmount',
    render: row => (
      <encryption
        key={row?.creditApplyId}
        data={{
          businessId: row?.creditApplyId,
          dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.FULLY_DESENSITIZE,
          content: row?.applyAmount,
          dateColumn: 'applyAmount',
          format: toThousands,
        }}
      />
    ),
  },
  {
    label: '申请人',
    minWidth: '80px',
    prop: 'applyUserName',
  },
  {
    label: '申请时间',
    minWidth: '170px',
    prop: 'applyTime',
    render: row => (
      <div>{filters.formatTime(row.applyTime)}</div>
    ),
  },
  {
    label: '审批状态',
    minWidth: '90px',
    prop: 'approvalState',
    render: row => (
      <div>{filters.getEnumLabel(APPROVE_STATUS_LIST, row.approvalState)}</div>
    ),
  },
  {
    label: '操作',
    width: '90px',
    fixed: 'right',
    render: row => (
      <div>
        {CAN_REVOKE
          && row.approvalState === APPROVE_STATUS_ENUM.APPROVAL_PROGRESS
          && (
            <el-button type="text" class="color-error" onClick={() => handleRevoke(row)}>
              撤销
            </el-button>
          )
        }
        {CAN_RESUBMIT
          && [APPROVE_STATUS_ENUM.APPROVAL_QUASH, APPROVE_STATUS_ENUM.APPROVAL_REFUSE].includes(row.approvalState)
          && (
            <router-link
              to={{
                name: 'ApprovalManageResubmitCreditApplication',
                params: {
                  id: row.creditApplyId,
                  type: CREDIT_SUBJECT_ROUTE_ENUM.CUSTOMER,
                },
              }}
            >
              <el-button type="text">重新提交</el-button>
            </router-link>
          )
        }
      </div>
    ),
  },
];

export const renderColumnsGroup = (
  handleRevoke: (row: IListItemGroup) => void,
  CAN_VIEW_GROUP_DETAIL: boolean,
  CAN_VIEW_GROUP: boolean,
  CAN_REVOKE_GROUP: boolean,
  CAN_RESUBMIT_GROUP: boolean,
): IColumnsItem<IListItemGroup>[] => [
  {
    label: '飞书审批编码',
    minWidth: '130px',
    prop: 'approvalFeiShuCode',
    render: row => (
      <div>
        {CAN_VIEW_GROUP_DETAIL ? (
          <router-link
            to={{
              name: 'ApprovalManageCreditApplicationDetail',
              params: {
                id: row.creditApplyId,
                type: CREDIT_SUBJECT_ROUTE_ENUM.GROUP,
              },
            }}
           >
            <el-button type="text">{row.approvalFeiShuCode}</el-button>
          </router-link>
        ) : (
          <div>{row.approvalFeiShuCode}</div>
        )}
      </div>
    ),
  },
  {
    label: '集团名称',
    minWidth: '200px',
    prop: 'crmGroupCreditCustomer.groupName',
    render: row => (
      <div>
        <div>{row.crmGroupCreditCustomer?.groupName}</div>
        <div class='margin-top-5'>
          <el-tag type="success">
            {filters.getEnumLabel(CREDIT_APPROVE_TYPE_LIST, row.applyType)}-
            {filters.getEnumLabel(CREDIT_APPLY_TYPE_LIST, row.creditType)}
          </el-tag>
        </div>
      </div>
    ),
  },
  {
    label: '集团编码',
    minWidth: '120px',
    prop: 'crmGroupCreditCustomer.groupCode',
    render: row => (
      <div>
        {CAN_VIEW_GROUP ? (
          <router-link
            to={{
              name: 'CustomerManageGroupDetail',
              params: {
                id: row.crmGroupCreditCustomer.groupId,
              },
            }}
           >
            <el-button type="text">{row.crmGroupCreditCustomer.groupCode}</el-button>
          </router-link>
        ) : (
          <div>{row.crmGroupCreditCustomer.groupCode}</div>
        )}
      </div>
    ),
  },
  {
    label: '申请额度(元)',
    minWidth: '135px',
    prop: 'applyAmount',
    render: row => (
      <encryption
        key={row?.creditApplyId}
        data={{
          businessId: row?.creditApplyId,
          dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.FULLY_DESENSITIZE,
          content: row?.applyAmount,
          dateColumn: 'applyAmount',
          format: toThousands,
        }}
      />
    ),
  },
  {
    label: '申请人',
    minWidth: '80px',
    prop: 'applyUserName',
  },
  {
    label: '申请时间',
    minWidth: '170px',
    prop: 'applyTime',
    render: row => (
      <div>{filters.formatTime(row.applyTime)}</div>
    ),
  },
  {
    label: '审批状态',
    minWidth: '90px',
    prop: 'approvalState',
    render: row => (
      <div>{filters.getEnumLabel(APPROVE_STATUS_LIST, row.approvalState)}</div>
    ),
  },
  {
    label: '操作',
    width: '90px',
    fixed: 'right',
    render: row => (
      <div>
        {CAN_REVOKE_GROUP
          && row.approvalState === APPROVE_STATUS_ENUM.APPROVAL_PROGRESS
          && (
            <el-button type="text" class="color-error" onClick={() => handleRevoke(row)}>
              撤销
            </el-button>
          )
        }
        {CAN_RESUBMIT_GROUP
          && [APPROVE_STATUS_ENUM.APPROVAL_QUASH, APPROVE_STATUS_ENUM.APPROVAL_REFUSE].includes(row.approvalState)
          && (
            <router-link
              to={{
                name: 'ApprovalManageResubmitCreditApplication',
                params: {
                  id: row.creditApplyId,
                  type: CREDIT_SUBJECT_ROUTE_ENUM.GROUP,
                },
              }}
            >
              <el-button type="text">重新提交</el-button>
            </router-link>
          )
        }
      </div>
    ),
  },
];
