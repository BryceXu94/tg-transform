<!--
 * @Descripttion: 档案审核（财务审核）
 * @Author: weitongxue
-->
<script lang="ts" setup>
import {
  ref,
  reactive,
  defineEmits, defineProps, withDefaults } from 'vue';
import { useRoute } from 'vue-router';
import { ElForm, ElMessage } from 'element-plus';
import { financialAuditApi } from '@/modules/customer-manage/customer-manage/api';
import { ARCHIVES_AUDIT_STATE } from '@/modules/customer-manage/customer-manage/constant';
import { useMenuStore } from '@/store/menu';

interface IConfig {
  params: any;
}

const $route = useRoute();
const customerId = $route.params.id as string;

const emits = defineEmits(['destroy', 'handleSuccess']);
const props = withDefaults(defineProps<IConfig>(), {
  params: {},
});

const visible = ref(true);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const form = reactive({
  state: '',
  remark: '',
});

const handleChange = (val: string) => {
  if (ARCHIVES_AUDIT_STATE.PASS === val) {
    formRef.value?.clearValidate();
  }
};

// 取消
const handleCancel = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

// 提交
const handleSubmit = async () => {
  await formRef.value?.validate();
  const data = {
    customerId,
    ...form,
  };
  await financialAuditApi(data);
  ElMessage.success('操作成功！');
  props?.params?.cb?.(props?.params?.activeTab);
  useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
  handleCancel();
};

</script>

<template>
  <el-dialog
    :modelValue="visible"
    @close="handleCancel"
    :close-on-click-modal="false"
    width="500px"
    title="财务审核操作"
    custom-class="el-dialog-inner-scroll"
  >
    <el-form
      :model="form"
      label-width="110px"
      ref="formRef"
    >
      <el-form-item
        label="客户名称："
      >
        <div>{{props.params?.commonInfo?.customerName}}</div>
      </el-form-item>
      <el-form-item
        label="账期信息："
      >
        <div>
          <span
            class="margin-right-20"
            v-if="props.params?.commonInfo?.isAdvancePayment === 'YES'"
          >预付{{props.params?.commonInfo?.advancePaymentRatio}}%</span>
          <span
            v-for="(item, index) in props.params?.commonInfo?.returnInfoList || []"
            :key="index"
          >
            <span>{{item?.settlementPeriodDays}}天/</span>
            <span>{{item?.returnPercent}}%</span>
          </span>
        </div>
      </el-form-item>
      <el-form-item
        prop="state"
        label="审核结果："
        :rules="[
          {
            required: true,
            message: '请选择审核结果',
            trigger: 'blur',
          },
        ]"
      >
        <el-radio-group v-model="form.state" @change="handleChange">
          <el-radio :label="ARCHIVES_AUDIT_STATE.PASS">通过</el-radio>
          <el-radio :label="ARCHIVES_AUDIT_STATE.REJECT">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="remark"
        label="备注信息："
        :rules="form.state === ARCHIVES_AUDIT_STATE.REJECT ? {
          required: true,
          message: '请输入备注信息',
          trigger: 'blur',
        } : {}"
      >
        <el-input
          type="textarea"
          v-model="form.remark"
          placeholder="请输入备注信息"
          :maxlength="500"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
        >提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.tips {
  margin-left: 30px;
  margin-top: 20px;
}
</style>
