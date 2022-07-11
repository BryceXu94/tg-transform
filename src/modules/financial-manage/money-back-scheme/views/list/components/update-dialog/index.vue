<!-- 设置预计回款日弹窗 -->
<template>
  <el-dialog
    v-model="visible"
    title="预计回款日"
    :close-on-click-modal="false"
    @close="handleClose"
    @open="handleOpen"
    :width="600"
  >
    <el-form
      :model="form"
      :rules="formRules"
      label-width="120px"
      ref="formRef"
      @keydown.enter="handleOk"
    >
      <el-form-item
        label="预计回款日："
        prop="planRepaymentDate"
      >
        <el-date-picker
          v-model="form.planRepaymentDate"
          type="date"
          placeholder="请选择预计回款日"
          :disabled-date="(time: Date) => time.getTime() < new Date(jumpDays(Date.now(), -1)).getTime()"
          value-format="YYYY-MM-DD"
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

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { jumpDays } from '@tiangong/utils';

import { ElForm, ElMessage } from 'element-plus';

import { updateMoneyBackSchemeDate } from '@/modules/financial-manage/money-back-scheme/api';
import {
  IUpdateMoneyBackSchemeDateReq,
  IGetMoneyBackSchemeListRes,
} from '@/modules/financial-manage/money-back-scheme/api/types';

export default defineComponent({
  emits: ['success'],
  setup(props, { emit, expose }) {
    const visible = ref<boolean>(false);
    const formRef = ref<InstanceType<typeof ElForm> | null>(null);
    const formData: IUpdateMoneyBackSchemeDateReq = {
      repaymentPlanId: '',
      planRepaymentDate: '',
    };
    const form = ref<IUpdateMoneyBackSchemeDateReq>({ ...formData });

    const handleOpen = () => {
      visible.value = true;
    };

    const handleClose = () => {
      form.value = formData;
      visible.value = false;
    };

    // 确认
    const handleOk = async () => {
      try {
        await formRef.value?.validate();
        await updateMoneyBackSchemeDate({
          ...form.value,
        });
        ElMessage.success('操作成功');
        handleClose();
        emit('success');
      } catch (error) {
        console.log(error);
      }
    };

    // 初始化
    const handleInit = (row: IGetMoneyBackSchemeListRes['list'][0]) => {
      formRef.value?.resetFields();
      form.value = {
        repaymentPlanId: row.repaymentPlanId,
        planRepaymentDate: '',
      };
      handleOpen();
    };

    expose({
      handleInit,
    });

    return {
      visible,
      formRef,
      form,
      handleOk,
      handleClose,
      handleOpen,
      jumpDays,
      formRules: {
        planRepaymentDate: [
          { required: true, message: '预计回款日不能为空' },
        ],
      },
    };
  },
});
</script>
