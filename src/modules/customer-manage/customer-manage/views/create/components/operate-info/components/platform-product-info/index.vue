<!--
 * @Descripttion:
 * @Author: weitongxue
-->
<template>
  <div class="operate-info">
    <div class="operate-info__title flex-justify-between flex-align-center">
      <span>产品信息</span>
      <el-button
        v-if="isCreate && CAN_CREATE_PRODUCT_DATA"
        type="success"
        @click="handleSave"
      >暂存</el-button>
      <div v-else>
        <el-button
          type="primary"
          v-show="!isEdit && !edit && CAN_UPDATE_PRODUCT_DATA"
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
    <div class="operate-info__content">
      <div
        class="content-title flex flex-align-center"
      >
        <div class="brand-content">
          <el-tag
            v-for="(item, index) in brandNameList"
            :key="index"
            class="margin-right-10 tag"
            @click="handleScroll(item)"
          >
            {{item}}
          </el-tag>
        </div>
        <el-button
          type="text"
          v-if="edit || isCreate"
          @click="handleAddBrand"
        >添加品牌</el-button>
      </div>
      <div
        class="content"
        v-for="(item, index) in brandList"
        :key="index"
        :id="item.brandName"
      >
        <div
          class="flex flex-justify-end del-brand"
          v-show="brandList.length > 1 && isEdit"
          @click="handleDelBrand(index)"
        >删除品牌</div>
        <el-form
          :model="item"
          label-width="140px"
          :ref="el => setRefs(el, index)"
        >
          <responsive-row :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }">
            <el-form-item
              label="公司品牌："
              prop="brandName"
              :rules="[
                {
                  required: true,
                  validator: validateBrantName,
                },
              ]"
            >
              <el-input
                v-model="item.brandName"
                maxlength="100"
                placeholder="请输入公司品牌"
                v-if="isEdit"
              ></el-input>
              <div v-else>{{item?.brandName}}</div>
            </el-form-item>
            <el-form-item
              label="品质要求："
              prop="qualityRequirement"
              :rules="[
                {
                  required: true,
                  message: '请输入品质要求',
                  trigger: ['blur', 'change'],
                },
              ]"
            >
              <dictionary-select
                v-model="item.qualityRequirement"
                placeholder="请输入品质要求"
                :dictionary="CX_DICTIONARY_KEY.QUALITY_REQUIREMENT"
                v-if="isEdit"
              />
              <div v-else>{{$filters.getEnumLabel(quality, item?.qualityRequirement)}}</div>
            </el-form-item>
            <el-form-item
              label="面料级别："
              prop="fabricLevel"
            >
              <dictionary-select
                v-model="item.fabricLevel"
                placeholder="请选择面料级别"
                :dictionary="CX_DICTIONARY_KEY.CRM_FABRIC_LEVEL"
                v-if="isEdit"
                clearable
              />
              <div v-else>{{$filters.getEnumLabel(fabricLevel, item?.fabricLevel)}}</div>
            </el-form-item>
            <el-form-item
              label="工艺级别："
              prop="craftLevel"
            >
              <dictionary-select
                v-model="item.craftLevel"
                placeholder="请选择工艺级别"
                :dictionary="CX_DICTIONARY_KEY.CRM_CRAFT_LEVEL"
                v-if="isEdit"
                clearable
              />
              <div v-else>{{$filters.getEnumLabel(craftLevel, item?.craftLevel)}}</div>
            </el-form-item>
            <el-form-item
              label="供应链服务级别："
              prop="supplyChainLevel"
            >
              <dictionary-select
                v-model="item.supplyChainLevel"
                placeholder="请选择供应链服务级别"
                :dictionary="CX_DICTIONARY_KEY.CRM_SUPPLY_CHAIN_LEVEL"
                v-if="isEdit"
                clearable
              />
              <div v-else>{{$filters.getEnumLabel(supplyChainLevel, item?.supplyChainLevel)}}</div>
            </el-form-item>

          </responsive-row>
          <el-form-item
            label="销售渠道："
            prop="saleChannelList"
            :rules="[
              {
                required: true,
                message: '请选择销售渠道',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <dictionary-select
              v-model="item.saleChannelList"
              placeholder="请选择销售渠道"
              :dictionary="CX_DICTIONARY_KEY.SALE_CHANNEL"
              multiple
              v-if="isEdit"
            />
            <div v-else>
              <span
                v-for="info in item?.saleChannelList"
                :key="info"
              >{{$filters.getEnumLabel(saleChannel, info)}}，</span>
            </div>
          </el-form-item>

          <el-form-item
            label="合作模式："
            prop="cooperationModeList"
            :rules="[
              {
                required: true,
                message: '请选择合作模式',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <dictionary-select
              v-model="item.cooperationModeList"
              placeholder="请选择合作模式"
              :dictionary="CX_DICTIONARY_KEY.COOPERATION_MODE"
              multiple
              v-if="isEdit"
            />
            <div v-else>
              <span
                v-for="info in item?.cooperationModeList"
                :key="info"
              >{{$filters.getEnumLabel(cooperation, info)}}，</span>
            </div>
          </el-form-item>

          <el-form-item
            label="合作品类："
            prop="coreCategoryList"
            :rules="[
              {
                required: true,
                message: '请选择合作品类',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-cascader
              v-model="item.coreCategoryList"
              v-if="isEdit"
              :options="category"
              clearable
              style="width: 100%"
              placeholder="请选择合作品类"
              :props="{
                value: 'label',
                multiple: true,
              }"
            />
            <div v-else>
              <div v-if="item?.coreCategoryList.length">
                <span
                  v-for="(info, key) in item?.coreCategoryList"
                  :key="key"
                >{{info?.join('')}}，</span>
              </div>
            </div></el-form-item>
        </el-form>
        <!-- 开发周期 -->
        <div class="margin-top-20">
          <el-form
            :model="item.productPeriod"
            label-width="140px"
            :ref="el => setRefs(el, index)"
          >
            <responsive-row :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }">
              <el-form-item
                label="常规首单件数："
                prop="firstOrderPiece"
                :rules="[
                  {
                    required: true,
                    message: '请输入常规首单件数',
                    trigger: ['blur', 'change'],
                  },
                ]"
              >
                <input-number
                  :max="9999999"
                  :min="0"
                  :precision="0"
                  v-model="item.productPeriod.firstOrderPiece"
                  placeholder="请输入常规首单件数"
                  v-if="isEdit"
                >
                  <template #append>
                    <div>件</div>
                  </template>
                </input-number>
                <div v-if="!isEdit">
                  <span v-if="item?.productPeriod?.firstOrderPiece">{{item?.productPeriod?.firstOrderPiece}}件</span>
                </div>
              </el-form-item>
              <el-form-item
                label="常规返单件数："
                prop="reworkOrderPiece"
                :rules="[
                  {
                    required: true,
                    message: '请输入常规返单件数',
                    trigger: ['blur', 'change'],
                  },
                ]"
              >
                <input-number
                  :max="9999999"
                  :precision="0"
                  :min="0"
                  v-model="item.productPeriod.reworkOrderPiece"
                  placeholder="请输入常规返单件数"
                  v-if="isEdit"
                >
                  <template #append>
                    <div>件</div>
                  </template>
                </input-number>
                <div v-if="!isEdit">
                  <span v-if="item?.productPeriod?.reworkOrderPiece">{{item?.productPeriod?.reworkOrderPiece}}件</span>
                </div>
              </el-form-item>
              <el-form-item
                label="首单生产周期："
                prop="firstOrderProducePeriodMax"
                :rules="[
                  {
                    required: true,
                    validator: (r, v, c) => validateProduce(r, v, c, item),
                    trigger: ['blur', 'change'],
                  },
                ]"
              >
                <div class="flex row-width" v-if="isEdit">
                  <input-number
                    :max="999"
                    :min="0"
                    :precision="0"
                    v-model="item.productPeriod.firstOrderProducePeriodMin"
                    placeholder="请输入首单生产周期"
                  >
                    <template #append>
                      <div>天</div>
                    </template>
                  </input-number>
                  <span class="padding-left-5 padding-right-5">至</span>
                  <input-number
                    :max="999"
                    :min="0"
                    :precision="0"
                    v-model="item.productPeriod.firstOrderProducePeriodMax"
                    placeholder="请输入首单生产周期"
                  >
                    <template #append>
                      <div>天</div>
                    </template>
                  </input-number>
                </div>
                <div v-else>
                  <span
                    v-if="item?.productPeriod?.firstOrderProducePeriodMin"
                  >{{item?.productPeriod?.firstOrderProducePeriodMin}}-</span>
                  <span
                    v-if="item?.productPeriod?.firstOrderProducePeriodMax"
                  >{{item?.productPeriod?.firstOrderProducePeriodMax}}天</span>
                </div>
              </el-form-item>
              <el-form-item
                label="返单生产周期："
                prop="reworkOrderProducePeriodMax"
                :rules="[
                  {
                    required: true,
                    validator: (r, v, c) => validateReworkOrder(r, v, c, item),
                    trigger: ['blur', 'change'],
                  },
                ]"
              >
                <div class="flex row-width" v-if="isEdit">
                  <input-number
                    :max="999"
                    :min="0"
                    :precision="0"
                    v-model="item.productPeriod.reworkOrderProducePeriodMin"
                    placeholder="请输入返单生产周期"
                  >
                    <template #append>
                      <div>天</div>
                    </template>
                  </input-number>
                  <span class="padding-left-5 padding-right-5">至</span>
                  <input-number
                    :max="999"
                    :min="0"
                    :precision="0"
                    v-model="item.productPeriod.reworkOrderProducePeriodMax"
                    placeholder="请输入返单生产周期"
                  >
                    <template #append>
                      <div>天</div>
                    </template>
                  </input-number>
                </div>
                <div v-else>
                  <span
                    v-if="item?.productPeriod?.reworkOrderProducePeriodMin"
                  >{{item?.productPeriod?.reworkOrderProducePeriodMin}}-</span>
                  <span
                    v-if="item?.productPeriod?.reworkOrderProducePeriodMax"
                  >{{item?.productPeriod?.reworkOrderProducePeriodMax}}天</span>
                </div>
              </el-form-item>
              <el-form-item
                label="客户验货标准："
                prop="customerInspectionLevel"
              >
                <dictionary-select
                  v-model="item.productPeriod.customerInspectionLevel"
                  placeholder="请选择客户验货标准"
                  :dictionary="CX_DICTIONARY_KEY.CRM_CUSTOMER_INSPECTION_LEVEL"
                  v-if="isEdit"
                  clearable
                />
                <div v-else>
                  {{$filters.getEnumLabel(customerInspectionLevel, item?.productPeriod?.customerInspectionLevel)}}
                </div>
              </el-form-item>
            </responsive-row>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref,
  computed,
  PropType,
  watch,
  inject,
} from 'vue';
import { useRoute } from 'vue-router';
import DictionarySelect from '@/components/dictionary-select/index.vue';
import { ElMessageBox } from 'element-plus';

import { platformBusinessSaveApi } from '@/modules/customer-manage/customer-manage/api';
import { useDictionary } from '@/hooks/use-dictionary';
import { cloneDeep } from 'lodash-es';

import {
  IBusinessSaveReq,
  IBusinessInfoSaveBrandItem,
  IDetailPlatformBusinessInfoBrandListItem,
} from '@/modules/customer-manage/customer-manage/api/types';
import { MODULE_BLOCK_ENUM, TABS_ENUM } from '@/modules/customer-manage/customer-manage/constant';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
// import CustomTable from '@/components/custom-table';

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<IDetailPlatformBusinessInfoBrandListItem[]>,
      default: () => [],
    },
  },
  components: {
    DictionarySelect,
  },
  setup(props) {
    const $route = useRoute();
    const customerId = $route.params.id! as string;
    const routeName = $route.name;
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
      CAN_CREATE_PRODUCT_DATA,
      CAN_UPDATE_PRODUCT_DATA,
    } = usePermissionConfig();

    const { getDictionaryOptions } = useDictionary();
    // 查询品类
    const category = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.PIMS_CATEGORY, 3) || [];
    });
    // 查询品质要求
    const quality = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.QUALITY_REQUIREMENT) || [];
    });
    // 销售渠道
    const saleChannel = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.SALE_CHANNEL) || [];
    });
    // 品牌类型
    const brandType = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.BRAND_TYPE) || [];
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

    const brandList = ref<IDetailPlatformBusinessInfoBrandListItem[]>([
      {
        brandName: '', // 品牌名称
        qualityRequirement: '', // 品质要求
        fabricLevel: '', // 面料级别
        craftLevel: '', // 工艺级别
        supplyChainLevel: '', // 供应链服务级别
        productPeriod: {
          firstOrderPiece: '', // 常规首单件数
          reworkOrderPiece: '', // 常规返单件数
          firstOrderProducePeriodMin: '', // 首单生产周期最小天数
          firstOrderProducePeriodMax: '', // 首单生产周期
          reworkOrderProducePeriodMin: '', // 返单生产周期
          reworkOrderProducePeriodMax: '', // 返单生产周期
          customerInspectionLevel: '', // 客户验货标准
        },
        saleChannelList: [],
        cooperationModeList: [],
        coreCategoryList: [],
      },
    ]);

    const refs = ref<any[]>([]);
    const setRefs = (el: any, index: number) => {
      console.log(el, index);
      refs.value.push(el);
    };

    // 获取品牌名称
    const brandNameList = computed(() => {
      return brandList.value.map(item => item.brandName).filter(info => info);
    });

    // 添加品牌
    const copyBrantNameList = ref<{key: number; value: string;}[]>([]);
    const handleAddBrand = () => {
      refs.value = [];
      brandList.value.forEach((item, index) => {
        copyBrantNameList.value.push({
          key: index,
          value: item.brandName,
        });
      });
      brandList.value.push(
        {
          brandName: '', // 品牌名称
          qualityRequirement: '', // 品质要求
          fabricLevel: '', // 面料级别
          craftLevel: '', // 工艺级别
          supplyChainLevel: '', // 供应链服务级别
          productPeriod: {
            firstOrderPiece: '', // 常规首单件数
            reworkOrderPiece: '', // 常规返单件数
            firstOrderProducePeriodMin: '', // 首单生产周期最小天数
            firstOrderProducePeriodMax: '', // 首单生产周期
            reworkOrderProducePeriodMin: '', // 返单生产周期
            reworkOrderProducePeriodMax: '', // 返单生产周期
            customerInspectionLevel: '', // 客户验货标准
          },
          saleChannelList: [],
          cooperationModeList: [],
          coreCategoryList: [],
        },
      );
    };
    // 删除品牌
    const handleDelBrand = (index: number) => {
      ElMessageBox.confirm(
        '确定删除该品牌?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
        },
      )
        .then(() => {
          brandList.value.splice(index, 1);
        })
        .catch(() => {
        });
    };

    const brandListInfoStr = ref('');
    watch(() => props.data, () => {
      if (props.data.length) {
        brandList.value = props.data;
      }
      brandListInfoStr.value = JSON.stringify(cloneDeep(brandList.value));
    }, { immediate: true });

    // 滚动
    const handleScroll = (item: string) => {
      const boxDOM = document.getElementById(item);
      const scrollTo = boxDOM?.getBoundingClientRect().top;
      document.documentElement.scrollTo(0, scrollTo! - 50);
    };

    const handleSave = async () => {
      const reqArr: Promise<any>[] = [];
      refs.value.forEach((item) => {
        if (item?.validate && typeof item?.validate === 'function') {
          reqArr.push(item?.validate());
        }

        if (item?.handleValidate && typeof item?.handleValidate === 'function') {
          reqArr.push(item?.handleValidate());
        }
      });
      await Promise.all(reqArr);

      // brandList.value.map((item) => {
      //   item.coreCategoryList = item.coreCategoryList.map((info: []) => {
      //     return info.join(',');
      //   }) as [];
      //   return item;
      // });

      const params: IBusinessSaveReq = {
        brandList: brandList.value,
        customerId,
        editModuleList: [MODULE_BLOCK_ENUM.BRAND],
      };
      const res = await platformBusinessSaveApi(params);
      edit.value = false;
      if (!isCreate.value) {
        handleRefresh?.(TABS_ENUM.TAB_OPERATE);
      }
      brandListInfoStr.value = JSON.stringify(cloneDeep(brandList.value));
      console.log(res.data?.isAllCompleted, '是否全部填写');
    };

    // 是否提示保存
    const handleIsSave = () => {
      return brandListInfoStr.value === JSON.stringify(brandList.value);
    };

    // 取消
    const cancelArr = ref<any[]>([]);
    const handleCancel = () => {
      edit.value = false;
      refs.value.forEach((item) => {
        if (item?.validate && typeof item?.validate === 'function') {
          cancelArr.value.push(item?.clearValidate);
        }

        if (item?.handleValidate && typeof item?.handleValidate === 'function') {
          cancelArr.value.push(item?.handleResetFields);
        }
      });
      cancelArr.value.forEach((item) => {
        if (item && typeof item === 'function') {
          item();
        }
      });
      brandList.value = cloneDeep(JSON.parse(brandListInfoStr.value));
    };

    // 编辑
    const handleEdit = () => {
      edit.value = true;
      brandListInfoStr.value = JSON.stringify(cloneDeep(brandList.value));
    };

    return {
      brandList,
      isCreate,
      edit,
      isEdit,
      CX_DICTIONARY_KEY,
      category,
      quality,
      brandType,
      saleChannel,
      brandNameList,
      cooperation,
      fabricLevel,
      craftLevel,
      customerInspectionLevel,
      supplyChainLevel,
      CAN_CREATE_PRODUCT_DATA,
      CAN_UPDATE_PRODUCT_DATA,
      // 生产周期校验
      validateProduce: (rule: any, value: string,
        callback: (err?: Error) => void, item: IBusinessInfoSaveBrandItem) => {
        if (value === '') {
          callback(new Error('请输入首单生产周期'));
        } else if (Number(item?.productPeriod?.firstOrderProducePeriodMax)
        < Number(item?.productPeriod?.firstOrderProducePeriodMin)) {
          callback(new Error('结束周期不能小于开始周期'));
        } else {
          callback();
        }
      },
      // 返单生产周期检验
      validateReworkOrder: (rule: any, value: string,
        callback: (err?: Error) => void, item: IBusinessInfoSaveBrandItem) => {
        if (value === '') {
          callback(new Error('请输入返单生产周期'));
        } else if (Number(item?.productPeriod?.reworkOrderProducePeriodMax)
        < Number(item?.productPeriod?.reworkOrderProducePeriodMin)) {
          callback(new Error('结束周期不能小于开始周期'));
        } else {
          callback();
        }
      },

      // 品牌重名校验
      validateBrantName: (rule: any, value: string,
        callback: (err?: Error) => void) => {
        if (!value) {
          callback(new Error('请输入品牌名称'));
        } else if (brandList.value.filter(item => item.brandName === value).length > 1) {
          callback(new Error('品牌名称不能重复'));
        } else {
          callback();
        }
      },

      setRefs,
      handleAddBrand,
      handleDelBrand,
      handleScroll,
      handleCancel,
      handleEdit,
      handleIsSave,
      handleSave,
    };
  },
});
</script>

<style lang="scss" scoped>
.operate-info {
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
    padding: 10px 0px 0px;
    .content-title {
      background-color: rgba(77, 116, 232, 0.1);
      padding: 5px 10px;
      min-height: 42px;
    }
    .brand-content {
      flex: 1 1 auto;
    }
    .content {
      border: 1px solid #ccc;
      padding: 15px 10px 0px;
      margin-bottom: 15px;
      .channel, .cooperation, .category {
        margin-bottom: 10px;
        .channel-content, .cooperation-content, .category-content {
          &__title  {
            padding: 10px;
            background-color: rgba(77, 116, 232, 0.1);
          }
        }
      }
      .del-brand {
        margin-bottom: 10px;
        padding: 5px 2px;
        color: red;
        cursor: pointer;
      }
    }
  }
  .row-width {
    width: 100%;
  }
  .tag {
    cursor: pointer;
  }
}
</style>
