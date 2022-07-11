import { has } from '@/core/plugins/filter';

type ValueType<T> = T | '';
export interface IConditionPermissionItem<T = any> {
  label: string;
  value: ValueType<T>;
  permissionCode?: string;
}

export const useConditionPermissionList = <T>(
  // eslint-disable-next-line arrow-parens
  allConditionPermissionList: IConditionPermissionItem<T>[],
  isDefaultAppendAll: boolean = false,
) => {
  const permissionList = allConditionPermissionList.filter((it) => {
    if (!it.permissionCode) return true;
    return has(it.permissionCode);
  }) as IConditionPermissionItem<T>[];

  const isAddAll = isDefaultAppendAll && permissionList.length === allConditionPermissionList.length;
  // 添加全部选项
  if (isAddAll) {
    permissionList.unshift({
      label: '全部',
      value: '',
      permissionCode: '',
    });
  }

  let defaultCondition: ValueType<T> = '';
  if (permissionList.length) {
    defaultCondition = permissionList[0].value;
  }

  return {
    permissionList,
    defaultCondition,
  };
};
