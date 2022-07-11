import { App } from 'vue';
import type { SFCWithInstall } from '@/types/utils';
import CopyText from './package/index.vue';

CopyText.install = (app: App): void => {
  app.component(CopyText.name, CopyText);
};

export default CopyText as SFCWithInstall<typeof CopyText>;
