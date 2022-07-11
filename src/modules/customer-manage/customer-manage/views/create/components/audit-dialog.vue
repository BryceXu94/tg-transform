<!--
 * @Descripttion: 提交审核
 * @Author: weitongxue
-->
<script lang="ts" setup>
import {
  ref,
  reactive,
  defineEmits, defineProps, withDefaults, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  updateCustomerAuditInfoApi,
} from '@/modules/customer-manage/customer-manage/api';
import { useAccountStore } from '@/store/account';
import { getUserInfo, getBDSuperiorInfo } from '@/api/query-options';
import {
  IUsersQueryUserByUsernameAndCompanyIdRes,
  IBdGetBdSuperiorRes,
} from '@/api/query-options/type.d';
import { ElForm, ElMessage } from 'element-plus';
import { useMenuStore } from '@/store/menu';

interface IConfig {
  params: any;
}

const emits = defineEmits(['destroy']);
const props = withDefaults(defineProps<IConfig>(), {
  params: {},
});

const $router = useRouter();

const visible = ref(true);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const form = reactive({
  businessId: props.params?.customerId,
  bdmId: '',
  bdmName: '',
  cmId: '',
  cmName: '',
  bdId: '',
  bdName: '',
});

const { currentCompany } = useAccountStore();

// 取消
const handleCancel = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

// 获取bdm 和 cm
const superiorInfo = ref<IBdGetBdSuperiorRes>();
const isBdmModify = ref(false);
const isCmModify = ref(false);
const getSuperiorInfo = async (bdId: string) => {
  try {
    const data = {
      companyId: currentCompany?.companyId as string,
      bdId,
    };
    const res = await getBDSuperiorInfo(data);
    superiorInfo.value = res?.data;
    form.bdmName = superiorInfo.value?.bdmName;
    form.bdmId = superiorInfo.value?.bdmId;
    form.cmName = superiorInfo.value?.cmName;
    form.cmId = superiorInfo.value?.cmId;
  } catch (e) {
    console.log(e);
  }
};

// 选择bd
const handleQueryBDUser = (value: string, row: IUsersQueryUserByUsernameAndCompanyIdRes[0]) => {
  form.bdName = row?.username;
  getSuperiorInfo(row?.userId);
};

watch(() => props.params, async (val) => {
  console.log(val, 'val');
  if (val.bdId && val.bdName) {
    form.bdId = val?.bdId;
    form.bdName = val?.bdName;
    getSuperiorInfo(val?.bdId);
  }
}, { immediate: true });

// 选择bdm
const handleQueryBDMUser = (value: string, row: IUsersQueryUserByUsernameAndCompanyIdRes[0]) => {
  form.bdmName = row?.username;
  isBdmModify.value = true;
};
// 选择cm
const handleQueryCMUser = (value: string, row: IUsersQueryUserByUsernameAndCompanyIdRes[0]) => {
  form.cmName = row?.username;
  isCmModify.value = true;
};

// 提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    const data = { ...form };
    if (!isBdmModify.value) {
      data.bdmName = superiorInfo.value!.bdmName;
    }
    if (!isCmModify.value) {
      data.cmName = superiorInfo.value!.cmName;
    }
    await updateCustomerAuditInfoApi(data);
    ElMessage.success('操作成功！');
    handleCancel();
    useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
    $router.push({
      name: 'CustomerManageCustomerList',
    });
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
    width="600px"
    title="提交提示"
    custom-class="el-dialog-inner-scroll"
  >
    <el-form
      :model="form"
      label-width="120px"
      ref="formRef"
    >
      <el-form-item
        label=" "
      >
        <div>
          <span class="tips">请核实BD与审核人，</span>
          <span>提交则会流入审批流程，是否继续确认？</span>
        </div>
      </el-form-item>
      <el-form-item
        label="客户名称："
      >
        <div>{{props.params?.customerName}}</div>
      </el-form-item>
      <el-form-item
        prop="bdId"
        label="BD名称："
        :rules="[
          {
            required: true,
            message: '请选择BD',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <query-select
          v-model="form.bdId"
          :method="getUserInfo"
          placeholder="请选择BD"
          @change="handleQueryBDUser"
          :config="{
            labelKey: 'username',
            valueKey: 'userId',
            keywordQueryKey: 'username',
            valueQueryKey: 'userId',
            dataKey: 'data',
            showCode: true,
            codeKey: 'userCode'
          }"
          :findKey="form.bdName"
        />
      </el-form-item>
      <el-form-item
        prop="bdmId"
        label="BDM审核员："
        :rules="[
          {
            required: true,
            message: '请输入BDM审核员',
            trigger: 'blur',
          },
        ]"
      >
        <query-select
          :method="getUserInfo"
          placeholder="请输入BDM审核员"
          v-model="form.bdmId"
          @change="handleQueryBDMUser"
          :config="{
            labelKey: 'username',
            valueKey: 'userId',
            keywordQueryKey: 'username',
            valueQueryKey: 'userId',
            dataKey: 'data',
            showCode: true,
            codeKey: 'userCode'
          }"
          :findKey="form.bdmName"
        />
      </el-form-item>
      <el-form-item
        prop="cmId"
        label="CM审核员："
        :rules="[
          {
            required: true,
            message: '请输入CM审核员',
            trigger: 'blur',
          },
        ]"
      >
        <query-select
          :method="getUserInfo"
          placeholder="请输入CM审核员"
          v-model="form.cmId"
          @change="handleQueryCMUser"
          :config="{
            labelKey: 'username',
            valueKey: 'userId',
            keywordQueryKey: 'username',
            valueQueryKey: 'userId',
            dataKey: 'data',
            showCode: true,
            codeKey: 'userCode'
          }"
          :findKey="form.cmName"
        />
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

<style lang="scss" scoped>
.tips {
  color: #F09030;
}
</style>
