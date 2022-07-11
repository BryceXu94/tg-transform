export type ValueType<T> = T | '';
export interface IPermissionItem<T = any> {
  label: string;
  value: ValueType<T>;
  permissionCode?: string;
}
