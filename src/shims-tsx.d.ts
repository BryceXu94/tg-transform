import { VNode, ComponentRenderProxy } from 'vue';
import { IFilters, IHas } from '@/core/plugins/filter';
import { JSBridge } from '@/core/bridge';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    interface ElementClass extends ComponentRenderProxy {}
    interface ElementAttributesProperty {
      $props: any; // 定义要使用的属性名称
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }

  interface Window {
    JSBridge: JSBridge;
    // eslint-disable-next-line camelcase
    h5_Android: { [key: string]: any; };

    webkit: {
      messageHandlers: { [key: string]: any; };
    };
  }
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: IFilters;
    $has: IHas;
  }
}
