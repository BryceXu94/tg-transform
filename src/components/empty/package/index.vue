<template>
  <div class="empty">
    <img
      :src="IconNoData"
      class="icon"
    />
    <div class="description">{{ description }}</div>
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import IconNoData from '@/assets/icon_nodata.png';

export default defineComponent({
  name: 'empty',
  props: {
    description: {
      type: String,
      default: '暂无数据',
    },
  },
  setup() {
    return {
      IconNoData,
    };
  },
});
</script>
<style lang="scss" scoped>
.empty{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #B4B4B4;
  .icon{
    width: 120px;
    height: 120px;
  }
  .description {
    padding-bottom: 20px;
  }
}
</style>
