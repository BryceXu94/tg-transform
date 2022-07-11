<template>
  <template v-if="current">
    <div
      v-if="mode === 'label'"
      :style="{
        color: colorMap[current.color],
      }"
      v-bind="$attrs"
    >{{current?.label}}</div>
    <el-tag
      v-else-if="mode === 'tag'"
      :type="current.color"
      v-bind="$attrs"
    >{{current?.label}}</el-tag>
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { GLOBAL_COLOR_TYPE_ENUM } from '@/constant/global';

export default defineComponent({
  name: 'StatusLabel',
  props: {
    mode: {
      type: String as PropType<'label'|'tag'>,
      default: 'label',
    },
    value: {
      type: String,
      default: '',
    },
    options: {
      type: Object as PropType<{ label: string; value: string; color: GLOBAL_COLOR_TYPE_ENUM; }[]>,
      default: () => ({}),
    },
  },
  setup(props) {
    const colorMap = {
      [GLOBAL_COLOR_TYPE_ENUM.PRIMARY]: 'var(--el-color-primary)',
      [GLOBAL_COLOR_TYPE_ENUM.ERROR]: 'var(--el-color-error)',
      [GLOBAL_COLOR_TYPE_ENUM.WARNING]: 'var(--el-color-warning)',
      [GLOBAL_COLOR_TYPE_ENUM.SUCCESS]: 'var(--el-color-success)',
    };
    const current = computed(() => {
      const { value, options } = props;
      return options.find(v => v.value === value);
    });
    return {
      colorMap,
      current,
    };
  },
});
</script>
