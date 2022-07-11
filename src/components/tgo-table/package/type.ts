import { ElTableColumn } from 'element-plus';
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
import { PropType, ExtractPropTypes } from 'vue';

type IElTableColumn = InstanceType<typeof ElTableColumn>;
type IAttrs = Omit<IElTableColumn['$props'], 'renderHeader'>;
// 重新定义属性
// 生成props类型
export interface ITableColumnsItem<T> extends IAttrs {
  /** 对应element表格的prop字段 */
  prop?: string;
  /** 是否隐藏 */
  hidden?: boolean;
  /** 对应element表格的type字段 */
  type?: 'index' | 'selection' | 'expand' | 'date' | 'enum' | 'image';
  /** 日期格式化 */
  format?: string;
  /** 对应element表格的fixed字段 */
  fixed?: boolean | 'left' | 'right';
  /** 文本对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 是否隐藏溢出内容 值为true会启用xss过滤 */
  ellipsis?: boolean;
  /** 表头自定义渲染 */
  renderHeader?: (
    column: TableColumnCtx<any>,
    index: number
  ) => JSX.Element | null | string | number | JSX.Element[];
  /** 自定义渲染 */
  render?: (
    row: T,
    column: TableColumnCtx<any>,
    index: number
  ) => JSX.Element | null | string | number | JSX.Element[];
  options?: {
    label: string;
    value: string;
  }[];
  children?: ITableColumnsItem<T>[];
  selectable?: (row: T, index: number) => boolean;
}

export const tgoTableProps = Object.assign(
  {},
  {
    data: {
      type: Array as PropType<any[]>,
      required: true,
      default: () => [],
    },
    columns: {
      type: Array as PropType<ITableColumnsItem<any>[]>,
      required: true,
      default: () => [],
    },
  },
);

export type TgoTableProps = ExtractPropTypes<typeof tgoTableProps>;
