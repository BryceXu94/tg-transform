<!--
 * @Descripttion: 字典表select
 * @Author: weitongxue
-->
<template>
  <el-select
    :modelValue="modelValue"
    :placeholder="placeholder"
    :readonly="readonly"
    :disabled="disabled"
    :clearable="clearable"
    :multiple="multiple"
    class="select-width"
    @change="handleSelect"
    v-bind="$attrs"
  >
    <el-option
      v-for="item in JOB_OPTIONS"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="disabledList.includes(item.value) || item.disabled"
    >
    </el-option>
  </el-select>
</template>
<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { useDictionary } from '@/hooks/use-dictionary';

export default defineComponent({
  emits: ['update:modelValue', 'change'],
  props: {
    modelValue: {
      type: [String, Array],
      default: '',
      required: true,
    },
    dictionary: {
      type: String,
      default: '',
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    disabledOption: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const { getDictionaryOptions } = useDictionary();
    // 选项
    const JOB_OPTIONS = computed(() => getDictionaryOptions(props.dictionary, props.level));

    const handleSelect = (val: string) => {
      const item = JOB_OPTIONS.value.find(v => v.value === val);
      emit('update:modelValue', val);
      emit('change', val, item);
    };

    const disabledList = computed(() => props.disabledOption);

    return {
      JOB_OPTIONS,
      disabledList,

      handleSelect,
    };
  },
});
</script>
