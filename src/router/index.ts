import routerAsyncMap from './router-async';
import routerConstantMap from './router-constant';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [...routerConstantMap, ...routerAsyncMap];

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHashHistory(),
  routes,
});

export default router;
