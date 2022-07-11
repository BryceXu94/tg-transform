<template>
  <div class="address-info">
    <div class="address-info__title flex flex-justify-between">
      <span>收货地址</span>
      <el-button
        v-if="isCreate && CAN_CREATE_DELIVERY_ADDRESS"
        type="success"
        @click="handleSave"
      >暂存</el-button>
      <div v-else>
        <el-button
          type="primary"
          v-show="!isEdit && !edit && CAN_UPDATE_DELIVERY_ADDRESS"
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
    <div class="address-info__content" v-if="address.length">
      <custom-table
        border
        ref="addressRef"
        :is-form="true"
        :data="shippingAddress"
        :columns="renderColumns(shippingAddress.length, handleDelete, handleAdd,
                                isEdit, handleChangeAddress, address, handleIsDefault, handleSelectType,
                                pageTab)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, PropType, inject } from 'vue';
import { useRoute } from 'vue-router';
import CustomTable from '@/components/custom-table';

import {
  renderColumns,
} from './composables/tableData';

import {
  updateCustomerBusinessInfoApi,
  platformBusinessSaveApi,
} from '@/modules/customer-manage/customer-manage/api';
import {
  IBusinessInfoSaveReq,
  IBusinessInfoSaveReqShippingAddressItem,
  IDetailBusinessInfoResShippingAddressItem,
} from '@/modules/customer-manage/customer-manage/api/types';
import { MODULE_BLOCK_ENUM, TABS_ENUM } from '@/modules/customer-manage/customer-manage/constant';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
import { useDictionary } from '@/hooks/use-dictionary';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { BUSINESS_MODE_ENUM, YES_NO_ENUM, SOURCE_TYPE_LIST, SOURCE_TYPE_ENUM } from '@/constant';
import { cloneDeep } from 'lodash-es';
import { filters } from '@/core/plugins/filter';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<IDetailBusinessInfoResShippingAddressItem[]>,
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
    const addressRef = ref<InstanceType<typeof CustomTable> | null>(null);
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
    // 地址类型
    const address = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.OPERATION_ADDRESS) || [];
    });

    // 权限
    const {
      CAN_CREATE_DELIVERY_ADDRESS,
      CAN_UPDATE_DELIVERY_ADDRESS,
    } = usePermissionConfig();

    const shippingAddress = ref<IBusinessInfoSaveReqShippingAddressItem[]>([
      {
        recipient: '',
        recipientPhone: '',
        province: '',
        city: '',
        region: '',
        addressDetail: '',
        type: '',
        isDefault: YES_NO_ENUM.NO,
        sourceType: SOURCE_TYPE_ENUM.WEB,
      },
    ]);

    const shippingAddressStr = ref('');
    watch(() => props.data, () => {
      if (props.data?.length) {
        shippingAddress.value = props.data.map((item) => {
          item.sourceType = filters.getEnumLabel(SOURCE_TYPE_LIST, item.sourceType) as keyof typeof SOURCE_TYPE_ENUM;
          return item;
        }) as IBusinessInfoSaveReqShippingAddressItem[];
      } else {
        shippingAddress.value = [];
      }
      shippingAddressStr.value = JSON.stringify(cloneDeep(shippingAddress.value));
    }, { immediate: true });

    // 添加收货地址
    const handleAdd = () => {
      shippingAddress.value.push({
        recipient: '',
        recipientPhone: '',
        province: '',
        city: '',
        region: '',
        addressDetail: '',
        type: '',
        isDefault: YES_NO_ENUM.NO,
        sourceType: SOURCE_TYPE_ENUM.WEB,
      });
    };

    // 删除收货地址
    const handleDelete = (index: number) => {
      shippingAddress.value.splice(index, 1);
    };

    // 是否默认判重复
    const handleIsDefault = (val: string, index: number) => {
      const type = shippingAddress.value[index]?.type;
      // 如果同类型的有默认，则全部改成非默认
      if (val === YES_NO_ENUM.YES) {
        shippingAddress.value.filter((info, key) => key !== index).forEach((item) => {
          if (item?.type === type && item.isDefault === YES_NO_ENUM.YES) {
            item.isDefault = YES_NO_ENUM.NO;
          }
        });
      }
    };
    // 选择地址切换判重复
    const handleSelectType = (val: string, index: number) => {
      const type = shippingAddress.value[index]?.type;
      const isDefault = shippingAddress.value[index]?.isDefault;
      // 如果同类型的有默认，则全部改成非默认
      shippingAddress.value.filter((info, key) => key !== index).forEach((item) => {
        if (item?.type === type && isDefault === YES_NO_ENUM.YES) {
          item.isDefault = YES_NO_ENUM.NO;
        }
      });
    };

    // 选择地址
    const handleChangeAddress = (list: string[] = ['', '', ''], index: number) => {
      [shippingAddress.value[index].province,
        shippingAddress.value[index].city, shippingAddress.value[index].region] = list;
    };

    const handleSave = async () => {
      await addressRef.value?.handleValidate();
      if (props.businessType === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS) {
        const params: IBusinessInfoSaveReq = {
          shippingAddress: shippingAddress.value,
          customerId,
          editModuleList: [MODULE_BLOCK_ENUM.SHIPPING_ADDRESS],
        };
        await updateCustomerBusinessInfoApi(params);
      } else {
        const params: IBusinessInfoSaveReq = {
          shippingAddress: shippingAddress.value,
          customerId,
          editModuleList: [MODULE_BLOCK_ENUM.SHIPPING_ADDRESS],
        };
        await platformBusinessSaveApi(params);
      }
      edit.value = false;
      if (!isCreate.value) {
        handleRefresh?.(TABS_ENUM.TAB_OPERATE);
      }

      shippingAddressStr.value = JSON.stringify(cloneDeep(shippingAddress.value));
      useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
    };

    // 是否提示保存
    const handleIsSave = () => {
      return shippingAddressStr.value === JSON.stringify(shippingAddress.value);
    };

    // 取消
    const handleCancel = () => {
      addressRef.value?.handleResetFields();
      edit.value = false;
      shippingAddress.value = cloneDeep(JSON.parse(shippingAddressStr.value));
    };

    const handleEdit = () => {
      emit('edit', 'addressInfo');
      edit.value = true;
      shippingAddressStr.value = JSON.stringify(cloneDeep(shippingAddress.value));
    };

    return {
      shippingAddress,
      isCreate,
      edit,
      isEdit,
      addressRef,
      CAN_CREATE_DELIVERY_ADDRESS,
      CAN_UPDATE_DELIVERY_ADDRESS,
      address,

      handleAdd,
      handleDelete,
      renderColumns,
      handleChangeAddress,
      handleCancel,
      handleEdit,
      handleIsSave,
      handleIsDefault,
      handleSelectType,
      handleSave,
    };
  },
});
</script>

<style lang="scss" scoped>
.address-info {
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
    padding: 10px 0px;
  }
}
</style>
