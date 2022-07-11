<script lang="tsx">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  render() {
    const { icon, title } = this;

    return [
      icon ? <i class={`${icon} menu_icon icon`} /> : null,
      title ? <span>{title}</span> : null,
    ].filter(Boolean);
  },
});
</script>
<style lang="scss" scoped>
.icon{
  font-size: 16px;
  padding-right: 12px;
}
</style>
