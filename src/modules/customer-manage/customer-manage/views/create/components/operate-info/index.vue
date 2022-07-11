<!--
 * @Descripttion: 运营信息
 * @Author: weitongxue
-->
<template>
  <!-- 产品信息 -->
  <product-info
    :data="brandInfo"
    :businessType="businessType"
    ref="product-info"
  />
  <!-- 收货地址 -->
  <address-info
    :data="addressInfo"
    :businessType="businessType"
    :pageTab="pageTab"
    ref="address-info"
    @edit="handleEdit"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, computed, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';

import ProductInfo from './components/product-info/index.vue';
import AddressInfo from './components/address-info/index.vue';

import {
  IDetailBusinessInfoRes,
} from '@/modules/customer-manage/customer-manage/api/types';
import { BUSINESS_MODE_ENUM } from '@/constant';

type TRefs = {
  'product-info': {
    handleIsSave: () => boolean;
  };
  'address-info': {
     handleIsSave: () => boolean;
  };
}

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<IDetailBusinessInfoRes>,
      default: () => {},
    },
    encryptData: {
      type: Object as PropType<IDetailBusinessInfoRes>,
      default: () => {},
    },
    businessType: {
      type: String,
      default: '',
    },
  },
  components: {
    ProductInfo,
    AddressInfo,
  },
  setup(props) {
    const $route = useRoute();
    const editedModule = reactive({
      addressInfo: false,
    });
    const isCreate = $route.name === 'CustomerManageCreateCustomer';

    // 产品信息
    const brandInfo = computed(() => props.data?.brandList);
    // 收货地址
    const addressInfo = computed(() => {
      return (isCreate || editedModule.addressInfo)
        ? props?.data?.shippingAddress
        : props?.encryptData?.shippingAddress
        || [];
    });

    const currentInstance = getCurrentInstance()!;

    // 检验是否需要保存
    const validateData = () => {
      return (currentInstance.refs as TRefs)['product-info'].handleIsSave()
      && (currentInstance.refs as TRefs)['address-info'].handleIsSave();
    };

    const handleEdit = (field: keyof typeof editedModule) => {
      editedModule[field] = true;
    };

    return {
      brandInfo,
      addressInfo,
      BUSINESS_MODE_ENUM,
      validateData,
      handleEdit,
      pageTab: 'operateInfo',
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
