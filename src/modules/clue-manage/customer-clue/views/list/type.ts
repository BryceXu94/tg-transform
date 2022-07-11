import {
  IGetCluesListReq,
  IGetCluesListRes,
} from '@/modules/clue-manage/customer-clue/api/type';

export type IDataItem = IGetCluesListRes['list'][0];
export type IParams = IGetCluesListReq;
export interface ITrackItem {
  id: string;
  name: string;
}
