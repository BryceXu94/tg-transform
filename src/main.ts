import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn';

import App from './App.vue';
import router from './router';
import store from './store';
import $filters from './core/plugins/filter';
import sentry from './core/plugins/logger';
import componentsInstall from '@/core/plugins/components-install';
import './styles/variables/element.scss';
import '@/styles/iconfont/iconfont.css';
import './core/plugins/permission';

export const app = createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus, {
    size: 'default',
    locale,
  })
  .use($filters)
  .use(sentry);
componentsInstall(app);
app.mount('#app');
