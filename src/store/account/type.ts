import { IUserInfoRes, ICompanyInfoItem } from '@/api/account/type';

export interface IStoreAccount extends IUserInfoRes {
}

export interface IState {
  token: string | null;
  account: IStoreAccount | null;
  /*
  * 当前租户
  * */
  currentCompany: ICompanyInfoItem | null;
}
