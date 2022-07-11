<template>
  <custom-card title="运营信息">
    <div class="operate_layout" v-if="data.length !== 0">
      <div class="tab">
        <el-scrollbar height="420px">
          <tabs
            :config="tabs"
            mode="vertical"
            v-model="curPlatform"
            :border="false"
            :clearable="true"
            @remove="handleRemovePlatform"
          />
          <el-tooltip content="新增电商平台" v-if="unSelectedPlatform.length">
            <el-icon
              class="add_platform"
              @click="handleAddPlatform"
            ><circle-plus /></el-icon>
          </el-tooltip>
        </el-scrollbar>
      </div>
      <div
        class="content"
        v-if="curPlatformData"
        :key="curPlatformData.ecommercePlatformType"
      >
        <el-form
          label-width="100px"
          :model="curPlatformData"
          ref="formEl"
          scrollToError
        >
          <el-scrollbar height="420px">
            <div
              class="table_item"
              v-for="(item, index) in curPlatformData?.shopInfoList"
              :key="index"
            >
              <responsive-row
                :col="{
                  xs: 12, sm: 12, md: 12, lg: 12, xl: 12
                }"
              >
                <el-form-item
                  label="店铺名称"
                  :prop="`shopInfoList.[${index}].shopName`"
                  :rules="shopNameRules(curPlatformIndex, index)"
                >
                  <el-input
                    v-model.trim="item.shopName"
                    placeholder="请输入店铺名称"
                    :maxlength="20"
                  />
                </el-form-item>
                <el-form-item
                  label=""
                >
                  <el-button
                    type="danger"
                    v-if="curPlatformData!.shopInfoList.length > 1"
                    @click="handleDeleteShop(index)"
                  >删除店铺</el-button>
                </el-form-item>
                <el-form-item label="店铺网址">
                  <el-input
                    v-model.trim="item.shopUrl"
                    placeholder="请输入店铺网址"
                    :maxlength="300"
                  />
                </el-form-item>
                <el-form-item label="店铺等级">
                  <el-input
                    v-model.trim="item.shopLevel"
                    placeholder="请输入店铺等级"
                    :maxlength="20"
                  />
                </el-form-item>
                <el-form-item label="口碑情况">
                  <el-input
                    v-model.trim="item.shopStar"
                    placeholder="请输入口碑情况"
                    :maxlength="20"
                  />
                </el-form-item>
                <el-form-item label="店铺粉丝量">
                  <input-number
                    v-model="item.shopFans"
                    placeholder="请输入店铺粉丝量"
                    :max="9999.99"
                    :precision="2"
                    :min="0"
                  >
                    <template #append>万</template>
                  </input-number>
                </el-form-item>
                <el-form-item
                  label="主营品类"
                  :prop="`shopInfoList.[${index}].mainCategory`"
                  :rules="rules.mainCategory"
                >
                  <el-cascader
                    v-model="item.mainCategory"
                    :options="PIMS_CATEGORY_OPTIONS"
                    clearable
                    style="width: 100%"
                    placeholder="请选择合作品类"
                    :props="{
                      value: 'label',
                      multiple: true,
                    }"
                    :max="100"
                  />
                </el-form-item>
                <el-form-item label="品牌名称">
                  <el-input
                    v-model="item.brandName"
                    placeholder="请输入品牌名称"
                    :maxlength="20"
                  />
                </el-form-item>
                <el-form-item
                  label="售价区间"
                  :prop="`shopInfoList.[${index}].priceMin`"
                  :rules="priceRules(curPlatformIndex, index)"
                >
                  <input-number-ranger
                    v-model:rangeStart="item.priceMin"
                    v-model:rangeEnd="item.priceMax"
                    :max="999999.99"
                    :precision="2"
                    :min="0"
                  >
                    <template #append>元</template>
                  </input-number-ranger>
                </el-form-item>
                <el-form-item
                  label="月畅销款数"
                  :prop="`shopInfoList.[${index}].monthSellWell`"
                  :rules="rules.monthSellWell"
                >
                  <input-number
                    v-model="item.monthSellWell"
                    placeholder="请输入月畅销款数"
                    :max="9999"
                    :min="0"
                    :precision="0"
                  >
                    <template #suffix>
                      <el-tooltip content="月畅销款为月销单品过千的款" placement="top">
                        <el-icon style="margin: auto;">
                          <warning />
                        </el-icon>
                      </el-tooltip>
                    </template>
                  </input-number>
                </el-form-item>
                <el-form-item
                  label="备注信息"
                  :col="{
                    xs: 24, sm: 24, md: 24, lg: 24, xl: 24
                  }"
                >
                  <el-input
                    type='textarea'
                    v-model.trim="item.remark"
                    placeholder="请输入备注信息"
                    :maxlength="100"
                  />
                </el-form-item>
              </responsive-row>
            </div>
            <div class="create">
              <el-button type="primary" @click="handleAddShop">添加店铺</el-button>
            </div>
          </el-scrollbar>
        </el-form>
      </div>
    </div>
    <div class="operate_layout empty" v-else>
      <empty description="运营电商平台为空，请选择">
        <el-button
          type="primary"
          @click="handleAddPlatform"
        >选择电商平台</el-button>
      </empty>
    </div>
    <platform-modal
      v-model:visible="platformModalVisible"
      :options="unSelectedPlatform"
      @confirm="handlePlatformModalConfirm"
    />
  </custom-card>
</template>
<script lang="ts">
import { defineComponent, ref, computed, PropType, watchEffect, nextTick } from 'vue';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { useDictionary } from '@/hooks/use-dictionary';
import PlatformModal from './platform-modal/index.vue';
import { CirclePlus, Warning } from '@element-plus/icons-vue';
import { getLabelByVal } from '@/core/plugins/filter';
import { IPlatformInfoItem } from '../../type';
import { FormItemRule, ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { isEmpty } from '@tiangong/utils';
import CustomCard from '@/modules/clue-manage/components/custom-card/index.vue';

export default defineComponent({
  components: {
    CirclePlus,
    Warning,
    PlatformModal,
    CustomCard,
  },
  emits: ['update:data'],
  props: {
    trackId: {
      type: String,
      required: true,
    },
    data: {
      type: Array as PropType<IPlatformInfoItem[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const formEl = ref<InstanceType<typeof ElForm>>();
    // 是否校验全部字段
    const needValidateAll = ref(false);
    const { getDictionaryOptions } = useDictionary();
    // 查询品类
    const PIMS_CATEGORY_OPTIONS = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.PIMS_CATEGORY, 3) || [];
    });
    // 运营平台字典
    const CRM_CLUE_PLATFORM_OPTIONS = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_CLUE_PLATFORM) || [];
    });
    // 当前选中平台
    const curPlatform = ref('');
    const curPlatformIndex = computed(() => props.data.findIndex(v => v.ecommercePlatformType === curPlatform.value));
    // 新增平台弹窗显示
    const platformModalVisible = ref(false);
    // 点击新增平台
    const handleAddPlatform = () => {
      platformModalVisible.value = true;
    };
    const tabs = computed(() => {
      const { data } = props;
      return data.map(v => ({
        label: getLabelByVal(CRM_CLUE_PLATFORM_OPTIONS.value, v.ecommercePlatformType!),
        value: v.ecommercePlatformType,
      }));
    });
    // 未选中的平台
    const unSelectedPlatform = computed(() => {
      const { data } = props;
      return CRM_CLUE_PLATFORM_OPTIONS.value
        .filter(v => !data.some(it => it.ecommercePlatformType === v.value));
    });
    // 确认新增平台
    const handlePlatformModalConfirm = (keys: string[]) => {
      const { data, trackId } = props;
      const list = [...data];
      keys.forEach((v) => {
        list.push({
          platformId: '',
          ecommercePlatformType: v,
          trackId,
          shopInfoList: [
            {
              trackShopId: '',
              shopName: '',
              shopUrl: '',
              shopLevel: '',
              shopStar: '',
              shopFans: '',
              brandName: '',
              mainCategory: [],
              priceMin: '',
              priceMax: '',
              monthSellWell: '',
              remark: '',
            },
          ],
        });
      });
      emit('update:data', list);
    };
    // 当前选中的平台数据
    const curPlatformData = computed(() => {
      const { data } = props;
      const row = data.find(v => v.ecommercePlatformType === curPlatform.value);
      return row;
    });
    // 新增店铺
    const handleAddShop = () => {
      if (curPlatformData.value!.shopInfoList.length >= 10) {
        ElMessage.warning('同一平台下，店铺不能超过10个');
        return;
      }
      curPlatformData.value!.shopInfoList.push({
        trackShopId: '',
        shopName: '',
        shopUrl: '',
        shopLevel: '',
        shopStar: '',
        shopFans: '',
        brandName: '',
        mainCategory: [],
        priceMin: '',
        priceMax: '',
        monthSellWell: '',
        remark: '',
      });
    };
    // 点击删除店铺
    const handleDeleteShop = async (index: number) => {
      await ElMessageBox.confirm('请确认是否删除该店铺', '提示');
      curPlatformData.value!.shopInfoList!.splice(index, 1);
      ElMessage.success('删除成功');
    };
    // 点击删除平台
    const handleRemovePlatform = (val: string) => {
      const { data } = props;
      const list = [...data];
      if (list.length <= 1) {
        ElMessage.warning('至少保留一个电商平台');
        return;
      }
      const index = list.findIndex(v => v.ecommercePlatformType === val);
      list.splice(index, 1);
      emit('update:data', list);
    };
    watchEffect(() => {
      const { data } = props;
      if (data.length) {
        const row = props.data.find(v => v.ecommercePlatformType === curPlatform.value);
        if (curPlatform.value === '' || !row) {
          curPlatform.value = data[0].ecommercePlatformType!;
        }
      } else {
        curPlatform.value = '';
      }
    });

    const rules = computed(() => {
      return {
        mainCategory: [
          {
            required: true,
            trigger: 'blur',
            validator: (_rules, value, cb) => {
              if (!needValidateAll.value) {
                cb();
                return;
              }
              if (isEmpty(value) || (Array.isArray(value) && value.length === 0)) {
                cb('主营品类不能为空');
              } else {
                cb();
              }
            },
          },
        ] as FormItemRule[],
        monthSellWell: [
          {
            required: true,
            trigger: 'blur',
            validator: (_rules, value, cb) => {
              if (!needValidateAll.value) {
                cb();
                return;
              }
              if (isEmpty(value) && typeof value !== 'number') {
                cb('月畅销款数不能为空');
              } else {
                cb();
              }
            },
          },
        ] as FormItemRule[],
      };
    });
    const shopNameRules = (platformIndex: number, shopIndex: number) => [
      {
        required: true,
        trigger: 'blur',
        validator: (_rules: any, _value: any, cb: any) => {
          if (!needValidateAll.value) {
            cb();
            return;
          }
          const curPlatformRow = props.data[platformIndex];
          const shopName = curPlatformRow!.shopInfoList[shopIndex]!.shopName!;
          if (isEmpty(shopName)) {
            cb('店铺名称不能为空');
          } else if (curPlatformRow.shopInfoList.filter(v => v.shopName === shopName).length > 1) {
            cb('店铺名称不能重复');
          } else {
            cb();
          }
        },
      },
    ] as FormItemRule[];
    const priceRules = (platformIndex: number, shopIndex: number) => [
      {
        required: true,
        trigger: 'blur',
        validator: (_rules: any, _value: any, cb: any) => {
          if (!needValidateAll.value) {
            cb();
            return;
          }
          const curPlatformRow = props.data[platformIndex];
          const priceMin = curPlatformRow!.shopInfoList[shopIndex]!.priceMin!;
          const priceMax = curPlatformRow!.shopInfoList[shopIndex]!.priceMax!;
          if (
            (priceMin === '' || priceMin === null || priceMin === undefined)
            || (priceMax === '' || priceMax === null || priceMax === undefined)
          ) {
            cb('售价区间不能为空');
          } else {
            cb();
          }
        },
      },
    ] as FormItemRule[];
    // 触发表单校验
    const validate = async () => {
      try {
        const { data } = props;
        if (data.length === 0) {
          ElMessage.error('运营信息不能为空');
          throw new Error('运营信息不能为空');
        }
        needValidateAll.value = true;
        await nextTick();
        // 第一个不通过校验规则的平台索引
        let index = -1;
        // 遍历所有数据 找出第一个不符合校验规则的平台索引
        props.data.some((v, i) => {
          return v.shopInfoList.some((it, itIndex) => {
            let flag = false;
            rules.value.mainCategory[0].validator?.({}, it.mainCategory, (errMsg) => {
              if (errMsg) {
                flag = true;
                index = i;
              }
            }, {}, {});
            rules.value.monthSellWell[0].validator?.({}, it.monthSellWell, (errMsg) => {
              if (errMsg) {
                flag = true;
                index = i;
              }
            }, {}, {});
            priceRules(i, itIndex)[0].validator?.({}, it.shopName, (errMsg) => {
              if (errMsg) {
                flag = true;
                index = i;
              }
            }, {}, {});
            shopNameRules(i, itIndex)[0].validator?.({}, it.shopName, (errMsg) => {
              if (errMsg) {
                flag = true;
                index = i;
              }
            }, {}, {});
            return flag;
          });
        });
        // 存在未通过校验的数据 切换到对应的tab 并且触发form表单验证
        if (index !== -1) {
          curPlatform.value = props.data[index].ecommercePlatformType!;
          await nextTick();
          await formEl.value?.validate();
        }
      } catch (error: any) {
        throw Error(error);
      } finally {
        setTimeout(() => {
          needValidateAll.value = false;
        }, 100);
      }
    };
    return {
      handleDeleteShop,
      Warning,
      curPlatformIndex,
      priceRules,
      shopNameRules,
      rules,
      formEl,
      handleRemovePlatform,
      handleAddShop,
      unSelectedPlatform,
      curPlatformData,
      tabs,
      curPlatform,
      handleAddPlatform,
      CRM_CLUE_PLATFORM_OPTIONS,
      PIMS_CATEGORY_OPTIONS,
      platformModalVisible,
      handlePlatformModalConfirm,
      validate,
    };
  },
});
</script>
<style lang="scss" scoped>
.operate_layout{
  display: flex;
  border: 1px solid #eee;
  // padding: 10px;
  .tab{
    position: relative;
    width: 100px;
    height: 100%;
    padding: 10px 0 10px 20px;
    box-sizing: border-box;
    &::before{
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      border-right: 1px solid #eee;
    }
    .add_platform{
      margin-top: 10px;
      margin-left: 5px;
      font-size: 16px;
      &:hover{
        color: var(--el-color-primary);
      }
    }
    // :deep(.el-scrollbar__view){
    //   height: 100%;
    // }
  }
  .content{
    flex: 1;
    padding: 10px;
    padding-right: 0;
    .table_item {
      padding: 20px;
      border-bottom: 1px solid #eee;
    }
    .create{
      display: flex;
      justify-content: flex-end;
      padding: 10px 20px;
    }
  }
  &.empty{
    display:flex;
    justify-content: center;
    align-items: center;
    height: 420px;
  }
}
</style>
