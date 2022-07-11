<!--
 * @Descripttion: 发票信息
 * @Author: weitongxue
-->
<template>
  <div class="invoice-info">
    <div class="invoice-info__title flex flex-justify-between flex-align-center">
      <span>发票信息</span>
      <el-button
        v-if="isCreate && CAN_CREATE_INVOICE_DATA"
        type="success"
        @click="handleSave"
      >暂存</el-button>
      <div v-else>
        <el-button
          type="primary"
          v-show="!isEdit && !edit && CAN_UPDATE_INVOICE_DATA"
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
    <div class="invoice-info__content">
      <el-form
        :model="invoice"
        label-width="130px"
      >
        <el-form-item
          label="发票类型："
          prop="invoiceType"
          :rules="[
            {
              required: true,
              message: '请输入账期天数',
              trigger: 'blur',
            },
          ]"
        >
          <el-radio-group v-model="invoice.invoiceType" v-if="isEdit">

            <el-radio
              v-for="item in INVOICE_TYPE_LIST"
              :key="item"
              :label="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group>
          <div v-else>{{$filters.getEnumLabel(INVOICE_TYPE_LIST, invoice?.invoiceType)}}</div>
        </el-form-item>
        <responsive-row
          :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
        >
          <el-form-item
            label="纳税人识别号："
            prop="taxpayerCode"
            :rules="invoice.taxpayerCode ? {
              validator: validatorCode,
              trigger: ['blur', 'change'],
            } : {}"
          >
            <el-input
              v-if="isEdit"
              v-model="invoice.taxpayerCode"
              placeholder="请输入纳税人识别号"
              maxLength="100"
              min="0"
            >
            </el-input>
            <div v-if="!isEdit">{{invoice?.taxpayerCode}}</div>
          </el-form-item>
          <el-form-item
            label="开户账号："
            :rules="invoice.accountNo ? {
              validator: validatorBankNo,
              trigger: ['blur', 'change'],
            } : {}"
            prop="accountNo"
          >
            <el-input
              v-if="isEdit"
              v-model="invoice.accountNo"
              placeholder="请输入开户账号"
              maxLength="100"
            >
            </el-input>
            <encryption
              :data="{
                businessId: customerId,
                dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.BACK_ACCOUNT_NO,
                content: invoice?.accountNo,
                pageTab,
                dateColumn: 'accountNo',
              }"
              v-else
            >
            </encryption>
          </el-form-item>
          <el-form-item
            label="开户支行："
            prop="subBank"
          >
            <el-input
              v-model="invoice.subBank"
              placeholder="请输入开户支行"
              v-if="isEdit"
              maxLength="100"
            ></el-input>
            <encryption
              :data="{
                businessId: customerId,
                dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.BACK_ACCOUNT_NAME,
                content: invoice?.subBank,
                pageTab,
                dateColumn: 'subBank',
              }"
              v-else
            >
            </encryption>
          </el-form-item>
          <el-form-item
            label="联系电话："
            prop="contactPhone"
            :rules="{
              trigger: ['blur'],
              validator: phoneValidate,
            }"
          >
            <el-input
              v-model="invoice.contactPhone"
              maxlength="18"
              v-if="isEdit"
              placeholder="请输入联系电话"
            ></el-input>
            <encryption
              :data="{
                businessId: customerId,
                dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
                content: invoice?.contactPhone,
                pageTab,
                dateColumn: 'contactPhone',
              }"
              v-else
            >
            </encryption>
          </el-form-item>
        </responsive-row>
        <el-form-item
          label="开户地址："
          prop="addressDetail"
        >
          <div class="flex" v-if="isEdit">
            <address-picker
              @change="handleChangeAddress"
              class="flex-1"
              :province="invoice?.subBankProvince"
              :city="invoice?.subBankCity"
              :area="invoice?.subBankRegion"
              :gutter="0"
            />
            <el-input
              class="flex-1"
              maxlength="100"
              v-model="invoice.addressDetail"
              placeholder="详细地址（如街道、门牌）"
            ></el-input>
          </div>
          <encryption
            :data="{
              businessId: customerId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.ADDRESS,
              content: [invoice?.subBankRegion, invoice?.addressDetail],
              prefix: `${invoice?.subBankProvince}${invoice?.subBankCity}`,
              pageTab,
              dateColumn: ['subBankRegion', 'addressDetail'],
            }"
            v-else
          ></encryption>
        </el-form-item>
      </el-form>

      <div class="margin-top-20">
        <custom-table
          border
          ref="invoiceTableRef"
          :data="customerShippingAddressList"
          :is-form="true"
          :columns="renderColumns(customerShippingAddressList.length,
                                  handleDelete, handleAdd, isEdit, handleChangeInvoiceAddress,
                                  pageTab)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import {
  renderColumns,
} from './composables/tableData';
import CustomTable from '@/components/custom-table';
import { ElForm } from 'element-plus';

import { updateCustomerAccountingInfoApi } from '@/modules/customer-manage/customer-manage/api';
import { IAccountingPeriodSaveReq,
  IDetailAccountingPeriodInvoice } from '@/modules/customer-manage/customer-manage/api/types';
import { MODULE_BLOCK_ENUM, TABS_ENUM } from '@/modules/customer-manage/customer-manage/constant';
import { INVOICE_TYPE_LIST, INVOICE_TYPE_ENUM, DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant/global';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
import { cloneDeep } from 'lodash-es';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<IDetailAccountingPeriodInvoice>,
      default: () => {},
    },
    pageTab: {
      type: String,
      default: '',
    },
  },
  components: {
  },
  emits: ['edit'],
  setup(props, { emit }) {
    const $route = useRoute();
    const customerId = $route.params.id! as string;
    const routeName = $route.name;
    const invoiceTableRef = ref<InstanceType<typeof CustomTable> | null>(null);
    const formRef = ref<InstanceType<typeof ElForm> | null>(null);
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
      CAN_CREATE_INVOICE_DATA,
      CAN_UPDATE_INVOICE_DATA,
    } = usePermissionConfig();

    const invoice = ref({
      invoiceType: INVOICE_TYPE_ENUM.GST, // 发票类型
      taxpayerCode: '', // 纳税人识别码
      accountNo: '', // 银行账号
      subBank: '', // 开户支行
      subBankProvince: '',
      contactPhone: '',
      subBankCity: '',
      subBankRegion: '',
      addressDetail: '',
    });

    const customerShippingAddressList = ref([
      {
        email: '',
        recipient: '',
        recipientPhone: '',
        province: '',
        city: '',
        region: '',
        addressDetail: '',
      },
    ]);

    const invoiceStr = ref('');
    const customerShippingAddressStr = ref('');
    watch(() => props.data, (val) => {
      if (val) {
        invoice.value = val;
      }
      if (val?.customerShippingAddressList.length) {
        customerShippingAddressList.value = val?.customerShippingAddressList;
      } else {
        customerShippingAddressList.value = [];
      }
      invoiceStr.value = JSON.stringify(cloneDeep(invoice.value));
      customerShippingAddressStr.value = JSON.stringify(cloneDeep(customerShippingAddressList.value));
    }, { immediate: true });

    // 新增发票接收信息
    const handleAdd = () => {
      customerShippingAddressList.value.push({
        email: '',
        recipient: '',
        recipientPhone: '',
        province: '',
        city: '',
        region: '',
        addressDetail: '',
      });
    };

    // 删除发票接收信息
    const handleDelete = (index: number) => {
      customerShippingAddressList.value.splice(index, 1);
    };

    // 选择地址
    const handleChangeAddress = (list: string[] = ['', '', '']) => {
      [invoice.value.subBankProvince,
        invoice.value.subBankCity, invoice.value.subBankRegion] = list;
    };
    const handleChangeInvoiceAddress = (list: string[] = ['', '', ''], index: number) => {
      [customerShippingAddressList.value[index].province,
        customerShippingAddressList.value[index].city,
        customerShippingAddressList.value[index].region] = list;
    };

    const isSave = ref(false);
    const handleSave = async () => {
      await formRef.value?.validate();
      await invoiceTableRef.value?.handleValidate();
      const data = {
        ...invoice.value,
        customerShippingAddressList: customerShippingAddressList.value,
      };
      const params: IAccountingPeriodSaveReq = {
        invoice: data,
        customerId,
        editModuleList: [MODULE_BLOCK_ENUM.INVOICE],
      };
      const res = await updateCustomerAccountingInfoApi(params);
      edit.value = false;
      isSave.value = true;
      if (!isCreate.value) {
        handleRefresh?.(TABS_ENUM.TAB_PAYMENT);
      }
      useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
      console.log(res.data?.isAllCompleted, '是否全部填写');
    };

    // 取消
    const handleCancel = () => {
      formRef.value?.clearValidate();
      invoiceTableRef.value?.handleResetFields();
      edit.value = false;
    };

    const handleEdit = () => {
      emit('edit', 'invoiceInfo');
      invoiceStr.value = JSON.stringify(cloneDeep(invoice.value));
      edit.value = true;
    };

    // 是否提示保存
    const handleIsSave = () => {
      return (invoiceStr.value === JSON.stringify(invoice.value)
      && customerShippingAddressStr.value === JSON.stringify(customerShippingAddressList.value)) || isSave.value;
    };

    return {
      invoice,
      customerShippingAddressList,
      customerId,
      isCreate,
      edit,
      isEdit,
      formRef,
      invoiceTableRef,
      INVOICE_TYPE_LIST,
      CAN_CREATE_INVOICE_DATA,
      CAN_UPDATE_INVOICE_DATA,

      renderColumns,
      handleDelete,
      handleAdd,
      handleChangeAddress,
      handleChangeInvoiceAddress,
      handleSave,
      handleCancel,
      handleEdit,
      handleIsSave,
      // 纳税识别号
      validatorCode: (rule: any, value: any, callback: (err?: Error) => void) => {
        if (!(/^[0-9A-Za-z]+$/.test(value))) {
          callback(new Error('请输入英文字母或数字组成的字符'));
        } else {
          callback();
        }
      },
      // 银行账号
      validatorBankNo: (rule: any, value: any, callback: (err?: Error) => void) => {
        if (!(/^[0-9]+$/.test(value))) {
          callback(new Error('请输入数字组成的字符'));
        } else {
          callback();
        }
      },
      // 手机号检验
      phoneValidate: (rule: any, value: any, callback: (err?: Error) => void) => {
        // if (value.length === 11 && !(/^1[3-9][0-9]{9}$/.test(value))) {
        //   callback(new Error('请输入正确的手机号码格式！'));
        // } else if (value.length === 12 && !(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value))) {
        //   callback(new Error('请输入正确的固定电话格式！'));
        // } else if (value.length !== 12 && value.length !== 11) {
        //   callback(new Error('请输入正确的手机号码格式！'));
        // } else if (value.length === 12 && !(/-/.test(value))) {
        //   callback(new Error('请输入正确的手机号码格式！'));
        // } else {
        //   callback();
        // }
        if (value.length && /[^\d-]/.test(value)) {
          callback(new Error('请输入正确的电话格式'));
        } else {
          callback();
        }
      },
      DESENSITIZE_DECRYPT_TYPE_ENUM,
    };
  },
});
</script>

<style lang="scss" scoped>
.invoice-info {
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
