<!--
 * @Descripttion: 绑定bd&转移客户
 * @Author: weitongxue
-->

<template>
  <el-dialog
    :modelValue="visible"
    @close="handleCancel"
    :close-on-click-modal="false"
    custom-class="el-dialog-inner-scroll"
    width="500px"
    :title="props.params.type === 'transfer' ? '转移客户' : '绑定设计组'"
  >
    <el-form
      :model="form"
      label-width="110px"
      ref="formRef"
      @submit="handleStopSubmit"
    >
      <el-form-item
        label="客户名称："
      >
        <div>{{props.params?.customerName}}</div>
      </el-form-item>
      <el-form-item
        prop="groupDetailList"
        label="设计组名称："
        :rules="[
          {
            type: 'array',
            required: true,
            message: '请选择设计组名称！',
            trigger: 'change',
          },
        ]"
      >
        <el-input v-model="filterText" placeholder="请输入关键字" />
        <el-tree
          class="margin-top-10"
          ref="treeRef"
          :data="treeData"
          show-checkbox
          node-key="orgId"
          @check="handleCheck"
          :default-checked-keys="defaultChecked"
          @check-change="handleCheckChange"
          :props="{
            children: 'children',
            label: 'orgName'
          }"
        />
      </el-form-item>
      <div class="padding-left-20 padding-right-20">
        <el-tag
          class="margin-right-5 margin-bottom-5"
          v-for="item in form.selectList"
          :key="item.orgId"
        >{{item.orgName}}</el-tag>
      </div>
      <div class="tips">提交则所选客户会自动绑定到该设计组跟进，是否继续确认？</div>
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
  defineEmits,
  defineProps,
  withDefaults,
  watch,
} from 'vue';
import { transferCustomerApi, bindingCustomerApi } from '@/modules/customer-follow/design-follow/api';
import { ICustomerGroupRelationPageResListItem } from '@/modules/customer-follow/design-follow/api/types';
import { HANDLE_TYPE } from '@/modules/customer-follow/design-follow/constant';
import { getAdminOrgsList } from '@/api/query-options';
import { IOrgsListResItem } from '@/api/query-options/type.d';
import { ElForm, ElMessage, ElTree } from 'element-plus';
import { cloneDeep } from 'lodash-es';

interface IParams {
  customerName: string;
  detailIdList?: [];
  row?: ICustomerGroupRelationPageResListItem;
  type: HANDLE_TYPE;
  onSuccess: () => void;
}

interface ITreeData {
  orgId: string;
  orgCode: string;
  orgName: string;
  parentCode: string;
  parentId: string;
  children: ITreeData[];
}

interface ISelectItem {
  orgId: string;
  orgName: string;
}

const emits = defineEmits(['destroy', 'success']);
const props = withDefaults(
  defineProps<{
  params: IParams;
}>(), {
    params: () => {
      return {
        customerName: '',
        detailIdList: [],
        type: HANDLE_TYPE.TRANSFER,
        onSuccess: () => {},
      };
    },
  },
);

const visible = ref(true);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const treeRef = ref<InstanceType<typeof ElTree>>();
const form = ref<{
  groupDetailList: string[];
  selectList: ISelectItem[];
}>({
  groupDetailList: [],
  selectList: [],
});

// 设计组（组织树）
const treeData = ref<IOrgsListResItem[]>([]);
const filterText = ref('');
const copyTreeData = ref<IOrgsListResItem[]>([]);
const handleTree = async () => {
  const res = await getAdminOrgsList({});
  treeData.value = res?.data ?? [];
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

const defaultChecked = ref<string[]>([]);
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
    treeData.value = cloneDeep(copyTreeData.value);
  }
  defaultChecked.value = form.value.selectList.map(item => item.orgId);
});

// 为了form检验
const currentSelect = ref<{orgName: string; orgId: string; isCheck: boolean;}[]>([]);
const handleCheckChange = (val: ITreeData, bol: boolean) => {
  const index = currentSelect.value.findIndex(info => info.orgId === val.orgId);
  if (index !== -1) {
    currentSelect.value[index].orgId = val.orgId;
    currentSelect.value[index].isCheck = bol;
    currentSelect.value[index].orgName = val.orgName;
  } else {
    currentSelect.value.push({
      orgId: val.orgId,
      isCheck: bol,
      orgName: val.orgName,
    });
  }
  const selectTree = treeRef.value?.getCheckedNodes();
  // 获取最后一级展示
  if (selectTree?.length) {
    selectTree.forEach((item: IOrgsListResItem) => {
      if (!item.children?.length) {
        if (!form.value.groupDetailList.includes(item.orgName!)) {
          form.value.groupDetailList.push(item.orgName!);
        }
      }
    });
  }
};

// 获取最后一级
const handleLastNode = (item: ITreeData, last: ISelectItem[]) => {
  if (!item.children.length) {
    last.push({
      orgId: item.orgId!,
      orgName: item.orgName!,
    });
  } else {
    item.children.forEach((info) => {
      handleLastNode(info, last);
    });
  }
};
// 删除选中
const handleCheck = (val: ITreeData) => {
  const list = [] as ISelectItem[];
  const selectList = form.value.selectList
    .map(item => item.orgId);
  handleLastNode(val, list);
  // 获取最后一级
  list.forEach((item) => {
    if (selectList.includes(item.orgId)) {
      const index = form.value.selectList.findIndex(e => e.orgId === item.orgId);
      form.value.selectList.splice(index, 1);
    } else {
      form.value.selectList.push(item);
    }
  });
  // 全选
  if (currentSelect.value.find(info => info.orgId === val.orgId)?.isCheck) {
    list.forEach((item) => {
      if (!form.value.selectList
        .map(e => e.orgId).includes(item.orgId)) {
        form.value.selectList.push(item);
      }
    });
  }
  if (!form.value.selectList.length) {
    form.value.groupDetailList = [];
  }
};

// 取消
const handleCancel = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

// 提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    const customerBusinessRelationList = props.params.detailIdList?.map(
      (item: ICustomerGroupRelationPageResListItem) => {
        return {
          customerId: item?.customerId,
          businessId: item?.businessId,
          groupDetailList: form.value.selectList.map((info) => {
            return {
              groupId: info.orgId,
              groupName: info.orgName,
            };
          }),
        };
      },
    );
    const transferParams = {
      customerBusinessRelationList,
    };
    const bindingParams = {
      customerId: props.params?.row?.customerId,
      businessId: props.params?.row?.businessId,
      groupDetailList: form.value.selectList.map((item) => {
        return {
          groupId: item.orgId,
          groupName: item.orgName,
        };
      }),
    };

    if (props.params.type === HANDLE_TYPE.TRANSFER) {
      await transferCustomerApi(transferParams);
    } else {
      await bindingCustomerApi(bindingParams);
    }

    ElMessage.success('操作成功！');
    if (props.params.onSuccess) {
      props.params.onSuccess();
    }
    handleCancel();
  } catch (e) {
    console.log(e);
  }
};

const handleStopSubmit = (e: Event) => {
  const event = e || window.event;
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    window.event?.preventDefault();
  }
};

</script>

<style lang="scss" scoped>
.tips {
  margin-left: 30px;
  margin-top: 20px;
}
:deep(.el-tree__empty-block) {
  width: 200px!important;
}
</style>
