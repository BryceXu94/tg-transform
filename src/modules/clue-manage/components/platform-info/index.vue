<template>
  <el-form
    label-width="140px"
    label-suffix="："
  >
    <custom-card title="运营信息">
      <responsive-row
        :col="{
          xs: 12, sm: 12, md: 12, lg: 12, xl: 12
        }"
      >
        <el-form-item label="客户主营品类">{{mainCategorySum || '-'}}</el-form-item>
        <el-form-item label="客户月畅销款数">{{monthSellSum || '-'}}</el-form-item>
        <el-form-item label="客户售价区间">
          {{priceMinSum}}
          -
          {{priceMaxSum}}
        </el-form-item>
      </responsive-row>
      <div class="brand_layout" v-if="data.length">
        <el-collapse v-model="activeEcommercePlatformType">
          <el-collapse-item
            :name="item.ecommercePlatformType"
            class="brand_layout_item"
            v-for="item in data"
            :key="item.platformId"
          >
            <template #title>
              <div class="header">
                {{$filters.getEnumLabel(CRM_CLUE_PLATFORM_OPTIONS, item.ecommercePlatformType!)}}
              </div>
            </template>
            <div class="content">
              <div
                class="li"
                v-for="shopItem in item.shopInfoList"
                :key="shopItem.trackShopId"
              >
                <responsive-row
                  :col="{
                    xs: 12, sm: 12, md: 12, lg: 12, xl: 12
                  }"
                >
                  <el-form-item label="店铺名称">{{shopItem.shopName || '-'}}</el-form-item>
                  <el-form-item label="店铺等级">{{shopItem.shopLevel || '-'}}</el-form-item>
                  <el-form-item label="店铺网址">{{shopItem.shopUrl || '-'}}</el-form-item>
                  <el-form-item label="店铺粉丝量">{{shopItem.shopFans && `${shopItem.shopFans}万` || '-'}}</el-form-item>
                  <el-form-item label="口碑情况">{{shopItem.shopStar || '-'}}</el-form-item>
                  <el-form-item label="品牌名称">{{shopItem.brandName || '-'}}</el-form-item>
                  <el-form-item label="店铺主营品类">
                    <el-cascader
                      :options="PIMS_CATEGORY_OPTIONS"
                      clearable
                      style="width: 100%"
                      placeholder="请选择合作品类"
                      :props="{
                        value: 'label',
                        multiple: true,
                      }"
                      :max="100"
                      v-model="shopItem.mainCategory"
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="月畅销款数">{{shopItem.monthSellWell || '-'}}</el-form-item>
                  <el-form-item label="售价区间">{{shopItem.priceMin}}-{{shopItem.priceMax}}</el-form-item>
                  <el-form-item label="备注信息">{{shopItem.remark || '-'}}</el-form-item>
                </responsive-row>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </custom-card>
  </el-form>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { useDictionary } from '@/hooks/use-dictionary';
import CustomCard from '@/modules/clue-manage/components/custom-card/index.vue';
import { IGetCluesDetailRes } from '@/modules/clue-manage/customer-clue/api/type';

export default defineComponent({
  components: {
    CustomCard,
  },
  props: {
    data: {
      type: Object as PropType<IGetCluesDetailRes['ecommercePlatformList']>,
      required: true,
    },
    mainCategorySum: {
      type: String,
      required: true,
      default: '',
    },
    monthSellSum: {
      type: String,
      required: true,
      default: '',
    },
    priceMinSum: {
      type: String,
      required: true,
      default: '',
    },
    priceMaxSum: {
      type: String,
      required: true,
      default: '',
    },
  },
  setup() {
    const activeEcommercePlatformType = ref('');
    const { getDictionaryOptions } = useDictionary();
    // 查询品类
    const PIMS_CATEGORY_OPTIONS = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.PIMS_CATEGORY, 3) || [];
    });
    const CRM_CLUE_PLATFORM_OPTIONS = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_CLUE_PLATFORM) || [];
    });
    return {
      activeEcommercePlatformType,
      CRM_CLUE_PLATFORM_OPTIONS,
      PIMS_CATEGORY_OPTIONS,
    };
  },
});
</script>
<style lang="scss" scoped>
.brand_layout {
  margin-left: 30px;
  border: 1px solid #eee;
  border-bottom: none;
  border-top: none;
  border-radius: 4px;
  &_item{
    :deep(.el-collapse-item__header){
      background-color: var(--el-color-primary-light-9);
      border-bottom: 1px solid #fff;

    }
    .header{
      line-height: 48px;
      padding-left: 20px;
      font-weight: 500;
    }
    .content{
      .li {
        padding: 20px 0 0;
        border-bottom: 1px solid #eee;
        &:last-of-type{
          border-bottom: none;
        }
      }
    }
  }
}
</style>
