<script lang="tsx">
import { defineComponent, nextTick, ref, withKeys } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import {
  IFormData,
} from './types';
import { isEmpty, isEmail } from '@tiangong/utils';
import { updateUserPassword } from '@/api/account';
import { useAccountStore } from '@/store/account';
import { useRouter } from 'vue-router';

export default defineComponent({
  emits: ['update:visible'],
  props: {
    visible: {
      type: Boolean,
      defalut: false,
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const accountStore = useAccountStore();
    const loading = ref(false);
    const refForm = ref<InstanceType<typeof ElForm> | null>(null);
    const formData = ref<IFormData>({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      userId: '',
    });
    const handleClose = () => {
      emit('update:visible', false);
    };
    const handleConfirm = async () => {
      try {
        await refForm.value?.validate();
        await updateUserPassword({
          ...formData.value,
          userId: accountStore.account!.userId,
        });
        // if (props.data?.tenantId) {
        //   await updateCustomer(formData.value);
        // } else {
        //   await createCustomer(formData.value);
        // }
        ElMessage.success('密码修改成功，请重新登录');
        await accountStore.logout();
        router.replace({
          name: 'Login',
        });
        handleClose();
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };
    const handleOpen = async () => {
      await refForm.value?.resetFields();
      await nextTick();
    };
    return {
      handleOpen,
      formData,
      handleClose,
      handleConfirm,
      refForm,
      rules: {
        oldPassword: [{
          required: true,
          message: '请输入旧密码',
        }],
        newPassword: [{
          required: true,
          validator: (rules: any, value: string, cb: (err?: string) => void) => {
            if (isEmpty(value)) {
              cb('请输入新密码');
            } else if (value === formData.value.oldPassword) {
              cb('新旧密码不能一致');
            } else {
              cb();
            }
          },
        }],
        confirmPassword: [{
          required: true,
          validator: (rules: any, value: string, cb: (err?: string) => void) => {
            if (isEmpty(value)) {
              cb('请再次输入密码');
            } else if (value !== formData.value.newPassword) {
              cb('两次密码不一致');
            } else {
              cb();
            }
          },
        }],
        mail: [{
          validator: (rules: any, value: string, cb: (err?: string) => void) => {
            if (value === '' || value === null) {
              cb();
            } else if (!isEmail(value)) {
              cb('邮箱格式错误');
            } else {
              cb();
            }
          },
        }],
      },
    };
  },
  render() {
    return (
      <el-dialog
        title="修改密码"
        modelValue={this.visible}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        close-on-click-modal={false}
        width="364px"
        v-slots={{
          footer: () => (
            <el-row type="flex" justify="end">
              <el-button onClick={this.handleClose}>取消</el-button>
              <el-button type="primary" onClick={this.handleConfirm}>修改密码</el-button>
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
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input
              placeholder="请输入旧密码"
              v-model={[this.formData.oldPassword, ['trim']]}
              maxLength={18}
              type="password"
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              placeholder="请输入新密码"
              v-model={[this.formData.newPassword, ['trim']]}
              maxLength={18}
              type="password"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              placeholder="请再次输入密码"
              v-model={[this.formData.confirmPassword, ['trim']]}
              ref="inputEl"
              maxLength={18}
              type="password"
            />
          </el-form-item>
        </el-form>
      </el-dialog>
    );
  },
});
</script>
