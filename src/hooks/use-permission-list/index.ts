import { has } from '@/core/plugins/filter';
import { IPermissionItem, ValueType } from './type';
import { Ref, computed, ref, watch } from 'vue';

export const usePermissionList = <T>(
  allConditionPermissionList: Ref<IPermissionItem<T>[]>,
  isDefaultAppendAll: boolean = false,
) => {
  // 默认值
  const defaultCondition: Ref<ValueType<T>> = ref('');

  const permissionList = computed(() => {
    const list = allConditionPermissionList.value.filter((it) => {
      if (!it.permissionCode) return true;
      return has(it.permissionCode);
    });
    const isAddAll = isDefaultAppendAll && list.length === allConditionPermissionList.value.length;
    if (isAddAll) {
      list.unshift({
        label: '全部',
        value: '',
        permissionCode: '',
      });
    }
    return list;
  });

  watch(() => permissionList.value, (val) => {
    // 添加全部选项
    if (val.length) {
      defaultCondition.value = permissionList.value[0].value;
    }
  });

  return {
    permissionList,
    defaultCondition,
  };
};
