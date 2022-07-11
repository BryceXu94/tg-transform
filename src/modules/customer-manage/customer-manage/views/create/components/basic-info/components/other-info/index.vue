<!--
 * @Descripttion: 其他信息
 * @Author: weitongxue
-->
<template>
  <div class="other-info">
    <div class="other-info__title flex-justify-between flex-align-center">
      <span>其他信息</span>
      <el-button
        v-if="isCreate && CAN_CREATE_OTHER_DATA"
        type="success"
        @click="handleSave"
      >暂存</el-button>
      <div v-else>
        <el-button
          type="primary"
          v-show="!isEdit && !edit && CAN_UPDATE_OTHER_DATA"
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
    <div class="other-info__content">
      <el-form
        :model="customerOther"
        label-width="150px"
        ref="formRef"
      >
        <responsive-row
          :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
        >
          <el-form-item
            label="纳税人资质："
            prop="taxpayerType"
            :rules="[
              {
                required: true,
                message: '请选择纳税人资质',
                trigger: 'blur',
              },
            ]"
          >
            <dictionary-select
              v-model="customerOther.taxpayerType"
              placeholder="请选择纳税人资质"
              :dictionary="CX_DICTIONARY_KEY.TAXPAYER_TYPE"
              v-if="isEdit"
            />
            <div v-else>{{$filters.getEnumLabel(taxpayerType, customerOther?.taxpayerType)}}</div>
          </el-form-item>
          <el-form-item
            label="法人身份证号："
            prop="artificialPersonIdCard"
            :rules="businessType === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS ? {
              validator: personIdCardValidate,
              trigger: 'blur',
              required: true,
            }
              : customerOther?.artificialPersonIdCard ? {
                validator: personIdCardValidate,
                trigger: 'blur',
              } : {}"
          >
            <el-input
              v-model="customerOther.artificialPersonIdCard"
              placeholder="请输入法人身份证号"
              v-if="isEdit"
            >
            </el-input>
            <encryption
              :data="{
                businessId: customerId,
                dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.ID_CARD,
                content: customerOther?.artificialPersonIdCard,
                pageTab,
                dateColumn: 'artificialPersonIdCard',
              }"
              v-else
            ></encryption>
          </el-form-item>
          <el-form-item
            label="是否内部客户："
            prop="customerType"
            v-if="CAN_UPDATE_KHLX"
            :rules="[
              {
                required: true,
                message: '请选择客户类型',
                trigger: 'blur',
              },
            ]"
          >
            <el-switch
              v-if="isEdit"
              v-model="customerOther.customerType"
              active-value="2"
              inactive-value="1"
            />
            <div v-else>{{$filters.getEnumLabel(CUSTOMER_TYPE_LIST, customerOther?.customerType)}}</div>
          </el-form-item>
          <el-form-item
            label="下单类型："
            prop="customerType"
            v-if="CAN_ORDER_TYPE"
          >
            <el-input
              v-if="isEdit"
              v-model="allowedOrderType"
              disabled
            />
            <div v-else>{{allowedOrderType}}</div>
          </el-form-item>
          <el-form-item
            label="可上传合同："
            prop="isUploadContract"
            v-if="CAN_UPDATE_KHLX"
          >
            <el-switch
              v-if="isEdit"
              v-model="customerOther.isUploadContract"
              active-value="1"
              inactive-value="0"
            />
            <div v-else>{{$filters.getEnumLabel(YES_OR_NO_NUMBER_LIST, customerOther?.isUploadContract!)}}</div>
          </el-form-item>
          <el-form-item
            label="法人联系电话："
            prop="artificialPersonPhone"
            :rules="{
              validator: phoneValidate,
              trigger: 'blur',
            }"
          >
            <el-input
              v-model="customerOther.artificialPersonPhone"
              maxlength="18"
              placeholder="请输入法人联系电话"
              v-if="isEdit"
            ></el-input>
            <encryption
              :data="{
                businessId: customerId,
                dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
                content: customerOther?.artificialPersonPhone,
                pageTab,
                dateColumn: 'artificialPersonPhone',
              }"
              v-else
            ></encryption>
          </el-form-item>
        </responsive-row>
        <el-form-item
          label="备注信息："
          prop="natureBusiness"
        >
          <el-input
            v-model="customerOther.remark"
            type="textarea"
            maxlength="500"
            placeholder="请输入备注信息，限500字符"
            v-if="isEdit"
          ></el-input>
          <div v-else>{{customerOther?.remark}}</div>
        </el-form-item>
      </el-form>
      <div class="margin-top-20">
        <custom-table
          border
          ref="operatingTableRef"
          :data="operatingAddressList"
          :is-form="true"
          :columns="renderColumns(
            handleDelete,
            handleAdd,
            handleChangeAddress,
            handleIsDefault,
            isEdit,
            pageTab,
          )"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed, PropType, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  updateCustomerBasicInfoApi,
  platformBaseInfoSaveApi,
} from '@/modules/customer-manage/customer-manage/api';
import {
  IBaseInfoUpdateCustomerOther,
  IDetailBaseInfoCustomerOther,
} from '@/modules/customer-manage/customer-manage/api/types';
import {
  MODULE_BLOCK_ENUM,
  CUSTOMER_TYPE_LIST,
  TABS_ENUM,
} from '@/modules/customer-manage/customer-manage/constant';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { BUSINESS_MODE_ENUM, ORDER_MODE_LIST, YES_NO_ENUM, YES_OR_NO_NUMBER_LIST } from '@/constant';
import { useDictionary } from '@/hooks/use-dictionary';
import { cloneDeep } from 'lodash-es';
import { DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant/global';
import DictionarySelect from '@/components/dictionary-select/index.vue';
import CustomTable from '@/components/custom-table';
import { ElForm, ElMessage } from 'element-plus';
import { filters } from '@/core/plugins/filter';
import {
  renderColumns,
} from './composables/tableData';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  components: {
    DictionarySelect,
  },
  props: {
    data: {
      type: Object as PropType<IDetailBaseInfoCustomerOther>,
      default: () => {},
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
    const operatingTableRef = ref<InstanceType<typeof CustomTable> | null>(null);
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

    const { getDictionaryOptions } = useDictionary();

    // 权限
    const {
      CAN_CREATE_OTHER_DATA,
      CAN_UPDATE_OTHER_DATA,
      CAN_UPDATE_KHLX,
      CAN_ORDER_TYPE,
    } = usePermissionConfig();

    const customerOther = ref<IBaseInfoUpdateCustomerOther>({
      taxpayerType: '', // 纳税人类型
      artificialPersonIdCard: '', // 法人身份证
      artificialPersonPhone: '', // 联系电话
      remark: '', // 备注
      customerType: '',
      allowedOrderType: '',
      isUploadContract: '0',
    });

    const operatingAddressList = ref([
      {
        province: '',
        city: '',
        region: '',
        addressDetail: '',
        isDefault: YES_NO_ENUM.NO,
      },
    ]);

    const allowedOrderType = computed(() => {
      return filters.getEnumLabel(ORDER_MODE_LIST, customerOther.value?.allowedOrderType);
    });

    const customerOtherStr = ref('');
    const operatingAddressListStr = ref('');
    watch(() => props.data, (val) => {
      customerOther.value = props.data;
      customerOtherStr.value = JSON.stringify(cloneDeep(customerOther.value));

      if (val?.operatingAddressList?.length) {
        operatingAddressList.value = val?.operatingAddressList;
      } else {
        operatingAddressList.value = [];
      }
      operatingAddressListStr.value = JSON.stringify(cloneDeep(operatingAddressList.value));
    }, { immediate: true });

    // 删除经营地址
    const handleDelete = (index: number) => {
      operatingAddressList.value.splice(index, 1);
    };

    // 添加经营地址
    const handleAdd = () => {
      operatingAddressList.value.push({
        province: '',
        city: '',
        region: '',
        addressDetail: '',
        isDefault: YES_NO_ENUM.NO,
      });
    };

    // 选择地址
    const handleChangeAddress = (list: string[] = ['', '', ''], index: number) => {
      [operatingAddressList.value[index].province,
        operatingAddressList.value[index].city, operatingAddressList.value[index].region] = list;
    };

    // 是否默认判重复
    const handleIsDefault = (val: string, index: number) => {
      if (val === YES_NO_ENUM.YES) {
        operatingAddressList.value.filter((info, key) => key !== index).forEach((item) => {
          if (item.isDefault === YES_NO_ENUM.YES) {
            item.isDefault = YES_NO_ENUM.NO;
          }
        });
      }
    };

    const handleSave = async () => {
      await formRef.value?.validate();
      await operatingTableRef.value?.handleValidate();
      // 判断是否有设置默认
      if (!operatingAddressList.value.length) {
        ElMessage.error('经营地址不能为空！');
        return;
      }
      const hasSetDefault = operatingAddressList.value.find(item => item.isDefault === YES_NO_ENUM.YES);
      if (!hasSetDefault) {
        ElMessage.error('请设置默认经营地址！');
        return;
      }
      const params = {
        customerOther: {
          ...customerOther.value,
          operatingAddressList: operatingAddressList.value,
        },
        customerId,
        editModuleList: [MODULE_BLOCK_ENUM.CUSTOMER_OTHER],
      };
      const res = props.businessType === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS
        ? await updateCustomerBasicInfoApi(params) : await platformBaseInfoSaveApi(params);
      edit.value = false;
      if (!isCreate.value) {
        handleRefresh?.(TABS_ENUM.TAB_BASIC);
      }
      useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
      customerOtherStr.value = JSON.stringify(cloneDeep(customerOther.value));
      operatingAddressListStr.value = JSON.stringify(cloneDeep(operatingAddressList.value));
      console.log(res.data?.isAllCompleted, '是否全部填写');
    };

    // 纳税人类型
    const taxpayerType = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.TAXPAYER_TYPE) || [];
    });

    // 取消
    const handleCancel = () => {
      formRef.value?.clearValidate();
      edit.value = false;
      customerOther.value = cloneDeep(JSON.parse(customerOtherStr.value));
      operatingAddressList.value = cloneDeep(JSON.parse(operatingAddressListStr.value));
    };

    const handleEdit = () => {
      emit('edit', 'customerOther');
      customerOtherStr.value = JSON.stringify(cloneDeep(customerOther.value));
      operatingAddressListStr.value = JSON.stringify(cloneDeep(operatingAddressList.value));
      edit.value = true;
    };

    // 是否提示保存
    const handleIsSave = () => {
      return (customerOtherStr.value === JSON.stringify(customerOther.value)
       && operatingAddressListStr.value === JSON.stringify(operatingAddressList.value));
    };

    return {
      formRef,
      operatingTableRef,
      customerOther,
      operatingAddressList,
      customerId,
      isCreate,
      edit,
      isEdit,
      CAN_CREATE_OTHER_DATA,
      CAN_UPDATE_OTHER_DATA,
      CX_DICTIONARY_KEY,
      BUSINESS_MODE_ENUM,
      allowedOrderType,
      CAN_UPDATE_KHLX,
      CUSTOMER_TYPE_LIST,
      CAN_ORDER_TYPE,
      YES_OR_NO_NUMBER_LIST,
      taxpayerType,

      renderColumns,
      handleSave,
      handleCancel,
      handleEdit,
      handleIsSave,
      handleDelete,
      handleChangeAddress,
      handleAdd,
      handleIsDefault,
      // 身份证校验
      personIdCardValidate: (rule: any, value: any, callback: (err?: Error) => void) => {
        if (value.length === 15 && !(/^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/
          .test(value))) {
          callback(new Error('请输入正确的身份证号码格式！'));
        } else if (value.length === 18
        && !(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
          .test(value))) {
          callback(new Error('请输入正确的身份证号码格式！'));
        } else if (value.length !== 15 && value.length !== 18) {
          callback(new Error('请输入正确的身份证号码格式！'));
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
.other-info {
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
    padding: 20px;
  }
}
</style>
