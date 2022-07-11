<!-- 提交提示弹窗：启用停用 -->
<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    :close-on-click-modal="false"
    :width="500"
    :show-close="!hideCancel"
    @close="handleClose"
  >
    <div class="submit-tips">
      <div>{{content}}</div>
      <slot />
    </div>
    <template #footer>
      <el-row justify="end">
        <el-button v-if="!hideCancel" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">{{confirmBtnText || '确认'}}</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script lang="tsx">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SubmitTipsDialog',
  emits: ['update:visible', 'success'],
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '提交提示',
    },
    content: {
      type: String,
      default: '',
    },
    hideCancel: {
      type: Boolean,
      default: false,
    },
    confirmBtnText: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    // 关闭
    const handleClose = () => {
      emit('update:visible', false);
    };
    // 确认
    const handleConfirm = async () => {
      emit('success');
      handleClose();
    };
    return {
      handleClose,
      handleConfirm,
    };
  },
});
</script>

<style scoped lang="scss">
.submit-tips {
  line-height: 28px;
}
</style>
