import { App } from 'vue';
import { useMenuStore } from '@/store/menu';
import { formatTime, toThousands } from '@tiangong/utils';

interface LabelListItem {
    value: string;
    label: string;
}

export function getLabelByVal(arr: LabelListItem[], val: string) {
  const item = arr.find(it => String(it.value) === String(val)) as LabelListItem || {};
  return item.label || '';
}
function getLabelByValList(arr: LabelListItem[], val: string[]) {
  const list: string[] = [];
  if (val && val.length) {
    val.forEach((item) => {
      arr.forEach((it) => {
        if (String(it.value) === String(item)) {
          list.push(it.label);
        }
      });
    });
  }
  return list.join('，') || '';
}
export const filters = {
  // 获取枚举标签
  getEnumLabel(list: LabelListItem[], val: string): string {
    return getLabelByVal(list, val);
  },
  // 获取枚举标签(多个)
  getEnumLabels(list: LabelListItem[], val: string[]): string {
    return getLabelByValList(list, val);
  },
  // 时间格式化
  formatTime(date: string | number | Date, fmt = 'YYYY-MM-DD HH:mm:ss'): string {
    return formatTime(date, fmt);
  },
  // 金额格式化
  toThousands(num: number | string, defaultValue = '-'): string {
    return toThousands(num, defaultValue);
  },
};
export const has = (code: string):boolean => {
  // return true;
  // if (process.env.NODE_ENV === 'development') {
  //   return true;
  // }
  const { authButtonList } = useMenuStore();
  return authButtonList.includes(code);
};
export type IFilters = typeof filters;
export type IHas = typeof has;
export default {
  install(app: App) {
    const { globalProperties } = app.config;

    globalProperties.$has = has;

    globalProperties.$filters = filters;
  },
};
