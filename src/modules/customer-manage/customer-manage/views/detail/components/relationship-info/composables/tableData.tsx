import { IColumnsItem } from '@/components/custom-table/package/type.d';

import {
  IDetailContactsCustomerContactListItem,
} from '@/modules/customer-manage/customer-manage/api/types';
import { ENABLE_DISABLE_LIST, SOURCE_TYPE_LIST, DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant';
import { filters } from '@/core/plugins/filter';
import { IDictionaryItem } from '@/hooks/use-dictionary/types';

// 联系信息
export const renderColumns = (
  postList: IDictionaryItem[],
  pageTab: string,
): IColumnsItem<IDetailContactsCustomerContactListItem>[] => {
  return [
    {
      label: '联系人姓名',
      render: row => (
        <encryption
          data={{
            businessId: row?.customerContactId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
            content: row?.contactName,
            pageTab,
            dateColumn: 'contactName',
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
      label: '所属职务',
      render: row => (
        <div>{filters.getEnumLabel(postList, row?.post)}</div>
      ),
    },
    {
      label: '联系人电话',
      render: row => (
        <encryption
          data={{
            businessId: row?.customerContactId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
            content: row?.phone,
            pageTab,
            dateColumn: 'phone',
          }}
        ></encryption>
      ),
    },
    {
      label: '联系人微信',
      render: row => (
        <encryption
          data={{
            businessId: row?.customerContactId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
            content: row?.weChatId,
            pageTab,
            dateColumn: 'weChatId',
          }}
        ></encryption>
      ),
    },
    {
      label: '联系人邮箱',
      render: row => (
        <encryption
          data={{
            businessId: row?.customerContactId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.EMAIL,
            content: row?.email,
            pageTab,
            dateColumn: 'email',
          }}
        ></encryption>
      ),
    },
    {
      label: '备注信息',
      render: row => (
        <encryption
          data={{
            businessId: row?.customerContactId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
            content: row?.remark,
            pageTab,
            dateColumn: 'remark',
          }}
        ></encryption>
      ),
    },
    {
      label: '启用状态',
      render: row => (
        <div>{filters.getEnumLabel(ENABLE_DISABLE_LIST, row?.enable)}</div>
      ),
    },
  ];
};
