import { filters } from '@/core/plugins/filter';
import { IColumnsItem } from '@/components/custom-table/package/type.d';
import {
  ICustomerGroupRelationPageResListItem,
} from '@/modules/customer-follow/design-follow/api/types';
import { BUSINESS_TYPE_LIST } from '@/modules/customer-follow/design-follow/constant';

// 设计跟进
export const renderColumns = (
  CAN_VIEW_FOLLOW_DETAIL: boolean,
): IColumnsItem<ICustomerGroupRelationPageResListItem>[] => {
  return [
    {
      type: 'selection',
      width: '50',
    },
    {
      label: '客户编码',
      minWidth: '150',
      render: row => (
        <div>
          {CAN_VIEW_FOLLOW_DETAIL ? (
            <router-link
              to={{
                name: 'CustomerManageCustomerDetail',
                params: {
                  id: row.customerId,
                },
              }}
            >
              {row.customerCode}
            </router-link>
          ) : (
            <div>{row.customerCode}</div>
          )}
        </div>
      ),
    },
    {
      label: '客户名称',
      minWidth: '200',
      render: row => (
        <div>
          <div>{row?.customerName}</div>
          <div class='margin-top-5'>
            {row?.regionName
              && (<el-tag
                type="warning"
                class="margin-right-10">{row?.regionName}</el-tag>
              )}
            <el-tag
              class="margin-right-10"
              type="success">
                {filters.getEnumLabel(BUSINESS_TYPE_LIST, row.businessType)}</el-tag>
          </div>
        </div>
      ),
    },
    {
      label: '所属设计组',
      minWidth: '100',
      render: row => (
        <div>{row?.groupName}</div>
      ),
    },
  ];
};

// 公海客户
export const publicRenderColumns = (
  CAN_VIEW_PUBLIC_DETAIL: boolean,
  CAN_BIND: boolean,
  handleBindDesign: (row: ICustomerGroupRelationPageResListItem) => void,
): IColumnsItem<ICustomerGroupRelationPageResListItem>[] => {
  return [
    {
      label: '客户编码',
      minWidth: '150',
      render: row => (
        <div>
          {CAN_VIEW_PUBLIC_DETAIL ? <router-link
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
      minWidth: '200',
      render: row => (
        <div>
          <div>{row?.customerName}</div>
          <div class='margin-top-5'>
            {row?.regionName
            && (
            <el-tag
              type="warning"
              class="margin-right-10">{row?.regionName}</el-tag>
            )}
            <el-tag
              class="margin-right-10"
              type="success">
                {filters.getEnumLabel(BUSINESS_TYPE_LIST, row.businessType)}
            </el-tag>
          </div>
        </div>
      ),
    },
    {
      label: '创建时间',
      minWidth: '170',
      render: row => (
        <div>{filters.formatTime(row.createdTime)}</div>
      ),
    },
    {
      label: '操作',
      minWidth: '100',
      fixed: 'right',
      render: row => (
        <div>
          {CAN_BIND
          && <el-button
            type="text"
            onClick={() => handleBindDesign(row)}>
            绑定设计组</el-button>}
        </div>
      ),
    },
  ];
};
