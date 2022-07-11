import {
  IGetCluesLifeCycleFunnelDataReq,
  IGetCluesLifeCycleBarDataReq,
} from '@/modules/clue-manage/life-cycle/api/type';

export interface IFunnelParams extends IGetCluesLifeCycleFunnelDataReq {
  date: string[];
  cascader: Array<string[]>;
}

export interface IBarParams extends IGetCluesLifeCycleBarDataReq {
  formerDate: string[];
  latterDate: string[];
}

export interface IBarDataItem {
  date: string;
  data: {
    label: string;
    detail: {
      label: string;
      value: number;
    }[];
    value: number;
  }[];
}

export interface IFunnelDataItem {
  value: string;
  detail: {
    label: string;
    value: number;
  }[];
  label: string;
  rate: number;
}

export interface ICascaderOptionItem {
  value: string;
  label: string;
  children?: ICascaderOptionItem[];
}
