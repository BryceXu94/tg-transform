<template>
  <div class="image_item">
    <el-image
      class="cover"
      fit="cover"
      :ref="handleSetImageRef"
      :src="src"
      :initial-index="initialIndex"
      :preview-src-list="previewSrcList"
      preview-teleported
    />
    <div class="mask">
      <el-icon
        class="icon"
        @click.stop="handlePreview"
      >
        <zoom-in></zoom-in>
      </el-icon>
      <el-icon
        class="icon"
        v-if="!disabled"
        @click.stop="handleDelete"
      >
        <delete></delete>
      </el-icon>
    </div>
    <div
      class="progress"
      v-if="!isEmpty(progress)"
    >
      <el-progress
        type="circle"
        :percentage="progress"
        :width="70"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { imageProps } from 'element-plus';
import { isEmpty } from '@tiangong/utils';
import { ImageEl } from './type';
import { Delete, ZoomIn } from '@element-plus/icons-vue';

export default defineComponent({
  components: {
    Delete,
    ZoomIn,
  },
  props: {
    ...imageProps,
    progress: {
      type: Number,
    },
    disabled: {
      type: Boolean,
    },
  },
  emits: [
    'setImageRef',
    'preview',
    'delete',
  ],
  setup(props, { emit }) {
    const handleSetImageRef = (el: ImageEl) => {
      emit('setImageRef', el);
    };
    const handlePreview = () => {
      emit('preview');
    };
    const handleDelete = () => {
      emit('delete');
    };
    return {
      handlePreview,
      isEmpty,
      handleSetImageRef,
      handleDelete,
    };
  },
});
</script>
<style lang="scss" scoped>
.image_item{
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 5px;
  margin-bottom: 5px;
  .cover{
    width: 100%;
    height: 100%;
  }
  .mask{
    display:flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.6);
    color: #fff;
    font-size: 16px;
    transition: all 0.3s;
    opacity: 0;
    .icon{
      cursor: pointer;
      margin-right: 10px;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  .progress{
    display:flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255,255,255,.6);
    color: #fff !important;
  }
  &:hover .mask{
    opacity: 1;
  }
  .error{
    display:flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #C0C4CC;
    background-color: #F5F7FA;
  }
  &.upload {
    display:flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border: 1px dashed #999;
    transition: all 0.3s;
    .icon{
      font-size: 24px;
      color: #999;
      transition: all 0.3s;
    }
    &:hover{
      border-color: $menu-text-active;
      .icon{
        color: $menu-text-active;
      }
    }
  }
}
</style>
