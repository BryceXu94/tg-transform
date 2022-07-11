import { IGetGroupListReq, IGetGroupListRes } from '../../api/types';

export interface IParams extends IGetGroupListReq {
  /** 创建时间范围 */
  createDate?: string[];
}

export type IListItem = IGetGroupListRes['list'][0];
