<template>
  <el-dialog
    :modelValue="visible"
    @close="handleCancel"
    :close-on-click-modal="false"
    custom-class="el-dialog-inner-scroll"
    width="500px"
    :title="props.params.type === CREATE_EDIT_ENUM.CREATE ? '创建账号' : '编辑账号'"
  >
    <el-form
      :model="form"
      label-width="140px"
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
          :method="getCustomerTenantPageApi"
          :disabled="props.params.type === CREATE_EDIT_ENUM.EDIT"
          placeholder="请选择客户名称"
          :config="{
            labelKey: 'customerName',
            valueKey: 'customerName',
            keywordQueryKey: 'customerName',
            dataKey: 'data.list',
            valueQueryKey: 'customerName',
          }"
          :queryParams="{
            businessType: '',
            filterHavingTenant: '1',
            isEnable: YES_NO_ENUM.YES,
          }"
          @change="handleQueryCustomer"
        />
      </el-form-item>
      <el-form-item
        prop="phone"
        label="账号："
        :rules="[
          {
            required: true,
            message: '请选择账号！',
            trigger: ['blur'],
          },
        ]"
      >
        <el-select
          v-model="form.phone"
          placeholder="请选择账号"
          class="select-width"
          @change="handleSelectNo"
          :disabled="props.params.type === CREATE_EDIT_ENUM.EDIT"
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
        prop="userName"
        label="姓名："
        :rules="[
          {
            required: true,
            message: '请选择姓名！',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <el-input
          v-model="form.userName"
          placeholder="请输入姓名"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="brandIds"
        label="所属品牌："
        :rules="[
          {
            required: true,
            message: '请选择所属品牌！',
            trigger: ['blur'],
          },
        ]"
      >
        <el-select
          v-model="form.brandIds"
          placeholder="请选择所属品牌"
          class="select-width"
          multiple
          collapse-tags
          collapse-tags-tooltip
          @change="handleSelectBrand"
          :disabled="form.isAllBrand === YES_OR_NO_NUMBER_ENUM.YES"
        >
          <el-option
            v-for="item in brandList"
            :key="item.brandId"
            :value="item.brandId"
            :label="item.isDeleted === YES_OR_NO_NUMBER_ENUM.YES ? item.brandName + '（品牌已删除）' : item.brandName"
          >
            <el-tooltip
              v-if="item.brandName!.length > 20"
              effect="dark"
              :content="item.brandName"
              placement="top"
            >
              <div class="tooltip-item">{{item.brandName}}</div>
            </el-tooltip>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="isAllBrand"
        label="是否全部品牌："
        :rules="[
          {
            required: true,
            message: '请选择是否全部品牌！',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <el-radio-group
          v-model="form.isAllBrand"
          @change="handleAllBrand"
        >
          <el-radio
            v-for="item in YES_OR_NO_NUMBER_LIST"
            :label="item.value"
            :key="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="miniAppRoleId"
        label="小程序角色："
        v-if="CAN__ACCOUNT_MINI_ROLES && wxRoleList.length"
        :rules="[
          {
            required: true,
            message: '请选择小程序角色！',
            trigger: ['blur'],
          },
        ]"
      >
        <el-radio-group v-model="form.miniAppRoleId">
          <el-radio
            v-for="item in wxRoleList"
            :key="item?.roleCode"
            :label="item?.id"
          >{{item?.roleName}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="appRoleId"
        label="App角色："
        v-if="CAN__ACCOUNT_APP_ROLES && appRoleList.length"
        :rules="[
          {
            required: true,
            message: '请选择App角色！',
            trigger: ['blur'],
          },
        ]"
      >
        <el-radio-group v-model="form.appRoleId">
          <el-radio
            v-for="item in appRoleList"
            :key="item?.roleCode"
            :label="item?.id"
          >{{item?.roleName}}</el-radio>
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
<script lang="ts" setup>
import {
  ref,
  reactive,
  defineEmits,
  defineProps,
  withDefaults,
  watch,
  computed,
} from 'vue';
import { getCustomerContactsInfoApi } from '@/modules/customer-manage/customer-manage/api';
import {
  getCustomerTenantPageApi,
  customerBrandInfoApi,
  customerAccountSaveApi,
} from '@/modules/tenant-manage/tenant-manage/api';
import {
  IUserSaveReq,
  IBrandBaseInfoResItem,
  ICustomerTenantPageListItem,
  IUserDetailRes,
} from '@/modules/tenant-manage/tenant-manage/api/types';
import {
  IDetailContactsCustomerContactListItem,
} from '@/modules/customer-manage/customer-manage/api/types';
import { YES_OR_NO_NUMBER_ENUM, YES_NO_ENUM, YES_OR_NO_NUMBER_LIST } from '@/constant/global';
import { CREATE_EDIT_ENUM } from '../types';
import { getSsoRoles } from '@/api/global';
import { IRolesQueryRolesResItem } from '@/api/global/type';
import { ElForm, ElMessage } from 'element-plus';
import { usePermissionConfig } from '../../../use-permission-config';

interface IConfig {
  params: {
    onSuccess: () => void;
    type: CREATE_EDIT_ENUM;
    data: IUserDetailRes;
  };
}

interface IForm extends IUserSaveReq {
   customerName?: string;
}

const emits = defineEmits(['destroy', 'success']);
const props = withDefaults(defineProps<IConfig>(), {});
const visible = ref(true);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const form = reactive<IForm>({
  tenantId: '', // 客户id
  userId: '', // 联系人id
  phone: '',
  userName: '',
  brandIds: [], // 所属品牌
  miniAppRoleId: '', // 小程序角色
  appRoleId: '', // app角色
  isAllBrand: YES_OR_NO_NUMBER_ENUM.NO,
});

const {
  CAN__ACCOUNT_MINI_ROLES,
  CAN__ACCOUNT_APP_ROLES,
} = usePermissionConfig();

// 获取管理员信息
const adminList = ref<IDetailContactsCustomerContactListItem[]>([]);
const handleSelectNo = (value: string) => {
  const item = adminList.value.find(info => info.customerContactId === value);
  if (item) {
    form.userName = item.contactName;
    form.phone = item.phone;
  }
};

// 获取角色
const roleList = ref<IRolesQueryRolesResItem[]>([]);
const handleGetSsoRoles = async (companyId: string) => {
  const res = await getSsoRoles(
    {
      companyId,
      systemCodeArray: ['CRM_CLIENT_WAPP', 'SKY_CREATION_APP'],
    },
  );
  roleList.value = res?.data ?? [];
};
// 小程序角色
const wxRoleList = computed(() => {
  return roleList.value.filter(item => item.systemCode === 'CRM_CLIENT_WAPP'
  && item.status === YES_OR_NO_NUMBER_ENUM.YES);
});
// app角色
const appRoleList = computed(() => {
  return roleList.value.filter(item => item.systemCode === 'SKY_CREATION_APP'
  && item.status === YES_OR_NO_NUMBER_ENUM.YES);
});

// 品牌
const brandList = ref<IBrandBaseInfoResItem[]>([]);

/**
 * 全选：1: cur.filter(info => info !== 'all').length === brandList.value.filter(info => info !== 'all').length
 *      2: 直接点击了全部
*/
const currentBrand = ref<string[]>([]);
const handleSelectBrand = (cur: string[]) => {
  let currentItem = '';
  if (currentBrand.value.length > cur.length) {
    currentItem = currentBrand.value.filter(v => !cur.some(item => item === v))?.[0];
    // 取消
    if (currentItem === 'all') {
      form.brandIds = [];
      currentBrand.value = [];
    } else {
      form.brandIds = cur.filter(item => item !== 'all');
      currentBrand.value = form.brandIds;
    }
  } else {
    // 新增
    currentItem = cur.filter(v => !currentBrand.value.some(item => item === v))?.[0];
    if (currentItem === 'all') {
      form.brandIds = brandList.value.map(item => item.brandId!);
      currentBrand.value = form.brandIds;
    } else {
      currentBrand.value = cur;
      form.brandIds = cur;
      // 只有一个不需要插入全部
      if (form.brandIds.length === brandList.value.filter(item => item.brandId !== 'all').length
      && brandList.value.length > 1) {
        form.brandIds.unshift('all');
      }
    }
  }
};

// 用户信息
const handleQueryCustomer = async (value: string, item: ICustomerTenantPageListItem) => {
  form.phone = '';
  form.userName = '';
  form.brandIds = [];
  if (value) {
    // 获取账号
    const res = await getCustomerContactsInfoApi(item.customerId);
    adminList.value = res?.data?.customerContactList;
    // 获取品牌
    const brandRes = await customerBrandInfoApi(item.customerId);
    // 如果品牌大于1个，则有全部（过滤掉列表和客户档案都不存在的品牌）
    brandList.value = brandRes?.data.filter((e) => {
      return (props.params?.data?.brandIds?.includes(e.brandId!) && e.isDeleted === YES_OR_NO_NUMBER_ENUM.YES)
      || (e.isDeleted !== YES_OR_NO_NUMBER_ENUM.YES);
    });
    if (brandList.value.length > 1) {
      brandList.value.unshift({
        brandId: 'all',
        brandName: '全部',
      });
    }
    // 获取角色
    handleGetSsoRoles(item.ssoTenantId);
    // 编辑回显
    if (props.params.type === CREATE_EDIT_ENUM.EDIT) {
      const {
        brandIds,
        isAllBrand,
      } = props.params.data;
      // 品牌回显
      form.brandIds = brandIds;
      if (brandList.value.filter(info => info.brandId !== 'all').length === brandIds.length
      && brandList.value.length > 1) {
        form.brandIds.unshift('all');
      }
      if (isAllBrand === YES_OR_NO_NUMBER_ENUM.YES) {
        form.brandIds = brandList.value.map(info => info.brandId!);
      }
      currentBrand.value = form.brandIds;
      const { phone, userName } = props.params.data;
      const admin = adminList.value?.find((info: IDetailContactsCustomerContactListItem) => {
        return info.phone === phone && info.contactName === userName;
      });
      form.phone = admin?.phone;
      form.userName = admin?.contactName || userName;
    } else {
      form.tenantId = item?.tenantId;
    }
  }
};

const handleAllBrand = (val: YES_OR_NO_NUMBER_ENUM) => {
  if (val === YES_OR_NO_NUMBER_ENUM.YES) {
    form.brandIds = brandList.value.map(item => item.brandId!);
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
    const {
      customerId,
      customerTenantId,
      brandIds,
      customerName,
      userId,
      phone,
      appRoleId,
      miniAppRoleId,
      ssoTenantId,
      isAllBrand,
    } = props.params.data;
    Object.assign(form, {
      tenantId: customerTenantId,
      customerTenantId,
      brandIds,
      customerName,
      userId,
      phone,
      appRoleId,
      miniAppRoleId,
      isAllBrand,
    });
    await handleQueryCustomer(customerId!, {
      customerId,
      ssoTenantId,
    } as ICustomerTenantPageListItem);
  }
}, { immediate: true });

// 提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    const data = Object.assign({}, form, {
      brandIds: form.brandIds.filter(item => item !== 'all'),
    });
    await customerAccountSaveApi(data);
    ElMessage.success('操作成功');
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
.tooltip-item {
  width: 340px;
  @include ellipsis()
}
</style>
