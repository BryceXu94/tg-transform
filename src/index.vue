<template>
  <!-- 过筛选 -->
  <div class="condition-select">
    <div class="condition-select-title" v-if="conditionInfo.title">
      {{ conditionInfo.title }}
    </div>

    <div class="condition-select-content">
      <span
        v-for="(tag, idx) in conditionInfo.conditionList"
        :key="idx"
        @click="handleChangeCondition(tag.value)"
        :class="{
          actived: modelValue === tag.value,
        }"
        class="filter-tag"
        >{{ tag.label }}</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { IConditionInfo } from "./types";

export default defineComponent({
  name: "ConditionSelect",
  props: {
    conditionInfo: {
      type: Object as PropType<IConditionInfo>,
      default: () => ({}),
    },

    modelValue: {
      type: [String, Number],
    },
  },

  setup(props, { emit }) {
    return {
      handleChangeCondition(val: string | number) {
        emit("update:modelValue", val);
        emit("conditionChange", val);
      },
    };
  },
});
</script>

<style lang="scss" scoped>
/* 搜索过滤 */
.condition-select {
  display: flex;
  line-height: 26px;

  &-title {
    text-align: left;
    margin: 2px 5px 2px 0;
  }

  &-content {
    flex: 1;
  }

  .filter-tag {
    display: inline-block;
    opacity: 0.8;
    font-size: $font-size-caption-sm;
    height: 26px;
    padding: 0 8px;
    border-radius: 3px;
    cursor: pointer;
    transform: all 2s;
    margin-right: 5px;
    margin-top: 2px;
    margin-bottom: 2px;

    &.actived {
      background: #4974f5;
      color: $color-text-base-inverse;
      opacity: 1;
    }
  }
}
</style>
