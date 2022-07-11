<template>
  <!-- 工商信息 -->
  <div class="basic-info">
    <basic-tem
      title="工商信息"
      :data="businessInfo"
      v-if="CAN_VIEW_BUSINESS_DATA"
    />
  </div>
  <div class="basic-info">
    <basic-tem
      title="规模信息"
      :data="scaleInfo"
      v-if="CAN_VIEW_SCALE_DATA"
    />
  </div>
  <div class="basic-info">
    <basic-tem
      title="其他"
      :data="otherInfo"
      v-if="CAN_VIEW_OTHER_DATA"
    />
    <custom-table
      border
      :data="operatingAddressList"
      :columns="addressRenderColumns(pageTab)"
    />
  </div>
  <empty v-if="!CAN_VIEW_BUSINESS_DATA && !CAN_VIEW_SCALE_DATA && !CAN_VIEW_OTHER_DATA" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useRoute } from 'vue-router';

import {
  IDetailBaseInfoRes,
} from '@/modules/customer-manage/customer-manage/api/types';
import { YES_NO_LIST, DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant/global';
import { filters } from '@/core/plugins/filter';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import {
  BUSINESS_MODE_ENUM,
  BUSINESS_MODE_LIST,
  ORDER_MODE_LIST,
  YES_OR_NO_NUMBER_LIST,
} from '@/constant';
import { CUSTOMER_TYPE_LIST } from '@/modules/customer-manage/customer-manage/constant';
import { useDictionary } from '@/hooks/use-dictionary';

import BasicTem from '../basic-tem.vue';
import {
  addressRenderColumns,
} from './composables/tableData';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<IDetailBaseInfoRes>,
      default: () => {},
    },
  },
  components: {
    BasicTem,
  },
  setup(props) {
    const $route = useRoute();
    const customerId = $route.params.id as string;
    const pageTab = 'basicInfo';
    const { getDictionaryOptions } = useDictionary();
    // 纳税人类型
    const taxpayerType = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.TAXPAYER_TYPE) || [];
    });

    // 权限
    const {
      CAN_VIEW_BUSINESS_DATA,
      CAN_VIEW_SCALE_DATA,
      CAN_VIEW_OTHER_DATA,
      CAN_UPDATE_KHLX,
      CAN_ORDER_TYPE,
    } = usePermissionConfig();

    // 营业信息
    const companyInfo = computed(() => props.data?.companyInfo);
    const businessType = computed(() => props?.data?.businessType);
    const businessInfo = computed(() => {
      return [
        {
          label: '客户全称',
          value: companyInfo.value?.customerName,
        },
        {
          label: '业务模式',
          value: filters.getEnumLabel(BUSINESS_MODE_LIST, businessType.value),
        },
        {
          label: '客户编码',
          value: companyInfo.value?.customerCode,
        },
        {
          label: '曾用名',
          value: companyInfo.value?.beforeName,
        },
        {
          label: '统一社会信用代码',
          value: companyInfo.value?.socialCreditCode,
        },
        {
          label: '天眼评分',
          value: companyInfo.value?.tianyanScore,
          isHidden: businessType.value === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS,
        },
        {
          label: '经营状态',
          value: companyInfo.value?.openState,
          isHidden: businessType.value === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS,
        },
        {
          label: '法定代表人',
          value: companyInfo.value?.artificialPerson,
        },
        {
          label: '公司类型',
          value: companyInfo.value?.companyType,
        },
        {
          label: '成立日期',
          value: `${filters.formatTime(companyInfo.value?.establishmentDate, 'YYYY-MM-DD')}`,
        },
        {
          label: '核准日期',
          value: `${filters.formatTime(companyInfo.value?.approvalDate, 'YYYY-MM-DD')}`,
          isHidden: businessType.value === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS,
        },
        {
          label: '营业期限',
          value: `${filters.formatTime(companyInfo.value?.businessTermSince || 253392422400000, 'YYYY-MM-DD')}
            至${filters.formatTime(companyInfo.value?.businessTermEnd || 253392422400000, 'YYYY-MM-DD')}`,
          isHidden: businessType.value === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS,
        },
        {
          label: '注册资本',
          value: `${companyInfo.value?.regCapital || '--'}万元${companyInfo.value?.regCapitalCurrency}`,
          isHidden: businessType.value === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS,
        },
        {
          label: '实缴资本',
          value: `${companyInfo.value?.actualPayCapital || '--'}万元${companyInfo.value?.actualCapitalCurrency}`,
          isHidden: businessType.value === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS,
        },
        {
          label: '注册地址',
          value: `${companyInfo.value?.registrationProvince}${companyInfo.value?.registrationCity}
          ${companyInfo.value?.registrationRegion}${companyInfo.value?.registrationAddress}`,
        },
        {
          label: '经营范围',
          isRow: true,
          value: companyInfo.value?.businessScope,
          isHidden: businessType.value === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS,
        },
        {
          label: '营业执照',
          type: 'image',
          value: '',
          imgList: companyInfo.value?.businessLicenseList ?? [],
        },
      ];
    });
    // 规模信息
    const customerScale = computed(() => props.data?.customerScale);
    const scaleInfo = computed(() => {
      return [
        {
          label: '年营业额',
          value: `${customerScale.value?.annualTurnover || '--'}${customerScale.value?.turnoverUnit}`,
          encryption: {
            businessId: customerId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.FULLY_DESENSITIZE,
            content: customerScale.value?.annualTurnover || '--',
            unit: customerScale.value?.turnoverUnit,
            pageTab,
            dateColumn: 'annualTurnover',
          },
        },
        {
          label: '年销售量',
          value: `${customerScale.value?.annualSaleVolume || '--'}${customerScale.value?.saleVolumeUnit}`,
          encryption: {
            businessId: customerId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.FULLY_DESENSITIZE,
            content: customerScale.value?.annualSaleVolume || '--',
            unit: customerScale.value?.saleVolumeUnit,
            pageTab,
            dateColumn: 'annualSaleVolume',
          },
        },
        {
          label: '销售倍率',
          value: `${customerScale.value?.saleRate}`,
          encryption: {
            businessId: customerId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.FULLY_DESENSITIZE,
            content: customerScale.value?.saleRate,
            pageTab,
            dateColumn: 'saleRate',
          },
        },
        {
          label: '合作预估规模',
          value: `${customerScale.value?.annualCooperationScale || '--'}${customerScale.value?.cooperationScaleUnit}`,
        },
        {
          label: '自有工厂',
          value: filters.getEnumLabel(YES_NO_LIST, customerScale.value?.selfFactory),
        },
        {
          label: '自有工厂备注',
          value: customerScale.value?.selfFactoryRemark,
        },
        {
          label: '自有设计师',
          value: filters.getEnumLabel(YES_NO_LIST, customerScale.value?.selfDesigner),
        },
        {
          label: '自有设计师备注',
          value: customerScale.value?.selfDesignerRemark,
        },
        {
          label: '在职人数',
          value: `${customerScale.value?.servingStaffMin || '--'}
          -${customerScale.value?.servingStaffMax || '--'}人`,
        },
      ];
    });
    // 其他信息
    const customerOther = computed(() => props.data?.customerOther);
    // 收货地址
    const operatingAddressList = computed(() => props?.data?.customerOther?.operatingAddressList || []);
    const otherInfo = computed(() => {
      const list = [
        {
          label: '纳税人类型',
          value: filters.getEnumLabel(taxpayerType.value, customerOther.value?.taxpayerType),
        },
        {
          label: '法人身份证号',
          value: customerOther.value?.artificialPersonIdCard,
          encryption: {
            businessId: customerId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.ID_CARD,
            content: customerOther.value?.artificialPersonIdCard,
            pageTab,
            dateColumn: 'artificialPersonIdCard',
          },
        },
        {
          label: '是否内部客户',
          value: filters.getEnumLabel(CUSTOMER_TYPE_LIST, customerOther.value?.customerType),
        },
        {
          label: '下单类型',
          value: filters.getEnumLabel(ORDER_MODE_LIST, customerOther.value?.allowedOrderType),
          isHidden: !CAN_ORDER_TYPE.value,
        },
        {
          label: '可上传合同',
          value: filters.getEnumLabel(YES_OR_NO_NUMBER_LIST, customerOther.value?.isUploadContract),
        },
        {
          label: '法人联系电话',
          value: customerOther.value?.artificialPersonPhone,
          encryption: {
            businessId: customerId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
            content: customerOther.value?.artificialPersonPhone,
            pageTab,
            dateColumn: 'artificialPersonPhone',
          },
        },
        // {
        //   label: '实际经营地址',
        //   value: `${customerOther.value?.operatingProvince}
        //   ${customerOther.value?.operatingCity}
        //   ${customerOther.value?.operatingRegion}${customerOther.value?.operatingAddress}`,
        // },
        // {
        //   label: '实际经营地址',
        //   value: `${customerOther.value?.operatingProvince}
        //   ${customerOther.value?.operatingCity}
        //   ${customerOther.value?.operatingRegion}${customerOther.value?.operatingAddress}`,
        //   encryption: {
        //     businessId: customerId,
        //     dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.ADDRESS,
        //     content: [customerOther.value?.operatingRegion, customerOther.value?.operatingAddress],
        //     prefix: [customerOther.value?.operatingProvince, customerOther.value?.operatingCity],
        //     pageTab,
        //     dateColumn: ['operatingRegion', 'operatingAddress'],
        //   },
        // },
        {
          label: '备注信息',
          value: customerOther.value?.remark,
        },
      ];
      return CAN_UPDATE_KHLX.value ? list : list.filter(item => item.label !== '客户类型');
    });

    return {
      businessInfo,
      scaleInfo,
      otherInfo,
      CAN_VIEW_BUSINESS_DATA,
      CAN_VIEW_SCALE_DATA,
      CAN_VIEW_OTHER_DATA,
      CAN_UPDATE_KHLX,
      taxpayerType,
      operatingAddressList,

      addressRenderColumns,
      pageTab,
    };
  },
});
</script>

<style lang="scss" scoped>
.basic-info {
  border: 1px solid #eee;
  margin-bottom: 10px;
  padding: 15px 10px;
}
</style>
