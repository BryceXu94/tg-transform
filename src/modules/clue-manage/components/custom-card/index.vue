<template>
  <div class="common_layout">
    <div class="common_layout_header">{{title}}</div>
    <div class="common_layout_content">
      <slot name='default' />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
  },
});
</script>
<style lang="scss" scoped>
.common_layout{
  padding: 15px 10px 0px;
  border: 1px solid #eee;
  margin-bottom: 10px;
  &_header{
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
  &_content{
    padding: 20px;
  }
}
</style>
