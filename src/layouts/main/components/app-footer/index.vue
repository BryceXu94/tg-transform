<template>
  <footer class="app-layout-footer">
    <section class="app-layout-footer-global">
      <div class="footer-copyright">{{ copyright }}</div>
    </section>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const YEAR = new Date().getFullYear();

export default defineComponent({
  name: 'AppFooter',
  props: {
    copyright: {
      type: String,
      default: `Copyright © ${YEAR} 广州致景信息科技有限公司`,
    },
  },
});
</script>

<style lang="scss" scoped>
.app-layout {
  &-footer {
    display: none;
    color: $color-text-caption;
    font-size: $font-size-base;
    &-global {
      margin: 30px 0;
      padding: 0 15px;
      text-align: center;
    }
  }
}
</style>
