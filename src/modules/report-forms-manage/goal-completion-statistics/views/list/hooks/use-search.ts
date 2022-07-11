import { computed } from 'vue';

export const useSearch = () => {
  const searchConfig = computed(() => {
    return [
      {
        name: '设置人：',
        component: 'input',
        valueName: 'creatorName',
        placeholder: '请输入设置人',
      },
      {
        name: '设置对象：',
        component: 'input',
        valueName: 'customerName',
        placeholder: '请输入设置对象',
      },
      {
        name: '生效日期：',
        component: 'datePicker',
        valueName: ['effectiveBeginDate', 'effectiveEndDate'],
        placeholder: ['开始日期', '结束日期'],
        valueFormat: 'YYYY-MM-DD',
      },
    ];
  });
  return {
    searchConfig,
  };
};
