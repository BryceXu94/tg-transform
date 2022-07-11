<!-- 额度调整弹窗 -->
<template>
  <el-dialog
    v-model="visible"
    title="额度调整"
    :close-on-click-modal="false"
    :destroy-on-close="true"
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
        :label="form.creditMark === CREDIT_SUBJECT_ENUM.GROUP ? '集团名称：' : '客户名称：'"
        prop="customerName"
      >
        {{customerName}}
      </el-form-item>
      <el-form-item
        label="调整类型："
        prop="adjustType"
      >
        <el-radio-group v-model="form.adjustType">
          <el-radio
            v-for="item in UPDATE_REDIT_TYPE_LIST"
            :key="item.value"
            :label="item.value"
          >
            {{item.label}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="调整金额："
        prop="adjustAmount"
      >
        <input-number
          clearable
          placeholder="请输入调整金额，若需要扣减请直接输入符号'-'"
          v-model="form.adjustAmount"
          :precision="2"
          :min="minAmount"
          :max="9999900"
        >
          <template #append>元</template>
        </input-number>
      </el-form-item>
      <el-form-item
        label="调整原因："
        prop="adjustReason"
      >
        <el-input
          clearable
          placeholder="请输入调整原因"
          :maxlength="100"
          v-model.trim="form.adjustReason"
        />
      </el-form-item>
      <el-form-item
        label="备注："
        prop="remark"
      >
        <el-input
          type="textarea"
          placeholder="请输入备注"
          :maxlength="500"
          show-word-limit
          v-model="form.remark"
          :autosize="{ minRows: 3, maxRows:4 }"
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

import { ElForm, ElMessage } from 'element-plus';

import { updateCreditLine, getCreditToken } from '@/modules/financial-manage/credit-manage/api';
import {
  IUpdateCreditLineReq,
  IGetCreditCustomerListRes,
  IGetCreditGroupListRes,
} from '@/modules/financial-manage/credit-manage/api/types';
import { CREDIT_SUBJECT_ENUM } from '@/constant';
import {
  UPDATE_REDIT_TYPE_ENUM,
  UPDATE_REDIT_TYPE_LIST,
} from '@/modules/financial-manage/credit-manage/constant';

export default defineComponent({
  emits: ['success'],
  setup(_props, { emit, expose }) {
    const visible = ref<boolean>(false);
    const formRef = ref<InstanceType<typeof ElForm> | null>(null);
    const formData = {
      creditMark: CREDIT_SUBJECT_ENUM.CUSTOMER,
      customerId: '',
      adjustType: UPDATE_REDIT_TYPE_ENUM.ROUTINE,
      adjustAmount: '',
      adjustReason: '',
      remark: '',
    };
    const form = ref<IUpdateCreditLineReq>({
      ...formData,
    });

    const handleOpen = () => {
      visible.value = true;
    };

    const handleClose = () => {
      formRef.value?.resetFields();
      visible.value = false;
    };

    // 确认
    const handleOk = async () => {
      try {
        await formRef.value?.validate();
        const { data } = await getCreditToken();
        await updateCreditLine({
          ...form.value,
        }, { token: data });
        ElMessage.success('操作成功');
        handleClose();
        emit('success');
      } catch (error) {
        console.log(error);
      }
    };

    const customerName = ref(''); // 客户名称
    const minAmount = ref(0); // 调整金额最低限制
    // 初始化
    const handleInit = (
      row: IGetCreditCustomerListRes['list'][0]|IGetCreditGroupListRes['list'][0],
      creditMark: CREDIT_SUBJECT_ENUM,
    ) => {
      form.value.customerId = creditMark === CREDIT_SUBJECT_ENUM.GROUP
        ? (row as IGetCreditGroupListRes['list'][0]).groupId
        : (row as IGetCreditCustomerListRes['list'][0]).customerId;
      form.value.creditMark = creditMark;
      minAmount.value = -row.totalAmount;
      customerName.value = creditMark === CREDIT_SUBJECT_ENUM.GROUP
        ? (row as IGetCreditGroupListRes['list'][0]).groupName
        : (row as IGetCreditCustomerListRes['list'][0]).customerName;
      handleOpen();
    };

    expose({
      handleInit,
    });

    return {
      UPDATE_REDIT_TYPE_LIST,
      CREDIT_SUBJECT_ENUM,
      visible,
      formRef,
      form,
      customerName,
      minAmount,
      handleOk,
      handleClose,
      handleOpen,
      formRules: {
        adjustAmount: [
          {
            required: true,
            validator: (_rule: any, value: string, callback: any) => {
              if (value === '' || value === null) {
                callback('调整金额不能为空');
                return;
              }
              if (+value === 0) {
                callback('调整金额不能为0');
                return;
              }
              callback();
            },
          },
        ],
        adjustReason: [
          { required: true, message: '调整原因不能为空' },
        ],
      },
    };
  },
});
</script>
