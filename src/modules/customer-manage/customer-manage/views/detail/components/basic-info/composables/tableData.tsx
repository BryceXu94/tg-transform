import { IColumnsItem } from '@/components/custom-table/package/type.d';
import {
  IBaseInfoCustomerAddressItem,
} from '@/modules/customer-manage/customer-manage/api/types';
import { YES_NO_LIST, DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant';
import { filters } from '@/core/plugins/filter';
// 收货地址
export const addressRenderColumns = (
  pageTab: string,
): IColumnsItem<IBaseInfoCustomerAddressItem>[] => {
  return [
    {
      label: '经营地址（省市区）',
      render: row => (
        <encryption
          data={{
            businessId: row?.customerAddressId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.ADDRESS,
            content: [row?.region],
            prefix: `${row?.province}${row?.city}`,
            pageTab,
            dateColumn: ['region'],
          }}
        ></encryption>
      ),
    },
    {
      label: '经营地址（详细地址）',
      render: row => (
        <encryption
          data={{
            businessId: row?.customerAddressId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.ADDRESS,
            content: [row?.addressDetail],
            pageTab,
            dateColumn: ['addressDetail'],
          }}
        ></encryption>
      ),
    },
    {
      label: '是否默认',
      render: row => (
        <div>{filters.getEnumLabel(YES_NO_LIST, row?.isDefault)}</div>
      ),
    },
  ];
};
