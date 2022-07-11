<template>
  <el-dialog
    :modelValue="visible"
    @close="handleClose"
    :close-on-click-modal="false"
    title="新增尺码"
    custom-class="el-dialog-inner-scroll"
    width="400px"
  >
    <responsive-row :col="{ xs: 8, sm: 8, md: 8, lg: 8, xl: 8 }" style="margin-bottom: -10px">
      <el-button
        :disabled="info.disabled"
        round
        v-for="(info, index) in sizeStandardInfo"
        :key="index"
        style="min-width: 80px;"
        class="margin-bottom-10"
        :type="info.disabled ? 'info' : info.actived ? 'primary' : ''"
        @click="info.actived = !info.actived"
      >{{ info.size }}</el-button>
    </responsive-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="handleConfirm"
          type="primary"
          :disabled="disabledConfirmBtn"
        >确定</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  defineEmits,
  defineProps,
  withDefaults,
  computed,
} from 'vue';

import { IChoosedSizeInfo } from './types';
import { ISizeStandard } from '../color-size-modal/type';

interface IConfig {
  params: {
    sizeList: string[];
    sizeStandard: ISizeStandard[];
    onSuccess: (choosedSizeInfo: IChoosedSizeInfo[]) => void;
  };
}

const emits = defineEmits(['destroy']);
const props = withDefaults(defineProps<IConfig>(), {});

const sizeStandardInfo = reactive(props.params.sizeStandard.map((size) => {
  return {
    size: size.value,
    disabled: props.params.sizeList.indexOf(size.value) !== -1,
    actived: false,
  };
}));

const disabledConfirmBtn = computed(() => sizeStandardInfo.every(item => !item.actived));

const visible = ref(true);

const handleClose = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

const handleConfirm = () => {
  if (props.params.onSuccess) {
    const choosedSizeInfo: IChoosedSizeInfo[] = [];
    sizeStandardInfo.forEach((item, index) => {
      if (item.actived) {
        choosedSizeInfo.push({
          index,
          size: item.size,
        });
      }
    });
    props.params.onSuccess(choosedSizeInfo);
  }
  handleClose();
};

</script>

<style lang="scss" scoped>

</style>
