<template>
  <el-form
    label-width="140px"
  >
    <business-info
      :data="cluesDetail.businessInfoModel || {}"
    />
    <platform-info
      :data="cluesDetail.ecommercePlatformList"
      :mainCategorySum="cluesDetail.mainCategorySum"
      :monthSellSum="cluesDetail.monthSellSum"
      :priceMinSum="cluesDetail.priceMinSum"
      :priceMaxSum="cluesDetail.priceMaxSum"
      v-if="showPlatformInfo"
    />
    <contact-info
      :clueType="clueType"
      :data="cluesDetail.contactList"
      v-if="showContactInfo"
    />
  </el-form>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import BusinessInfo from '@/modules/clue-manage/components/business-info/index.vue';
import PlatformInfo from '@/modules/clue-manage/components/platform-info/index.vue';
import ContactInfo from '@/modules/clue-manage/components/contact-info/index.vue';
import { ICustomerClueDevDetailRes } from '@/modules/clue-manage/develop-follow/api/types';
import { CLUE_TYPE_ENUM } from '@/modules/clue-manage/develop-follow/constant';

export default defineComponent({
  props: {
    clueType: {
      type: String as PropType<CLUE_TYPE_ENUM>,
      default: CLUE_TYPE_ENUM.DEVELOPMENT_PLAN,
    },
    cluesDetail: {
      type: Object as PropType<ICustomerClueDevDetailRes>,
    },
  },
  components: {
    BusinessInfo,
    PlatformInfo,
    ContactInfo,
  },
  setup(props) {
    const showPlatformInfo = computed(() => props.clueType === CLUE_TYPE_ENUM.E_COMMERCE_CLUE);
    const showContactInfo = computed(() => [
      CLUE_TYPE_ENUM.E_COMMERCE_CLUE,
      CLUE_TYPE_ENUM.STRANGER_VISIT_CLUE,
    ].includes(props.clueType));
    return {
      showPlatformInfo,
      showContactInfo,
    };
  },
});
</script>
