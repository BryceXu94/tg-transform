<!-- 详情页-标题 -->
<script lang="tsx">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DetailTitle',
  props: {
    title: {
      type: String,
      default: '',
    },
    tips: {
      type: String,
      default: '',
    },
    lineHeight: {
      type: Number,
      default: 32,
    },
  },

  render() {
    return (
      <div
        class="detail-title"
        style={{
          lineHeight: `${this.lineHeight}px`,
        }}
      >
        <div class="detail-title_left">
          {this.$props.title && <div class="title">
             <span class="title__item">{this.$props.title}</span>
          </div>}
          {this.$slots.status && <div class="margin-right-10">
            {this.$slots.status()}
          </div>}
          {this.tips && <span class="color-warning detail-title_tips">{this.tips}</span>}
        </div>
        {this.$slots.default && <div class="detail-title_right">
          {this.$slots.default()}
        </div>}
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.detail-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  &_left {
    display: flex;
    flex: 1 1 80%;
    font-weight: bold;
    .title {
      min-width: 110px;
      &__item {
        position: relative;
        padding-left: 10px;
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          width: 3px;
          height: 16px;
          background-color: var(--el-color-primary);
          transform: translateY(-50%);
        }
      }
    }
  }

  &_right {
    display: flex;
  }

  &_tips {
    padding-left: 10px;
    font-size: 12px;
  }
}
</style>
