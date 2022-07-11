<template>
  <main class="app-layout-body">
    <section class="page-content">
      <slot />
      <!-- <transition name="fade-transform" mode="out-in">
      </transition> -->
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppBody',
  setup() {},
});
</script>

<style lang="scss" scoped>

.app-layout-body {
  padding: 24px;
  position: relative;
  a {
    color: $color-link;
  }
}
.page-content {
  // border-radius: 4px;
  // background-color: #fff;
}
</style>
