import { computed, ComputedRef } from 'vue';
import { IPermissionItem } from '../type';

export const useSearchConfig = (props: {
  regionList: ComputedRef<IPermissionItem<string>[]>;
  SHOW_SEA_CUSTOMER: ComputedRef<boolean>;
}) => {
  const {
    regionList,
    SHOW_SEA_CUSTOMER,
  } = props;
  const searchConfig = computed(() => {
    return [
      {
        name: '区域',
        component: 'select',
        valueName: 'regionCode',
        placeholder: '请选择',
        options: regionList.value,
        clearable: false,
      },
      {
        name: '组织',
        slotName: 'organization',
      },
      {
        slotName: 'seaCustomer',
        isHiden: !SHOW_SEA_CUSTOMER.value,
      },
    ];
  });
  return {
    searchConfig,
  };
};
