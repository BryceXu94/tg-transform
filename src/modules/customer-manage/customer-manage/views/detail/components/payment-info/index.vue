<template>
  <!-- 货款账期 -->
  <div v-if="CAN_VIEW_PAYMENT_PERIOD" class="payment-info">
    <basic-tem
      title="货款账期"
      :data="payInfo"
    />
    <div class="padding-10">
      <div class="margin-bottom-15">
        <span style="font-weight: bold;">回款周期</span>
      </div>
      <custom-table
        :key="periodOptions"
        border
        :data="customerAccountingPeriod?.customerSettlementPeriodList || []"
        :columns="periodRenderColumns(
          handleShowExplain,
          periodOptions,
        )"
      />
    </div>
  </div>
  <!-- 发票信息 -->
  <div
    v-if="CAN_VIEW_INVOICE_DATA && BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS === businessType"
    class="payment-info"
  >
    <basic-tem
      title="发票信息"
      :data="invoiceObj"
    />
    <div class="padding-10">
      <custom-table
        border
        :data="invoiceInfo?.customerShippingAddressList || []"
        :columns="invoiceRenderColumns(pageTab)"
      />
    </div>
  </div>
  <!-- 银行卡信息 -->
  <div v-if="CAN_VIEW_CARD_DATA" class="bank-card-info">
    <div class="bank-card-info__title margin-bottom-10">银行卡信息</div>
    <div class="padding-10">
      <custom-table
        border
        :data="bankInfo"
        :columns="bankRenderColumns(pageTab)"
      />
    </div>
  </div>
  <empty v-if="!CAN_VIEW_PAYMENT_PERIOD && !CAN_VIEW_INVOICE_DATA && !CAN_VIEW_CARD_DATA" />
  <PaybackPeriodDialog ref="paybackPeriodDialogEl" />
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import PaybackPeriodDialog from '@/modules/customer-manage/customer-manage/components/payback-period-dialog/index.vue';

import { invoiceRenderColumns, bankRenderColumns, periodRenderColumns } from './composables/tableData';
import {
  YES_NO_LIST,
  INVOICE_TYPE_LIST,
  YES_NO_ENUM,
  OPEN_CLOSE_LIST,
} from '@/constant/global';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { filters } from '@/core/plugins/filter';
import BasicTem from '../basic-tem.vue';
import {
  IDetailAccountingPeriodRes,
} from '@/modules/customer-manage/customer-manage/api/types';
import { useDictionary } from '@/hooks/use-dictionary';
import { BUSINESS_MODE_ENUM, DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant';
import {
  OUTGOING_TYPE_LIST,
  DISCOUNT_GRADE_LIST,
  FINANCE_CREDIT_STATE_LIST,
  OUTGOING_TYPE_ENUM,
  PERIOD_DATE_ORDER_LIST,
} from '@/modules/customer-manage/customer-manage/constant';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';

export default defineComponent({
  components: {
    BasicTem,
    PaybackPeriodDialog,
  },
  props: {
    data: {
      type: Object as PropType<IDetailAccountingPeriodRes>,
      default: () => {},
    },
  },
  setup(props) {
    const $route = useRoute();
    const customerId = $route.params.id! as string;
    const pageTab = 'paymentInfo';

    // 获取数据字典（出账日类型）
    const { getDictionaryOptions } = useDictionary();
    // 自然月出账日
    const naturalMonthOptions = computed(() => getDictionaryOptions(CX_DICTIONARY_KEY.NATURAL_MONTH_DATE) || []);
    const periodOptions = computed(() => getDictionaryOptions(CX_DICTIONARY_KEY.SETTLEMENT_PERIOD_DAYS) || []);
    const businessType = computed(() => props?.data?.businessType);

    // 货款帐期
    const customerAccountingPeriod = computed(() => props?.data?.customerAccountingPeriod);
    const payInfo = computed(() => {
      return [
        {
          label: '出账类型',
          value: filters.getEnumLabel(OUTGOING_TYPE_LIST, customerAccountingPeriod.value?.billingDate),
        },
        {
          label: '出账日设置',
          value: filters.getEnumLabel(
            customerAccountingPeriod.value?.billingDate === OUTGOING_TYPE_ENUM.NATURAL_MONTHS
              ? naturalMonthOptions.value
              : PERIOD_DATE_ORDER_LIST,
            customerAccountingPeriod.value?.periodDate,
          ),
        },
        {
          label: '是否开通易宝',
          value: filters.getEnumLabel(OPEN_CLOSE_LIST, customerAccountingPeriod.value?.isOpenYizubaoAccount ?? ''),
        },
        {
          label: '易宝账号',
          value: customerAccountingPeriod.value?.yizubaoAccountNo || '--',
        },
        {
          label: '优惠档次',
          value: filters.getEnumLabel(DISCOUNT_GRADE_LIST, customerAccountingPeriod.value?.preferentialGrade),
        },
        {
          label: '金条授信信息',
          value: filters.getEnumLabel(FINANCE_CREDIT_STATE_LIST, customerAccountingPeriod.value?.financeGrantingState),
        },
        {
          label: '预付定金',
          value: `${filters.getEnumLabel(YES_NO_LIST, customerAccountingPeriod.value?.isAdvancePayment)}
          ${customerAccountingPeriod.value?.isAdvancePayment === YES_NO_ENUM.YES
    ? `（${customerAccountingPeriod.value?.advancePaymentRatio}%）` : ''}
          `,
        },
        {
          label: '平均账期',
          value: `${customerAccountingPeriod.value?.averagePeriod || '--'}天`,
        },
      ];
    });

    // 发票信息
    const invoiceInfo = computed(() => props.data?.invoice);
    const invoiceObj = computed(() => {
      return [
        {
          label: '发票类型',
          value: filters.getEnumLabel(INVOICE_TYPE_LIST, invoiceInfo.value?.invoiceType),
        },
        {
          label: '纳税人识别号',
          value: invoiceInfo.value?.taxpayerCode,
        },
        {
          label: '开户支行',
          value: invoiceInfo.value?.subBank,
          encryption: {
            businessId: customerId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.BACK_ACCOUNT_NAME,
            content: invoiceInfo.value?.subBank,
            pageTab,
            dateColumn: 'subBank',
          },
        },
        {
          label: '联系电话',
          value: invoiceInfo.value?.contactPhone,
          encryption: {
            businessId: customerId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
            content: invoiceInfo.value?.contactPhone,
            pageTab,
            dateColumn: 'contactPhone',
          },
        },
        {
          label: '开户账号',
          value: invoiceInfo.value?.accountNo,
          encryption: {
            businessId: customerId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.BACK_ACCOUNT_NO,
            content: invoiceInfo.value?.accountNo,
            pageTab,
            dateColumn: 'accountNo',
          },
        },
        {
          label: '开户地址',
          value: `${invoiceInfo.value?.subBankProvince ?? ''}
          ${invoiceInfo.value?.subBankCity ?? ''}${invoiceInfo.value?.subBankRegion ?? ''}
          ${invoiceInfo.value?.addressDetail ?? ''}`,
          encryption: {
            businessId: customerId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.ADDRESS,
            content: [invoiceInfo.value?.subBankRegion ?? '', invoiceInfo.value?.addressDetail ?? ''],
            prefix: [invoiceInfo.value?.subBankProvince ?? '', invoiceInfo.value?.subBankCity ?? ''],
            pageTab,
            dateColumn: ['subBankRegion', 'addressDetail'],
          },
        },
      ];
    });

    // 银行卡信息
    const bankInfo = computed(() => props.data?.bankAccountList);

    // 结算周期说明弹窗
    const paybackPeriodDialogEl = ref<typeof PaybackPeriodDialog | null>(null);
    const handleShowExplain = () => {
      paybackPeriodDialogEl.value?.handleInit();
    };

    // 权限
    const {
      CAN_VIEW_PAYMENT_PERIOD,
      CAN_VIEW_INVOICE_DATA,
      CAN_VIEW_CARD_DATA,
    } = usePermissionConfig();

    return {
      payInfo,
      customerAccountingPeriod,
      invoiceObj,
      invoiceInfo,
      bankInfo,
      periodOptions,
      businessType,
      paybackPeriodDialogEl,
      CAN_VIEW_PAYMENT_PERIOD,
      CAN_VIEW_INVOICE_DATA,
      CAN_VIEW_CARD_DATA,
      BUSINESS_MODE_ENUM,

      invoiceRenderColumns,
      bankRenderColumns,
      pageTab,
      periodRenderColumns,
      handleShowExplain,
    };
  },
});
</script>
<style lang="scss" scoped>
.payment-info, .bank-card-info {
  border: 1px solid #eee;
  margin-bottom: 10px;
  padding: 15px 10px;
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
}
</style>
