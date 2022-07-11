import { defineComponent } from 'vue';
import { tgoTableProps, TgoTableProps, ITableColumnsItem } from './type';
import xss from 'xss';
import { formatTime } from '@tiangong/utils';

export default defineComponent({
  name: 'TgoTable',
  props: tgoTableProps,
  setup() {
    const itemDefaultRender = (
      row: any,
      column: TgoTableProps['columns'][0],
    ) => {
      const { type, format = 'YYYY-MM-DD', prop, options = [] } = column;
      if (!prop) return null;
      let text = row[prop];
      switch (type) {
        case 'date':
          text = formatTime(text, format);
          break;
        case 'enum':
          text = (
            <status-label
              options={options}
              value={text}
            />
          );
          break;
        default:
          break;
      }
      if (column.ellipsis) {
        text = xss(text);
      }
      return text;
    };
    return {
      itemDefaultRender,
    };
  },
  render() {
    const renderColumn = (columns: ITableColumnsItem<any>[]) => columns.filter(v => v.hidden !== true)
      .map((v) => {
        const {
          label = '',
          ellipsis = false,
          children = [],
          renderHeader,
          render,
          prop,
          type,
          // eslint-disable-next-line no-restricted-syntax
          ...rest
        } = v;
        return (
          <el-table-column
            {...rest}
            label={label}
            type={type}
            key={JSON.stringify(v)}
            prop={prop}
            show-overflow-tooltip={ellipsis}
            v-slots={{
              default: v.type && ['selection', 'index'].includes(v.type) ? (
                undefined
              ) : ({ row, $index, column }: any) => {
                if (children.length === 0 && $index === -1) {
                  return null;
                }
                return children.length > 0 ? (
                  <>{renderColumn(children)}</>
                ) : (
                  <>
                    {render ? (
                      render(row, column, $index)
                    ) : (
                      <>
                        {prop ? (
                          <>
                            {type === 'image' ? (
                              <el-image
                                src={row[prop]}
                                preview-src-list={[row[prop]]}
                                width={80}
                                height={80}
                                fit="cover"
                              />
                            ) : (
                              this.itemDefaultRender(row, v)
                            )}
                          </>
                        ) : undefined}
                      </>
                    )}
                  </>
                );
              },
              header: ({ $index, column }: any) => (
                <>{renderHeader ? renderHeader(column, $index) : label}</>
              ),
            }}
          />
        );
      });
    return (
      <el-table
        border
        {...this.$attrs}
        data={this.data}
        v-slots={{
          empty: this.$slots.empty,
        }}
      >
        {renderColumn(this.columns)}
      </el-table>
    );
  },
});
