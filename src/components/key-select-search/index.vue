<template>
  <el-input
    class="input-with-select"
    :placeholder="placeholder || '请输入'"
    v-model.trim="inputValue"
    clearable
  >
    <template #prepend>
      <el-select
        placeholder="请选择"
        v-model="keyValue"
      >
        <el-option
          v-for="item in keyList"
          :key="item[keyListConfig.valueName]"
          :label="item[keyListConfig.labelName]"
          :value="item[keyListConfig.valueName]"
        />
      </el-select>
    </template>
  </el-input>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, toRefs, watch, inject } from 'vue';

interface IKeyListConfig {
  labelName: string;
  valueName: string;
}

export default defineComponent({
  props: {
    // input框的v-model
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    // 左侧下拉options
    keyList: {
      type: Array as PropType<{
        [key: string]: IKeyListConfig['valueName'];
      }[]>,
      default: () => ([]),
    },
    // 左侧下拉options的配置
    keyListConfig: {
      type: Object as PropType<IKeyListConfig>,
      default: () => ({
        labelName: 'label',
        valueName: 'value',
      }),
    },
    placeholder: {
      type: String,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const { keyList, keyListConfig, modelValue } = toRefs(props);
    const inputValue = ref('');
    // 标记是否为searchMenu下使用的
    const isSearchMenu = inject('searchMenu');
    // 设置左侧下拉默认为第一项
    const keyValue = ref(keyList.value[0][keyListConfig.value.valueName]);
    watch([keyValue, inputValue], () => {
      // 先把全部字段置空
      keyList.value.forEach((item) => {
        modelValue.value[item[keyListConfig.value.valueName]] = '';
      });
      // 在searchMenu下使用的，派发change事件，外层再去修改modelValue
      // 页面中直接使用的，直接改变modelValue
      emit(isSearchMenu ? 'change' : 'update:modelValue', {
        ...modelValue.value,
        [keyValue.value]: inputValue.value,
      });
    });
    // 重置后select默认选中第一项，输入框清空
    const reset = () => {
      inputValue.value = '';
      keyValue.value = keyList.value[0][keyListConfig.value.valueName];
    };
    return {
      inputValue,
      keyValue,
      reset,
    };
  },
});
</script>

<style lang="scss" scoped>
  .input-with-select {
    .el-select .el-input {
      min-width: 90px;
    }
    .el-input-group__prepend {
      background-color: #fff;
    }
    :deep(.el-input__suffix) {
      margin-right: 10px;
    }
    :deep(.el-select){
      width: 100px !important;
      .select-trigger{
        .el-input
          .el-input__suffix {
            margin-right: 0 !important;
          }
      }
    }
  }
</style>
