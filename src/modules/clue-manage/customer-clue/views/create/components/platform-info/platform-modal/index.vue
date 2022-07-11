<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { IDictionaryItem } from '@/hooks/use-dictionary/types';

export default defineComponent({
  emits: ['update:visible', 'confirm'],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array as PropType<IDictionaryItem[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const selectedKeys = ref<string[]>([]);
    const handleClose = () => {
      emit('update:visible', false);
    };
    const handleConfirm = async () => {
      try {
        if (selectedKeys.value.length === 0) {
          ElMessage.error('请至少选择一个电商平台');
          return;
        }
        emit('confirm', selectedKeys.value);
        handleClose();
      } catch (error) {
        console.log(error);
      }
    };
    const handleOpen = async () => {
      selectedKeys.value = [];
    };
    return {
      handleOpen,
      selectedKeys,
      handleClose,
      handleConfirm,
    };
  },
  render() {
    return (
      <el-dialog
        title="请选择新增电商平台"
        modelValue={this.visible}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        close-on-click-modal={false}
        width="364px"
        v-slots={{
          footer: () => (
            <el-row type="flex" justify="end">
              <el-button onClick={this.handleClose}>取消</el-button>
              <el-button type="primary" onClick={this.handleConfirm}>确定</el-button>
            </el-row>
          ),
        }}
      >
        <el-checkbox-group v-model={this.selectedKeys}>
          {this.options.map(v => (
            <el-checkbox label={v.value}>{v.label}</el-checkbox>
          ))}
        </el-checkbox-group>
      </el-dialog>
    );
  },
});
</script>
