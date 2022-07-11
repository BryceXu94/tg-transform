import { IColumnsItem } from '@/components/custom-table/package/type.d';
import {
  IDetailBusinessInfoResShippingAddressItem,
  IDetailBusinessInfoResBrandListItemCoreCategoryListItem,
  IDetailBusinessInfoResBrandListItemCooperationModeListItem,
  IDetailBusinessInfoResBrandListItemSaleChannelListItem,
} from '@/modules/customer-manage/customer-manage/api/types';
import { IDictionaryItem } from '@/hooks/use-dictionary/types';
import { YES_NO_LIST, SOURCE_TYPE_LIST, DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant';
import { filters } from '@/core/plugins/filter';

// 销售渠道
export const channelRenderColumns = (
  saleChannel: IDictionaryItem[],
): IColumnsItem<IDetailBusinessInfoResBrandListItemSaleChannelListItem>[] => {
  return saleChannel.length ? [
    {
      label: '销售渠道',
      render: row => (
        <div>{filters.getEnumLabel(saleChannel, row.channelCode)}</div>
      ),
    },
    {
      label: '销售占比',
      render: row => (
        <div>{row?.salesRatio || '--'}%</div>
      ),
    },
  ] : [];
};

// 合作模式
export const cooperationRenderColumns = (
  cooperation: IDictionaryItem[],
): IColumnsItem<IDetailBusinessInfoResBrandListItemCooperationModeListItem>[] => {
  return cooperation.length ? [
    {
      label: '合作模式',
      render: row => (
        <div>{filters.getEnumLabel(cooperation, row.cooperationType)}</div>
      ),
    },
    {
      label: '模式占比',
      render: row => (
        <div>{row?.cooperationRatio || '--'}%</div>
      ),
    },
  ] : [];
};

// 核心品类
export const categoryRenderColumns = (): IColumnsItem<IDetailBusinessInfoResBrandListItemCoreCategoryListItem>[] => {
  return [
    {
      label: '品类名称',
      render: row => (
        <div>{row?.category}</div>
      ),
    },
    {
      label: '品类占比',
      render: row => (
        <div>{row?.ratio || '--'}%</div>
      ),
    },
    {
      label: '加工均价/元',
      render: row => (
        <div>{row?.machiningAveragePrice}</div>
      ),
    },
    {
      label: '客销单价/元',
      render: row => (
        <div>{row?.perTicketSales}</div>
      ),
    },
  ];
};

// 收货地址
export const addressRenderColumns = (
  address: IDictionaryItem[],
  pageTab: string,
): IColumnsItem<IDetailBusinessInfoResShippingAddressItem>[] => {
  return [
    {
      label: '收货人',
      render: row => (
        <encryption
          data={{
            businessId: row?.customerAddressId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
            content: row?.recipient,
            pageTab,
            dateColumn: 'recipient',
          }}
        ></encryption>
      ),
    },
    {
      label: '来源类型',
      render: row => (
        <div>{filters.getEnumLabel(SOURCE_TYPE_LIST, row.sourceType)}</div>
      ),
    },
    {
      label: '收货电话',
      render: row => (
        <encryption
          data={{
            businessId: row?.customerAddressId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
            content: row?.recipientPhone,
            pageTab,
            dateColumn: 'recipientPhone',
          }}
        ></encryption>
      ),
    },
    {
      label: '收货地址',
      render: row => (
        <encryption
          data={{
            businessId: row?.customerAddressId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.ADDRESS,
            content: [row?.region, row?.addressDetail],
            prefix: `${row?.province}${row?.city}`,
            pageTab,
            dateColumn: ['region', 'addressDetail'],
          }}
        ></encryption>
      ),
    },
    {
      label: '地址类型',
      render: row => (
        <div>{filters.getEnumLabel(address, row?.type)}</div>
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
