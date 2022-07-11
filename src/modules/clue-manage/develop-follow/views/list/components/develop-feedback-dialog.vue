<template>
  <el-dialog
    :modelValue="visible"
    @close="handleCancel"
    :close-on-click-modal="false"
    custom-class="el-dialog-inner-scroll"
    width="500px"
    title="开发反馈"
  >
    <el-form
      :model="formData"
      label-width="100px"
      ref="formRef"
    >
      <el-form-item
        label="开发情况"
        prop="devSpeed"
        :rules="[
          {
            required: true,
            message: '开发情况不能为空',
            trigger: 'change',
          },
        ]"
      >
        <dictionary-select
          v-model="formData.devSpeed"
          placeholder="请选择"
          :dictionary="CX_DICTIONARY_KEY.CRM_CLUE_DEVELOPMENT"
        />
      </el-form-item>
      <el-form-item
        prop="remark"
        label="备注内容"
        :rules="[
          {
            required: formData.devSpeed === OTHER_CODE_ENUM.DEV_SPEED_OTHER,
            message: '备注内容不能为空',
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          v-model="formData.remark"
          placeholder="请输入备注内容"
          type="textarea"
          show-word-limit
          maxlength="500"
          :rows="4"
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

<script lang="ts" setup>
import {
  ref,
  defineEmits,
  defineProps,
  withDefaults,
} from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { OTHER_CODE_ENUM } from '@/modules/clue-manage/develop-follow/constant';
import { devFeedback } from '@/modules/clue-manage/develop-follow/api';
import { IDevFeedbackReq } from '@/modules/clue-manage/develop-follow/api/types';
import DictionarySelect from '@/components/dictionary-select/index.vue';

interface IParams {
  devId: string;
  onSuccess: () => void;
}

const emits = defineEmits(['destroy', 'success']);
const props = withDefaults(
  defineProps<{
  params: IParams;
}>(), {
    params: () => {
      return {
        devId: '',
        onSuccess: () => {},
      };
    },
  },
);

const visible = ref(true);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const formData = ref<IDevFeedbackReq>({
  devId: props.params?.devId,
  devSpeed: '',
  remark: '',
});

const handleCancel = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

const handleSubmit = async () => {
  await formRef.value?.validate();

  await devFeedback(formData.value);

  ElMessage.success('操作成功！');
  if (props.params.onSuccess) {
    props.params.onSuccess();
  }
  handleCancel();
};

</script>
