// 表格参数
export interface IColumnsItem<T> {
  /* 列属性 */
  property: keyof T;
  /* 标签 */
  label: string;
  /* 最小宽度 */
  minWidth: string;
  /* 类型 */
  type: string;
}
export interface ISummaryMethodProps<T> {
  /** columns配置 */
  columns: IColumnsItem<T>[];
  /* 列表数据 */
  data: T[];
}
