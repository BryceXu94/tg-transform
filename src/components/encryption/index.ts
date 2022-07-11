import { App } from 'vue';
import type { SFCWithInstall } from '@/types/utils';
import Compnent from './package/index.vue';
import type { IEncryptionData } from './package/types';

Compnent.install = (app: App): void => {
  app.component(Compnent.name, Compnent);
};

const _Compnent = Compnent as SFCWithInstall<typeof Compnent>;

export {
  IEncryptionData,
};

export default _Compnent;
