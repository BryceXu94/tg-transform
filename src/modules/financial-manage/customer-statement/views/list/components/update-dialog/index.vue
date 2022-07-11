<!-- 更改账单类型弹窗 -->
<template>
  <el-dialog
    v-model="visible"
    title="更改账单类型"
    :close-on-click-modal="false"
    @close="handleClose"
    @open="handleOpen"
    :width="600"
  >
    <el-form
      :model="form"
      :rules="formRules"
      label-width="100px"
      ref="formRef"
      @keydown.enter="handleOk"
    >
      <el-form-item
        label="账单类型："
        prop="billType"
      >
        <el-radio-group v-model="form.billType">
          <el-radio
            v-for="item in BILL_TYPE_LIST"
            :key="item.value"
            :label="item.value"
            :disabled="item.value === currentBillType"
          >{{item.label}}</el-radio>
        </el-radio-group>
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

import { ElForm, ElMessage } from 'element-plus';

import { updateCustomerStatementType } from '@/modules/financial-manage/customer-statement/api';
import {
  IUpdateCustomerStatementTypeReq,
  IGetCustomerStatementListRes,
} from '@/modules/financial-manage/customer-statement/api/types';
import {
  BILL_TYPE_LIST,
} from '@/modules/financial-manage/customer-statement/constant';

export default defineComponent({
  emits: ['success'],
  setup(props, { emit, expose }) {
    const visible = ref<boolean>(false);
    const formRef = ref<InstanceType<typeof ElForm> | null>(null);
    const currentBillType = ref('');
    const formData: IUpdateCustomerStatementTypeReq = {
      billId: '',
      billType: '',
    };
    const form = ref<IUpdateCustomerStatementTypeReq>({ ...formData });

    const handleOpen = () => {
      visible.value = true;
    };

    const handleClose = () => {
      currentBillType.value = '';
      form.value = formData;
      visible.value = false;
    };

    // 确认
    const handleOk = async () => {
      try {
        await formRef.value?.validate();
        await updateCustomerStatementType({
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
    const handleInit = (row: IGetCustomerStatementListRes['list'][0]) => {
      formRef.value?.resetFields();
      form.value = {
        billId: row.billId,
        billType: '',
      };
      currentBillType.value = row.billType;
      handleOpen();
    };

    expose({
      handleInit,
    });

    return {
      BILL_TYPE_LIST,
      visible,
      formRef,
      form,
      currentBillType,
      handleOk,
      handleClose,
      handleOpen,
      formRules: {
        billType: [
          { required: true, message: '账单类型不能为空' },
        ],
      },
    };
  },
});
</script>
