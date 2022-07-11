<template>
  <el-dialog
    :modelValue="visible"
    @close="handleCancel"
    :close-on-click-modal="false"
    custom-class="el-dialog-inner-scroll"
    width="500px"
    :title="props.params.type === CREATE_EDIT_ENUM.CREATE ? '数据权限配置新增' : '数据权限配置编辑'"
  >
    <el-form
      :model="form"
      label-width="110px"
      ref="formRef"
    >
      <el-form-item
        prop="dataRange"
        label="数据范围："
        :rules="[
          {
            required: true,
            message: '请输入数据范围！',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <el-input
          v-model="form.dataRange"
          disabled
          placeholder="请输入数据范围"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="detailReq"
        label="人员名单："
        :rules="[
          {
            required: true,
            message: '请选择人员名单！',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <div>
          <el-tag
            class="margin-right-5 margin-bottom-5"
            closable
            v-for="(item, index) in form.detailReq"
            :key="index"
            @close="handleClose(item)"
          >{{ item.userName }}[{{ item.userCode }}]</el-tag>
        </div>
        <query-select
          v-model="form.userName"
          placeholder="请选择人员名单"
          :method="getUserOptionsByUserName"
          :config="{
            labelKey: 'username',
            valueKey: 'userId',
            keywordQueryKey: 'username',
            valueQueryKey: 'username',
            dataKey: 'data',
            showCode: true,
            codeKey: 'userCode',
          }"
          @change="handleSelectPersonnel"
        />
      </el-form-item>
      <el-form-item
        prop="dataObject"
        label="数据对象："
        :rules="[
          {
            required: true,
            message: '请输入数据对象！',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <el-input
          v-model="form.dataObject"
          disabled
          placeholder="请输入数据对象"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="dataObjectName"
        label="部门名称："
        :rules="[
          {
            required: true,
            message: '请选择部门名称',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <el-input
          v-model="filterText"
          placeholder="请选择部门名称"
          clearable
        />
        <el-tree
          class="margin-top-10"
          ref="treeRef"
          :data="treeData"
          show-checkbox
          node-key="orgId"
          @check="handleCheck"
          :check-strictly="true"
          :default-checked-keys="defaultChecked"
          :props="{
            children: 'children',
            label: 'orgName',
          }"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, defineEmits, defineProps, withDefaults, watch } from 'vue';
import { getUserOptionsByUserName, getAdminOrgsList } from '@/api/query-options';
import { IOrgsListResItem, IGetUserOptionsByUserNameRes } from '@/api/query-options/type.d';
import {
  createDataPermissionConfig,
  editDataPermissionConfig,
} from '@/modules/configuration-manage/data-permissions/api';
import {
  IDataPermissionConfigSaveReq,
  IDataPermissionConfigDetailResDetailVosItem,
} from '@/modules/configuration-manage/data-permissions/api/type';
import { CREATE_EDIT_ENUM } from '../type';
import {
  DATA_RANGE_ENUM,
  DATA_RANGE_LIST,
  DATA_OBJECT_ENUM,
  DATA_OBJECT_LIST,
} from '@/modules/configuration-manage/data-permissions/constant/index';
import { filters } from '@/core/plugins/filter';
import { ElForm, ElMessage, ElTree } from 'element-plus';
import { cloneDeep } from 'lodash-es';

interface IConfig {
  onSuccess: () => void;
  configId?: string;
  configType?: string;
  dataObjectType?: string;
  dataObjectId?: string;
  dataObjectName?: string;
  detailVos?: IDataPermissionConfigDetailResDetailVosItem[];
  type: CREATE_EDIT_ENUM;
}

interface ITreeData {
  orgId: string;
  orgCode: string;
  orgName: string;
  parentCode: string;
  parentId: string;
  children: ITreeData[];
}

interface IPersonnelData {
  configId?: string;
  userName?: string;
  userId?: string;
}

interface IForm extends IDataPermissionConfigSaveReq {
  userName: string;
  dataRange: string;
  dataObject: string;
}

interface CheckedKey {
  checkedKeys: string[];
  checkedNodes: string[];
  halfCheckedKeys: string[];
  halfCheckedNodes: string[];
}
const emits = defineEmits(['destroy', 'success']);
const props = withDefaults(
  defineProps<{
    params: IConfig;
  }>(),
  {
    params: () => {
      return {
        configId: '',
        configType: '',
        dataObjectType: '',
        dataObjectId: '',
        dataObjectName: '',
        detailVos: [],
        type: CREATE_EDIT_ENUM.CREATE,
        onSuccess: () => {},
      };
    },
  },
);

const visible = ref(true);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const treeRef = ref<InstanceType<typeof ElTree>>();
const form = reactive<IForm>({
  configType: DATA_RANGE_ENUM.SALES_DEPT_DATA,
  dataObjectType: DATA_OBJECT_ENUM.SPECIFY_DEPARTMENT,
  dataRange: filters.getEnumLabel(DATA_RANGE_LIST, DATA_RANGE_ENUM.SALES_DEPT_DATA),
  dataObject: filters.getEnumLabel(DATA_OBJECT_LIST, DATA_OBJECT_ENUM.SPECIFY_DEPARTMENT),
  dataObjectId: '',
  dataObjectName: '',
  detailReq: [],
  userName: '',
});

// 获取人员信息
const handleSelectPersonnel = (value: string, row: IGetUserOptionsByUserNameRes) => {
  const result = form.detailReq?.find(info => info.userId === row.userId);
  // 数组里面已经存在的人员不可再次添加
  if (value && result === undefined) {
    form.detailReq!.push({
      userId: row.userId,
      userName: row.username,
      userCode: row.userCode,
    });
  }
};

// 取消tag
const handleClose = (item: IPersonnelData) => {
  form.detailReq!.splice(form.detailReq!.indexOf(item), 1);
  if (form.detailReq?.length === 0) {
    form.userName = '';
  }
};

// 部门(组织树)
// 用于判断树是否加载完
const isLoad = ref<boolean>(false);
const treeData = ref<IOrgsListResItem[]>([]);
const filterText = ref('');
const copyTreeData = ref<IOrgsListResItem[]>([]);
const handleTree = async () => {
  const res = await getAdminOrgsList({});
  treeData.value = res?.data ?? [];
  isLoad.value = true;
  copyTreeData.value = cloneDeep(treeData.value);
};
handleTree();

// 过滤
const showTreeData = ref<IOrgsListResItem[]>([]);
const deepFilter = (val: string, tree: ITreeData[]) => {
  if (!tree.length) return;
  tree?.forEach((item: ITreeData) => {
    if (item.orgName.indexOf(val) !== -1) {
      showTreeData.value.push(item);
    } else {
      deepFilter(val, item.children);
    }
  });
};

// 复选框状态
const handleCheck = (val: ITreeData, node:CheckedKey) => {
  // 复选框取消选中则输入框置空
  if (node.checkedKeys.length === 0) {
    filterText.value = '';
    treeRef.value?.setCheckedKeys([]);
  } else {
    console.log(val, 'val');
    treeRef.value?.setCheckedKeys([val.orgId]);
    form.dataObjectId = val.orgId;
    form.dataObjectName = val.orgName;
    filterText.value = val.orgName;
  }
};

// 取消
const handleCancel = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

// 组织树输入监听;
watch(filterText, (val) => {
  if (val) {
    showTreeData.value = [];
    treeData.value = cloneDeep(copyTreeData.value);
    treeData.value.forEach((item) => {
      if (item.orgName?.indexOf(val.trim()) !== -1) {
        showTreeData.value.push(item);
      } else if (item.children?.length) {
        deepFilter(val, item.children as ITreeData[]);
      } else {
        showTreeData.value = [];
      }
    });
    treeData.value = showTreeData.value;
  } else {
    treeRef.value?.setCheckedKeys([]);
    form.dataObjectName = '';
    treeData.value = cloneDeep(copyTreeData.value);
  }
});

// 编辑监听
const defaultChecked = ref<string[]>([]);
watch(
  () => props,
  async () => {
    if (props.params.type === CREATE_EDIT_ENUM.EDIT) {
      const { configId, dataObjectName, detailVos, dataObjectId } = props.params;
      form.configId = configId!;
      form.dataObjectId = dataObjectId!;
      form.detailReq = detailVos!;
      form.dataObjectName = dataObjectName!;
      defaultChecked.value = [dataObjectId!];
    }
  },
  { immediate: true },
);

watch(isLoad, (val) => {
  if (val === true) {
    filterText.value = form.dataObjectName;
  }
});

// 确认
const handleConfirm = async () => {
  try {
    await formRef.value?.validate();
    const dataParams = {
      configId: form.configId,
      configType: form.configType,
      dataObjectType: form.dataObjectType,
      dataObjectId: form.dataObjectId,
      dataObjectName: form.dataObjectName,
      detailReq: form.detailReq,
    };
    if (props.params.type === CREATE_EDIT_ENUM.CREATE) {
      await createDataPermissionConfig(dataParams);
    } else {
      await editDataPermissionConfig(dataParams);
    }
    ElMessage.success('操作成功！');
    if (props.params.onSuccess) {
      console.log(111);
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
