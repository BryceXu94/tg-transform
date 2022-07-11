<template>
  <div class="page padding-20">
    <el-row class="title-wrap">
      <el-col :span="12">
        <span class="text">
          {{title}}
        </span>
      </el-col>
      <el-col :span="12" class="align-right">
        <el-button
          v-if="!readOnly"
          type="primary"
          @click="handleSave"
        >保存</el-button>
        <el-button @click="cancel()">取消</el-button>
      </el-col>
    </el-row>
    <el-tabs
      v-model="currentTab"
      :before-leave="handleClick"
    >
      <el-tab-pane label="基本信息" :name="baseInfoName">
        <base-info
          ref="baseInfoRef"
          :customerId="customerId"
          @saveSuccess="baseInfoSaveSuccess"
          :readOnly="readOnly"
        />
      </el-tab-pane>
      <el-tab-pane label="额度" :name="quotaName">
        <quota
          :customerId="customerId"
          ref="quotaRef"
          :readOnly="readOnly"
        />
      </el-tab-pane>
      <el-tab-pane label="外部系统对应关系" :name="relationName">
        <relation
          :customerId="customerId"
          ref="relationRef"
          :readOnly="readOnly"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import BaseInfo from './components/base-info.vue';
import Quota from '@/modules/customer/view/create/components/quota.vue';
import Relation from '@/modules/customer/view/create/components/relation.vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';

export default defineComponent({
  name: 'index',
  components: {
    BaseInfo,
    Quota,
    Relation,
  },
  setup() {
    const customerId = ref<string>('');
    const baseInfoRef = ref<InstanceType<typeof BaseInfo> | null>(null);
    const quotaRef = ref<InstanceType<typeof Quota> | null>(null);
    const relationRef = ref<InstanceType<typeof Relation> | null>(null);
    const currentTab = ref<string>(BaseInfo.name);
    const readOnly = ref<boolean>(false);
    const title = ref<string>('');
    const router = useRouter();
    const getRef = (name: string) => {
      switch (name) {
        case BaseInfo.name: return baseInfoRef;
        case Quota.name: return quotaRef;
        case Relation.name: return relationRef;
        default: return null;
      }
    };
    const handleSave = async () => {
      const tabRef = getRef(currentTab.value);
      if (tabRef) {
        await tabRef.value?.handleSave();
        // console.log(tabRef);
      }
      // baseInfo.value?.handleSave();
    };
    const cancel = () => {
      router.push('/customer/list');
    };
    const handleClick = async (activeName: string, oldName: string) => {
      const tabRef = getRef(oldName);
      if (!customerId.value) {
        await ElMessageBox.confirm(
          '是否保存客户基本信息?',
          '提示',
          {
            confirmButtonText: '保存',
            cancelButtonText: '取消',
          },
        );
        await handleSave();
      }
      if (tabRef && tabRef.value?.isChange()) {
        await ElMessageBox.confirm(
          '请先保存当前内容后再切换?',
          '提示',
          {
            confirmButtonText: '保存',
            cancelButtonText: '取消',
          },
        );
        await handleSave();
      }
      return true;
    };
    const baseInfoSaveSuccess = (data: string) => {
      customerId.value = data;
      router.push({
        name: 'CustomerEdit',
        params: {
          id: data,
        },
      });
    };
    onMounted(() => {
      const route = useRoute();
      const { id } = route.params;
      if (id) {
        customerId.value = String(id);
      }
      if (route.meta.readOnly) {
        readOnly.value = Boolean(route.meta.readOnly);
      }
      if (route.meta.title) {
        title.value = String(route.meta.title);
      }
    });
    return {
      currentTab,
      handleClick,
      handleSave,
      cancel,
      baseInfoRef,
      quotaRef,
      relationRef,
      customerId,
      quotaName: Quota.name,
      relationName: Relation.name,
      baseInfoName: BaseInfo.name,
      readOnly,
      baseInfoSaveSuccess,
      title,
    };
  },
});
</script>

<style scoped lang="scss">
.page{
  background: #fff;
  border-radius: 5px;
  .title-wrap{
    height: 64px;
    line-height: 64px;
    width: 100%;
    .text{
      width: 32px;
      height: 24px;
      font-size: 16px;
      font-weight: bold;
      color: #18181A;
      line-height: 24px;
    }
  }
}
</style>
