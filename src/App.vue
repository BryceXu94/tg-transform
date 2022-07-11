<template>
  <el-config-provider
    :locale="locale"
  >
    <router-view />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import { useRouter } from 'vue-router';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  components: {
    ElConfigProvider,
  },
  setup() {
    const router = useRouter();
    const menuStore = useMenuStore();
    router.beforeEach((_, form) => {
      if (form && form?.meta?.isKeepAlive) {
        menuStore.addKeepAlive(form.name as string);
      }
    });
    return {
      locale: zhCn,
    };
  },
});
</script>
