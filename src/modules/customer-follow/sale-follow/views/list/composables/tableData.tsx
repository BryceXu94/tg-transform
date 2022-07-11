import { filters } from '@/core/plugins/filter';
import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { usePermissionConfig } from '@/modules/customer-follow/sale-follow/use-permission-config';
import {
  ICustomerBdDetailPageListItem,
} from '@/modules/customer-follow/sale-follow/api/types';
import { BUSINESS_MODE_LIST } from '@/constant/global';

const {
  CAN_VIEW_FOLLOW_DETAIL,
  CAN_VIEW_PUBLIC_DETAIL,
  CAN_BIND,
} = usePermissionConfig();

// 客户档案
export const renderColumns = (
): IColumnsItem<ICustomerBdDetailPageListItem>[] => {
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
          {CAN_VIEW_FOLLOW_DETAIL.value ? <router-link
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
          <div class="margin-top-5">
            {row?.regionName
            && (
              <el-tag
                type="warning"
                class="margin-right-10">
              {row?.regionName}</el-tag>
            )}
            <el-tag
              type="success"
              class="margin-right-10">
              {filters.getEnumLabel(BUSINESS_MODE_LIST, row?.businessType)}</el-tag>
          </div>
        </div>
      ),
    },
    {
      label: '所属BD',
      minWidth: '100',
      render: row => (
        <div>{row?.ownerName}</div>
      ),
    },
  ];
};

// 公海客户
export const publicRenderColumns = (
  handleBindBd: (row: ICustomerBdDetailPageListItem) => void,
): IColumnsItem<ICustomerBdDetailPageListItem>[] => {
  return [
    {
      label: '客户编码',
      minWidth: '150',
      render: row => (
        <div>
          {CAN_VIEW_PUBLIC_DETAIL.value ? <router-link
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
          <div class="margin-top-5">
            {row?.regionName
            && (
              <el-tag
                type="warning"
                class="margin-right-10">
                {row?.regionName}</el-tag>
            )}
            <el-tag
              type="success"
              class="margin-right-10">
              {filters.getEnumLabel(BUSINESS_MODE_LIST, row?.businessType)}</el-tag>
          </div>
        </div>
      ),
    },
    {
      label: '创建时间',
      minWidth: '170',
      render: row => (
        <div>{filters.formatTime(row?.createdTime)}</div>
      ),
    },
    {
      label: '操作',
      minWidth: '100',
      fixed: 'right',
      render: row => (
        <div>
          {CAN_BIND.value
          && <el-button
            type="text"
            onClick={() => handleBindBd(row)}>绑定BD</el-button>}
        </div>
      ),
    },
  ];
};
