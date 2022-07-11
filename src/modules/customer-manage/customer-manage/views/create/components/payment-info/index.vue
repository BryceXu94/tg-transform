<!--
 * @Descripttion: 期货帐期
 * @Author: weitongxue
-->
<template>
  <!-- 帐期信息 -->
  <account-info
    :data="accountInfo"
    ref="account-info"
    v-if="businessType === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS"
  />
  <platform-account-info
    :data="accountInfo"
    ref="account-info"
    v-if="businessType === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS"
  />
  <!-- 发票信息 -->
  <invoice-info
    :data="invoiceInfo"
    :pageTab="pageTab"
    ref="invoice-info"
    @edit="handleEdit"
    v-if="businessType === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS"
  />
  <!-- 银行卡信息 -->
  <bank-card-info
    :data="bankInfo"
    :businessType="businessType"
    :pageTab="pageTab"
    ref="bank-card-info"
    @edit="handleEdit"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, computed, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';

import AccountInfo from './components/account-info/index.vue';
import InvoiceInfo from './components/invoice-info/index.vue';
import BankCardInfo from './components/bank-card-info/index.vue';
import PlatformAccountInfo from './components/platform-account-info/index.vue';

import {
  IDetailAccountingPeriodRes,
} from '@/modules/customer-manage/customer-manage/api/types';
import { BUSINESS_MODE_ENUM } from '@/constant';

type TRefs = {
  'account-info': {
    handleIsSave: () => boolean;
  };
  'invoice-info': {
     handleIsSave: () => boolean;
  };
  'bank-card-info': {
     handleIsSave: () => boolean;
  };
}

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<IDetailAccountingPeriodRes>,
      default: () => {},
    },
    encryptData: {
      type: Object as PropType<IDetailAccountingPeriodRes>,
      default: () => {},
    },
  },
  components: {
    AccountInfo,
    InvoiceInfo,
    BankCardInfo,
    PlatformAccountInfo,
  },
  setup(props) {
    const $route = useRoute();
    const editedModule = reactive({
      invoiceInfo: false,
      bankInfo: false,
    });
    const isCreate = $route.name === 'CustomerManageCreateCustomer';

    // 帐期信息
    const accountInfo = computed(() => props?.data?.customerAccountingPeriod);
    // 发票信息
    const invoiceInfo = computed(() => {
      return (isCreate || editedModule.invoiceInfo) ? props?.data?.invoice : props?.encryptData?.invoice;
    });
    // 银行卡信息
    const bankInfo = computed(() => {
      return (isCreate || editedModule.bankInfo) ? props?.data?.bankAccountList : props?.encryptData?.bankAccountList;
    });
    // 业务类型
    const businessType = computed(() => props?.data?.businessType);

    const currentInstance = getCurrentInstance()!;

    // 检验是否需要保存
    const validateData = () => {
      return businessType.value === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS
        ? ((currentInstance.refs as TRefs)['account-info'].handleIsSave()
      && (currentInstance.refs as TRefs)['invoice-info'].handleIsSave()
      && (currentInstance.refs as TRefs)['bank-card-info'].handleIsSave())
        : ((currentInstance.refs as TRefs)['account-info'].handleIsSave()
      && (currentInstance.refs as TRefs)['bank-card-info'].handleIsSave());
    };

    const handleEdit = (field: keyof typeof editedModule) => {
      editedModule[field] = true;
    };

    return {
      accountInfo,
      invoiceInfo,
      bankInfo,
      businessType,
      BUSINESS_MODE_ENUM,

      validateData,

      handleEdit,
      pageTab: 'paymentInfo',
    };
  },
});
</script>
