/*
 * @Descripttion: 品牌相关操作
 * @Author: weitongxue
 */
import { ref } from 'vue';

type TKeyWord = 'channel' | 'cooperation' | 'category'
interface ISelectItem {parentIndex: number; key: number; value: string;}
type TRepeatObj = Record<number, string[]>;

export const repeat = ref<Record<TKeyWord, { selectList: ISelectItem[]; repeatObj: TRepeatObj; }>>({
  channel: {
    selectList: [],
    repeatObj: {},
  },
  cooperation: {
    selectList: [],
    repeatObj: {},
  },
  category: {
    selectList: [],
    repeatObj: {},
  },
});
// 渠道/合作模式/品类 选项去重复
export const useToRepeat = (type: string, index: number, parentIndex: number, keyWord: TKeyWord) => {
  // 选择销售渠道（去重复）
  /**
   * index: 当前index; $index: 当前品牌index
   * 同一个品牌不能重复，不同品牌可以重复
  */
  repeat.value[keyWord].selectList.forEach((item: ISelectItem, _index: number) => {
    // 判断统一父级下有没有重复（去重复）
    if (item.parentIndex === parentIndex) {
      if (item.key === index) {
        repeat.value[keyWord].selectList[_index] = {
          parentIndex,
          key: index,
          value: type,
        };
        repeat.value[keyWord].selectList.splice(_index, 1);
      }
    }
  });

  repeat.value[keyWord].selectList.push({
    parentIndex,
    key: index,
    value: type,
  });

  // 重新计算
  repeat.value[keyWord].repeatObj = {};
  repeat.value[keyWord].selectList.forEach((item) => {
    repeat.value[keyWord].repeatObj[item.parentIndex] = [...new Set([item.value].concat(
      repeat.value[keyWord].repeatObj[item.parentIndex],
    ))].filter(info => !!info);
  });

  return {
    repeatObj: repeat.value[keyWord].repeatObj,
  };
};
