export interface IConditionItem {
  label: string;
  value: number | string;
}

export interface IConditionInfo {
  title: string;
  conditionList: IConditionItem[];
}
