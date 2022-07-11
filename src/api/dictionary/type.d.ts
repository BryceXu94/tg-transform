import { DICTIONARY_STATUS_ENUM } from '@/constant/dictionary';

export interface IDictItem {
  dictNum: string;
  dictName: string;
}

// 获取字典值 - 批量 出参
export interface IDictValuesItem {
  /**
   * 字典值父编号
   */
  valueParentCode: string;
  /**
   * 字典值编号
   */
  valueCode: string;
  /**
   * 来源方 : (open_sender : 公开的来源方)
   */
  senderCode: string;
  /**
   * 字典值
   */
  value: string;
  /**
   * 是否启用
   */
  isEnable: DICTIONARY_STATUS_ENUM;
  children?: IDictValuesItem[];
}

export interface IGetDictValueBatchListRes {
  /**
   * 字典编码
   */
  dictCode: string;
  /**
   * 字典名称
   */
  dictName: string;
  /**
   * 字典值列表
   */
  dictValues?: IDictValuesItem[];
}
