<!--
 * @Descripttion: 创建客户
 * @Author: weitongxue
-->
<script lang="ts" setup>
import {
  ref,
  reactive,
  defineEmits,
  defineProps,
  withDefaults,
} from 'vue';
import { useRouter } from 'vue-router';
import { ElForm } from 'element-plus';

import { createdCustomerApi } from '@/modules/customer-manage/customer-manage/api';
import { licenseOcrApi } from '@/api/global/index';
import { BUSINESS_MODE_ENUM, BUSINESS_MODE_DESC_LIST } from '@/constant';
import { ICustomerInfoBusinessLicenseOcrReq } from '@/api/global/type';
import { useMenuStore } from '@/store/menu';

const emits = defineEmits(['destroy']);
const props = withDefaults(defineProps<{
  businessType: BUSINESS_MODE_ENUM | '';
}>(), {
  businessType: '',
});
const $router = useRouter();

const visible = ref(true);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const form = reactive({
  customerName: '',
  socialCreditCode: '',
  businessLicenseList: [],
});
const visibleConfirm = ref(false);

// 取消
const handleCancel = () => {
  visible.value = false;
  visibleConfirm.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

// ocr识别
const handleChange = async (item: ICustomerInfoBusinessLicenseOcrReq[]) => {
  try {
    const data = {
      name: item[0]?.name,
      url: item[0]?.url,
    };
    const res = await licenseOcrApi(data);
    if (res?.data?.registerNumber) {
      form.customerName = res?.data?.name;
      form.socialCreditCode = res?.data.registerNumber;
    }
  } catch (e) {
    console.log(e);
  }
};

// 提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    visibleConfirm.value = true;
  } catch (e) {
    console.log(e);
  }
};

// 确认提交
const handleConfirm = async () => {
  try {
    const res = await createdCustomerApi({
      ...form,
      businessType: props.businessType,
    });
    handleCancel();
    $router.push({
      name: 'CustomerManageCreateCustomer',
      params: {
        id: res?.data?.customerId,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

const validatorName = (rule: any, value: any, callback: (err?: Error) => void) => {
  // 检验中英文，包括中英文括号
  // eslint-disable-next-line max-len
  const reg = /^[A-Za-z\u4E00-\u9FFF]+(((（|\()[A-Za-z\u4E00-\u9FFF]+(）|\)))|([A-Za-z\u4E00-\u9FFF]*))?[A-Za-z\u4E00-\u9FFF]*$/;
  if (value === '') {
    callback(new Error('请输入客户名称（与营业执照保持一致）'));
  } else if (!(reg.test(value))) {
    callback(new Error('请输入中英文字符（允许括号）'));
  } else {
    callback();
  }
};

const validatorCode = (rule: any, value: any, callback: (err?: Error) => void) => {
  if (value === '') {
    callback(new Error('请输入统一社会信用代码'));
  } else if (!(/^[0-9A-Z]+$/.test(value))) {
    callback(new Error('请输入大写英文字母或数字组成的字符'));
  } else if (value.length < 18) {
    callback(new Error('请输入18位字符的统一社会信用代码'));
  } else {
    callback();
  }
};

</script>

<template>
  <el-dialog
    :modelValue="visible"
    @close="handleCancel"
    :close-on-click-modal="false"
    :title="`创建${$filters.getEnumLabel(BUSINESS_MODE_DESC_LIST, businessType)}客户`"
    custom-class="el-dialog-inner-scroll"
    width="600px"
  >
    <el-form
      :model="form"
      label-width="150px"
      ref="formRef"
    >
      <el-form-item
        label="营业执照附件："
      >
        <div>
          <upload
            :limit="1"
            v-model="form.businessLicenseList"
            :sizeLimit="3"
            type="imageList"
            accept="image/png,image/jpeg,image/jpg"
            tip="支持jpg/jpeg/png格式，大小不超3mb"
            :compress="{
              isCompress: true,
              compressWidth: 1000,
            }"
            @upload="handleChange"
          />
        </div>
      </el-form-item>
      <el-form-item
        prop="customerName"
        label="客户名称："
        :rules="{
          required: true,
          validator: validatorName,
          trigger: ['blur', 'change'],
        }"
      >
        <el-input
          placeholder="请输入客户名称（与营业执照保持一致）"
          v-model="form.customerName"
          maxlength="100"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="socialCreditCode"
        label="统一社会信用代码："
        :rules="{
          required: true,
          validator: validatorCode,
          trigger: ['blur', 'change'],
        }"
      >
        <el-input
          v-model="form.socialCreditCode"
          placeholder="请输入统一社会信用代码"
          maxlength="18"
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
  <submit-tips-dialog
    title="温馨提示"
    v-model:visible="visibleConfirm"
    @success="handleConfirm"
  >
    <div>
      你此次提交的是
      <strong class="color-error">【{{$filters.getEnumLabel(BUSINESS_MODE_DESC_LIST, businessType)}}模式】</strong>
      的客户档案建立
    </div>
    <div>是否继续确认，提交则不可进行修改</div>
    <div>请核实</div>
  </submit-tips-dialog>
</template>
