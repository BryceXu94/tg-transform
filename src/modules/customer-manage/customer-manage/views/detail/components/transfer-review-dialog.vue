<!--
 * @Descripttion: 转交审核
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

import { getUserOptionsByUserName } from '@/api/query-options';
import { IGetUserOptionsByUserNameRes } from '@/api/query-options/type.d';
import { transferReview } from '@/modules/customer-manage/customer-manage/api';
import { useMenuStore } from '@/store/menu';

const emits = defineEmits(['destroy', 'success']);
const props = withDefaults(defineProps<{
  detailId: string;
  originUserId: string;
  success:() => void;
}>(), {
  detailId: '',
  originUserId: '',
  success: () => {},
});

const visible = ref(true);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const form = reactive({
  targetUserId: '',
  targetUserName: '',
  remark: '',
});

// 取消
const handleCancel = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

// 选择所属BD
const handleChangeBD = (val: string, row: IGetUserOptionsByUserNameRes) => {
  form.targetUserName = row.username;
};

// 提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    await transferReview({
      ...form,
      detailId: props.detailId,
      originUserId: props.originUserId,
    });
    handleCancel();
    useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
    props.success();
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
    width="600px"
  >
    <el-form
      :model="form"
      ref="formRef"
    >
      <el-form-item
        label="审核人员："
        prop="targetUserId"
        :rules="{
          required: true,
          message: '请选择审核人员',
          trigger: ['blur', 'change'],
        }"
      >
        <query-select
          placeholder="请选择审核人员"
          v-model="form.targetUserId"
          :method="getUserOptionsByUserName"
          :config="{
            valueKey: 'userId',
            labelKey: 'username',
            keywordQueryKey: 'username',
            dataKey: 'data',
            showCode: true,
            codeKey: 'userCode',
          }"
          @change="handleChangeBD"
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
        >提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>
