<!--
 * @Descripttion: 规模信息
 * @Author: weitongxue
-->
<template>
  <div class="scale-info">
    <div class="scale-info__title flex-justify-between flex-align-center">
      <span>规模信息</span>
      <el-button
        v-if="isCreate && CAN_CREATE_SCALE_DATA"
        type="success"
        @click="handleSave"
      >暂存</el-button>
      <div v-else>
        <el-button
          type="primary"
          v-show="!isEdit && !edit && CAN_UPDATE_SCALE_DATA"
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
    <div class="scale-info__content">
      <el-form
        :model="customerScale"
        label-width="150px"
        ref="formRef"
      >
        <responsive-row
          :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
        >
          <el-form-item
            label="年营业额："
            prop="annualTurnover"
            :rules="[
              {
                required: true,
                validator: annualTurnoverValidator,
                trigger: ['blur', 'change']
              }
            ]"
          >
            <input-number
              v-model="customerScale.annualTurnover"
              placeholder="请输入年营业额"
              :precision="2"
              :min="0"
              maxLength="15"
              v-if="isEdit"
            >
              <template #append>
                <dictionary-select
                  v-model="customerScale.turnoverUnit"
                  placeholder="请选择单位"
                  :clearable="false"
                  :dictionary="CX_DICTIONARY_KEY.CRM_AMOUNT_UNIT"
                  v-if="isEdit"
                />
              </template>
            </input-number>
            <encryption
              :data="{
                businessId: customerId,
                dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.FULLY_DESENSITIZE,
                content: customerScale?.annualTurnover || '--',
                unit: customerScale.turnoverUnit,
                pageTab,
                dateColumn: 'annualTurnover',
              }"
              v-else
            ></encryption>
          </el-form-item>
          <el-form-item
            label="年销售量："
            prop="annualSaleVolume"
            :rules="[
              {
                required: true,
                validator: annualSaleVolumeValidator,
                trigger: ['blur', 'change']
              }
            ]"
          >
            <input-number
              v-model="customerScale.annualSaleVolume"
              placeholder="请输入年销售量"
              :precision="2"
              :min="0"
              maxLength="15"
              v-if="isEdit"
            >
              <template #append>
                <dictionary-select
                  v-model="customerScale.saleVolumeUnit"
                  placeholder="请选择单位"
                  :dictionary="CX_DICTIONARY_KEY.CRM_QUANTITY_UNIT"
                  v-if="isEdit"
                />
              </template>
            </input-number>
            <encryption
              :data="{
                businessId: customerId,
                dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.FULLY_DESENSITIZE,
                content: customerScale?.annualSaleVolume || '--',
                unit: customerScale.saleVolumeUnit,
                pageTab,
                dateColumn: 'annualSaleVolume',
              }"
              v-else
            ></encryption>
          </el-form-item>
          <el-form-item
            label="销售倍率："
            prop="saleRate"
            maxLength="15"
            :rules="[
              {
                required: true,
                message: '请输入销售倍率',
                trigger: 'blur',
              },
            ]"
          >
            <input-number
              v-model="customerScale.saleRate"
              :precision="1"
              :min="0"
              :max="9999999999"
              placeholder="请输入销售倍率"
              v-if="isEdit"
            >
            </input-number>
            <encryption
              :data="{
                businessId: customerId,
                dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.FULLY_DESENSITIZE,
                content: customerScale?.saleRate,
                pageTab,
                dateColumn: 'saleRate',
              }"
              v-else
            ></encryption>
          </el-form-item>
          <el-form-item
            label="合作预估规模："
            prop="annualCooperationScale"
            :rules="customerScale.annualCooperationScale ? {
              validator: annualCooperationScaleValidator,
              trigger: ['blur', 'change']
            } : {}"
          >
            <input-number
              v-model="customerScale.annualCooperationScale"
              placeholder="请输入合作预估规模"
              :precision="2"
              :min="0"
              maxLength="15"
              v-if="isEdit"
            >
              <template #append>
                <dictionary-select
                  v-model="customerScale.cooperationScaleUnit"
                  placeholder="请选择单位"
                  :dictionary="CX_DICTIONARY_KEY.CRM_AMOUNT_UNIT"
                  v-if="isEdit"
                />
              </template>
            </input-number>
            <div v-else>{{customerScale?.annualCooperationScale || '--'}}{{customerScale.cooperationScaleUnit}}</div>
          </el-form-item>
          <el-form-item
            label="人员规模："
            prop="servingStaffMax"
            :rules="customerScale.servingStaffMax ?
              {
                validator: (r, v, c) => validateServingStaff(r, v, c, customerScale),
                trigger: ['blur', 'change'],
                type: 'number'
              } : {}"
          >
            <div class="flex row-width" v-if="isEdit">
              <input-number
                v-model="customerScale.servingStaffMin"
                :precision="0"
                :min="0"
                placeholder="请输入"
              ></input-number>
              <span class="margin-left-5 margin-right-5">至</span>
              <input-number
                :precision="0"
                v-model="customerScale.servingStaffMax"
                :min="0"
                placeholder="请输入"
              ></input-number>
            </div>
            <div v-else>{{customerScale?.servingStaffMin}}-{{customerScale?.servingStaffMax}}</div>
          </el-form-item>
        </responsive-row>
        <el-form-item
          label="自有工厂："
          prop="selfFactoryRemark"
        >
          <div v-if="isEdit" class="row-width">
            <el-switch
              active-value="YES"
              inactive-value="NO"
              :disabled="!isEdit"
              v-model="customerScale.selfFactory"
              @change="handleFactoryChange"
            />
            <el-input
              class="margin-top-20"
              v-if="customerScale.selfFactory === 'YES'"
              v-model="customerScale.selfFactoryRemark"
              type="textarea"
              maxlength="500"
              placeholder="请输入备注信息，限500字符"
            ></el-input>
          </div>
          <div v-else>
            <div>{{$filters.getEnumLabel(YES_NO_LIST, customerScale?.selfFactory!)}}</div>
            <div>{{customerScale?.selfFactoryRemark}}</div>
          </div>
        </el-form-item>
        <el-form-item
          label="自有设计师："
          prop="selfDesignerRemark"
        >
          <div v-if="isEdit" class="row-width">
            <el-switch
              :disabled="!isEdit"
              v-model="customerScale.selfDesigner"
              active-value="YES"
              inactive-value="NO"
              @change="handleDesignerChange"
            />
            <el-input
              class="margin-top-20"
              v-if="customerScale.selfDesigner === 'YES'"
              v-model="customerScale.selfDesignerRemark"
              type="textarea"
              maxlength="500"
              placeholder="请输入备注信息，限500字符"
            ></el-input>
          </div>
          <div v-else>
            <div>{{$filters.getEnumLabel(YES_NO_LIST, customerScale?.selfDesigner!)}}</div>
            <div>{{customerScale?.selfDesignerRemark}}</div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed, PropType, inject } from 'vue';
import { useRoute } from 'vue-router';
import { ElForm } from 'element-plus';

import {
  updateCustomerBasicInfoApi,
  platformBaseInfoSaveApi,
} from '@/modules/customer-manage/customer-manage/api';
import { IBaseInfoUpdateCustomerScale } from '@/modules/customer-manage/customer-manage/api/types';
import { MODULE_BLOCK_ENUM, TABS_ENUM } from '@/modules/customer-manage/customer-manage/constant';
import { YES_NO_LIST, YES_NO_ENUM, BUSINESS_MODE_ENUM } from '@/constant';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
import { cloneDeep } from 'lodash-es';
import DictionarySelect from '@/components/dictionary-select/index.vue';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant/global';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<IBaseInfoUpdateCustomerScale>,
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
  components: {
    DictionarySelect,
  },
  emits: ['edit'],
  setup(props, { emit }) {
    const $route = useRoute();
    const customerId = $route.params.id! as string;
    const routeName = $route.name;
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
      CAN_CREATE_SCALE_DATA,
      CAN_UPDATE_SCALE_DATA,
    } = usePermissionConfig();

    const customerScale = ref<IBaseInfoUpdateCustomerScale>({
      servingStaffMin: '', // 在职人数
      servingStaffMax: '',
      selfDesignerRemark: '', // 自有设计师备注
      selfDesigner: 'NO', // 自有设计师 YES--有，NO--无
      selfFactoryRemark: '', // 自有工厂备注
      selfFactory: 'NO', // 自有工厂 YES--有，NO--无
      annualTurnover: '', // 年营业额/万元
      annualSaleVolume: '', // 年销售量/万件
      saleRate: '', // 销售倍率
      annualCooperationScale: '',
      turnoverUnit: '', // 营业额单位
      saleVolumeUnit: '', // 年销售量单位
      cooperationScaleUnit: '', // 预估合作规模单位
    });

    const customerScaleStr = ref('');
    watch(() => props.data, () => {
      if (props.data) {
        customerScale.value = props.data;
        if (!customerScale.value.selfDesigner) {
          customerScale.value.selfDesigner = 'NO';
        }
        if (!customerScale.value.selfFactory) {
          customerScale.value.selfFactory = 'NO';
        }
      }
      customerScaleStr.value = JSON.stringify(cloneDeep(customerScale.value));
    }, { immediate: true });

    const handleSave = async () => {
      await formRef.value?.validate();
      const data: IBaseInfoUpdateCustomerScale = {
        ...customerScale.value,
        selfFactory: customerScale.value.selfFactory,
        selfDesigner: customerScale.value.selfDesigner,
      };
      const params = {
        customerScale: data,
        customerId,
        editModuleList: [MODULE_BLOCK_ENUM.CUSTOMER_SCALE],
      };
      const res = props.businessType === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS
        ? await updateCustomerBasicInfoApi(params) : await platformBaseInfoSaveApi(params);
      edit.value = false;
      if (!isCreate.value) {
        handleRefresh?.(TABS_ENUM.TAB_BASIC);
      }

      customerScaleStr.value = JSON.stringify(cloneDeep(customerScale.value));
      useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
      console.log(res.data?.isAllCompleted, '是否全部填写');
    };

    const handleDesignerChange = (val: YES_NO_ENUM) => {
      if (val === YES_NO_ENUM.NO) {
        customerScale.value.selfDesignerRemark = '';
      }
    };
    const handleFactoryChange = (val: YES_NO_ENUM) => {
      if (val === YES_NO_ENUM.NO) {
        customerScale.value.selfFactoryRemark = '';
      }
    };

    // 取消
    const handleCancel = () => {
      formRef.value?.clearValidate();
      edit.value = false;
      customerScale.value = cloneDeep(JSON.parse(customerScaleStr.value));
    };

    const handleEdit = () => {
      emit('edit', 'customerScale');
      customerScaleStr.value = JSON.stringify(cloneDeep(customerScale.value));
      edit.value = true;
    };

    // 是否提示保存
    const handleIsSave = () => {
      return customerScaleStr.value === JSON.stringify(customerScale.value);
    };

    return {
      formRef,
      customerScale,
      customerId,
      isCreate,
      edit,
      isEdit,
      YES_NO_LIST,
      CAN_CREATE_SCALE_DATA,
      CAN_UPDATE_SCALE_DATA,
      CX_DICTIONARY_KEY,
      // 人员规模校验
      validateServingStaff: (rule: any, value: string,
        callback: (err?: Error) => void, item: IBaseInfoUpdateCustomerScale) => {
        if (Number(item?.servingStaffMax) < Number(item?.servingStaffMin)) {
          callback(new Error('结束规模数据不能小于开始规模数据'));
        } else {
          callback();
        }
      },
      // 营业额检验
      annualTurnoverValidator: (rule: any, value: string,
        callback: (err?: Error) => void) => {
        if (!value) {
          callback(new Error('请输入年营业额！'));
        } else if (value && !customerScale.value.turnoverUnit) {
          callback(new Error('请选择单位'));
        } else {
          callback();
        }
      },
      // 年销售量
      annualSaleVolumeValidator: (rule: any, value: string,
        callback: (err?: Error) => void) => {
        if (!value) {
          callback(new Error('请输入年销售量！'));
        } else if (value && !customerScale.value.saleVolumeUnit) {
          callback(new Error('请选择单位'));
        } else {
          callback();
        }
      },
      // 预估合作规模/
      annualCooperationScaleValidator: (rule: any, value: string,
        callback: (err?: Error) => void) => {
        if (value && !customerScale.value.cooperationScaleUnit) {
          callback(new Error('请选择单位'));
        } else {
          callback();
        }
      },

      handleDesignerChange,
      handleFactoryChange,
      handleSave,
      handleCancel,
      handleEdit,
      handleIsSave,
      DESENSITIZE_DECRYPT_TYPE_ENUM,
    };
  },
});
</script>

<style lang="scss" scoped>
.scale-info {
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
  .row-width {
    width: 100%;
  }
}
:deep(.el-input-group__append) {
  width: 120px!important;
  padding: 0!important;
  .el-select {
    margin: 0;
  }
}
</style>
