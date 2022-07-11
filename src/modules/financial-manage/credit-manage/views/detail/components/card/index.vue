<template>
  <div class="card">
    <div class="card_title">
      {{title}}
      <i class="card_dot" :style="{backgroundColor: color}" />
    </div>
    <div class="card_num">{{toThousands(value)}}</div>
  </div>
</template>

<script lang="tsx">
import { defineComponent } from 'vue';
import { toThousands } from '@tiangong/utils';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#FF7A06',
    },
  },
  setup() {
    return {
      toThousands,
    };
  },
});
</script>

<style scoped lang="scss">
.card {
  min-width: 320px;
  padding: 20px 30px;
  border: 1px solid #E1E4ED;
  border-radius: 2px;
  margin-right: 20px;

  &_title {
    position: relative;
    margin-bottom: 20px;
  }

  &_dot {
    position: absolute;
    left: -16px;
    top: 50%;
    width: 8px;
    height: 8px;
    border-radius: 100%;
    transform: translateY(-50%);
  }

  &_num {
    height: 36px;
    line-height: 36px;
    font-size: 32px;
    font-weight: bold;
  }
}
</style>
