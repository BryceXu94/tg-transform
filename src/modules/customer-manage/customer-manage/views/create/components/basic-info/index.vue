<template>
  <!-- 工商信息 -->
  <business-info
    :data="companyInfo"
    :state="state"
    ref="business-info"
    v-if="BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS === businessType"
  />
  <platform-business-info
    :data="companyInfo"
    :state="state"
    ref="business-info"
    v-if="BUSINESS_MODE_ENUM.PLATFORM_BUSINESS === businessType"
  ></platform-business-info>
  <!-- 规模信息 -->
  <scale-info
    :data="scaleInfo"
    :pageTab="pageTab"
    ref="scale-info"
    @edit="handleEdit"
    :businessType="businessType"
  />
  <!-- 其他信息 -->
  <other-info
    :data="otherInfo"
    :pageTab="pageTab"
    ref="other-info"
    @edit="handleEdit"
    :businessType="businessType"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, computed, getCurrentInstance, reactive } from 'vue';
import { useRoute } from 'vue-router';

import BusinessInfo from './components/business-info.vue';
import ScaleInfo from './components/scale-info.vue';
import OtherInfo from './components/other-info/index.vue';
import PlatformBusinessInfo from './components/platform-business-info.vue';

import {
  IDetailBaseInfoRes,
} from '@/modules/customer-manage/customer-manage/api/types';
import { BUSINESS_MODE_ENUM } from '@/constant';

type TRefs = {
  'business-info': {
    handleIsSave: () => boolean;
  };
  'scale-info': {
     handleIsSave: () => boolean;
  };
  'other-info': {
     handleIsSave: () => boolean;
  };
}

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<IDetailBaseInfoRes>,
      default: () => {},
    },
    encryptData: {
      type: Object as PropType<IDetailBaseInfoRes>,
      default: () => {},
    },
    state: {
      type: String,
      default: '',
    },
  },
  components: {
    BusinessInfo,
    ScaleInfo,
    OtherInfo,
    PlatformBusinessInfo,
  },
  setup(props) {
    const $route = useRoute();
    const currentInstance = getCurrentInstance()!;
    const editedModule = reactive({
      customerScale: false,
      customerOther: false,
    });
    const isCreate = $route.name === 'CustomerManageCreateCustomer';

    // 工商信息
    const companyInfo = computed(() => props?.data?.companyInfo);
    // 规模信息
    const scaleInfo = computed(() => {
      return (isCreate || editedModule.customerScale) ? props?.data?.customerScale : props?.encryptData?.customerScale;
    });
    // 其他信息
    const otherInfo = computed(() => {
      return (isCreate || editedModule.customerOther) ? props?.data?.customerOther : props?.encryptData?.customerOther;
    });
    // 业务类型
    const businessType = computed(() => props?.data?.businessType);

    // 检验是否需要保存
    const validateData = () => {
      return (currentInstance.refs as TRefs)['business-info'].handleIsSave()
      && (currentInstance.refs as TRefs)['scale-info'].handleIsSave()
      && (currentInstance.refs as TRefs)['other-info'].handleIsSave();
    };

    const handleEdit = (field: keyof typeof editedModule) => {
      editedModule[field] = true;
    };

    return {
      companyInfo,
      scaleInfo,
      otherInfo,
      businessType,
      BUSINESS_MODE_ENUM,

      validateData,

      handleEdit,
      pageTab: 'basicInfo',
    };
  },
});
</script>
