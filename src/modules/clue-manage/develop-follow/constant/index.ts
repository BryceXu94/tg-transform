import { GLOBAL_COLOR_TYPE_ENUM } from '@/constant/global';

export enum TAB_TYPE_ENUM {
  /** 开发跟进 */
  DEVELOP_FOLLOW = '1',
  /** 公海线索 */
  HIGH_SEAS_CLUE = '2'
}
export const TAB_TYPE_LIST = [
  { value: TAB_TYPE_ENUM.DEVELOP_FOLLOW, label: '开发跟进' },
  { value: TAB_TYPE_ENUM.HIGH_SEAS_CLUE, label: '公海线索' },
];

export enum CLUE_TYPE_ENUM {
  /** 电商线索 */
  E_COMMERCE_CLUE = '1',
  /** 开发计划 */
  DEVELOPMENT_PLAN = '2',
  /** 陌拜线索 */
  STRANGER_VISIT_CLUE = '3',
}
export const CLUE_TYPE_LIST = [
  { value: CLUE_TYPE_ENUM.E_COMMERCE_CLUE, label: '电商线索', color: GLOBAL_COLOR_TYPE_ENUM.WARNING },
  { value: CLUE_TYPE_ENUM.DEVELOPMENT_PLAN, label: '开发计划', color: GLOBAL_COLOR_TYPE_ENUM.PRIMARY },
  { value: CLUE_TYPE_ENUM.STRANGER_VISIT_CLUE, label: '陌拜线索', color: GLOBAL_COLOR_TYPE_ENUM.DANGER },
];

export enum DEVELOP_STATE_ENUM {
  /** 未分配 */
  UNASSIGNED = '1',
  /** 开发中 */
  IN_DEVELOP = '2',
  /** 已转换 */
  CONVERTED = '3',
  /** 无效 */
  INVALID = '4',
}
/*
  未分配：BD认领、分配BD
  开发中：转移BD、释放公海、进度反馈、提交结果
  已转换：查看客户档案
  无效：激活
 */
export const DEVELOP_STATE_LIST = [
  { value: DEVELOP_STATE_ENUM.UNASSIGNED, label: '未分配', color: GLOBAL_COLOR_TYPE_ENUM.WARNING },
  { value: DEVELOP_STATE_ENUM.IN_DEVELOP, label: '开发中', color: GLOBAL_COLOR_TYPE_ENUM.PRIMARY },
  { value: DEVELOP_STATE_ENUM.CONVERTED, label: '已转换', color: GLOBAL_COLOR_TYPE_ENUM.SUCCESS },
  { value: DEVELOP_STATE_ENUM.INVALID, label: '无效', color: GLOBAL_COLOR_TYPE_ENUM.DANGER },
];

export enum BD_OPERATE_TYPE_ENUM {
  /*  转移BD */
  TRANSFER_BD = '3',
  /*  分配BD */
  BD_DISTRIBUTE = '2',
  /*  BD认领 */
  BD_CLAIM = '1',
}
export const BD_OPERATE_TYPE_LIST = [
  { value: BD_OPERATE_TYPE_ENUM.TRANSFER_BD, label: '转移BD' },
  { value: BD_OPERATE_TYPE_ENUM.BD_DISTRIBUTE, label: '分配BD' },
  { value: BD_OPERATE_TYPE_ENUM.BD_CLAIM, label: 'BD认领' },
];

export enum SUBMIT_RESULT_TYPE_ENUM {
  /** 转换 */
  CONVERT = '3',
  /** 无效 */
  INVALID = '4'
}
export const SUBMIT_RESULT_TYPE_LIST = [
  { value: SUBMIT_RESULT_TYPE_ENUM.CONVERT, label: '转换' },
  { value: SUBMIT_RESULT_TYPE_ENUM.INVALID, label: '无效' },
];

export enum DETAIL_TABS_ENUM {
  /** 基本信息 */
  TAB_BASIC = 'tab-basic',
  /** 开发历程 */
  TAB_HISTORY = 'tab-history'
}

export enum OTHER_CODE_ENUM {
  /** 开发情况-其他 */
  DEV_SPEED_OTHER = 'C_01',
  /** 无效原因-其他 */
  INVALID_REASON_OTHER = 'F_01',
}
