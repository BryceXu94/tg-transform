<!-- 导出弹窗 -->
<template>
  <el-dialog
    v-model="visible"
    title="导出选择"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="handleClose"
    @open="handleOpen"
    :width="600"
  >
    <el-form
      :model="formData"
      :rules="formRules"
      label-width="100px"
      ref="formEl"
      @keydown.enter="handleOk"
    >
      <el-form-item
        label="授信主体："
        prop="subjectType"
      >
        <el-radio-group
          v-model="formData.subjectType"
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
        v-if="formData.subjectType === CREDIT_SUBJECT_ENUM.CUSTOMER"
        label="客户名称："
        prop="customerId"
      >
        <query-select
          :key="CREDIT_SUBJECT_ENUM.CUSTOMER"
          :needInitOptions="true"
          placeholder="请选择客户名称"
          v-model="formData.customerId"
          clearable
          :method="getCustomerOptions"
          :config="{
            valueKey: 'customerId',
            labelKey: 'customerName',
            keywordQueryKey: 'customerName',
            valueQueryKey: 'customerName',
            dataKey: 'data',
          }"
          :queryParams="{
            customerState: CUSTOMER_STATUS_ENUM.ENABLE,
            creditGrantingState: CUSTOMER_CREDIT_APPROVE_STATUS_ENUM.ENABLE,
          }"
        />
      </el-form-item>
      <el-form-item
        v-if="formData.subjectType === CREDIT_SUBJECT_ENUM.GROUP"
        label="集团名称："
        prop="groupId"
      >
        <query-select
          :key="CREDIT_SUBJECT_ENUM.GROUP"
          :needInitOptions="true"
          placeholder="请选择集团名称"
          v-model="formData.groupId"
          clearable
          :method="getGroupOptions"
          :config="{
            valueKey: 'groupId',
            labelKey: 'groupName',
            keywordQueryKey: 'groupName',
            valueQueryKey: 'groupName',
            dataKey: 'data',
          }"
        />
      </el-form-item>
      <el-form-item
        label="导出类型："
        prop="exportType"
      >
        <el-select
          v-model="formData.exportType"
          class="select-width"
        >
          <el-option
            v-for="item in exportTypeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="导出时间："
        prop="date"
        class="select-width"
      >
        <el-date-picker
          v-model="formData.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :disabledDate="disabledDate"
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
import { defineComponent, ref, computed } from 'vue';
import { formatTime } from '@tiangong/utils';

import { ElForm, ElMessage } from 'element-plus';

import { exportByBlob } from '@/core/utils/file-download';
import { filters } from '@/core/plugins/filter';
import { getCustomerOptions, getGroupOptions } from '@/api/query-options';
import {
  CUSTOMER_CREDIT_APPROVE_STATUS_ENUM,
  CUSTOMER_STATUS_ENUM,
  CREDIT_SUBJECT_ENUM,
  CREDIT_SUBJECT_LIST,
} from '@/constant';
import {
  EXPORT_TYPE_LIST,
  GROUP_EXPORT_TYPE_LIST,
} from '@/modules/financial-manage/credit-manage/constant';

export default defineComponent({
  emits: ['success'],
  setup(_props, { expose }) {
    const visible = ref<boolean>(false);
    const formEl = ref<InstanceType<typeof ElForm> | null>(null);
    const baseData = {
      subjectType: CREDIT_SUBJECT_ENUM.CUSTOMER,
      customerId: '',
      groupId: '',
      exportType: '',
      date: [],
    };
    const formData = ref({
      ...baseData,
    });

    const exportTypeOptions = computed(() => {
      return formData.value.subjectType === CREDIT_SUBJECT_ENUM.GROUP ? GROUP_EXPORT_TYPE_LIST : EXPORT_TYPE_LIST;
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
        const data = {
          customerId: formData.value.subjectType === CREDIT_SUBJECT_ENUM.GROUP
            ? formData.value.groupId
            : formData.value.customerId,
          exportType: formData.value.exportType,
          startTime: formData.value.date?.[0] ? `${formData.value.date?.[0]} 00:00:00` : '',
          endTime: formData.value.date?.[1] ? `${formData.value.date?.[1]} 23:59:59` : '',
        };
        await exportByBlob({
          method: 'post',
          url: '/crm-credit/web/v1/customer-credit-manager/export-credit-info',
          data,
          filename: `${filters.getEnumLabel(
            [...EXPORT_TYPE_LIST, ...GROUP_EXPORT_TYPE_LIST], formData.value.exportType,
          )}.xlsx`,
          loading: true,
        });
        ElMessage.success('操作成功');
        handleClose();
      } catch (error) {
        console.log(error);
      }
    };

    // 切换授信主体
    const handleChangeSubjectType = (subjectType: CREDIT_SUBJECT_ENUM) => {
      formData.value = {
        ...baseData,
        subjectType,
      };
    };

    // 初始化
    const handleInit = (subjectType: CREDIT_SUBJECT_ENUM) => {
      formData.value.subjectType = subjectType;
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
      formData,
      EXPORT_TYPE_LIST,
      exportTypeOptions,
      getGroupOptions,
      getCustomerOptions,
      disabledDate: (time: Date) => {
        return time.getTime() > new Date(formatTime(Date.now())).getTime();
      },
      handleOk,
      handleClose,
      handleOpen,
      handleChangeSubjectType,
      formRules: {
        exportType: [
          { required: true, message: '导出类型不能为空' },
        ],
        // date: [
        //   { type: 'array', required: true, message: '导出时间不能为空' },
        // ],
      },
    };
  },
});
</script>
<style lang="scss" scoped>
:deep(.el-range-editor) {
  width: 100%!important;
}
</style>
