<!--
 * @Descripttion: 绑定bd&转移客户
 * @Author: weitongxue
-->
<script lang="ts" setup>
import {
  ref,
  reactive,
  defineEmits, defineProps, withDefaults } from 'vue';
import { useAccountStore } from '@/store/account';
import { getUserInfo, getBDSuperiorInfo } from '@/api/query-options';
import { IUsersQueryUserByUsernameAndCompanyIdRes, IBdGetBdSuperiorRes } from '@/api/query-options/type.d';
import { transferCustomerApi, bindingCustomerApi } from '@/modules/customer-follow/sale-follow/api';
import { IBdInfoRes } from '@/modules/customer-follow/sale-follow/api/types';
import { ElForm, ElMessage } from 'element-plus';

interface IConfig {
  params: any;
}

const emits = defineEmits(['destroy', 'success']);
const props = withDefaults(defineProps<IConfig>(), {
  params: {},
});

const visible = ref(true);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const form = reactive<{
  ownerName: string;
  ownerId: string;
  cmName: string;
  cmId: string;
}>({
  ownerName: '',
  ownerId: '',
  cmName: '',
  cmId: '',
});

const { currentCompany } = useAccountStore();

// 取消
const handleCancel = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

const auditBdInfo = props.params?.auditBdInfo as IBdInfoRes;
const bdmName = auditBdInfo?.bdmInfo.map(item => item.bdmName).join(',');
const bdmCustomerName = auditBdInfo?.bdmInfo.map(item => item.customerName).join(',');
// eslint-disable-next-line vue/no-setup-props-destructure
const showAuditBdInfo = auditBdInfo?.isShow;

// 获取bdm 和 cm
const superiorInfo = ref<IBdGetBdSuperiorRes>();
const isCmModify = ref(false);
const getSuperiorInfo = async (bdId: string) => {
  try {
    const data = {
      companyId: currentCompany?.companyId as string,
      bdId,
    };
    const res = await getBDSuperiorInfo(data);
    superiorInfo.value = res?.data;
    form.cmName = superiorInfo.value?.cmName;
    form.cmId = superiorInfo.value?.cmId;
    isCmModify.value = false;
  } catch (e) {
    console.log(e);
  }
};

// 选择bd
const handleQueryBDUser = (value: string, row: IUsersQueryUserByUsernameAndCompanyIdRes[0]) => {
  form.ownerName = row?.username;
  getSuperiorInfo(row?.userId);
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
    if (!isCmModify.value) {
      data.cmName = superiorInfo.value!.cmName;
    }
    const transferParams = {
      detailIdList: props.params.detailIdList,
      ...data,
    };
    const bindingParams = {
      customerId: props.params?.row?.customerId,
      businessId: props.params?.row?.businessId,
      ...data,
    };

    await (props.params.type === 'transfer' ? transferCustomerApi(transferParams)
      : bindingCustomerApi(bindingParams));

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

<template>
  <el-dialog
    :modelValue="visible"
    @close="handleCancel"
    :close-on-click-modal="false"
    custom-class="el-dialog-inner-scroll"
    width="500px"
    title="提交提示"
  >
    <el-form
      :model="form"
      label-width="120px"
      ref="formRef"
    >
      <el-form-item
        label="客户名称："
      >
        <div>{{props.params?.customerName}}</div>
      </el-form-item>
      <el-form-item
        prop="ownerId"
        label="BD名称："
        :rules="[
          {
            required: true,
            message: '请选择BD名称',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <query-select
          v-model="form.ownerId"
          :method="getUserInfo"
          :config="{
            labelKey: 'username',
            valueKey: 'userId',
            keywordQueryKey: 'username',
            valueQueryKey: 'username',
            dataKey: 'data',
            showCode: true,
            codeKey: 'userCode',
          }"
          :findKey="form.ownerName"
          @change="handleQueryBDUser"
        />
      </el-form-item>
      <div class="tips" v-if="!showAuditBdInfo">提交则所选客户会自动绑定到该BD跟进，是否继续确认？</div>
      <template v-else>
        <el-divider />
        <div class="tips margin-bottom-20">该客户处于档案审核中，请再次核实转移的BD与审核人，提交后自动绑定到对应BD跟进，与对应审核人员进行审核。</div>
        <el-form-item
          label="客户名称："
        >
          <div>{{bdmCustomerName}}</div>
        </el-form-item>
        <el-form-item
          prop="ownerId"
          label="BDM审核员："
          :rules="[
            {
              required: true,
              message: '请选择BDM审核员',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            type="text"
            disabled
            placeholder="请选择"
            v-model="bdmName"
          />
        </el-form-item>
        <el-form-item
          prop="cmId"
          label="CM审核员："
          :rules="[
            {
              required: true,
              message: '请选择CM审核员',
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
              valueQueryKey: 'username',
              dataKey: 'data',
              showCode: true,
              codeKey: 'userCode'
            }"
            :findKey="form.cmName"
          />
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

<style lang="scss" scoped>
.tips {
  margin-left: 30px;
  margin-top: 20px;
}
</style>
