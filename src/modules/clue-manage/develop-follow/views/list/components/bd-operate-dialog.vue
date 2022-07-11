<template>
  <el-dialog
    :modelValue="visible"
    @close="handleCancel"
    :close-on-click-modal="false"
    custom-class="el-dialog-inner-scroll"
    width="500px"
    :title="$filters.getEnumLabel(BD_OPERATE_TYPE_LIST, props.params?.type)"
  >
    <el-form
      :model="formData"
      label-width="100px"
      ref="formRef"
      @submit="handleStopSubmit"
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
            message: 'BD名称不能为空',
            trigger: 'change',
          },
        ]"
      >
        <el-input
          type="text"
          v-model="formData.ownerName"
          v-if="isBdClaim"
          disabled
        />
        <query-select
          placeholder="请选择BD"
          v-model="formData.ownerId"
          :method="getUserOptionsByUserName"
          :config="{
            valueKey: 'userId',
            labelKey: 'username',
            keywordQueryKey: 'username',
            dataKey: 'data',
            showCode: true,
            codeKey: 'userCode',
          }"
          @change="handleChangeBD"
          v-else
        />
      </el-form-item>
      <div class="tips">提交则所选客户会自动绑定到该BD跟进，是否继续确认？</div>
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
  computed,
} from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import { getUserOptionsByUserName } from '@/api/query-options';
import { IGetUserOptionsByUserNameRes } from '@/api/query-options/type.d';
import { bdInfo } from '@/modules/clue-manage/develop-follow/api';
import {
  BD_OPERATE_TYPE_ENUM,
  BD_OPERATE_TYPE_LIST,
} from '@/modules/clue-manage/develop-follow/constant';
import { useAccountStore } from '@/store/account';

interface IParams {
  customerName: string;
  detailIdList: string[];
  type: BD_OPERATE_TYPE_ENUM;
  onSuccess: () => void;
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
        type: BD_OPERATE_TYPE_ENUM.TRANSFER_BD,
        onSuccess: () => {},
      };
    },
  },
);

const visible = ref(true);
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const formData = ref<{
  ownerId: string;
  ownerName: string;
}>({
  ownerId: '',
  ownerName: '',
});

const isBdClaim = computed(() => props.params?.type === BD_OPERATE_TYPE_ENUM.BD_CLAIM);

if (isBdClaim.value) {
  const accountStore = useAccountStore();
  formData.value.ownerId = accountStore.account?.userId ?? '';
  formData.value.ownerName = accountStore.account?.username ?? '';
}

const handleChangeBD = (val: string, row: IGetUserOptionsByUserNameRes) => {
  formData.value.ownerName = row.username;
};

const handleCancel = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

const handleSubmit = async () => {
  await formRef.value?.validate();

  await bdInfo({
    devIdList: props.params.detailIdList,
    ...formData.value,
    customerBdHandle: props.params.type,
  });

  ElMessage.success('操作成功！');
  if (props.params.onSuccess) {
    props.params.onSuccess();
  }
  handleCancel();
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
</style>
