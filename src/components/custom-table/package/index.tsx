import { onUpdated, defineComponent, PropType, ref, watch, nextTick } from 'vue';
import { IProps } from './type.d';
import Sortable from 'sortablejs';
import { ElTable, ElForm } from 'element-plus';
import styles from './style.module.scss';
import { Rank } from '@element-plus/icons-vue';

/**
 * 公共表格组件
 */
export default defineComponent({
  name: 'CustomTable',
  components: {
    Rank,
  },
  props: {
    data: {
      type: Array as PropType<IProps['data']>,
      required: true,
      default: () => [],
    },
    columns: {
      type: Array as PropType<IProps['columns']>,
      required: true,
      default: () => [],
    },
    canDrag: {
      type: Boolean,
      default: false,
    },
    isForm: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const currentKey = ref(0);
    const tableEl = ref<InstanceType<typeof ElTable> | null>(null);
    const elFormRef = ref<InstanceType<typeof ElForm> | null>(null);

    const init = () => {
      if (!props.canDrag) return;
      const el = tableEl.value?.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
      Sortable.create(el, {
        // sort: false,
        handle: `.${styles?.dragTarget}`,
        forceFallback: true,
        animation: 150,
        ghostClass: `${styles?.active}`,
        dragClass: `${styles?.active}`,
        selectedClass: `${styles?.active}`,
        // 拖拽结束执行,evt执向拖拽的参数
        onEnd: async (evt) => {
          // 判断是否重新排序
          if (evt.oldIndex !== evt.newIndex) {
            const { data } = props;
            const row = data.splice(evt.oldIndex!, 1)[0];
            data.splice(evt.newIndex!, 0, row);
            currentKey.value += 1;
            setTimeout(async () => {
              const els: HTMLElement[] = tableEl.value?.$el.querySelectorAll(
                '.el-table__body-wrapper > table > tbody > tr',
              );
              els.forEach((v) => {
                v.setAttribute('draggable', 'true');
              });
              // init();
            });
          }
        },
      });
    };

    const handleSelectionChange = (selectedList: any[]) => {
      emit('selectionChange', selectedList);
    };

    watch(
      [() => props.columns, () => props.canDrag],
      ([columns, canDrag], [oldColumns, oldCanDrag]) => {
        if (canDrag !== oldCanDrag) {
          currentKey.value += 1;
          return;
        }
        if (canDrag && (!oldColumns || columns.length !== oldColumns.length)) {
          currentKey.value += 1;
        }
      },
      {
        immediate: true,
      },
    );
    watch(
      () => props.data,
      () => {
        if (props.canDrag) {
          currentKey.value += 1;
        }
      },
      {
        immediate: true,
      },
    );
    onUpdated(async () => {
      if (props.canDrag) {
        await nextTick();
        init();
      }
    });

    // form检验
    const handleValidate = () => {
      return elFormRef.value?.validate();
    };

    // form重置
    const handleResetFields = () => {
      elFormRef.value?.resetFields();
    };
    return {
      tableEl,
      currentKey,
      elFormRef,
      handleSelectionChange,
      handleValidate,
      handleResetFields,
    };
  },
  render() {
    const renderTableItem = (column: IProps['columns'][0]) => {
      const renderFun = column.render;
      const key = column.prop;
      if (renderFun) {
        return {
          default: ({ row, $index }: any) => {
            if ($index === -1) return null;
            return renderFun(row, $index);
          },
          header: column.renderHeader,
        };
      }
      if (key) {
        return {
          default: ({ row }: any) => row[key],
          header: column.renderHeader,
        };
      }
      return undefined;
    };
    const Table = () => {
      return (
        <div>
          <el-table
            ref="tableEl"
            stripe
            border={true}
            {...this.$attrs}
            key={this.currentKey}
            data={this.data}
            onSelectionChange={this.handleSelectionChange}
          >
            {this.canDrag && (
              <el-table-column
                width="60px"
                align="center"
                v-slots={{
                  default: () => (
                    <el-icon
                      class={styles.dragTarget}
                      title="按住拖拽"
                    >
                      <rank/>
                    </el-icon>
                  ),
                }}
              />
            )}
            {this.columns.map(v => (
              <el-table-column
                key={v.label}
                type={v.type}
                label={v.label}
                width={v.width}
                minWidth={v.minWidth}
                labelClassName={v.labelClassName}
                fixed={v.fixed}
                align={v.align}
                show-overflow-tooltip={v.ellipsis}
                // renderHeader={v.renderHeader}
                v-slots={renderTableItem(v)}
                selectable={
                  v.selectable ? (row: any, index: number) => v.selectable(row, index) : null
                }
                prop={v.prop}
              >
              </el-table-column>
            ))}
          </el-table>
        </div>
      );
    };
    return (
      this.isForm ? (
        <el-form
          ref="elFormRef"
          model={
            { data: this.data }
          }
        >{Table()}</el-form>
      ) : Table()
    );
  },
});
