<script lang="tsx">
import { defineComponent, nextTick, watchEffect, ref, withKeys, PropType, computed } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import {
  CUSTOM_AUDIT_RESULT_ENUM,
  CUSTOM_AUDIT_RESULT_LIST,
  AUDIT_REASON_LIST,
} from './constant';
import { batchAuditClues } from '@/modules/clue-manage/customer-clue/api';
import { IFormData, ITrackItem } from './type';
import { AUDIT_RESULT_ENUM } from '@/modules/clue-manage/customer-clue/constant';

export default defineComponent({
  emits: ['update:visible', 'success'],
  props: {
    tracks: {
      type: Array as PropType<ITrackItem[]>,
      default: () => [],
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  setup(props, { emit }) {
    const refForm = ref<InstanceType<typeof ElForm> | null>(null);
    const formData = ref<IFormData>({
      auditResult: CUSTOM_AUDIT_RESULT_ENUM.PASS,
      rejectReason: AUDIT_RESULT_ENUM.AUDIT_PASSED,
      remark: '',
    });
    const handleClose = () => {
      emit('update:visible', false);
    };
    // 点击确认
    const handleConfirm = async () => {
      try {
        await refForm.value?.validate();
        await batchAuditClues({
          trackIdList: props.tracks.map(v => v.id),
          auditRemark: formData.value.remark,
          auditResult: formData.value.rejectReason,
        });
        ElMessage.success('操作成功');
        emit('success');
        handleClose();
      } catch (error) {
        console.log('批量审核失败', error);
      }
    };
    const handleOpen = async () => {
      await refForm.value?.resetFields();
      await nextTick();
    };
    watchEffect(() => {
      if (formData.value.auditResult === CUSTOM_AUDIT_RESULT_ENUM.PASS) {
        formData.value.rejectReason = AUDIT_RESULT_ENUM.AUDIT_PASSED;
      } else {
        formData.value.rejectReason = AUDIT_RESULT_ENUM.AUDIT_FAILED_A;
      }
    });
    const rules = computed(() => {
      return {
        auditResult: [{
          required: true,
          message: '审核结果不能为空',
        }],
        rejectReason: [{
          required: true,
          message: '驳回原因不能为空',
        }],
        remark: [{
          required: formData.value.rejectReason === AUDIT_RESULT_ENUM.AUDIT_FAILED_C,
          message: '审核备注不能为空',
        }],
      };
    });
    return {
      handleOpen,
      formData,
      handleClose,
      handleConfirm,
      refForm,
      rules,
    };
  },
  render() {
    return (
      <el-dialog
        title="审核线索"
        modelValue={this.visible}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        close-on-click-modal={false}
        width="500px"
        v-slots={{
          footer: () => (
            <el-row type="flex" justify="end">
              <el-button onClick={this.handleClose}>取消</el-button>
              <el-button type="primary" onClick={this.handleConfirm}>保存</el-button>
            </el-row>
          ),
        }}
      >
        <el-form
          ref="refForm"
          model={this.formData}
          rules={this.rules}
          label-width="80px"
          onKeydown={withKeys(this.handleConfirm, ['enter'])}
        >
          <el-form-item label="客户线索">
            {this.tracks.map(v => v.name).join('、')}
          </el-form-item>
          <el-form-item label="审核结果" prop="auditResult">
            <el-radio-group v-model={this.formData.auditResult}>
              {CUSTOM_AUDIT_RESULT_LIST.map(v => (
                <el-radio-button
                  label={v.value}
                >{v.label}</el-radio-button>
              ))}
            </el-radio-group>
          </el-form-item>
          {this.formData.auditResult === CUSTOM_AUDIT_RESULT_ENUM.REJECT && (
            <el-form-item
              label="驳回原因"
              prop="rejectReason"
            >
              <el-select v-model={this.formData.rejectReason} class="select-full">
                {AUDIT_REASON_LIST.map(v => (
                  <el-option
                    label={v.label}
                    value={v.value}
                  />
                ))}
              </el-select>
            </el-form-item>
          )}
          <el-form-item label="审核备注" prop="remark">
            <el-input
              placeholder="请输入审核备注"
              v-model={[this.formData.remark, ['trim']]}
              maxLength={500}
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </el-dialog>
    );
  },
});
</script>
