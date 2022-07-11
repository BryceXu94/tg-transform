<script lang="tsx">
import { defineComponent, SetupContext, PropType } from 'vue';
import { ElRow, ElCol } from 'element-plus';

interface RowConfig {
  props?: InstanceType<typeof ElRow>;
  [key: string]: any;
}

interface ColConfig {
  props?: InstanceType<typeof ElCol> | null;
  [key: string]: any;
}

export default defineComponent({
  name: 'ResponsiveRow',
  props: {
    row: {
      type: Object as PropType<RowConfig>,
    },
    col: {
      type: Object as PropType<ColConfig>,
    },
  },
  setup(props, { slots }: SetupContext) {
    return () => {
      const { col = {}, row } = props;
      const childList = (slots.default && slots.default()) || [];

      // 默认参数
      const defaultColProps = { xs: 24, sm: 12, md: 8, lg: 8, xl: 6 } as InstanceType<typeof ElCol>;

      type TChild = typeof childList;

      const colChildList = [] as TChild;
      const getColChild = (_childList: TChild) => {
        if (Array.isArray(_childList)) {
          _childList?.forEach((child) => {
            // 优先级：默认 < 父组件col < 子组件col
            const childCol = {
              ...defaultColProps,
              ...col,
              ...child.props?.col || {},
            };
            const _type = child?.type as any;
            if (_type?.name === 'ElCol') {
              colChildList.push(child);
              return;
            }
            /**
             * 有children还是要处理
             */
            if (!_type?.name && !Array.isArray(child?.children)) {
              /**
               * _type在生产模式下，v-if的类型为 Symbol()
               * ps：若想控制显隐暂时先使用v-if，不建议使用v-show
               *    因为在dirs（数组）中没有能判断具体指令名称的属性
               */
              const vNodeType = Object(_type).toString();
              if (vNodeType === 'Symbol(Comment)' || vNodeType === 'Symbol()') {
                return;
              }
            }
            if (child?.children?.length) {
              getColChild(child.children as TChild);
              return;
            }
            colChildList.push(
              (<el-col {...childCol}>
                {child}
              </el-col>),
            );
          });
        }
      };
      getColChild(childList);
      return (
        <el-row {...(row || {})}>
          {
            colChildList
          }
        </el-row>
      );
    };
  },
});
</script>
