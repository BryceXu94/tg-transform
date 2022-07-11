<!-- 该组件是为了header部分的左边筛选条件与右侧按钮布局五五分 -->
<template>
  <!-- 如果右侧没有按钮，则占一整行 -->
  <div
    class="header"
  >
    <div
      class="header-content"
    >
      <slot />
    </div>
    <div
      class="header-btn"
    >
      <slot name="button" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HeaderArea',
});
</script>

<style lang="scss" scoped>
.header{
  display: flex;
  &-content {
    flex: 1 1 auto;
  }
  &-btn {
    display: flex;
    align-items: flex-end;
  }
}
</style>
