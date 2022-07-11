<template>
  <div
    class="file_item"
  >
    <el-icon class="icon">
      <document></document>
    </el-icon>
    <div class="name">{{name || url}}</div>
    <div class="right">
      <el-icon
        class="icon"
        v-if="canDownload"
        @click.stop="handleDownload"
      >
        <download></download>
      </el-icon>
      <el-icon
        v-if="!disabled"
        class="icon"
        @click.stop="handleDelete"
      >
        <close></close>
      </el-icon>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Document, Close, Download } from '@element-plus/icons-vue';

export default defineComponent({
  components: {
    Document,
    Close,
    Download,
  },
  props: {
    name: {
      type: String,
    },
    url: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    canDownload: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'delete',
  ],
  setup(props, { emit }) {
    const handleDownload = () => {
      const { url, name } = props;
      if (url) {
        const req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.responseType = 'blob';
        req.onload = () => {
          const href = window.URL.createObjectURL(req.response);
          const a = document.createElement('a');
          a.href = href;
          a.download = name || url;
          a.click();
        };
        req.send();
      }
    };
    const handleDelete = () => {
      console.log('1231');

      emit('delete');
    };
    return {
      handleDownload,
      handleDelete,
    };
  },
});
</script>
<style lang="scss" scoped>
.file_item{
  display: flex;
  align-items: center;
  position: relative;
  height: 28px;
  padding: 0 50px 0 5px;
  border-radius: 4px;
  color: #666;
  transition: all 0.3s;
  &:hover{
    background-color: #f6f6f6;
  }
  .icon{
    font-size: 12px;
    cursor: pointer;
  }
  .name{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: $menu-text-active;
    padding-left: 8px;
    line-height: 18px;
    cursor: pointer;
    font-size: 14px;
  }
  .right{
    display: flex;
    align-items: center;
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    .icon {
      font-size: 16px;
      margin-left: 4px;
    }
    .icon :hover{
      color: $color-primary;
    }
  }
}
</style>
