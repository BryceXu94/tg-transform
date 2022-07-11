import { computed, ComputedRef } from 'vue';
import { IPermissionItem } from '../type';
import { formatTime } from '@tiangong/utils';
import { RISK_LEVEL_LIST } from '@/modules/customer-board/customer-risk/constant';

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
        name: '风险等级',
        component: 'select',
        valueName: 'riskLevel',
        placeholder: '请选择',
        options: [
          ...RISK_LEVEL_LIST,
        ],
        clearable: true,
        multiple: true,
      },
      {
        name: '更新日期',
        component: 'datePicker',
        valueName: ['updateStartDate', 'updateEndDate'],
        placeholder: ['开始日期', '结束日期'],
        valueFormat: 'YYYY-MM-DD',
        disabledDate: (time: Date) => {
          return time.getTime() > new Date(formatTime(Date.now())).getTime();
        },
      },
      {
        name: '客户名称',
        component: 'input',
        valueName: 'customerName',
        placeholder: '请输入客户名称',
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
