<template>
  <el-dialog
    :modelValue="visible"
    @close="handleCancel"
    :close-on-click-modal="false"
    custom-class="el-dialog-inner-scroll"
    width="500px"
    :title="props.params.type === CREATE_EDIT_ENUM.CREATE ? '创建租户' : '编辑租户'"
  >
    <el-form
      :model="form"
      label-width="110px"
      ref="formRef"
    >
      <el-form-item
        prop="customerName"
        label="客户名称："
        :rules="[
          {
            required: true,
            message: '请选择客户名称！',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <query-select
          v-model="form.customerName"
          :method="getCustomerOptions"
          :disabled="props.params.type === CREATE_EDIT_ENUM.EDIT"
          placeholder="请选择客户名称"
          :config="{
            labelKey: 'customerName',
            valueKey: 'customerName',
            keywordQueryKey: 'customerName',
            dataKey: 'data',
            valueQueryKey: 'customerName',
          }"
          :queryParams="{
            businessType: '',
            filterHavingTenant: '1',
            customerState: CUSTOMER_STATE_ENUM.ENABLE,
          }"
          @change="handleQueryUser"
        />
      </el-form-item>
      <el-form-item
        prop="contactId"
        label="管理员账号："
        :rules="[
          {
            required: true,
            message: '请选择管理员账号！',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <el-select
          v-model="form.contactId"
          placeholder="请选择管理员账号"
          class="select-width"
          @change="handleSelectAdmin"
        >
          <el-option
            v-for="item in adminList"
            :key="item.customerContactId"
            :value="item.customerContactId"
            :label="item.phone"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="adminName"
        label="管理员姓名："
        :rules="[
          {
            required: true,
            message: '请选择管理员姓名！',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <el-input
          v-model="form.adminName"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div>提示：管理员账号默认拥有超管权限</div>
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
  reactive,
  defineEmits,
  defineProps,
  withDefaults,
  watch,
} from 'vue';
import { getCustomerOptions } from '@/api/query-options';
import { getCustomerContactsInfoApi } from '@/modules/customer-manage/customer-manage/api';
import { customerTenantSaveApi } from '@/modules/tenant-manage/tenant-manage/api';
import { ICustomerTenantSaveReq } from '@/modules/tenant-manage/tenant-manage/api/types';
import { IDetailContactsCustomerContactListItem } from '@/modules/customer-manage/customer-manage/api/types';
import {
  CUSTOMER_STATE_ENUM,
} from '@/modules/customer-manage/customer-manage/constant';
import { CREATE_EDIT_ENUM } from '../types';

import { ElForm, ElMessage } from 'element-plus';

interface IConfig {
  params: {
    onSuccess: () => void;
    type: CREATE_EDIT_ENUM;
    customerId?: string;
    customerName?: string;
    phone: string;
    userName?: string;
  };
}

interface IForm extends ICustomerTenantSaveReq {
   adminName: string;
   customerName: string;
}

const emits = defineEmits(['destroy', 'success']);
const props = withDefaults(defineProps<IConfig>(), {});

const visible = ref(true);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const form = reactive<IForm>({
  customerName: '', // 客户名称
  customerId: '', // 客户id
  contactId: '', // 联系人id
  adminName: '',
});

// 获取管理员信息
const adminList = ref<IDetailContactsCustomerContactListItem[]>([]);
const handleSelectAdmin = (value: string) => {
  const item = adminList.value.find(info => info.customerContactId === value);
  if (item) {
    form.contactId = item.customerContactId;
    form.adminName = item.contactName;
  }
};

// 用户信息
const handleQueryUser = async (value: string, item: ICustomerTenantSaveReq) => {
  if (value) {
    form.customerId = item?.customerId;
    form.contactId = '';
    const res = await getCustomerContactsInfoApi(form.customerId);
    // 联系人
    adminList.value = res?.data?.customerContactList;
    // 编辑回显
    if (props.params.type === CREATE_EDIT_ENUM.EDIT) {
      const admin = adminList.value?.find((info: IDetailContactsCustomerContactListItem) => {
        return info.phone === props.params.phone && info.contactName === props.params.userName;
      });
      if (admin) {
        form.contactId = admin.customerContactId;
        form.adminName = props.params.userName! || admin.contactName;
      }
    } else {
      form.customerId = item?.customerId;
    }
  }
};

// 取消
const handleCancel = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

watch(() => props, async () => {
  if (props.params.type === CREATE_EDIT_ENUM.EDIT) {
    const { customerId, customerName } = props.params;
    form.customerName = customerName!;
    form.customerId = customerId!;
    await handleQueryUser(customerId!, {
      customerId,
    } as ICustomerTenantSaveReq);
  }
}, { immediate: true });

// 提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    const { customerId, contactId } = form;
    await customerTenantSaveApi({ customerId, contactId });
    ElMessage.success('操作成功！');
    if (props.params.onSuccess) {
      props.params.onSuccess();
    }
    handleCancel();
  } catch (e) {
    console.log(e);
  }
};

</script>

<style lang="scss" scoped>
.tips {
  margin-left: 30px;
  margin-top: 20px;
}
</style>
