<template>
  <span @click="handleScreenfullChange">
    <el-icon
      class="font-size-20"
    >
      <full-screen></full-screen>
    </el-icon>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { FullScreen } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'Fullscreen',
  components: {
    FullScreen,
  },
  props: {
    // unusable message
    unusableMsg: {
      type: String,
      default: 'you browser can not work',
    },
  },
  setup(props) {
    const handleScreenfullChange = () => {
      if (!screenfull.isEnabled) {
        ElMessage.warning(props.unusableMsg);
        return;
      }
      screenfull.toggle();
    };

    return {
      handleScreenfullChange,
    };
  },
});
</script>
<style scoped>
.icon{
    color: #606166;
}
</style>
