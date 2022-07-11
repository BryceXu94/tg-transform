<!-- 初始授信弹窗 -->
<template>
  <el-dialog
    v-model="visible"
    title="初始额度"
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
      ref="formEl"
      @keydown.enter="handleOk"
    >
      <el-form-item
        label="授信主体："
        prop="creditMark"
      >
        <el-radio-group
          v-model="form.creditMark"
          @change="handleChangeSubjectType"
        >
          <el-radio
            v-for="item in CREDIT_SUBJECT_LIST"
            :key="item.value"
            :label="item.value"
          >
            {{item.label}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="form.creditMark === CREDIT_SUBJECT_ENUM.CUSTOMER"
        label="客户名称："
        prop="customerId"
        :rules="{ required: true, message: '客户名称不能为空' }"
      >
        <query-select
          placeholder="请选择客户"
          v-model="form.customerId"
          :method="getCustomerOptions"
          :config="{
            valueKey: 'customerId',
            labelKey: 'customerName',
            keywordQueryKey: 'customerName',
            valueQueryKey: 'customerName',
            dataKey: 'data',
            showValue: true,
          }"
          :queryParams="{
            customerState: CUSTOMER_STATUS_ENUM.ENABLE,
            creditGrantingState: CUSTOMER_CREDIT_APPROVE_STATUS_ENUM.WAIT_CREDIT_GRANTING,
          }"
          @change="handleChangeCustomer"
        />
      </el-form-item>
      <el-form-item
        v-if="form.creditMark === CREDIT_SUBJECT_ENUM.GROUP"
        label="集团名称："
        prop="groupId"
        :rules="{ required: true, message: '集团名称不能为空' }"
      >
        <query-select
          :needInitOptions="true"
          placeholder="请选择集团"
          v-model="form.groupId"
          :method="getGroupOptions"
          :config="{
            valueKey: 'groupId',
            labelKey: 'groupName',
            keywordQueryKey: 'groupName',
            valueQueryKey: 'groupName',
            dataKey: 'data',
          }"
          @change="handleChangeGroup"
        />
      </el-form-item>
      <el-form-item
        label="初始金额："
        prop="initAmount"
      >
        <input-number
          clearable
          placeholder="请输入初始金额"
          v-model="form.initAmount"
          :min="0"
          :max="9999900"
          :precision="2"
        >
          <template #append>元</template>
        </input-number>
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

import { getCustomerOptions, getGroupOptions } from '@/api/query-options';
import { ICustomerInfoSearchResItem, IGetGroupOptionsRes } from '@/api/query-options/type.d';
import { initialCreditLine } from '@/modules/financial-manage/credit-manage/api';
import {
  CUSTOMER_CREDIT_APPROVE_STATUS_ENUM,
  CUSTOMER_STATUS_ENUM,
  CREDIT_SUBJECT_ENUM,
  CREDIT_SUBJECT_LIST,
} from '@/constant';

export default defineComponent({
  emits: ['success'],
  setup(_props, { emit, expose }) {
    const visible = ref<boolean>(false);
    const formEl = ref<InstanceType<typeof ElForm> | null>(null);
    const formData = {
      creditMark: CREDIT_SUBJECT_ENUM.CUSTOMER,
      customerId: '',
      groupId: '',
      customerName: '',
      initAmount: '',
      remark: '',
    };
    const form = ref({
      ...formData,
    });

    const handleOpen = () => {
      visible.value = true;
    };

    const handleClose = () => {
      formEl.value?.resetFields();
      visible.value = false;
    };

    // 确认
    const handleOk = async () => {
      try {
        await formEl.value?.validate();
        await initialCreditLine({
          ...form.value,
          customerId: form.value.creditMark === CREDIT_SUBJECT_ENUM.GROUP
            ? form.value.groupId
            : form.value.customerId,
        });
        ElMessage.success('操作成功');
        handleClose();
        emit('success');
      } catch (error) {
        console.log(error);
      }
    };

    // 选择客户
    const handleChangeCustomer = (_val: string, row: ICustomerInfoSearchResItem) => {
      form.value.customerName = row.customerName;
    };

    // 选择集团
    const handleChangeGroup = (_val: string, row: IGetGroupOptionsRes) => {
      form.value.customerName = row.groupName;
    };

    // 切换授信主体
    const handleChangeSubjectType = (creditMark: CREDIT_SUBJECT_ENUM) => {
      form.value = {
        ...formData,
        creditMark,
      };
    };

    // 初始化
    const handleInit = (subjectType: CREDIT_SUBJECT_ENUM) => {
      form.value.creditMark = subjectType;
      handleOpen();
    };

    expose({
      handleInit,
    });

    return {
      CUSTOMER_STATUS_ENUM,
      CUSTOMER_CREDIT_APPROVE_STATUS_ENUM,
      CREDIT_SUBJECT_ENUM,
      CREDIT_SUBJECT_LIST,
      visible,
      formEl,
      form,
      handleOk,
      handleClose,
      handleOpen,
      handleChangeCustomer,
      handleChangeGroup,
      handleChangeSubjectType,
      getCustomerOptions,
      getGroupOptions,
      formRules: {
        initAmount: [
          {
            required: true,
            validator: (_rule: any, value: string, callback: any) => {
              if (value === '' || value === null) {
                callback('初始金额不能为空');
                return;
              }
              if (+value === 0) {
                callback('初始金额不能为0');
                return;
              }
              callback();
            },
          },
        ],
      },
    };
  },
});
</script>
