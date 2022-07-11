export interface IDictionaryItem{
  value: string;
  label: string;
  disabled: boolean;
  children?: IDictionaryItem[];
}
export interface IFlatDictionaryItem{
  value: string;
  label: string;
  disabled: boolean;
  pIds: string[];
  cIds: string[];
  lastLevelChildIds: string[];
}

export interface IMapData {
  [key: string]: IDictionaryItem[];
}
