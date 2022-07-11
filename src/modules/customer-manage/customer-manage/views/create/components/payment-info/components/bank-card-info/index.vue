<!--
 * @Descripttion: 银行卡信息
 * @Author: weitongxue
-->
<template>
  <div class="bank-card-info">
    <div class="bank-card-info__title flex flex-justify-between flex-align-center">
      <span>银行卡信息</span>
      <el-button
        v-if="isCreate && CAN_CREATE_CARD_DATA"
        type="success"
        class="margin-right-10"
        @click="handleSave"
      >暂存</el-button>
      <div v-else>
        <el-button
          type="primary"
          v-show="!isEdit && !edit && CAN_UPDATE_CARD_DATA"
          @click="handleEdit"
        >编辑</el-button>
        <div v-show="edit">
          <el-button
            @click="handleCancel"
          >取消</el-button>
          <el-button
            type="primary"
            @click="handleSave"
          >保存</el-button>
        </div>
      </div>
    </div>
    <div class="bank-card-info__content">
      <custom-table
        border
        ref="bankRef"
        :data="bankAccountList"
        v-if="businessType"
        :is-form="true"
        :columns="renderColumns(bankAccountList.length, handleDelete, handleAdd, isEdit, handleSelectBank,
                                pageTab, businessType)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  PropType,
  watch,
  inject,
} from 'vue';
import { useRoute } from 'vue-router';
import {
  renderColumns,
} from './composables/tableData';

import CustomTable from '@/components/custom-table';

import {
  updateCustomerAccountingInfoApi,
  platformAccountSaveApi,
} from '@/modules/customer-manage/customer-manage/api';
import { IAccountingPeriodSaveReq,
  IAccountingPeriodSaveBankAccountListItem,
} from '@/modules/customer-manage/customer-manage/api/types';
import { MODULE_BLOCK_ENUM, TABS_ENUM } from '@/modules/customer-manage/customer-manage/constant';
import { BUSINESS_MODE_ENUM } from '@/constant';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
import { cloneDeep } from 'lodash-es';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<IAccountingPeriodSaveBankAccountListItem[]>,
      default: () => [],
    },
    businessType: {
      type: String,
      default: '',
    },
    pageTab: {
      type: String,
      default: '',
    },
  },
  emits: ['edit'],
  setup(props, { emit }) {
    const $route = useRoute();
    const customerId = $route.params.id! as string;
    const routeName = $route.name;
    const bankRef = ref<InstanceType<typeof CustomTable> | null>(null);
    const handleRefresh = inject<(item: TABS_ENUM) => void>('handleRefresh');

    // 是否编辑
    const edit = ref(false);
    const isEdit = computed(() => {
      return routeName === 'CustomerManageCreateCustomer' || edit.value;
    });
    // 区分新增还是编辑
    const isCreate = computed(() => {
      // customerCode存在就是创建
      return routeName === 'CustomerManageCreateCustomer';
    });

    // 权限
    const {
      CAN_CREATE_CARD_DATA,
      CAN_UPDATE_CARD_DATA,
    } = usePermissionConfig();

    const bankAccountList = ref<IAccountingPeriodSaveBankAccountListItem[]>([
      {
        bankName: '',
        bankCode: '',
        subBankName: '',
        accountHolder: '',
        accountNo: '',
        accountType: '',
        enableState: 'NO',
      },
    ]);

    const bankAccountStr = ref('');
    watch(() => props.data, (val) => {
      if (val && val?.length) {
        bankAccountList.value = props.data;
      } else {
        bankAccountList.value = [];
      }
      bankAccountStr.value = JSON.stringify(cloneDeep(bankAccountList.value));
    });

    // 新增银行卡信息
    const handleAdd = () => {
      bankAccountList.value.push({
        bankName: '',
        bankCode: '',
        subBankName: '',
        accountHolder: '',
        accountNo: '',
        accountType: '',
        enableState: 'NO',
      });
    };

    // 删除银行卡信息
    const handleDelete = (index: number) => {
      bankAccountList.value.splice(index, 1);
    };

    // 选择银行
    const handleSelectBank = (item: {label: string; value: string;}, index: number) => {
      bankAccountList.value[index].bankName = item?.label;
    };

    const handleSave = async () => {
      await bankRef.value?.handleValidate();
      const params: IAccountingPeriodSaveReq = {
        bankAccountList: bankAccountList.value.filter(item => item.accountNo),
        customerId,
        editModuleList: [MODULE_BLOCK_ENUM.BANK_ACCOUNT],
      };
      const res = props.businessType === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS
        ? await updateCustomerAccountingInfoApi(params) : await platformAccountSaveApi(params);
      edit.value = false;
      if (!isCreate.value) {
        handleRefresh?.(TABS_ENUM.TAB_PAYMENT);
      }
      bankAccountStr.value = JSON.stringify(cloneDeep(bankAccountList.value));
      useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
      console.log(res.data?.isAllCompleted, '是否全部填写');
    };

    // 是否提示保存
    const handleIsSave = () => {
      return bankAccountStr.value === JSON.stringify(bankAccountList.value);
    };

    // 取消
    const handleCancel = () => {
      bankRef.value?.handleResetFields();
      edit.value = false;
      bankAccountList.value = cloneDeep(JSON.parse(bankAccountStr.value));
    };

    const handleEdit = () => {
      emit('edit', 'bankInfo');
      edit.value = true;
      bankAccountStr.value = JSON.stringify(cloneDeep(bankAccountList.value));
    };

    return {
      bankAccountList,
      isCreate,
      edit,
      isEdit,
      bankRef,
      CAN_CREATE_CARD_DATA,
      CAN_UPDATE_CARD_DATA,

      renderColumns,
      handleDelete,
      handleAdd,
      handleSelectBank,
      handleCancel,
      handleEdit,
      handleIsSave,
      handleSave,
    };
  },
});
</script>

<style lang="scss" scoped>
.bank-card-info {
  border: 1px solid #eee;
  margin-bottom: 10px;
  padding: 15px 10px 0px;
  &__title {
    display: flex;
    align-items: center;
    position: relative;
    font-weight: bold;
    padding-left: 10px;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 3px;
      height: 16px;
      background-color: var(--el-color-primary);
      transform: translateY(-50%);
    }
  }
  &__content {
    padding: 20px 10px;
  }
}
</style>
