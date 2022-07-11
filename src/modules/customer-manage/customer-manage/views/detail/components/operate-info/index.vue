<template>
  <div class="operate-info">
    <!-- 产品信息 -->
    <div class="product-info" v-if="CAN_VIEW_PRODUCT_DATA">
      <div class="product-info__title">产品信息</div>
      <!-- content -->
      <div
        class="product-content__tags margin-top-20"
        v-if="brandNameList.length"
      >
        <el-tag
          class="margin-right-10 tag"
          v-for="(item, index) in brandNameList"
          :key="index"
          @click="handleScroll(item)"
        >{{item}}</el-tag>
      </div>
      <div
        class="product-info__content"
        v-show="brandList.length"
        v-for="(item, index) in brandList"
        :key="index"
        :id="item.brandName"
      >
        <el-form
          label-width="140px"
          class="margin-top-20"
        >
          <responsive-row :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }">
            <el-form-item label="公司品牌：">
              {{item?.brandName}}
            </el-form-item>
            <el-form-item
              label="品牌类型："
            >
              {{$filters.getEnumLabels(brandType, item.brandType)}}
            </el-form-item>
            <el-form-item
              label="对标品牌："
            >
              {{item?.benchmarkingBrand}}
            </el-form-item>
            <el-form-item
              label="消费年龄："
            >
              {{$filters.getEnumLabels(consumerAgeList, item.consumerAgeList)}}
            </el-form-item>
            <el-form-item
              label="产品风格："
            >
              {{$filters.getEnumLabels(productStyle, item.productStyle)}}
            </el-form-item>
            <el-form-item label="品质要求：">
              {{$filters.getEnumLabel(quality, item?.qualityRequirement)}}
            </el-form-item>
            <el-form-item label="面料级别：">
              {{$filters.getEnumLabel(fabricLevel, item?.fabricLevel!)}}
            </el-form-item>
            <el-form-item label="工艺级别：">
              {{$filters.getEnumLabel(craftLevel, item?.craftLevel!)}}
            </el-form-item>
            <el-form-item label="供应链服务级别：">
              {{$filters.getEnumLabel(supplyChainLevel, item?.supplyChainLevel!)}}
            </el-form-item>
          </responsive-row>
        </el-form>
        <!-- 销售渠道 -->
        <div
          class="channel"
        >
          <div class="channel-content">
            <div class="channel-content__title">销售渠道</div>
            <div class="padding-10">
              <custom-table
                border
                :data="item?.saleChannelList"
                :columns="channelRenderColumns(saleChannel)"
              />
            </div>
          </div>
        </div>
        <!-- 合作模式 -->
        <div
          class="cooperation"
        >
          <div class="cooperation-content">
            <div class="channel-content__title">合作模式</div>
            <div class="padding-10">
              <custom-table
                border
                :data="item?.cooperationModeList"
                :columns="cooperationRenderColumns(cooperation)"
              />
            </div>
          </div>
        </div>
        <!-- 核心品类 -->
        <div
          class="category"
        >
          <div class="category-content">
            <div class="category-content__title">核心品类</div>
            <div class="padding-10">
              <custom-table
                border
                :data="item?.coreCategoryList"
                :columns="categoryRenderColumns()"
              />
            </div>
          </div>
        </div>
        <!-- 面料检测内容 -->
        <div>
          <div class="padding-10 font-bold">面料检测内容</div>
          <el-form
            label-width="160px"
            class="margin-top-20"
          >
            <el-form-item
              label="检测方式："
            >
              <span>
                {{$filters.getEnumLabel(
                  CHECK_WAY_LIST,
                  brandList?.[index]?.checkRequirementModel?.checkWay!
                )}}
              </span>
            </el-form-item>
            <responsive-row
              :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
              v-if="brandList?.[index]?.checkRequirementModel?.checkWay !== CHECK_WAY_ENUM.NOT_REQUIRED_CHECK
                && brandList[index].checkRequirementModel.checkWay"
            >
              <el-form-item
                label="面辅料检测要求："
              >
                <span>
                  {{$filters.getEnumLabels(
                    materialTestingRequirements, brandList?.[index]?.checkRequirementModel?.fabricRequirement!
                  )}}</span>
              </el-form-item>
              <el-form-item
                label="面辅料检测支付："
                v-if="brandList?.[index]?.checkRequirementModel?.checkWay !== CHECK_WAY_ENUM.TIANGONG_CHECK"
              >
                <span>{{$filters.getEnumLabel(
                  PAYMENT_WAY_LIST,
                  brandList?.[index]?.checkRequirementModel?.fabricPaymentWay!
                )}}</span>
              </el-form-item>
              <el-form-item label="成衣检测要求：">
                <span>
                  {{$filters.getEnumLabels(
                    garmentTestingRequirements, brandList[index].checkRequirementModel.productRequirement!
                  )}}</span>
              </el-form-item>
              <el-form-item
                label="成衣检测支付："
                v-if="brandList?.[index]?.checkRequirementModel?.checkWay !== CHECK_WAY_ENUM.TIANGONG_CHECK"
              >
                <span>{{$filters.getEnumLabel(
                  PAYMENT_WAY_LIST,
                  brandList?.[index]?.checkRequirementModel?.productPaymentWay!
                )}}</span>
              </el-form-item>
            </responsive-row>
          </el-form>
        </div>
        <!-- 包装内容 -->
        <div>
          <div class="padding-10 font-bold">包装内容</div>
          <el-form
            label-width="160px"
            class="margin-top-20"
          >
            <responsive-row
              :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
              v-for="item in brandList?.[index]?.checkRequirementModel?.packageRequirement"
              :key="item"
            >
              <el-form-item
                label="包装要求："
              >
                <span>
                  {{$filters.getEnumLabels(
                    packagingRequirements, item.packageRequireList!
                  )}}
                </span>
              </el-form-item>
              <el-form-item

                label="包装供给方："
              >
                <span>{{$filters.getEnumLabel(PACKAGE_PROVIDER_LIST, item?.packageProvider!)}}</span>
              </el-form-item>
            </responsive-row>
            <el-form-item
              label="包装支付："
              v-if="brandList?.[index]?.checkRequirementModel?.packageRequirement?.map(
                info => info.packageProvider!).includes(PAYMENT_WAY_ENUM.TIANGONG_PAY)"
            >
              <span>{{$filters.getEnumLabel(
                PAYMENT_WAY_LIST,
                brandList?.[index]?.checkRequirementModel?.packagePayment!
              )}}</span>
            </el-form-item>
          </el-form>
        </div>
        <!-- 运输内容 -->
        <div>
          <div class="padding-10 font-bold">运输内容</div>
          <el-form
            label-width="160px"
            class="margin-top-20"
          >
            <responsive-row :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }">
              <el-form-item
                label="运输方式："
              >
                <span>{{$filters.getEnumLabels(
                  typeOfShipping,
                  brandList?.[index]?.checkRequirementModel?.deliveryWay!
                )}}</span>
              </el-form-item>
              <el-form-item

                label="运费支付："
              >
                <span>{{$filters.getEnumLabel(
                  PAYMENT_WAY_LIST,
                  brandList?.[index]?.checkRequirementModel?.shippingFeePayment!
                )}}</span>
              </el-form-item>
            </responsive-row>
          </el-form>
        </div>
        <!-- 下单内容 -->
        <div>
          <div class="padding-10 font-bold">下单内容</div>
          <el-form
            label-width="160px"
            class="margin-top-20"
          >
            <responsive-row :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }">
              <el-form-item
                label="开发选择规律："
              >
                <span>{{item?.productPeriod?.prototypePeriod}}{{item?.productPeriod?.prototypePeriodUnit}}</span>
                <span
                  v-if="item?.productPeriod?.prototypePeriodTimes"
                >{{item?.productPeriod?.prototypePeriodTimes}}次</span>
              </el-form-item>
              <el-form-item

                label="生产下单规律："
              >
                <span>{{item?.productPeriod?.producePeriod}}{{item?.productPeriod?.producePeriodUnit}}</span>
                <span v-if="item?.productPeriod?.producePeriodTimes">{{item?.productPeriod?.producePeriodTimes}}次</span>
              </el-form-item>
              <el-form-item label="常规首单件数：">
                <span v-if="item?.productPeriod?.firstOrderPiece">{{item?.productPeriod?.firstOrderPiece}}件</span>
              </el-form-item>
              <el-form-item label="首单生产周期：">
                <span
                  v-if="item?.productPeriod?.firstOrderProducePeriodMin"
                >{{item?.productPeriod?.firstOrderProducePeriodMin}}天-</span>
                <span>{{item?.productPeriod?.firstOrderProducePeriodMax}}天</span>
              </el-form-item>
              <el-form-item label="常规返单件数：">
                {{item?.productPeriod?.reworkOrderPiece}}件
              </el-form-item>
              <el-form-item label="返单生产周期：">
                <span
                  v-if="item?.productPeriod?.reworkOrderProducePeriodMin"
                >{{item?.productPeriod?.reworkOrderProducePeriodMin}}天-</span>
                <span>{{item?.productPeriod?.reworkOrderProducePeriodMax}}天</span>
              </el-form-item>
              <el-form-item

                label="样版开发周期/天："
              >
                <span
                  v-if="item?.productPeriod?.prototypeDevelopmentPeriodMin"
                >{{item?.productPeriod?.prototypeDevelopmentPeriodMin}}天-</span>
                <span>{{item?.productPeriod?.prototypeDevelopmentPeriodMax}}天</span>
              </el-form-item>
              <el-form-item label="客户验货标准：">
                {{$filters.getEnumLabel(customerInspectionLevel, item?.productPeriod?.customerInspectionLevel!)}}
              </el-form-item>
              <el-form-item label="产前样要求：">
                <span>{{item?.productPeriod?.sampleRequirement}}</span>
              </el-form-item>
            </responsive-row>
          </el-form>
        </div>

      </div>
      <empty v-show="!brandList.length" />
    </div>
    <!-- 收货地址 -->
    <div class="address-info" v-if="CAN_VIEW_DELIVERY_ADDRESS">
      <div class="address-info__title margin-bottom-10">收货地址</div>
      <div class="padding-10">
        <custom-table
          border
          :data="shippingAddressList"
          :columns="addressRenderColumns(address, pageTab)"
        />
      </div>
    </div>
    <empty v-if="!CAN_VIEW_PRODUCT_DATA && !CAN_VIEW_DELIVERY_ADDRESS" />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import {
  IDetailBusinessInfoRes,
  IDetailBusinessInfoResBrandListItem,
} from '@/modules/customer-manage/customer-manage/api/types';
import { useDictionary } from '@/hooks/use-dictionary/';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
import { BUSINESS_MODE_ENUM } from '@/constant';

import {
  channelRenderColumns,
  cooperationRenderColumns,
  categoryRenderColumns,
  addressRenderColumns,
} from './composables/tableData';

import {
  CHECK_WAY_LIST,
  PAYMENT_WAY_LIST,
  PACKAGE_PROVIDER_LIST,
  CHECK_WAY_ENUM,
  PAYMENT_WAY_ENUM,
} from '../../../../constant';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<IDetailBusinessInfoRes>,
      default: () => {},
    },
  },
  setup(props) {
    const { getDictionaryOptions } = useDictionary();
    // 查询品类
    const category = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.PIMS_CATEGORY) || [];
    });
    // 查询品质要求
    const quality = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.QUALITY_REQUIREMENT) || [];
    });
    // 查询产品风格
    const productStyle = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.PRODUCT_STYLE) || [];
    });
    // 查询消费年龄
    const consumerAgeList = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CONSUMER_AGE) || [];
    });
    // 销售渠道
    const saleChannel = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.SALE_CHANNEL) || [];
    });
    // 地址类型
    const address = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.OPERATION_ADDRESS) || [];
    });
    // 品牌类型
    const brandType = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.BRAND_TYPE) || [];
    });

    // 品牌信息
    const brandList = computed(() => {
      let list: IDetailBusinessInfoResBrandListItem[] = [];
      if (props.data?.brandList?.length) {
        list = props.data?.brandList?.map((item) => {
          // 处理checkRequirementModel返回null的数据
          if (!item.checkRequirementModel) {
            item.checkRequirementModel = {
              checkWay: '', // 检测方式
              fabricRequirement: [], // 面辅料检测要求
              productRequirement: [], // 成衣检测要求
              fabricPaymentWay: '', // 面辅料检测支付
              productPaymentWay: '', // 成衣检测支付
              packagePayment: '', // 包装支付
              deliveryWay: [], // 运输方式
              shippingFeePayment: '', // 运费支付方式
              packageRequirement: [{
                packageRequireList: [], // 包装要求
                packageProvider: '', // 包装供给方
              }],
            };
          }
          return item;
        });
      } else {
        list = [];
      }
      return list;
    });
    // 获取品牌名称
    const brandNameList = computed(() => {
      return brandList.value.map(item => item.brandName).filter(info => info);
    });
    // 合作模式
    const cooperation = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.COOPERATION_MODE) || [];
    });
    // 面料级别
    const fabricLevel = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_FABRIC_LEVEL) || [];
    });
    // 工艺级别
    const craftLevel = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_CRAFT_LEVEL) || [];
    });
    // 供应链服务级别
    const supplyChainLevel = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_SUPPLY_CHAIN_LEVEL) || [];
    });
    // 客户验货标准
    const customerInspectionLevel = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_CUSTOMER_INSPECTION_LEVEL) || [];
    });
    // 包装要求
    const packagingRequirements = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_PACKAGING_REQUIREMENTS) || [];
    });
    // 面辅料检测要求
    const materialTestingRequirements = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_MATERIAL_TESTING_REQUIREMENTS) || [];
    });
    // 成衣检测要求
    const garmentTestingRequirements = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_GARMENT_TESTING_REQUIREMENTS) || [];
    });
    // 运输方式
    const typeOfShipping = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_TYPE_OF_SHIPPING) || [];
    });

    // 业务类型
    const businessType = computed(() => props?.data?.businessType);

    // 收货地址
    const shippingAddressList = computed(() => props?.data?.shippingAddress || []);

    // 权限
    const {
      CAN_VIEW_PRODUCT_DATA,
      CAN_VIEW_DELIVERY_ADDRESS,
    } = usePermissionConfig();

    // 滚动
    const handleScroll = (item: string) => {
      const boxDOM = document.getElementById(item);
      const scrollTo = boxDOM?.getBoundingClientRect().top;
      document.documentElement.scrollTo(0, scrollTo!);
    };

    return {
      brandList,
      shippingAddressList,
      brandNameList,
      category,
      quality,
      productStyle,
      saleChannel,
      address,
      brandType,
      consumerAgeList,
      cooperation,
      fabricLevel,
      craftLevel,
      customerInspectionLevel,
      supplyChainLevel,
      CAN_VIEW_PRODUCT_DATA,
      CAN_VIEW_DELIVERY_ADDRESS,
      businessType,
      BUSINESS_MODE_ENUM,
      PAYMENT_WAY_ENUM,
      CHECK_WAY_LIST,
      PAYMENT_WAY_LIST,
      PACKAGE_PROVIDER_LIST,
      CHECK_WAY_ENUM,
      packagingRequirements,
      materialTestingRequirements,
      garmentTestingRequirements,
      typeOfShipping,

      channelRenderColumns,
      cooperationRenderColumns,
      categoryRenderColumns,
      addressRenderColumns,
      handleScroll,
      pageTab: 'operateInfo',
    };
  },
});
</script>

<style lang="scss" scoped>
.product-info, .address-info {
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
  .product-content__tags {
    padding: 5px 10px;
    background-color: rgba(77, 116, 232, 0.1);
  }
  &__content {
    border: 1px solid #eee;
    margin-bottom: 10px;
  }
  // 销售渠道
  .channel, .cooperation, .category {
    padding: 0px 10px 15px 10px;
    .channel-content, .cooperation-content, .category-content {
       border: 1px solid #eee;
      &__title  {
        padding: 8px 10px;
        background-color: rgba(77, 116, 232, 0.1);
      }
    }
  }
  .tag {
    cursor: pointer;
  }
}
</style>
