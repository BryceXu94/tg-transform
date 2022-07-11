// 表格参数
export interface IColumnsItem<T> {
  /** 列属性 */
  property: keyof T;
  /** 标签 */
  label: string;
  /** 最小宽度 */
  minWidth: string;
  /** 类型 */
  type: string;
}
export interface ISummaryMethodProps<T> {
  /** columns配置 */
  columns: IColumnsItem<T>[];
  /** 列表数据 */
  data: T[];
}

// 尺寸表头
export interface ISizeConfigItem {
  /** 尺寸 */
  size: string;
  /** property别名 */
  prop: string;
}
