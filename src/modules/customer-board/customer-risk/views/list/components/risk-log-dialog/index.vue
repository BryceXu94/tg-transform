<template>
  <el-dialog
    :modelValue="visible"
    @close="handleCancel"
    :close-on-click-modal="false"
    custom-class="el-dialog-inner-scroll"
    width="500px"
    title="风险更新记录"
  >
    <p class="customer_name">客户名称：{{ customerName }}</p>
    <el-scrollbar max-height="600px">
      <tgo-table
        :data="riskHistoryList"
        :columns="tableColumns"
      />
    </el-scrollbar>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  ref,
  defineEmits,
  defineProps,
  withDefaults,
} from 'vue';
import { useTableColumns } from './hooks/use-table-columns';
import { getFinanceRiskInfoDetailApi } from '@/modules/customer-board/customer-risk/api';
import { IFinanceRiskInfoDetailResRiskHistoryListItem } from '../../type';

interface IParams {
  customerId: string;
}

const emits = defineEmits(['destroy', 'success']);
const props = withDefaults(
  defineProps<{
  params: IParams;
}>(), {
    params: () => {
      return {
        customerId: '',
      };
    },
  },
);

const visible = ref(true);

const { tableColumns } = useTableColumns();

const customerName = ref('');
const riskHistoryList = ref<IFinanceRiskInfoDetailResRiskHistoryListItem[]>([]);

const handleOpen = async () => {
  const { data } = await getFinanceRiskInfoDetailApi(props.params.customerId);
  customerName.value = data.customerName;
  riskHistoryList.value = data.riskHistoryList;
};
handleOpen();

const handleCancel = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

</script>

<style lang="scss" scoped>
.customer_name {
  margin-top: -16px;
  margin-bottom: 10px;
}
</style>
