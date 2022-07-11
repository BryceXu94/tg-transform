<template>
  <div class="relationship-info">
    <div class="relationship-info__title margin-bottom-10">联系信息</div>
    <div class="padding-10" v-if="CAN_VIEW_CONTACT_DATA">
      <custom-table
        border
        :data="contactList"
        :columns="renderColumns(postList, pageTab)"
      />
    </div>
    <empty v-else />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';

import {
  renderColumns,
} from './composables/tableData';
import {
  IDetailContactsRes,
} from '@/modules/customer-manage/customer-manage/api/types';

import { useDictionary } from '@/hooks/use-dictionary';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<IDetailContactsRes>,
      default: () => {},
    },
  },
  setup(props) {
    const contactList = computed(() => props.data?.customerContactList);

    // 获取数据字典（所属职务）
    const { getDictionaryOptions } = useDictionary();
    const postList = computed(() => getDictionaryOptions(CX_DICTIONARY_KEY.POST_NAME) || []);

    // 权限
    const {
      CAN_VIEW_CONTACT_DATA,
    } = usePermissionConfig();

    return {
      contactList,
      postList,
      CAN_VIEW_CONTACT_DATA,

      renderColumns,
      pageTab: 'relationshipInfo',
    };
  },
});
</script>

<style lang="scss" scoped>
.relationship-info {
  border: 1px solid #eee;
  margin-bottom: 10px;
  padding: 15px 10px;
  &__title {
    display: flex;
    align-items: center;
    position: relative;
    font-weight: bold;
    padding-left: 10px;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 3px;
      height: 16px;
      background-color: var(--el-color-primary);
      transform: translateY(-50%);
    }
  }
}
</style>
