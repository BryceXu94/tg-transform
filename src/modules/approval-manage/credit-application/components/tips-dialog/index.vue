<!-- 温馨提示弹窗 -->
<template>
  <el-dialog
    :model-value="visible && visibleRevoke"
    title="温馨提示"
    :close-on-click-modal="false"
    :width="600"
    @close="handleClose"
  >
    <el-form
      :model="data"
    >
      <el-form-item
        :label="subjectType === CREDIT_SUBJECT_ENUM.GROUP ? '集团名称：' : '客户名称：'"
      >
        {{name}}
      </el-form-item>
      <el-form-item label="申请类型：">
        {{$filters.getEnumLabel(CREDIT_APPROVE_TYPE_LIST, data.applyType ?? '')}}
        -
        {{$filters.getEnumLabel(CREDIT_APPLY_TYPE_LIST, data.creditType ?? '')}}</el-form-item>
      <el-form-item label="申请金额：">
        <encryption
          :data="{
            businessId: data.creditApplyId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.FULLY_DESENSITIZE,
            content: amount,
            unit: amountUnit,
            dateColumn: 'applyAmount',
            format: toThousands,
          }"
        ></encryption>
      </el-form-item>
    </el-form>
    <div class="color-warning">{{tips}}</div>
    <template #footer>
      <el-row justify="end">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script lang="tsx">
import { defineComponent, PropType, ref, computed } from 'vue';
import { toThousands } from '@tiangong/utils';

import { ElMessage } from 'element-plus';

import {
  revokeCreditApplication,
  revokeGroupCreditApplication,
} from '@/modules/approval-manage/credit-application/api';
import { CREDIT_SUBJECT_ENUM } from '@/constant';
import {
  TIPS_DIALOG_TYPE_ENUM,
  CREDIT_APPROVE_TYPE_LIST,
  CREDIT_APPLY_TYPE_LIST,
} from '../../constant';
import { DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant/global';
import { IFormData } from '../../views/detail/types';

export default defineComponent({
  emits: ['update:visible', 'success', 'submit', 'destroy'],
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Object as PropType<IFormData>,
      default: () => ({}),
    },
    name: {
      type: String,
      default: '',
    },
    amount: {
      type: [String, Number],
      default: '0',
    },
    action: {
      type: String as PropType<TIPS_DIALOG_TYPE_ENUM>,
      default: TIPS_DIALOG_TYPE_ENUM.REVOKE,
    },
    subjectType: {
      type: String as PropType<CREDIT_SUBJECT_ENUM>,
      default: CREDIT_SUBJECT_ENUM.CUSTOMER,
    },
  },
  setup(props, { emit }) {
    const visibleRevoke = ref(true);
    const tips = computed(() => {
      return props.action === TIPS_DIALOG_TYPE_ENUM.SUBMIT
        ? `提交则该${props.subjectType === CREDIT_SUBJECT_ENUM.GROUP ? '集团' : '客户'}授信申请将会流入审批，是否继续提交？`
        : `提交则该${props.subjectType === CREDIT_SUBJECT_ENUM.GROUP ? '集团' : '客户'}授信申请将会被撤回，是否继续提交？`;
    });
    const amountUnit = computed(() => {
      return props.action === TIPS_DIALOG_TYPE_ENUM.SUBMIT ? '万元' : '元';
    });
    // 关闭
    const handleClose = () => {
      visibleRevoke.value = false;
      emit('update:visible', false);
      setTimeout(() => {
        emit('destroy');
        visibleRevoke.value = true;
      }, 500);
    };
    // 确认
    const handleConfirm = async () => {
      try {
        if (props.action === TIPS_DIALOG_TYPE_ENUM.SUBMIT) {
          emit('submit');
        } else {
          // 请求撤销
          if (props.subjectType === CREDIT_SUBJECT_ENUM.GROUP) {
            await revokeGroupCreditApplication({
              creditApplyId: props.data.creditApplyId!,
            });
          } else {
            await revokeCreditApplication({
              creditApplyId: props.data.creditApplyId!,
            });
          }
          ElMessage.success('操作成功');
          emit('success');
          handleClose();
        }
      } catch (error) {
        console.log('请求失败', error);
      }
    };
    return {
      visibleRevoke,
      CREDIT_APPROVE_TYPE_LIST,
      CREDIT_APPLY_TYPE_LIST,
      DESENSITIZE_DECRYPT_TYPE_ENUM,
      CREDIT_SUBJECT_ENUM,
      tips,
      amountUnit,
      handleClose,
      handleConfirm,
      toThousands,
    };
  },
});
</script>
