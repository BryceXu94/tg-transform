import { App } from 'vue';
import type { SFCWithInstall } from '@/types/utils';
import Compnent from './package/index.vue';

Compnent.install = (app: App): void => {
  app.component(Compnent.name, Compnent);
};

const _Compnent = Compnent as SFCWithInstall<typeof Compnent>;

export default _Compnent;
