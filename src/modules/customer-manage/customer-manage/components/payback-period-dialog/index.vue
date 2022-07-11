<!-- 回款周期说明弹窗 -->
<template>
  <el-dialog
    v-model="visible"
    title="回款周期说明"
    :close-on-click-modal="false"
    @close="handleClose"
    :width="600"
  >
    <custom-table
      border
      :data="data"
      :columns="renderColumns()"
    />
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { renderColumns } from './tableData';

export default defineComponent({
  setup(props, { expose }) {
    const visible = ref<boolean>(false);
    const data = [
      { period: '30天', desc: '代表1个自然月' },
      { period: '45天', desc: '代表1个自然月加半个月' },
      { period: '60天', desc: '代表2个自然月' },
      { period: '90天', desc: '代表3个自然月' },
      { period: '120天', desc: '代表4个自然月' },
    ];

    const handleOpen = () => {
      visible.value = true;
    };

    const handleClose = () => {
      visible.value = false;
    };

    // 初始化
    const handleInit = () => {
      handleOpen();
    };

    expose({
      handleInit,
    });

    return {
      visible,
      data,
      renderColumns,
      handleClose,
      handleOpen,
    };
  },
});
</script>
