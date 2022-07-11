import { IGetUserResourceItemRes } from '@/api/menu/type';

export interface IMenuItem extends IGetUserResourceItemRes {}

export interface MenuState {
  menus: IMenuItem[];
  isGetMenu: boolean;
  authMenuList: string[];
  authButtonList: string[];
  needReload: boolean;
  cacheKeys: Set<string>;
}
