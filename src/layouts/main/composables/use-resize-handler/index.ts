import { onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/store/app';

// const WIDTH = 992; // refer to Bootstrap's responsive design

export function useResizeHandler() {
  const currentRouter = useRoute();

  const appState = useAppStore();
  watch(
    () => {
      return currentRouter;
    },
    () => {
      if (appState.device === 'mobile' && appState.sidebar.opened) {
        appState.closeSideBar(false);
      }
    },
  );

  // const $IsMobile = () => {
  //   const rect = document.body.getBoundingClientRect();
  //   return rect.width - 1 < WIDTH;
  // };

  // const $GetScreenSize = () => {
  //   const rect = document.body.getBoundingClientRect();
  //   let screenSize = 'screen-xl';

  //   if (rect.width < 576) {
  //     screenSize = 'screen-xs';
  //   } else if (rect.width < 768) {
  //     screenSize = 'screen-sm';
  //   } else if (rect.width < 992) {
  //     screenSize = 'screen-md';
  //   } else if (rect.width < 1200) {
  //     screenSize = 'screen-lg';
  //   }
  //   appState.toggleScreenSize(screenSize);
  // };

  // const $ResizeHandler = () => {
  //   if (!document.hidden) {
  //     const isMobile = $IsMobile();
  //     appState.toggleDevice(isMobile ? 'mobile' : 'desktop');

  //     if (isMobile && appState.screenSize !== 'screen-xs') {
  //       appState.closeSideBar(true);
  //     }

  //     $GetScreenSize();
  //   }
  // };

  onMounted(() => {
    // window.addEventListener('resize', $ResizeHandler);
    // const isMobile = $IsMobile();
    // if (isMobile) {
    //   appState.toggleDevice('mobile');
    //   appState.closeSideBar(true);
    // }

    // $ResizeHandler();
  });

  onUnmounted(() => {
    // window.removeEventListener('resize', $ResizeHandler);
  });
}
