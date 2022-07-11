import { computed } from 'vue';
import { useMenuStore } from '@/store/menu';
import { useAppStore } from '@/store/app';
import { useAccountStore } from '@/store/account';

export default function useSide() {
  const appStore = useAppStore();
  const menuStore = useMenuStore();
  const accountStore = useAccountStore();

  const sidebar = computed(() => {
    return appStore.sidebar;
  });

  const isCollapse = computed(() => {
    return !sidebar.value.opened;
  });
  const menus = computed(() => {
    return menuStore.menus;
  });

  return {
    appStore,
    menuStore,
    accountStore,

    sidebar,
    isCollapse,
    menus,
  };
}
