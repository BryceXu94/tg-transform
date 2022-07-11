<template>
  <div>
    <condition-select
      v-for="(item, index) in conditions"
      :key="index"
      :conditionInfo="item"
      :modelValue="modelValue[item.key]"
      @conditionChange="(val) => handleChangeCondition(val, item.key)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IConditionsItem } from './types';

export default defineComponent({
  name: 'ConditionSelectArea',
  emits: ['update:modelValue', 'conditionChange'],
  props: {
    conditions: {
      type: Array as PropType<IConditionsItem[]>,
      default: () => ([]),
    },
    modelValue: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    return {
      handleChangeCondition(val: string | number, key: string) {
        emit('update:modelValue', {
          ...props.modelValue,
          [key]: val,
        });
        emit('conditionChange', val);
      },
    };
  },
});
</script>
