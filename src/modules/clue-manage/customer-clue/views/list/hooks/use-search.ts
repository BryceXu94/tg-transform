import { computed } from 'vue';
import {
  AUDIT_STATE_LIST,
} from '@/modules/clue-manage/customer-clue/constant';

export const useSearch = () => {
  const searchConfig = computed(() => {
    return [
      {
        name: '客户信息',
        component: 'input',
        valueName: 'customerName',
        placeholder: '请输入客户信息',
      },
      {
        name: '审核结果',
        component: 'select',
        valueName: 'auditResult',
        placeholder: '请选择',
        options: [
          {
            label: '全部',
            value: '',
          },
          ...AUDIT_STATE_LIST,
        ],
        clearable: true,
      },
      {
        name: '创建人',
        component: 'input',
        valueName: 'creatorName',
        placeholder: '请输入客户名称',
      },
      {
        name: '创建时间：',
        component: 'datePicker',
        valueName: ['createdStartTime', 'createdEndTime'],
        placeholder: ['开始日期', '结束日期'],
      },
      {
        name: '主营品类',
        slotName: 'mainCategory',
      },
      // {
      //   name: '月畅销款数',
      //   component: 'inputNumber',
      //   valueName: 'monthSellWell',
      //   placeholder: '请输入月畅销款数',
      //   max: 9999,
      //   min: 0,
      //   precision: 0,
      // },
      {
        name: '月畅销款数',
        slotName: 'monthSellWell',
      },
      {
        name: '售价区间',
        slotName: 'saleRange',
      },
    ];
  });
  return {
    searchConfig,
  };
};
