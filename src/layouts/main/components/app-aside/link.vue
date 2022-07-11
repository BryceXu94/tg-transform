<script lang="tsx">
import { defineComponent } from 'vue';
import { isExternal } from '@tiangong/utils';
import router from '@/router';
import { RouteLocationRaw } from 'vue-router';

export default defineComponent({
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  render() {
    const _isExternal = isExternal(this.to);
    if (_isExternal) {
      return (
        <a href={this.to} target="_blank" rel="noopener">
          { this.$slots.default && this.$slots.default() }
        </a>
      );
    }
    const has = router.hasRoute(this.to);
    const to:RouteLocationRaw = has ? { name: this.to } : this.to;
    return (
      <router-link to={to}>
        { this.$slots.default && this.$slots.default() }
      </router-link>
    );
  },
});
</script>
