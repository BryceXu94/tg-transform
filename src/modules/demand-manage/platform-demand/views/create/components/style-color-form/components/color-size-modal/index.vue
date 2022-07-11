<script lang="tsx">
import { computed, defineComponent, PropType, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { ISizeStandard, IColorModalDate } from './type';

export default defineComponent({
  emits: ['update:visible', 'confirm'],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    styleColor: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    sizeStandard: {
      type: Array as PropType<ISizeStandard[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const formData = reactive<IColorModalDate>({
      styleColor: [],
      sizeStandard: [],
    });
    const handleClose = () => {
      emit('update:visible', false);
    };
    const handleConfirm = async () => {
      try {
        let { styleColor } = formData;
        styleColor = [...new Set(styleColor.map(color => color.trim().slice(0, 10)))];
        formData.styleColor = styleColor;
        if ([...new Set([...styleColor, ...props.styleColor])].length < (props.styleColor.length + styleColor.length)) {
          ElMessage.warning('款号颜色重复');
          return;
        }
        emit('confirm', formData);
        handleClose();
      } catch (error) {
        console.log(error);
      }
    };
    const handleOpen = async () => {
      formData.styleColor = [];
    };

    const disabledConfirmBtn = computed(() => !(formData.styleColor.length && formData.sizeStandard.length));

    return {
      formData,
      handleOpen,
      handleClose,
      handleConfirm,
      disabledConfirmBtn,
    };
  },
  render() {
    return (
      <el-dialog
        title="请选择尺码颜色"
        modelValue={this.visible}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        close-on-click-modal={false}
        width="456px"
        v-slots={{
          footer: () => (
            <el-row type="flex" justify="end">
              <el-button
                type="primary"
                onClick={this.handleConfirm}
                disabled={this.disabledConfirmBtn}
              >确定</el-button>
              <el-button onClick={this.handleClose}>关闭</el-button>
            </el-row>
          ),
        }}
      >
        <el-form
          model={this.formData}
          label-width="100px"
        >
          <el-form-item
            label="款号颜色："
            prop="styleColor"
          >
            <el-select
              v-model={this.formData.styleColor}
              multiple
              filterable
              allow-create
              default-first-option
              reserve-keyword={false}
              placeholder="请输入"
              style="width: 100%"
            >
              <el-option
                label="请输入颜色，多个颜色时输入Enter键重复添加"
                disabled
                value
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="尺码标准："
            prop="sizeStandard"
          >
            <el-checkbox-group v-model={this.formData.sizeStandard} key={this.sizeStandard}>
              {this.sizeStandard.map(size => (
                <el-checkbox label={size.value} checked={size.checked}>{size.value}</el-checkbox>
              ))}
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-dialog>
    );
  },
});
</script>
