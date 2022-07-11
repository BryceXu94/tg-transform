import { App } from 'vue';
import type { SFCWithInstall } from '@/types/utils';
import AppPage from './main.vue';

AppPage.install = (app: App): void => {
  app.component(AppPage.name, AppPage);
};

const _AppPage = AppPage as SFCWithInstall<typeof AppPage>;

export default _AppPage;
