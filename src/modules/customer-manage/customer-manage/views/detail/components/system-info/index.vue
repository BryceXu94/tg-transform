<template>
  <div class="system-info">
    <div class="system-info__title margin-bottom-10">其他主体关联信息</div>
    <div class="padding-10" v-if="CAN_VIEW_SYSTEM_LINKAGES">
      <custom-table
        border
        :data="data || []"
        :columns="renderColumns()"
      />
    </div>
    <empty v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import {
  renderColumns,
} from './composables/tableData';
import {
  IGetCustomerRelationRes,
} from '@/modules/customer-manage/customer-manage/api/types';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<IGetCustomerRelationRes[]>,
      default: () => [],
    },
  },
  setup() {
    // 权限
    const {
      CAN_VIEW_SYSTEM_LINKAGES,
    } = usePermissionConfig();
    return {
      renderColumns,
      CAN_VIEW_SYSTEM_LINKAGES,
    };
  },
});
</script>

<style lang="scss" scoped>
.system-info {
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
