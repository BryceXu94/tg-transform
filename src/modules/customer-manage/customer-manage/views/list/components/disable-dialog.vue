<!--
 * @Descripttion: 停用客户
-->
<template>
  <el-dialog
    :modelValue="visible"
    @close="handleCancel"
    :close-on-click-modal="false"
    title="操作提示"
    custom-class="el-dialog-inner-scroll"
    width="600px"
  >
    <el-form
      :model="form"
      ref="formRef"
    >
      <el-form-item
        prop="reason"
        label="原因类型："
        :rules="{
          required: true,
          message: '请选择原因类型',
          trigger: ['blur', 'change'],
        }"
      >
        <dictionary-select
          v-model="form.reason"
          placeholder="请选择原因类型"
          :dictionary="CX_DICTIONARY_KEY.CRM_DEACTIVATION_REASON"
          @change="handleSelectReason"
        />
      </el-form-item>
      <el-form-item
        prop="remark"
        label="备注信息："
        :rules="{
          required: true,
          message: '请输入备注信息',
          trigger: ['blur', 'change'],
        }"
      >
        <el-input
          v-model.trim="form.remark"
          placeholder="请输入备注信息"
          type="textarea"
          :rows="3"
          :maxlength="500"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
        >确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  defineEmits,
  withDefaults,
  defineProps,
} from 'vue';
import { ElForm } from 'element-plus';

import DictionarySelect from '@/components/dictionary-select/index.vue';

import { customerDisableApi } from '@/modules/customer-manage/customer-manage/api';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { IDictionaryItem } from '@/hooks/use-dictionary/types';

const emits = defineEmits(['destroy', 'success']);
const props = withDefaults(defineProps<{
  customerId: string;
  pageNum: number;
  success:(pageNum: number) => void;
}>(), {
  pageNum: 1,
  customerId: '',
  success: () => {},
});

const visible = ref(true);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const form = reactive({
  reason: '',
  remark: '',
});

// 取消
const handleCancel = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

// 选择原因
const handleSelectReason = (v: string, item: IDictionaryItem) => {
  form.reason = item.label;
};

// 提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    await customerDisableApi({
      ...form,
      customerId: props.customerId,
    });
    handleCancel();
    props.success(props.pageNum);
  } catch (e) {
    console.log(e);
  }
};
</script>
