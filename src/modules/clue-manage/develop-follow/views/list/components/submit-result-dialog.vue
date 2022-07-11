<template>
  <el-dialog
    :modelValue="visible"
    @close="handleCancel"
    :close-on-click-modal="false"
    custom-class="el-dialog-inner-scroll"
    width="500px"
    title="提交结果"
  >
    <el-form
      :model="formData"
      label-width="140px"
      ref="formRef"
    >

      <el-form-item
        prop="customerDevStatus"
        label="跟进结果"
        :rules="[
          {
            required: true,
            message: '跟进结果不能为空',
            trigger: 'change',
          },
        ]"
      >
        <el-radio-group
          v-model="formData.customerDevStatus"
          :class="{
            convertActive: isConvertSubmiType,
            invalidActive: isInvalidSubmiType,
          }"
        >
          <el-radio-button
            v-for="item in SUBMIT_RESULT_TYPE_LIST"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="customerName"
        label="客户名称"
        :rules="[
          {
            required: !customerInfoDisabled,
            message: '客户名称不能为空',
            trigger: 'blur',
          },
        ]"
        :key="formData.customerDevStatus"
      >
        <el-input
          v-model="formData.customerName"
          placeholder="请输入客户名称"
          :disabled="customerInfoDisabled"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="socialCreditCode"
        label="统一社会信用代码"
        :rules="validatorSocialCreditCode"
        :key="formData.customerDevStatus"
      >
        <el-input
          v-model="formData.socialCreditCode"
          placeholder="请输入统一社会信用代码"
          :disabled="customerInfoDisabled"
        ></el-input>
      </el-form-item>
      <template v-if="isConvertSubmiType">
        <el-form-item
          prop="businessType"
          label="业务类型"
          :rules="[
            {
              required: true,
              message: '业务类型不能为空',
              trigger: 'change',
            },
          ]"
        >
          <el-select
            v-model="formData.businessType"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in BUSINESS_MODE_NO_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>
      <template v-if="isInvalidSubmiType">
        <el-form-item
          label="无效原因"
          prop="invalidReason"
          :rules="[
            {
              required: true,
              message: '无效原因不能为空',
              trigger: 'change',
            },
          ]"
        >
          <dictionary-select
            v-model="formData.invalidReason"
            placeholder="请选择"
            :dictionary="CX_DICTIONARY_KEY.CRM_CLUE_INVALID"
          />
        </el-form-item>
        <el-form-item
          prop="followRemark"
          label="跟进备注"
          :rules="[
            {
              required: formData.invalidReason === OTHER_CODE_ENUM.INVALID_REASON_OTHER,
              message: '跟进备注不能为空',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="formData.followRemark"
            placeholder="请输入跟进备注"
            type="textarea"
            show-word-limit
            maxlength="500"
            :rows="4"
          ></el-input>
        </el-form-item>
      </template>
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

<script lang="ts" setup>
import {
  ref,
  defineEmits,
  defineProps,
  withDefaults,
  computed,
  watch,
} from 'vue';
import { ElForm, ElMessage, FormItemRule } from 'element-plus';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import {
  SUBMIT_RESULT_TYPE_ENUM,
  SUBMIT_RESULT_TYPE_LIST,
  OTHER_CODE_ENUM,
} from '@/modules/clue-manage/develop-follow/constant';
import {
  BUSINESS_MODE_NO_LIST,
} from '@/constant/global';
import DictionarySelect from '@/components/dictionary-select/index.vue';
import { devFinish } from '@/modules/clue-manage/develop-follow/api';
import { ICustomerClueDevPageResListItem, IDevFinishReq } from '@/modules/clue-manage/develop-follow/api/types';
import { isEmpty } from '@tiangong/utils';

interface IParams {
  row: ICustomerClueDevPageResListItem;
  onSuccess: () => void;
}

const emits = defineEmits(['destroy', 'success']);
const props = withDefaults(
  defineProps<{
  params: IParams;
}>(), {
    params: () => {
      return {
        row: {} as ICustomerClueDevPageResListItem,
        onSuccess: () => {},
      };
    },
  },
);

const visible = ref(true);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
// eslint-disable-next-line vue/no-setup-props-destructure
let { customerName, socialCreditCode } = props.params?.row;
const formData = ref<IDevFinishReq>({
  devId: props.params?.row?.devId,
  customerDevStatus: SUBMIT_RESULT_TYPE_ENUM.CONVERT,
  customerName,
  socialCreditCode,
  businessType: '',
  invalidReason: '',
  followRemark: '',
});

const handleCancel = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};
const handleSubmit = async () => {
  await formRef.value?.validate();

  await devFinish(formData.value);

  ElMessage.success('操作成功！');
  if (props.params.onSuccess) {
    props.params.onSuccess();
  }
  handleCancel();
};

const isConvertSubmiType = computed(() => formData.value.customerDevStatus === SUBMIT_RESULT_TYPE_ENUM.CONVERT);
const isInvalidSubmiType = computed(() => formData.value.customerDevStatus === SUBMIT_RESULT_TYPE_ENUM.INVALID);

const customerInfoDisabled = computed(() => isInvalidSubmiType.value);

const validatorSocialCreditCode = computed<FormItemRule[]>(() => {
  return [
    {
      required: !customerInfoDisabled.value,
      trigger: 'blur',
      validator: (_rules, value, cb) => {
        if (isEmpty(value)) {
          cb('统一社会信用代码不能为空');
          return;
        }
        if (/^[A-Z0-9]{18}$/.test(value)) {
          cb();
          return;
        }
        cb('请输入正确的统一社会信用代码');
      },
    },
  ];
});
watch(
  () => formData.value.customerDevStatus,
  () => {
    [customerName, formData.value.customerName] = [formData.value.customerName!, customerName];
    [socialCreditCode, formData.value.socialCreditCode] = [formData.value.socialCreditCode!, socialCreditCode];
  },
);

</script>

<style lang="scss" scoped>
.convertActive,
.invalidActive {
  position: relative;
  &::before {
    content: '线索可转化为客户';
    position: absolute;
    width: 160%;
    top: -28px;
    font-size: 14px;
    color: #fff;
    background: var(--el-color-primary);
    border-radius: 8px 8px 8px 0;
    line-height: 26px;
    text-align: center;
    transition: all 0.3s;
  }
}
.invalidActive::before {
  content: '线索置为无效';
  transform: translateX(60px);
}
</style>
