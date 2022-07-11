import { App } from 'vue';
import type { SFCWithInstall } from '@/types/utils';
import ConditionArea from './package/index.vue';
import type { IConditionsItem, IConditionItem } from './package/types';

ConditionArea.install = (app: App): void => {
  app.component(ConditionArea.name, ConditionArea);
};

const _ConditionArea = ConditionArea as SFCWithInstall<typeof ConditionArea>;

export {
  _ConditionArea as default,
  IConditionsItem,
  IConditionItem,
};
