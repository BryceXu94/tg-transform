<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    :modelValue="true"
    title="选择租户"
    :width="450"
  >
    <div>
      <el-radio-group v-model="selectedCompanyId">
        <el-radio
          v-for="item in companyInfoList"
          :label="item.companyId"
          :key="item.companyId"
        >
          {{ item.companyName }}
        </el-radio>
      </el-radio-group>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm()">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAccountStore } from '@/store/account';
import { useMenuStore } from '@/store/menu';
import { ElMessage } from 'element-plus';
import { ICompanyInfoItem } from '@/api/account/type';

export default defineComponent({
  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const { query } = $route;
    const { account, setCurrentCompany } = useAccountStore();
    const { getMenus, clearMenus } = useMenuStore();
    const selectedCompanyId = ref<string>('');
    const companyInfoList = computed<ICompanyInfoItem[]>(() => {
      return account?.companyInfoList || [];
    });
    const handleConfirm = async () => {
      if (!selectedCompanyId.value) {
        ElMessage.error('请选择租户');
        return;
      }
      const currentCompany = companyInfoList.value.find(it => it.companyId === selectedCompanyId.value);
      if (currentCompany) {
        setCurrentCompany(currentCompany);
        clearMenus();
        await getMenus();
      }
      const path = query.redirect as string|null;
      if (path) {
        $router.replace({ path: decodeURIComponent(path) });
      } else {
        $router.replace({
          name: 'Dashboard',
        });
      }
    };
    return {
      handleConfirm,
      companyInfoList,
      selectedCompanyId,
    };
  },
});
</script>
