export interface IConditionItem {
  label: string;
  value: number | string;
}

export interface IConditionsItem {
  title: string;
  conditionList: IConditionItem[];
  key: string;
}
