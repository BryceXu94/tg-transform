export interface IColumnsItem<T> {
  /** 对应element表格的prop字段 */
  prop?: string;
  /** 对应element表格的type字段 */
  type?: 'index' | 'selection' | 'expand';
  /** 标题 */
  label?: string;
  /** 宽度 */
  width?: string;
  /** 最小宽度 */
  minWidth?: string;
  /** 对应element表格的fixed字段 */
  fixed?: true | 'left' | 'right';
  /** 文本对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 是否隐藏溢出内容 */
  ellipsis?: boolean;
  /** 当前列标题的自定义类名 */
  labelClassName?: string;
  /** 自定义渲染 */
  render?: (row: T, index: number) => JSX.Element | null;
  selectable?: (row: T, index: number) => boolean;
  /** 自定义表头 */
  renderHeader?: (columnData: { column: any; $index: number; }) => JSX.Element | null;
}

export interface IProps {
  /** columns配置 */
  columns: IColumnsItem[];
  /** 列表数据 */
  data: any[];
}
