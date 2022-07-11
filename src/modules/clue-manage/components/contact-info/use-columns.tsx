import { computed } from 'vue';
import { ITableColumnsItem } from '@/components/tgo-table/package/type';
import { IGetCluesDetailRes } from '@/modules/clue-manage/customer-clue/api/type';
import { useDictionary } from '@/hooks/use-dictionary';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { CLUE_TYPE_ENUM } from '@/modules/clue-manage/develop-follow/constant';

export const useColumns = (clueType: CLUE_TYPE_ENUM) => {
  const { getDictionaryOptions } = useDictionary();
  const POST_NAME_OPTIONS = computed(() => getDictionaryOptions(CX_DICTIONARY_KEY.POST_NAME));
  const columns = computed<ITableColumnsItem<IGetCluesDetailRes['contactList'][0]>[]>(() => [
    {
      label: '联系人',
      prop: 'contactName',
      render: row => (
        <encryption
          data={row.contactName}
        />
      ),
    },
    {
      label: '所属职务',
      prop: 'post',
      type: 'enum',
      options: POST_NAME_OPTIONS.value,
    },
    {
      label: '联系电话',
      prop: 'phone',
      render: row => (
        <encryption
          data={row.phone}
        />
      ),
    },
    {
      label: '联系微信',
      prop: 'weChatId',
      hidden: clueType === CLUE_TYPE_ENUM.E_COMMERCE_CLUE,
      render: row => (
        <encryption
          data={row.weChatId}
        />
      ),
    },
    {
      label: '联系人邮箱',
      prop: 'email',
      render: row => (
        <encryption
          data={row.email}
        />
      ),
    },
    {
      label: '备注信息',
      prop: 'remark',
      render: row => (
        <encryption
          data={row.remark}
        />
      ),
    },
  ]);
  return {
    columns,
  };
};
