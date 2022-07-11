<template>
  <custom-card title="联系信息">
    <tgo-table
      :data="encryptionData"
      :columns="columns"
    />
  </custom-card>
</template>
<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useColumns } from './use-columns';
import CustomCard from '@/modules/clue-manage/components/custom-card/index.vue';
import { IGetCluesDetailRes } from '@/modules/clue-manage/customer-clue/api/type';
import { IEncryptionData } from '@/components/encryption';
import { DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant/global';
import { CLUE_TYPE_ENUM } from '@/modules/clue-manage/develop-follow/constant';

export default defineComponent({
  components: {
    CustomCard,
  },
  props: {
    data: {
      type: Array as PropType<IGetCluesDetailRes['contactList']>,
      required: true,
    },
    clueType: {
      type: String as PropType<CLUE_TYPE_ENUM>,
      default: CLUE_TYPE_ENUM.E_COMMERCE_CLUE,
    },
  },
  setup(props) {
    const { columns } = useColumns(props.clueType);
    const encryptionData = computed(() => {
      const { data } = props;
      return data.map((v) => {
        return {
          ...v,
          contactName: {
            businessId: v.customerContactId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
            content: v.contactName,
            dateColumn: 'contactName',
          } as IEncryptionData,
          phone: {
            businessId: v.customerContactId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
            content: v.phone,
            dateColumn: 'phone',
          } as IEncryptionData,
          weChatId: {
            businessId: v.customerContactId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
            content: v.weChatId,
            dateColumn: 'weChatId',
          } as IEncryptionData,
          email: {
            businessId: v.customerContactId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.EMAIL,
            content: v.email,
            dateColumn: 'email',
          } as IEncryptionData,
          remark: {
            businessId: v.customerContactId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.FULLY_DESENSITIZE,
            content: v.remark,
            dateColumn: 'remark',
          } as IEncryptionData,
        };
      });
    });
    return {
      columns,
      encryptionData,
    };
  },
});
</script>
