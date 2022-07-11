<template>
  <div class="operate_layout" v-if="activeColor">
    <div class="tab">
      <el-scrollbar height="200px">
        <tabs
          :config="tabConfig"
          mode="vertical"
          v-model="activeColor"
          :border="false"
          :clearable="true"
          @remove="handleRemoveStyleColor"
        />
        <el-tooltip content="新增款号颜色">
          <el-icon
            class="add_color"
            @click="handleAddStyleColor"
          ><circle-plus /></el-icon>
        </el-tooltip>
      </el-scrollbar>
    </div>
    <div
      class="content"
      :key="activeColor"
    >
      <el-form
        ref="formEl"
        :model="formData"
      >
        <el-form-item
          label="合同报价"
          prop="expectPrice"
          label-width="100px"
          :rules="rules.expectPrice"
          :show-message="false"
        >
          <input-number
            v-model="formData.expectPrice"
            :precision="2"
            :min="0.01"
            :max="999.99"
            style="width: 240px"
          >
            <template #append>元</template>
          </input-number>
        </el-form-item>
        <div
          class="margin-left-20"
        >
          <tgo-table
            :data="[{}]"
            :columns="tableColumns"
            class="size_table"
          />
        </div>
      </el-form>
    </div>
  </div>
  <div class="operate_layout empty" v-else>
    <empty description="款号颜色为空">
      <el-button
        type="primary"
        @click="handleAddStyleColor"
      >新增款号颜色</el-button>
    </empty>
  </div>
  <el-row justify="end" class="total">
    <div class="margin-right-20">订单总数量 <span class="color-primary">{{totalNumber}}</span>（件）</div>
    <div>预计成交额 <span class="color-primary">{{totalAmount}}</span>（元）</div>
  </el-row>
  <color-size-modal
    v-model:visible="colorModalVisible"
    :styleColor="styleColor"
    :sizeStandard="sizeStandard"
    @confirm="handleColorModalConfirm"
  />
</template>

<script lang="tsx">
import { defineComponent, PropType, ref, computed, watchEffect, nextTick } from 'vue';
import { FormItemRule, ElForm, ElMessage } from 'element-plus';
import { CirclePlus } from '@element-plus/icons-vue';
import { useTableColumns } from './use-table-columns';
import { handleOpenDialog } from '@/hooks/use-dialog';
import AddSizeMadal from './components/add-size-madal/index.vue';
import ColorSizeModal from './components/color-size-modal/index.vue';
import {
  IDemandSaveSkcListItem,
} from '@/modules/demand-manage/platform-demand/api/types';
import { IChoosedSizeInfo } from './components/add-size-madal/types';
import { ISizeStandard, IColorModalDate } from './components/color-size-modal/type';
import {
  DEMAND_TYPE_ENUM,
} from '@/modules/demand-manage/platform-demand/constant';
import NP from 'number-precision';

export default defineComponent({
  components: {
    CirclePlus,
    ColorSizeModal,
  },
  props: {
    skcList: {
      type: Array as PropType<IDemandSaveSkcListItem[]>,
      default: () => [],
      required: true,
    },
    sizeStandard: {
      type: Array as PropType<ISizeStandard[]>,
      default: () => [],
      required: true,
    },
    styleType: {
      type: String as PropType<DEMAND_TYPE_ENUM>,
      required: true,
    },
  },
  emits: ['update:skcList'],
  setup(props, { emit }) {
    const formEl = ref<InstanceType<typeof ElForm> | null>(null);

    const activeColor = ref('');
    const totalNumber = ref(0);
    const totalAmount = ref(0);
    watchEffect(() => {
      const { skcList } = props;
      if (skcList.length) {
        if (!skcList.find(item => item.color === activeColor.value)) {
          activeColor.value = skcList[0].color;
        }
      } else {
        activeColor.value = '';
      }

      totalNumber.value = 0;
      totalAmount.value = 0;
      for (let i = 0, { length: iL } = skcList; i < iL; i++) {
        const { expectPrice, skuList } = skcList[i];
        for (let j = 0, { length: jL } = skuList; j < jL; j++) {
          const { quantity } = skuList[j];
          totalNumber.value = NP.plus(totalNumber.value, quantity);
          totalAmount.value = NP.plus(totalAmount.value, NP.times(expectPrice, quantity));
        }
      }
    });

    const styleColor = computed(() => {
      return props.skcList.map(item => item.color);
    });

    const tabConfig = computed(() => {
      return props.skcList.map(item => ({
        label: item.color,
        value: item.color,
      }));
    });

    const formData = computed(() => {
      return props.skcList.find(skc => skc.color === activeColor.value) || {} as IDemandSaveSkcListItem;
    });

    const sizeList = computed(() => {
      return formData.value!.skuList.map(sku => sku.size);
    });

    const handleAddSize = () => {
      handleOpenDialog(AddSizeMadal, {
        params: {
          sizeList: sizeList.value,
          sizeStandard: props.sizeStandard,
          onSuccess(choosedSizeInfo: IChoosedSizeInfo[]) {
            const { skuList } = formData.value;
            skuList.push(
              ...choosedSizeInfo.map((item) => {
                return {
                  color: activeColor.value,
                  size: item.size,
                  quantity: '',
                  _index: item.index,
                };
              }),
            );
            skuList.sort((previous, next) => {
              return (previous._index as number) - (next._index as number);
            });
          },
        },
      });
    };

    const handleDelSize = (index: number) => {
      const { skuList } = formData.value;
      if (skuList.length > 1) {
        formData.value.skuList.splice(index, 1);
      } else {
        ElMessage.warning('请至少保留一个尺码');
      }
    };

    const handleFillQuantity = () => {
      const { skuList } = formData.value;
      const fillQuantityItem = skuList.find((item => item.quantity));
      if (fillQuantityItem) {
        skuList.forEach((sku) => {
          if (!sku.quantity) {
            sku.quantity = fillQuantityItem.quantity;
          }
        });
      } else {
        ElMessage.warning('请至少输入一个需求件数');
      }
    };

    const colorModalVisible = ref(false);
    const handleAddStyleColor = () => {
      if (props.sizeStandard.length) {
        colorModalVisible.value = true;
      } else {
        ElMessage.warning(`请选择${['', '码数标准', '款号SPU'][props.styleType]}`);
      }
    };

    const handleColorModalConfirm = (data: IColorModalDate) => {
      emit('update:skcList', props.skcList.concat(
        data.styleColor.map(color => ({
          color,
          expectPrice: '',
          skuList: props.sizeStandard.map((size, index) => {
            return {
              color,
              size: size.value,
              quantity: '',
              _index: index,
            };
          }).filter(item => data.sizeStandard.includes(item.size)),
        })),
      ));
      nextTick(() => {
        [activeColor.value] = data.styleColor;
      });
    };

    const handleRemoveStyleColor = (color: string) => {
      const { skcList } = props;
      const list = [...skcList];
      if (list.length > 1) {
        list.splice(list.findIndex(item => item.color === color), 1);
        emit('update:skcList', list);
      } else {
        ElMessage.warning('请至少保留一个款号颜色');
      }
    };

    const rules = computed(() => {
      return {
        expectPrice: [
          {
            trigger: 'blur',
            required: true,
            validator: (_rules, value, cb) => {
              if (!value) {
                cb('合同报价不能为空');
              } else {
                cb();
              }
            },
          },
        ] as FormItemRule[],
        quantity: [
          {
            trigger: ['blur'],
            validator: (_rules, value, cb) => {
              if (!value) {
                cb('请输入...');
              } else {
                cb();
              }
            },
          },
        ] as FormItemRule[],
      };
    });

    const disabledAddSize = computed(() => {
      return props?.sizeStandard.length === formData.value?.skuList.length;
    });
    const { tableColumns } = useTableColumns(
      formData,
      disabledAddSize,
      rules,
      handleDelSize,
      handleAddSize,
      handleFillQuantity,
    );

    const validate = async () => {
      try {
        const { skcList } = props;
        if (skcList.length === 0) {
          ElMessage.error('款号颜色不能为空');
          throw new Error('款号颜色不能为空');
        }
        let index = -1;
        // 遍历所有数据 找出第一个不符合校验规则的款号颜色索引
        skcList.some((v, i) => {
          let flag = false;
          rules.value.expectPrice[0].validator?.({}, v.expectPrice, (errMsg) => {
            if (errMsg) {
              flag = true;
              index = i;
            }
          }, {}, {});
          return flag && v.skuList.some((it) => {
            rules.value.quantity[0].validator?.({}, it.quantity, (errMsg) => {
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
          activeColor.value = skcList[index].color;
          await nextTick();
          await formEl.value?.validate();
        }
      } catch (error: any) {
        throw Error(error);
      }
    };

    return {
      activeColor,
      totalNumber,
      totalAmount,
      tabConfig,
      formEl,
      tableColumns,
      formData,
      rules,
      validate,
      styleColor,
      colorModalVisible,
      handleAddStyleColor,
      handleColorModalConfirm,
      handleRemoveStyleColor,
    };
  },
});
</script>

<style scoped lang="scss">
.operate_layout{
  display: flex;
  border: 1px solid #eee;
  margin-left: 50px;
  margin-right: 150px;
  padding-top: 20px;
  .tab{
    position: relative;
    min-width: 100px;
    height: 100%;
    padding: 10px 0 10px 20px;
    box-sizing: border-box;
    flex-shrink: 0;
    &::before{
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      border-right: 1px solid #eee;
    }
    .add_color {
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
    overflow: hidden;
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
    height: 230px;
    padding: 0;
    :deep(.icon) {
      width: 80px;
      height: 80px;
    }
  }
}
.size_table {
  :deep(.el-form-item) {
    margin-bottom: 4px;
  }
}
.total {
  margin: 10px 150px 20px 0;
}
</style>
