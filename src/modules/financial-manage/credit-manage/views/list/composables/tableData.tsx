import { toThousands } from '@tiangong/utils';
import { filters } from '@/core/plugins/filter';
import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { CREDIT_SUBJECT_ROUTE_ENUM, CREDIT_SUBJECT_ENUM } from '@/constant';
import {
  STATUS_ENUM,
  STATUS_LIST,
  STATUS_REVERT_LIST,
  STATUS_NUMBER_ENUM,
  STATUS_NUMBER_LIST,
  STATUS_NUMBER_REVERT_LIST,
} from '../../../constant';
import {
  IListItemCustomer,
  IListItemGroup,
} from '../types';

// 客户维度
export const renderColumns = (
  handleChangeStatus: (row: IListItemCustomer) => void,
  handleUpdate: (row: IListItemCustomer) => void,
  CAN_VIEW_CUSTOMER_DETAIL: boolean,
  CAN_VIEW_USAGE: boolean,
  CAN_TOGGLE: boolean,
  CAN_UPDATE: boolean,
  CAN_VIEW_CUSTOMER: boolean,
): IColumnsItem<IListItemCustomer>[] => [
  {
    label: '客户编码',
    minWidth: '120px',
    prop: 'customerCode',
    render: row => (
      <div>
        {CAN_VIEW_CUSTOMER ? (
          <router-link
            to={{
              name: 'CustomerManageCustomerDetail',
              params: {
                id: row.customerId,
              },
            }}
           >
            <el-button type="text">{row.customerCode}</el-button>
          </router-link>
        ) : (
          <div>{row.customerCode}</div>
        )}
      </div>
    ),
  },
  {
    label: '客户名称',
    minWidth: '130px',
    prop: 'customerName',
    render: row => (
      <div>
        <div>{row.customerName}</div>
        <div class="margin-top-5">
          {row?.regionName && (
            <el-tag type="warning">{row?.regionName}</el-tag>
          )}
          {row.isOverdue && (
            <el-tag
              effect="plain"
              type="danger"
              class="margin-left-5"
            >
              逾期{row.overdueDays ?? '0'}天
            </el-tag >
          )}
          {row.creditMark === CREDIT_SUBJECT_ENUM.GROUP && (
            <el-tag
              effect="plain"
              type="primary"
              class="margin-left-5"
            >
              集团授信
            </el-tag >
          )}
        </div>
      </div>
    ),
  },
  {
    label: '总额度(元)',
    minWidth: '110px',
    prop: 'totalAmount',
    render: row => (
      <div>{toThousands(row.totalAmount)}</div>
    ),
  },
  {
    label: '可用额度(元)',
    minWidth: '120px',
    prop: 'availableAmount',
    render: row => (
      <div>{toThousands(row.availableAmount)}</div>
    ),
  },
  {
    label: '临时额度(元)',
    minWidth: '120px',
    prop: 'tempAmount',
    render: row => (
      <div>{toThousands(row.tempAmount)}</div>
    ),
  },
  {
    label: '启用状态',
    minWidth: '90px',
    prop: 'status',
    render: row => (
      <div>
        {filters.getEnumLabel(STATUS_LIST, row.amountStatus)}
      </div>
    ),
  },
  {
    label: '操作',
    width: '170px',
    fixed: 'right',
    render: row => (
      <div>
        {CAN_UPDATE
          && row.amountStatus !== STATUS_ENUM.DIASBLE
          && (
            <el-button type="text" onClick={() => handleUpdate(row)}>
              调整
            </el-button>
          )
        }
        {CAN_TOGGLE && (
          <el-button
            type="text"
            class={`margin-right-12 ${row.amountStatus === STATUS_ENUM.ENABLE ? 'color-error' : ''}`}
            onClick={() => handleChangeStatus(row)}
          >
            {filters.getEnumLabel(STATUS_REVERT_LIST, row.amountStatus)}
          </el-button>
        )}
        {CAN_VIEW_USAGE && (
          <router-link
            to={{
              name: 'FinancialManageCreditUsageDetail',
              params: {
                id: row.customerId,
                type: CREDIT_SUBJECT_ROUTE_ENUM.CUSTOMER,
              },
            }}
           >
            <el-button type="text" class='margin-right-12'>使用明细</el-button>
          </router-link>
        )}
        {CAN_VIEW_CUSTOMER_DETAIL && (
          <router-link
            to={{
              name: 'FinancialManageCreditDetail',
              params: {
                id: row.customerId,
                type: CREDIT_SUBJECT_ROUTE_ENUM.CUSTOMER,
              },
            }}
           >
            <el-button type="text">查看详情</el-button>
          </router-link>
        )}
      </div>
    ),
  },
];

// 集团维度
export const renderColumnsGroup = (
  handleChangeStatus: (row: IListItemGroup) => void,
  handleUpdate: (row: IListItemGroup) => void,
  CAN_VIEW_GROUP_DETAIL: boolean,
  CAN_VIEW_GROUP_USAGE: boolean,
  CAN_TOGGLE_GROUP: boolean,
  CAN_UPDATE_GROUP: boolean,
  CAN_VIEW_GROUP: boolean,
): IColumnsItem<IListItemGroup>[] => [
  {
    label: '集团编码',
    minWidth: '120px',
    prop: 'groupCode',
    render: row => (
      <div>
        {CAN_VIEW_GROUP ? (
          <router-link
            to={{
              name: 'CustomerManageGroupDetail',
              params: {
                id: row.groupId,
              },
            }}
           >
            <el-button type="text">
              {row.groupCode}
            </el-button>
          </router-link>
        ) : (
          <div>{row.groupCode}</div>
        )}
      </div>
    ),
  },
  {
    label: '集团名称',
    minWidth: '130px',
    prop: 'groupName',
  },
  {
    label: '旗下客户数量',
    minWidth: '120px',
    prop: 'customerCount',
  },
  {
    label: '总额度(元)',
    minWidth: '110px',
    prop: 'totalAmount',
    render: row => (
      <div>{toThousands(row.totalAmount)}</div>
    ),
  },
  {
    label: '可用额度(元)',
    minWidth: '120px',
    prop: 'availableAmount',
    render: row => (
      <div>{toThousands(row.availableAmount)}</div>
    ),
  },
  {
    label: '临时额度(元)',
    minWidth: '120px',
    prop: 'tempAmount',
    render: row => (
      <div>{toThousands(row.tempAmount)}</div>
    ),
  },
  {
    label: '启用状态',
    minWidth: '90px',
    prop: 'status',
    render: row => (
      <div>
        {filters.getEnumLabel(STATUS_NUMBER_LIST, row.amountStatus)}
      </div>
    ),
  },
  {
    label: '操作',
    width: '170px',
    fixed: 'right',
    render: row => (
      <div>
        {CAN_UPDATE_GROUP && row.amountStatus !== STATUS_NUMBER_ENUM.DIASBLE
          && <el-button type="text" onClick={() => handleUpdate(row)}>
          调整
        </el-button>}
        {CAN_TOGGLE_GROUP && <el-button
          type="text"
          class={`margin-right-12 ${row.amountStatus === STATUS_NUMBER_ENUM.ENABLE ? 'color-error' : ''}`}
          onClick={() => handleChangeStatus(row)}
        >
          {filters.getEnumLabel(STATUS_NUMBER_REVERT_LIST, row.amountStatus)}
        </el-button>}
        {CAN_VIEW_GROUP_USAGE && (
          <router-link
            to={{
              name: 'FinancialManageCreditUsageDetail',
              params: {
                id: row.groupId,
                type: CREDIT_SUBJECT_ROUTE_ENUM.GROUP,
              },
            }}
           >
            <el-button type="text" class='margin-right-12'>
              使用明细
            </el-button>
          </router-link>
        )}
        {CAN_VIEW_GROUP_DETAIL && (
          <router-link
            to={{
              name: 'FinancialManageCreditDetail',
              params: {
                id: row.groupId,
                type: CREDIT_SUBJECT_ROUTE_ENUM.GROUP,
              },
            }}
           >
            <el-button type="text">
              查看详情
            </el-button>
          </router-link>
        )}
      </div>
    ),
  },
];
