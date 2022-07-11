import { computed } from 'vue';
import { useAccountStore } from '@/store/account';
import { useAppStore } from '@/store/app';
import { useMenuStore } from '@/store/menu';

export default function useHeader() {
  const accountStore = useAccountStore();
  const appStore = useAppStore();
  const menuStore = useMenuStore();

  const accountData = computed(() => {
    return {
      userName: accountStore.account?.username || '',
    };
  });

  const handleToggleSideBar = () => {
    appStore.toggleSidebar();
  };

  /**
     * 退出登录
     */
  const handleLogout = async () => {
    await accountStore.logout();
  };

  return {
    accountStore,
    appStore,
    menuStore,

    accountData,
    handleLogout,
    handleToggleSideBar,
  };
}
