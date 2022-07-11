import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

export interface Sidebar {
  opened: boolean;
  withoutAnimation: boolean;
}

export interface AppState {
  sidebar: Sidebar;
  device: string;
  screenSize: string;
}

const SIDEBAR_IS_CLOSED_KEY = 'sidebar-closed';
const toggleBodyClassName = (sidebar: AppState['sidebar'], screenSize: AppState['screenSize']) => {
  if (sidebar.opened && screenSize === 'screen-xs') {
    document.body.classList.add('sidebar-show');
  } else {
    document.body.classList.remove('sidebar-show');
  }
};

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    sidebar: {
      opened: true,
      // opened: !Number(Cookies.get(SIDEBAR_IS_CLOSED_KEY)),
      withoutAnimation: false,
    },
    device: 'desktop',
    screenSize: 'screen-xl',
  }),
  actions: {
    toggleSidebar() {
      // openedCode =>>  1: 隐藏; 0: 显示
      const openedCode = this.sidebar.opened ? '1' : '0';
      Cookies.set(SIDEBAR_IS_CLOSED_KEY, openedCode);
      this.sidebar.opened = !this.sidebar.opened;
      this.sidebar.withoutAnimation = false;
    },
    closeSideBar(withoutAnimation: boolean) {
      Cookies.set(SIDEBAR_IS_CLOSED_KEY, '1');
      this.sidebar.opened = false;
      this.sidebar.withoutAnimation = withoutAnimation;

      toggleBodyClassName(this.sidebar, this.screenSize);
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleScreenSize(size: string) {
      this.screenSize = size;
    },
  },
});
