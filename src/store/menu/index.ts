import { defineStore } from 'pinia';
import { IMenuItem, MenuState } from './type';
import { getUserResource } from '@/api/menu';
import { RESOURCE_TYPE_ENUM } from '@/api/menu/type';
import { uniq } from 'lodash-es';

// 首页路由配置
const BASE_ROUTE: IMenuItem[] = [
  {
    frontEndUrl: 'Dashboard',
    resourceName: '首页',
    resourceType: RESOURCE_TYPE_ENUM.MENU,
    icon: 'font_family icon-cssshouye',
  },
];
export const useMenuStore = defineStore({
  id: 'menu',
  state: (): MenuState => ({
    menus: [],
    needReload: false,
    isGetMenu: false,
    authMenuList: [],
    authButtonList: [],
    cacheKeys: new Set(),
  }),
  actions: {
    async getMenus() {
      try {
        if (this.isGetMenu) return;
        const { data = [] } = await getUserResource();
        const resourceTreeVos: IMenuItem[] = data;
        this.menus = [...BASE_ROUTE, ...resourceTreeVos];
        const authMenuList: string[] = ['Dashboard'];
        const authButtonList: string[] = [];
        const deep = (menuTree: IMenuItem[]) => {
          menuTree.forEach((it) => {
            if (it.resourceType === RESOURCE_TYPE_ENUM.MENU && it.frontEndUrl) {
              authMenuList.push(it.frontEndUrl);
            }
            if (it.children?.length && it.resourceType !== RESOURCE_TYPE_ENUM.BUTTON) {
              deep(it.children);
            } else if (it.resourceType === RESOURCE_TYPE_ENUM.BUTTON) {
              if (it.frontEndUrl) {
                authMenuList.push(...it.frontEndUrl.split(','));
              }
              if (it.resourceCode) {
                authButtonList.push(it.resourceCode);
              }
            }
          });
        };
        deep(data);
        this.authMenuList = uniq(authMenuList);
        this.authButtonList = uniq(authButtonList);
        this.isGetMenu = true;
      } catch (error) {
        // 获取菜单失败 清空菜单
        this.clearMenus();
        throw Error('获取资源失败');
      }
    },
    clearMenus() {
      this.menus = [...BASE_ROUTE];
      this.authMenuList = [];
      this.authButtonList = [];
      this.isGetMenu = false;
    },
    addKeepAlive(key: string) {
      // 只缓存一个
      this.cacheKeys.clear();
      this.cacheKeys.add(key);
    },
    deleteKeepAlive(key: string) {
      this.cacheKeys.delete(key);
    },
  },
});
