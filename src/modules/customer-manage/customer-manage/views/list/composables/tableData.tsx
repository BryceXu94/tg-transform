import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { formatTime } from '@tiangong/utils';
import { filters } from '@/core/plugins/filter';
import { ENABLE_DISABLE_ENUM } from '@/constant/global';
import {
  CUSTOMER_STATUS_LIST,
  PROFILE_STATE_LIST,
  PROFILE_STATE_ENUM,
  CUSTOMER_STATE_ENUM,
} from '@/modules/customer-manage/customer-manage/constant';
import { BUSINESS_MODE_LIST, BUSINESS_MODE_ENUM, ORDER_MODE_LIST } from '@/constant';
import { ICustomerInfoPageListItem } from '@/modules/customer-manage/customer-manage/api/types';

// 客户档案
export const customerRenderColumns = (
  handleEnableDisabled: (type: ENABLE_DISABLE_ENUM, customerName: string, customerId: string) => void,
  handleToUpdate: (code: string) => void,
  handleToDetail: (code: string) => void,
  handleChangeOrderType: (customerId: string, allowedOrderType: string) => void,
  handleDeleteCustomer: (customerId: string) => void,
  CAN_ADD: boolean,
  CAN_UPDATE: boolean,
  CAN_APPROVE: boolean,
  CAN_VIEW: boolean,
  CAN_TOGGLE_STATUS: boolean,
  CAN_ORDER_TYPE: boolean,
  CAN_DELETE_CUSTOMER: boolean,
): IColumnsItem<ICustomerInfoPageListItem>[] => {
  return [
    {
      label: '客户编码',
      minWidth: '150',
      render: row => (
        <div class="margin-bottom-5">
        {CAN_VIEW ? <router-link
          to={{
            name: 'CustomerManageCustomerDetail',
            params: {
              id: row.customerId,
            },
          }}
        >
          {row.customerCode}
        </router-link> : <div>{row.customerCode}</div>}
      </div>
      ),
    },
    {
      label: '客户名称',
      minWidth: '240',
      render: row => (
        <div>
          <div>{row?.customerName}</div>
          <div class="margin-top-5">
            {row?.regionName
            && (
              <el-tag
                type="warning"
                class="margin-right-10">
                {row?.regionName}
              </el-tag>
            )}
            <el-tag
              class="margin-right-10"
              type="success">
              {filters.getEnumLabel(BUSINESS_MODE_LIST, row?.businessType)}
            </el-tag>
            {row?.allowedOrderType && (
              <el-tag>
                {filters.getEnumLabel(ORDER_MODE_LIST, row?.allowedOrderType)}
              </el-tag>
            )}
          </div>
        </div>
      ),
    },
    {
      label: '所属BD',
      minWidth: '150',
      render: row => (
        <div>{row?.bdName || '--'}</div>
      ),
    },
    {
      label: '创建时间',
      minWidth: '200',
      render: row => (
        <div>{formatTime(row?.createdTime)}</div>
      ),
    },
    {
      label: '档案状态',
      minWidth: '150',
      render: row => (
        <div>{filters.getEnumLabel(PROFILE_STATE_LIST, row?.profileState)}</div>
      ),
    },
    {
      label: '客户状态',
      minWidth: '150',
      render: row => (
        <div>{filters.getEnumLabel(CUSTOMER_STATUS_LIST, row?.customerState)}</div>
      ),
    },
    {
      label: '操作',
      minWidth: '180',
      fixed: 'right',
      render: row => (
        <div>
          {/** 资料补录中 || 待提交 || 财务驳回 ｜｜ cm驳回 || bdm驳回 */}
          {CAN_ADD && [PROFILE_STATE_ENUM.WAIT_PROFILE_COMPLETE,
            PROFILE_STATE_ENUM.CM_AUDIT_FAILED,
            PROFILE_STATE_ENUM.FINANCE_AUDIT_FAILED,
            PROFILE_STATE_ENUM.WAIT_COMMIT,
            PROFILE_STATE_ENUM.BDM_AUDIT_FAILED,
          ]
            .includes(row?.profileState)
           && (
            <el-button
              type="text"
              onClick={() => handleToUpdate(row.customerId)}>
              补录
            </el-button>
           )}
          {/** 待财务审核 */}
          {CAN_APPROVE && row?.profileState === PROFILE_STATE_ENUM.WAIT_FINANCE_AUDIT
           && (
            <el-button
              type="text"
              onClick={() => handleToDetail(row.customerId)}>
              审核
            </el-button>
           )}
          {/** 审核通过并且是已启用 或者是平台业务并且档案状态不等于为准入 */}
          {CAN_UPDATE
            && (row?.profileState === PROFILE_STATE_ENUM.AUDIT_PASSED
            || (BUSINESS_MODE_ENUM.PLATFORM_BUSINESS === row?.businessType
            && row?.customerState !== CUSTOMER_STATE_ENUM.ALLOW_REJECTED))
            && (
              <el-button
                type="text"
                onClick={() => handleToUpdate(row.customerId)}>
                编辑
              </el-button>
            )}
          {/** 已启用 || 平台业务不等于待提交并且以启用 || 未准入（看板优化_BI202205V1） */}
          {CAN_TOGGLE_STATUS
          && (CUSTOMER_STATE_ENUM.ENABLE === row?.customerState
            || CUSTOMER_STATE_ENUM.ALLOW_REJECTED === row?.customerState)
          && (
            <el-button
              type="text"
              onClick={() => handleEnableDisabled(
                ENABLE_DISABLE_ENUM.DISABLE,
                row.customerName,
                row.customerId,
              )}>停用</el-button>
          )}
          {/** 已禁用 */}
          {CAN_TOGGLE_STATUS
          && CUSTOMER_STATE_ENUM.DISABLE === row?.customerState
          && (<el-button
              type="text"
              onClick={() => handleEnableDisabled(
                ENABLE_DISABLE_ENUM.ENABLE,
                row.customerName,
                row.customerId,
              )}>启用
            </el-button>
          )}
          {CAN_ORDER_TYPE && row.businessType !== BUSINESS_MODE_ENUM.PLATFORM_BUSINESS
          && (
            <el-button
              type="text"
              onClick={() => handleChangeOrderType(
                row.customerId,
                row.allowedOrderType,
              )}>下单类型</el-button>)}
          {![CUSTOMER_STATE_ENUM.ENABLE, CUSTOMER_STATE_ENUM.DISABLE]
            .includes(row.customerState)
            && CAN_DELETE_CUSTOMER
            && <el-button
              type="text"
              class="color-error"
              onClick={() => handleDeleteCustomer(row.customerId)}
            >
              删除
            </el-button>
          }

        </div>
      ),
    },
  ];
};
