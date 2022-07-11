<!--
 * @Descripttion: 下单类型
 * @Author: weitongxue
-->
<script lang="ts" setup>
import {
  ref,
  reactive,
  defineEmits,
  withDefaults,
  defineProps,
} from 'vue';
import { ElForm } from 'element-plus';
import { ORDER_MODE_LIST } from '@/constant/global';
import { allowedOrderTypeApi } from '@/modules/customer-manage/customer-manage/api';

const emits = defineEmits(['destroy', 'success']);
const props = withDefaults(defineProps<{
  customerId: string;
  pageNum: number;
  allowedOrderType: string;
  success:(pageNum: number) => void;
}>(), {
  pageNum: 1,
  customerId: '',
  allowedOrderType: '',
  success: () => {},
});

const visible = ref(true);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const form = reactive({
  allowedOrderType: props.allowedOrderType,
});

// 取消
const handleCancel = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

// 提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    console.log(form, props);
    const data = {
      customerId: props.customerId,
      ...form,
    };
    await allowedOrderTypeApi(data);
    handleCancel();
    props.success(props.pageNum);
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <el-dialog
    :modelValue="visible"
    @close="handleCancel"
    :close-on-click-modal="false"
    title="操作提示"
    custom-class="el-dialog-inner-scroll"
    width="500px"
  >
    <el-form
      :model="form"
      label-width="150px"
      ref="formRef"
    >
      <el-form-item
        prop="allowedOrderType"
        label="下单类型："
        :rules="{
          required: true,
          message: '请选择下单类型！',
          trigger: ['blur', 'change'],
        }"
      >
        <el-radio-group v-model="form.allowedOrderType">
          <el-radio
            v-for="item in ORDER_MODE_LIST"
            :key="item.value"
            :label="item.value"
          >{{item.label}}</el-radio>
        </el-radio-group>
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
