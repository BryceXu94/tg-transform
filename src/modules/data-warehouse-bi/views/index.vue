<template>
  <app-page>
    <template #main="{ height }">
      <iframe
        ref="iframeRef"
        width="100%"
        :height="height - 10"
        :src="iframeUrl"
      ></iframe>
    </template>
  </app-page>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { boardGetToken } from '../api';

export default defineComponent({
  name: 'SaleOperateBi',
  setup() {
    const iframeRef = ref<HTMLIFrameElement>();
    const iframeUrl = ref<string>('');
    const $route = useRoute();

    const init = async () => {
      const { data: ssoToken } = await boardGetToken();
      iframeUrl.value = `${$route?.meta?.url}?ssoToken=${ssoToken}`;
    };

    watch(() => $route?.meta?.url, () => {
      init();
    }, { immediate: true });

    return {
      iframeRef,
      iframeUrl,
    };
  },
});
</script>

<style scoped lang="scss">
iframe {
  border: none;
}
</style>
