import { App } from 'vue';
import type { SFCWithInstall } from '@/types/utils';
import ResponsiveRow from './package/index.vue';

ResponsiveRow.install = (app: App): void => {
  app.component(ResponsiveRow.name, ResponsiveRow);
};

const _ResponsiveRow = ResponsiveRow as SFCWithInstall<typeof ResponsiveRow>;

export default _ResponsiveRow;
