<!--
 * @Descripttion: 货款帐期
 * @Author: weitongxue
-->
<template>
  <div class="account-info">
    <div class="account-info__title flex flex-justify-between flex-align-center">
      <span>货款账期</span>
      <el-button
        v-if="isCreate && CAN_CREATE_PAYMENT_PERIOD"
        type="success"
        @click="handleSave"
      >暂存</el-button>
      <div v-else>
        <el-button
          type="primary"
          v-show="!isEdit && !edit && CAN_UPDATE_PAYMENT_PERIOD"
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
    <div class="account-info__content">
      <el-form
        :model="customerAccountingPeriod"
        label-width="130px"
        ref="formRef"
      >
        <responsive-row
          :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
        >
          <el-form-item
            label="出账类型："
            prop="billingDate"
            :rules="[
              {
                required: true,
                message: '请选择出账类型',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-select
              v-show="isEdit"
              v-model="customerAccountingPeriod.billingDate"
              placeholder="请选择出账类型"
              style="width: 100%"
              @change="handleChangeOutgoingType"
            >
              <el-option
                v-for="item in OUTGOING_TYPE_LIST"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div v-show="!isEdit">
              {{$filters.getEnumLabel(OUTGOING_TYPE_LIST, customerAccountingPeriod?.billingDate)}}</div>
          </el-form-item>
          <el-form-item
            label="出账日设置："
            prop="periodDate"
            :rules="[
              {
                required: true,
                message: '请选择出账日',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-select
              v-show="isEdit"
              v-model="customerAccountingPeriod.periodDate"
              placeholder="请选择出账日"
              style="width: 100%"
            >
              <el-option
                v-for="item in outgoingDataOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div v-show="!isEdit">
              {{$filters.getEnumLabel(outgoingDataOptions, customerAccountingPeriod?.periodDate)}}</div>
          </el-form-item>
          <el-form-item
            label="是否开通易宝："
          >
            <div>{{$filters.getEnumLabel(OPEN_CLOSE_LIST, customerAccountingPeriod.isOpenYizubaoAccount!)}}</div>
          </el-form-item>
          <el-form-item
            label="易宝账号："
          >
            <div>{{customerAccountingPeriod?.yizubaoAccountNo || '--'}}</div>
          </el-form-item>
          <el-form-item
            label="优惠档次："
            prop="preferentialGrade"
          >
            <el-select
              v-show="isEdit"
              v-model="customerAccountingPeriod.preferentialGrade"
              placeholder="请选择优惠档次"
              style="width: 100%"
            >
              <el-option
                v-for="item in DISCOUNT_GRADE_LIST"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div v-show="!isEdit">
              {{$filters.getEnumLabel(DISCOUNT_GRADE_LIST, customerAccountingPeriod?.preferentialGrade)}}</div>
          </el-form-item>
          <el-form-item
            label="金条授信信息："
            prop="financeGrantingState"
          >
            {{$filters.getEnumLabel(FINANCE_CREDIT_STATE_LIST, customerAccountingPeriod?.financeGrantingState)}}
          </el-form-item>
          <el-form-item
            label="预付定金："
            prop="advancePaymentRatio"
            :rules="customerAccountingPeriod.isAdvancePayment === 'YES' ? {
              required: true,
              message: '请输入预付比例',
              trigger: ['blur', 'change'],
            } : {}"
          >
            <div class="flex flex-align-center" v-show="isEdit">
              <el-switch
                class="margin-right-20"
                active-value="YES"
                inactive-value="NO"
                @change="handleAdvancePaymentChange"
                v-model="customerAccountingPeriod.isAdvancePayment"
              />
              <input-number
                :disabled="customerAccountingPeriod.isAdvancePayment === 'NO'"
                v-model="customerAccountingPeriod.advancePaymentRatio"
                placeholder="请输入预付比例"
                :max="100"
                :min="0"
                :precision="2"
              >
                <template #append>%</template>
              </input-number>
            </div>
            <div v-show="!isEdit">
              <span>{{$filters.getEnumLabel(YES_NO_LIST,customerAccountingPeriod?.isAdvancePayment)}}</span>
              <!-- 特殊处理，只有isAdvancePayment=YES显示，后端处理问题 -->
              <span
                v-if="customerAccountingPeriod?.advancePaymentRatio
                  && customerAccountingPeriod?.isAdvancePayment === YES_NO_ENUM.YES"
              >
                （{{customerAccountingPeriod?.advancePaymentRatio }}%）
              </span>
            </div>
          </el-form-item>
          <el-form-item
            label="平均账期："
          >
            <div>{{customerAccountingPeriod?.averagePeriod || '--'}}天</div>
          </el-form-item>
        </responsive-row>
      </el-form>

      <div class="margin-top-15">
        <div class="margin-bottom-15">
          <span class="title">结算周期设置</span>
        </div>
        <custom-table
          :key="periodOptions"
          border
          :is-form="true"
          ref="accountRef"
          :data="customerSettlementPeriodList"
          :columns="renderColumns(
            customerSettlementPeriodList.length,
            handleDelete,
            handleAdd,
            handleShowExplain,
            isEdit,
            customerSettlementPeriodList,
            periodOptions,
          )"
        />
      </div>
    </div>
  </div>
  <PaybackPeriodDialog ref="paybackPeriodDialogEl" />
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed, PropType, inject } from 'vue';
import { useRoute } from 'vue-router';
import {
  renderColumns,
} from './composables/tableData';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';

import CustomTable from '@/components/custom-table';
import PaybackPeriodDialog from '@/modules/customer-manage/customer-manage/components/payback-period-dialog/index.vue';
import { ElForm } from 'element-plus';

import { platformAccountSaveApi } from '@/modules/customer-manage/customer-manage/api';
import {
  IAccountingPeriodSaveReq,
  IDetailAccountingPeriodCustomerAccountingPeriod,
  IDetailAccountingPeriodCustomerAccountingPeriodListItem,
} from '@/modules/customer-manage/customer-manage/api/types';
import {
  MODULE_BLOCK_ENUM,
  OUTGOING_TYPE_LIST,
  DISCOUNT_GRADE_LIST,
  OUTGOING_TYPE_ENUM,
  PERIOD_DATE_ORDER_LIST,
  FINANCE_CREDIT_STATE_LIST,
  TABS_ENUM,
} from '@/modules/customer-manage/customer-manage/constant';
import { YES_NO_LIST, YES_NO_ENUM, OPEN_CLOSE_LIST } from '@/constant';
import { useDictionary } from '@/hooks/use-dictionary';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
import { cloneDeep } from 'lodash-es';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  components: {
    PaybackPeriodDialog,
  },
  props: {
    data: {
      type: Object as PropType<IDetailAccountingPeriodCustomerAccountingPeriod>,
      default: () => {},
    },
  },
  setup(props) {
    const $route = useRoute();
    const customerId = $route.params.id! as string;
    const routeName = $route.name;
    const accountRef = ref<InstanceType<typeof CustomTable> | null>(null);
    const formRef = ref<InstanceType<typeof ElForm> | null>(null);
    const handleRefresh = inject<(item: TABS_ENUM) => void>('handleRefresh');

    // 获取数据字典（出账日类型）
    const { getDictionaryOptions } = useDictionary();
    const billingTypeList = computed(() => getDictionaryOptions(CX_DICTIONARY_KEY.BILLING_DATE_TYPE) || []);
    // 自然月出账日
    const naturalMonthOptions = computed(() => getDictionaryOptions(CX_DICTIONARY_KEY.NATURAL_MONTH_DATE) || []);
    // 回款周期
    const periodOptions = computed(() => getDictionaryOptions(CX_DICTIONARY_KEY.SETTLEMENT_PERIOD_DAYS) || []);

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
      CAN_CREATE_PAYMENT_PERIOD,
      CAN_UPDATE_PAYMENT_PERIOD,
    } = usePermissionConfig();

    const customerAccountingPeriod = ref<IDetailAccountingPeriodCustomerAccountingPeriod>({
      billingDate: '', // 出账类型
      periodDate: '', // 出账日设置
      preferentialGrade: '', // 优惠档次
      financeGrantingState: '', // 金融授信结果
      isAdvancePayment: 'NO', // 是否预付定金 YES--是，NO--不是
      advancePaymentRatio: '', // 预付定金比例
      isOpenYizubaoAccount: 'NO',
      yizubaoAccountNo: '',
      averagePeriod: '', // 平均账期
    });

    const customerSettlementPeriodList = ref<IDetailAccountingPeriodCustomerAccountingPeriodListItem[]>([
      {
        settlementPeriodDays: '',
        returnPercent: '',
      },
    ]);

    const outgoingDataOptions = computed(() => {
      let list: {label: string; value: string;}[] = [];
      if (customerAccountingPeriod.value.billingDate === OUTGOING_TYPE_ENUM.NATURAL_MONTHS) {
        list = naturalMonthOptions.value;
      } else if (customerAccountingPeriod.value.billingDate === OUTGOING_TYPE_ENUM.ORDER) {
        list = PERIOD_DATE_ORDER_LIST;
      }
      return list;
    });

    // 新增周期
    const handleAdd = () => {
      customerSettlementPeriodList.value.push({
        settlementPeriodDays: '',
        returnPercent: '',
      });
    };

    const customerAccountingPeriodStr = ref('');
    const customerSettlementPeriodListStr = ref('');
    watch(() => props.data, () => {
      if (props.data && props.data?.customerSettlementPeriodList!.length) {
        customerAccountingPeriod.value = props.data;
        if (customerAccountingPeriod.value.isAdvancePayment === YES_NO_ENUM.NO) {
          customerAccountingPeriod.value.advancePaymentRatio = '';
        }
        customerSettlementPeriodList.value = props?.data?.customerSettlementPeriodList;
      }
      customerAccountingPeriodStr.value = JSON.stringify(cloneDeep(customerAccountingPeriod.value));
      customerSettlementPeriodListStr.value = JSON.stringify(cloneDeep(customerSettlementPeriodList.value));
    }, { immediate: true });

    // 删除
    const handleDelete = (index: number) => {
      customerSettlementPeriodList.value.splice(index, 1);
    };

    const handleAdvancePaymentChange = (val: YES_NO_ENUM) => {
      if (val === YES_NO_ENUM.NO) {
        customerAccountingPeriod.value.advancePaymentRatio = '';
      }
    };

    const handleSave = async () => {
      await formRef.value?.validate();
      await accountRef.value?.handleValidate();
      const data = {
        ...customerAccountingPeriod.value,
        customerSettlementPeriodList: customerSettlementPeriodList.value,
      };
      const params: IAccountingPeriodSaveReq = {
        customerAccountingPeriod: data,
        customerId,
        editModuleList: [MODULE_BLOCK_ENUM.ACCOUNTING_PERIOD],
      };
      const res = await platformAccountSaveApi(params);
      edit.value = false;
      if (!isCreate.value) {
        handleRefresh?.(TABS_ENUM.TAB_PAYMENT);
      }

      customerAccountingPeriodStr.value = JSON.stringify(cloneDeep(customerAccountingPeriod.value));
      customerSettlementPeriodListStr.value = JSON.stringify(cloneDeep(customerSettlementPeriodList.value));
      useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
      console.log(res.data?.isAllCompleted, '是否全部填写');
    };

    // 是否提示保存
    const handleIsSave = () => {
      return (customerAccountingPeriodStr.value === JSON.stringify(customerAccountingPeriod.value)
      && customerSettlementPeriodListStr.value === JSON.stringify(customerSettlementPeriodList.value));
    };

    // 取消
    const handleCancel = () => {
      formRef.value?.clearValidate();
      edit.value = false;
      customerAccountingPeriod.value = cloneDeep(JSON.parse(customerAccountingPeriodStr.value));
      customerSettlementPeriodList.value = cloneDeep(JSON.parse(customerSettlementPeriodListStr.value));
    };

    // 编辑
    const handleEdit = () => {
      edit.value = true;
      customerAccountingPeriodStr.value = JSON.stringify(cloneDeep(customerAccountingPeriod.value));
      customerSettlementPeriodListStr.value = JSON.stringify(cloneDeep(customerSettlementPeriodList.value));
    };

    // 结算周期说明弹窗
    const paybackPeriodDialogEl = ref<typeof PaybackPeriodDialog | null>(null);
    const handleShowExplain = () => {
      paybackPeriodDialogEl.value?.handleInit();
    };

    // 更改出账类型
    const handleChangeOutgoingType = () => {
      customerAccountingPeriod.value.periodDate = '';
    };

    return {
      customerAccountingPeriod,
      customerSettlementPeriodList,
      isCreate,
      isEdit,
      edit,
      customerId,
      accountRef,
      formRef,
      periodOptions,
      outgoingDataOptions,
      CX_DICTIONARY_KEY,
      YES_NO_LIST,
      billingTypeList,
      CAN_CREATE_PAYMENT_PERIOD,
      CAN_UPDATE_PAYMENT_PERIOD,
      DISCOUNT_GRADE_LIST,
      YES_NO_ENUM,
      OPEN_CLOSE_LIST,
      OUTGOING_TYPE_LIST,
      FINANCE_CREDIT_STATE_LIST,

      renderColumns,
      handleDelete,
      handleAdd,
      handleAdvancePaymentChange,
      handleCancel,
      handleEdit,
      handleIsSave,
      handleSave,
      handleShowExplain,
      handleChangeOutgoingType,
    };
  },
});
</script>

<style lang="scss" scoped>
.account-info {
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
    .title {
      font-weight: bold;
    }
  }
}
</style>
