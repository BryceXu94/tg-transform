import { App } from 'vue';
import type { SFCWithInstall } from '@/types/utils';
import ConditionSelect from './package/index.vue';
import type { IConditionInfo, IConditionItem } from './package/types';

ConditionSelect.install = (app: App): void => {
  app.component(ConditionSelect.name, ConditionSelect);
};

const _ConditionSelect = ConditionSelect as SFCWithInstall<typeof ConditionSelect>;

export {
  IConditionInfo,
  IConditionItem,
};

export default _ConditionSelect;
