<template>
  <el-dialog
    :modelValue="visible"
    @close="handleCancel"
    :close-on-click-modal="false"
    custom-class="el-dialog-inner-scroll"
    width="600px"
    :title="props.type === TYPE_ENUM.CREATE ? '目标设置' : '目标变更'"
  >
    <el-form
      :model="form"
      label-width="110px"
      ref="formRef"
      :rules="rules"
    >
      <el-form-item
        label="目标类型："
        prop="targetType"
      >
        <el-select
          v-if="props.type === TYPE_ENUM.CREATE"
          v-model="form.targetType"
          placeholder="请选择目标类型"
          class="select-width"
          @change="handleSelectTargetType"
        >
          <el-option
            v-for="item in TARGET_TYPE_LIST"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
        <div v-else>{{$filters.getEnumLabel(TARGET_TYPE_LIST, form.targetType)}}</div>
      </el-form-item>
      <el-form-item
        label="目标名称："
        prop="targetName"
      >
        <el-input
          placeholder="请输入目标名称"
          v-model="form.targetName"
          maxLength="100"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="设置范围："
        prop="objectiveType"
      >
        <el-select
          v-model="form.objectiveType"
          placeholder="请选择设置范围"
          class="select-width"
          @change="handleSelectObject"
          :disabled="(form.targetType === TARGET_TYPE_ENUM.COLLECTION_AMOUNT)
            || isNoAdmin"
        >
          <el-option
            v-for="item in TARGET_RANGE_LIST"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 内部对象才有部门 -->
      <el-form-item
        label="设置部门："
        prop="objectiveOrgId"
        v-if="form.objectiveType === TARGET_RANGE_ENUM.INNER_OBJECT"
      >
        <el-input
          v-if="isNoAdmin"
          disabled
          v-model="form.objectiveOrgName"
        ></el-input>
        <el-select
          v-else
          v-model="form.objectiveOrgId"
          placeholder="请选择设置部门"
          class="select-width"
          @change="handleSelectOrg"
        >
          <el-option
            v-for="item in orgList"
            :key="item.orgId"
            :value="item.orgId"
            :label="item.orgName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="设置对象："
        prop="objective"
      >
        <query-select
          v-model="form.objective"
          v-if="form.objectiveType === TARGET_RANGE_ENUM.INNER_OBJECT"
          :method="getSaleTargetUserApi"
          placeholder="请选择设置对象"
          :config="{
            labelKey: 'objectiveName',
            valueKey: 'objectiveId',
            keywordQueryKey: 'objectiveName',
            valueQueryKey: 'objectiveName',
            dataKey: 'data.list',
          }"
          :queryParams="{
            orgId: form.objectiveOrgId
          }"
          :disabled="!form.objectiveOrgId || isNoAdmin"
          needInitOptions
          @change="handleInnerObjective"
        />
        <query-select
          v-else
          placeholder="请选择设置对象"
          v-model="form.objective"
          :method="getCustomerOptions"
          :config="{
            valueKey: 'customerId',
            labelKey: 'customerName',
            keywordQueryKey: 'customerName',
            valueQueryKey: 'customerName',
            dataKey: 'data',
            showValue: true,
          }"
          :queryParams="{
            ownerId: account.account?.userId,
            customerState: 'ENABLE',
            businessType: ''
          }"
          :disabled="form.objectiveType !== TARGET_RANGE_ENUM.EXTERNAL_OBJECT || isNoAdmin"
          needInitOptions
          @change="handleObjective"
        />
      </el-form-item>
      <el-form-item
        label="目标完成："
        prop="targetValue"
      >
        <input-number
          v-model="form.targetValue"
          placeholder="请输入需要完成的目标值"
          :min="0"
          maxLength="9"
          :precision="0"
        >
          <template #append>
            <el-select
              v-model="form.targetUnit"
              placeholder="请选择"
              style="width: 115px"
            >

              <el-option
                v-for="item in utilList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </input-number>
      </el-form-item>
      <el-form-item
        label="生效日期："
        prop="effectivePeriod"
      >
        <el-select
          v-model="form.effectivePeriod"
          placeholder="请选择生效日期"
          class="select-width"
        >
          <el-option
            v-for="item in EFFECTIVE_DATE_LIST"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="变更原因："
        prop="reason"
        v-if="props.type === TYPE_ENUM.UPDATE"
      >
        <el-input
          type="textarea"
          placeholder="请输入变更原因"
          v-model="form.reason"
          maxLength="500"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
        >确认</el-button>
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
  reactive,
  watch,
  computed,
} from 'vue';

import {
  TYPE_ENUM,
  TARGET_TYPE_LIST,
  TARGET_RANGE_LIST,
  EFFECTIVE_DATE_LIST,
  TARGET_RANGE_ENUM,
  TARGET_TYPE_ENUM,
} from '../../../constant';
import {
  getSaleTargetUserApi,
  getSaleTargetOrgApi,
  saleTargetSaveApi,
  saleTargetUpdateApi,
} from '../../../api';
import {
  ISaleTargetSaveReq,
  ISaleTargetManageOrgResItem,
  ISaleTargetNextOrgAndUserResListItem,
  ISaleTargetPageResListItem,
} from '../../../api/type';
import { useAccountStore } from '@/store/account';
import {
  getCustomerOptions,
} from '@/api/query-options';
import { ICustomerInfoSearchResItem } from '@/api/query-options/type.d';

import { ElForm, ElMessage } from 'element-plus';
import type { FormRules } from 'element-plus';
import { IDictionaryItem } from '@/hooks/use-dictionary/types';
import { useMenuStore } from '@/store/menu';

interface IProps {
  type: keyof typeof TYPE_ENUM;
  utilList: IDictionaryItem[];
  success: () => void;
  row?: ISaleTargetPageResListItem;
}

interface IForm extends ISaleTargetSaveReq {
  objective?: '';
}

const account = useAccountStore();
const emits = defineEmits(['destroy', 'success']);
const props = withDefaults(defineProps<IProps>(), {
  type: TYPE_ENUM.CREATE,
  utilList: () => [],
  success: () => {},
  row: () => { return {}; },
});

const visible = ref(true);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const form = ref<IForm>({
  targetId: '',
  targetName: '', // 目标名称
  targetType: '', // 目标类型
  objectiveType: '', // 设置范围
  targetValue: '', // 目标值
  targetUnit: '',
  objectiveList: [], // 设置对象
  effectivePeriod: '', // 生效周期
  reason: '', // 变更原因
  objectiveOrgId: '', // 设置部门Id
  objectiveOrgName: '', // 设置部门名称
  objective: '',
});

// 查询组织
const orgList = ref<ISaleTargetManageOrgResItem[]>([]);
const handleSelectObject = async (val: TARGET_RANGE_ENUM) => {
  form.value.objective = '';
  form.value.objectiveList = [];
  form.value.objectiveOrgId = '';
  form.value.objectiveOrgName = '';
  // 只有内部对象才查组织
  if (val === TARGET_RANGE_ENUM.INNER_OBJECT && account.currentCompany?.companyId) {
    const res = await getSaleTargetOrgApi(account.currentCompany?.companyId);
    orgList.value = res?.data ?? [];
  }
};

// 目标类型
const handleSelectTargetType = (type: TARGET_TYPE_ENUM) => {
  formRef.value?.resetFields();
  form.value.targetType = type;
  form.value.targetUnit = '';
  // 目标设定选择了“回款金额”后，“设置范围”固定为【外部对象】，不可修改
  if (type === TARGET_TYPE_ENUM.COLLECTION_AMOUNT) {
    form.value.objectiveType = TARGET_RANGE_ENUM.EXTERNAL_OBJECT;
  }
};

// 目标变更（回显）
watch(() => props.row, async (val) => {
  Object.assign(form.value, val, {
    objective: val?.objectiveList?.[0]?.objectiveName,
  });
  if (form.value.objectiveType === TARGET_RANGE_ENUM.INNER_OBJECT && account.currentCompany?.companyId) {
    const res = await getSaleTargetOrgApi(account.currentCompany?.companyId);
    orgList.value = res?.data ?? [];
  }
}, { immediate: true });

// 取消
const handleCancel = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

// 选择设置对象（外部）
const handleObjective = (val: string, item: ICustomerInfoSearchResItem) => {
  form.value.objectiveList = [];
  form.value.objectiveList.push({
    objectiveName: item?.customerName,
    objectiveId: item?.customerId,
    type: '3', // 客户
  });
};

// 选择设置对象（内部）
const handleInnerObjective = (val: string, item: ISaleTargetNextOrgAndUserResListItem) => {
  form.value.objectiveList = [];
  const { objectiveId, objectiveName, objectiveOrgPath, type } = item;
  form.value.objectiveList.push({
    objectiveId,
    objectiveName,
    objectiveOrgPath,
    type,
  });
};

// 选择部门
const handleSelectOrg = (val: string) => {
  form.value.objective = '';
  form.value.objectiveList = [];
  form.value.objectiveOrgName = orgList.value?.find(info => info.orgId === val)?.orgName || '';
};

// 目标变更是否是同一个操作人
const isNoAdmin = computed(() => {
  return !!(props.row?.creatorId !== account.account?.userId && props.row?.creatorId);
});

// 提交
const handleSubmit = async () => {
  await formRef.value?.validate();
  if (form.value.targetId) {
    // 目标变更
    await saleTargetUpdateApi(form.value);
  } else {
    await saleTargetSaveApi(form.value);
  }
  handleCancel();
  ElMessage.success('操作成功！');
  if (typeof props.success === 'function') {
    props.success();
  }
  useMenuStore().deleteKeepAlive('SalesManageTargetSettingList');
};

const rules = reactive<FormRules>({
  targetType: [
    {
      required: true,
      message: '请选择目标类型',
      trigger: 'change',
    },
  ],
  targetName: [
    {
      required: true,
      message: '请输入目标名称',
      trigger: 'blur',
    },
  ],
  objectiveType: [
    {
      required: true,
      message: '请选择设置范围',
      trigger: 'change',
    },
  ],
  objectiveOrgId: [
    {
      required: true,
      message: '请选择部门',
      trigger: 'change',
    },
  ],
  targetValue: [
    {
      required: true,
      validator: (rule: any, value: string,
        callback: (err?: Error) => void) => {
        if (!value) {
          callback(new Error('请输入目标值！'));
        } else if (value && !form.value.targetUnit) {
          callback(new Error('请选择单位'));
        } else {
          callback();
        }
      },
    },
  ],
  objective: [
    {
      required: true,
      message: '请选择设置对象',
      trigger: 'change',
    },
  ],
  effectivePeriod: [
    {
      required: true,
      message: '请选择生效日期',
      trigger: 'change',
    },
  ],
  reason: [
    {
      required: true,
      message: '请输入变更原因',
      trigger: 'blur',
    },
  ],
});
</script>
