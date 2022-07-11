<!-- 异常反馈弹窗 -->
<template>
  <el-dialog
    v-model="visible"
    title="异常反馈"
    :close-on-click-modal="false"
    @close="handleClose"
    @open="handleOpen"
    :width="750"
  >

    <el-form
      :model="form"
      :rules="formRules"
      label-width="100px"
      ref="formEl"
      @keydown.enter="handleOk"
    >
      <el-form-item
        label="反馈备注："
        prop="feedbackContent"
        class="feedback"
      >
        <el-input
          type="textarea"
          placeholder="请输入异常反馈"
          :rows="3"
          :maxlength="500"
          show-word-limit
          v-model="form.feedbackContent"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="图片凭证："
        prop="files"
      >
        <upload
          :limit="9"
          :sizeLimit="10"
          paste
          v-model="form.files"
          list-type="picture"
          accept="image/png,image/jpg,image/jpeg"
          tip="最多可以上传9张图片，支持png、jpg、jpeg图片格式，大小不超过10mb"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose()">取消</el-button>
        <el-button type="primary" @click="handleOk()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang='ts'>
import { defineComponent, ref } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import { abnormalFeedBack } from '@/modules/sales-manage/visit-record/api';
import { ICustomerVisitFeedbackReq, ICustomerVisitPageRes } from '@/modules/sales-manage/visit-record/api/types';

export default defineComponent({
  emits: ['success'],
  setup(props, { emit, expose }) {
    const visible = ref<boolean>(false);
    const formEl = ref<InstanceType<typeof ElForm> | null>(null);
    const formData = {
      visitId: '',
      feedbackContent: '',
      files: [],
    };
    const form = ref<ICustomerVisitFeedbackReq>({
      ...formData,
    });
    const handleOpen = () => {
      visible.value = true;
    };

    const handleClose = () => {
      visible.value = false;
    };

    // 确认
    const handleOk = async () => {
      try {
        await formEl.value?.validate();
        await abnormalFeedBack(form.value);
        ElMessage.success('操作成功');
        handleClose();
        emit('success');
      } catch (error) {
        console.log(error);
      }
    };

    // 初始化
    const handleInit = (row: ICustomerVisitPageRes['list'][0]) => {
      formEl.value?.resetFields();
      form.value = {
        ...formData,
        visitId: row.visitId,
      };
      handleOpen();
    };

    expose({
      handleInit,
    });

    return {
      visible,
      formEl,
      form,
      handleOk,
      handleClose,
      handleOpen,
      formRules: {
        feedbackContent: [
          { required: true, message: '异常反馈不能为空' },
        ],
        files: [
          { required: true, message: '图片凭证不能为空' },
        ],
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.feedback{
  :deep(.el-textarea){
    border: 1px solid #ccc;
    .el-input__count{
      position: relative;
      bottom: 0;
      left: 530px;
    }
  }
  :deep(.el-textarea__inner){
    box-shadow: none;
    padding-bottom: 20px;
    &:focus{
      box-shadow: none;
    }
  }
  :deep(.is-error .el-textarea__inner){
    box-shadow: none;
  }
}
:deep(.feedback.is-error){
  .el-textarea {
    border-color: red;
  }
  .textarea__inner{
    box-shadow: none;
  }
}
</style>
