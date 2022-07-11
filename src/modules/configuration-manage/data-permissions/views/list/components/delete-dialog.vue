<!-- 删除提示弹窗-->
<template>
  <el-dialog
    :modelValue="visible"
    @close="handleCancel"
    :close-on-click-modal="false"
    title="删除提示"
    width="500px"
  >
    <div class="delete-tips">删除则该配置失效，是否继续确认？</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineEmits, withDefaults, defineProps } from 'vue';
import { deleteDataPermissionConfig } from '@/modules/configuration-manage/data-permissions/api';

const emits = defineEmits(['destroy', 'success']);
const props = withDefaults(
  defineProps<{
    configId: string;
    pageNum: number;
    success:(pageNum: number) => void;
  }>(),
  {
    pageNum: 1,
    configId: '',
    success: () => {},
  },
);

const visible = ref(true);

// 取消
const handleCancel = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

// 确认
const handleConfirm = async () => {
  try {
    await deleteDataPermissionConfig({
      configId: props.configId,
    });
    handleCancel();
    props.success(props.pageNum);
  } catch (e) {
    console.log(e);
  }
};
</script>

<style scope lang="scss">
.delete-tips{
  line-height: 28px;
}
</style>
