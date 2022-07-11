import {
  ref,
} from 'vue';
import {
  IDictionaryItem,
  IMapData,
} from './types';
import {
  getDictValueBatchList,
} from '@/api/dictionary';
import {
  DICTIONARY_STATUS_ENUM,
  CX_CUSTOM_DICTIONARY_KEY,
} from '@/constant/dictionary';

const dictMap = ref<IMapData>({});
const taskQueue = new Set<string>();
let timer:any = 0;
export const useDictionary = () => {
  const getData = async () => {
    try {
      let currentTask = [...taskQueue];
      const customKeys: string[] = [];
      if (CX_CUSTOM_DICTIONARY_KEY) {
        const keys: string[] = Object.values(CX_CUSTOM_DICTIONARY_KEY);
        currentTask = currentTask.filter((key) => {
          const flag = keys.includes(key);
          if (flag) {
            customKeys.push(key);
          }
          return !flag;
        });
      }
      // 自定义处理
      // customKeys.forEach(async (key) => {
      //   let data:IDictionaryItem[] = [];
      //   let res;
      //   switch (key) {
      //     default:
      //       break;
      //   }
      //   taskQueue.delete(key);
      //   dictMap.value[key] = data;
      // });
      if (currentTask.length === 0) return;
      const { data } = await getDictValueBatchList(currentTask);
      data.forEach((items) => {
        const result:IDictionaryItem[] = []; // 存放结果集
        const itemMap: {
          [key: string]: IDictionaryItem;
        } = {};
        items?.dictValues?.forEach((item) => {
          const id = item.valueCode;
          const pid = item.valueParentCode;
          if (!itemMap[id]) {
            itemMap[id] = {
              label: '',
              value: '',
              // children: [],
              disabled: false,
            };
          }
          const obj: IDictionaryItem = {
            label: item.value,
            value: item.valueCode,
            disabled: item.isEnable === DICTIONARY_STATUS_ENUM.DISABLE,
          };
          if (itemMap[id].children) {
            obj.children = itemMap[id].children;
          }
          itemMap[id] = obj;
          const treeItem = itemMap[id];
          if (pid === '') {
            result.push(treeItem);
          } else {
            if (!itemMap[pid]) {
              itemMap[pid] = {
                label: '',
                value: '',
                disabled: false,
              };
            }
            if (itemMap[pid]?.children) {
              itemMap[pid].children?.push(treeItem);
            } else {
              itemMap[pid].children = [treeItem];
            }
          }
        });
        taskQueue.delete(items.dictCode!);
        dictMap.value[items.dictCode!] = result;
      });
    } catch (e) {
      console.error(e, '获取字典数据接口异常');
    }
  };
  const clearTask = () => {
    if (timer) {
      clearTimeout(timer);
      timer = 0;
    }
  };
  const createTask = () => {
    clearTask();
    if (taskQueue.size === 0) return;
    timer = setTimeout(() => {
      getData();
    }, 100);
  };
  const getDictionary = (code: string) => {
    const dictionaryKeys = Object.keys(dictMap.value);
    if (dictionaryKeys.includes(code)) return;
    taskQueue.add(code);
    createTask();
  };
  /**
   * @param key 字典编码
   * @param maxLevel 最大层级 默认不做限制
   */
  const getDictionaryOptions = (key: string, maxLevel?: number) => {
    getDictionary(key);
    const data = dictMap.value[key] || [];
    if (!maxLevel) return data;
    const deep = (arr: IDictionaryItem[], currentLevel: number = 1):IDictionaryItem[] => {
      return arr.map((v) => {
        if (v.children?.length) {
          if (currentLevel === maxLevel) {
            const { ...rest } = v;
            return {
              ...rest,
              children: [],
            };
          }
          return {
            ...v,
            children: deep(v.children, currentLevel + 1),
          };
        }
        return v;
      });
    };
    return deep(data);
  };
  return {
    getDictionaryOptions,
  };
};
