import { App, watch } from 'vue';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import router from '@/router';
import { useAccountStore } from '@/store/account';
import { currentEnv } from '../http/env';

const initSentry = (app: App) => {
  Sentry.init({
    app,
    dsn: 'https://5fafc041de474878a8479ca676ee5406@sentry.yunbanfang.cn/7',
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      })],
    tracesSampleRate: 1.0,
    environment: currentEnv,
  });
};

/**
 * 配置用户信息
 */
const initSentryUserInfo = () => {
  const accountStore = useAccountStore();
  // 已登录的无法触发watch，所以手动获取
  Sentry.setUser({ id: accountStore.account?.userId, username: accountStore.account?.username });
  // 重新登录触发watch，重新设置信息
  watch(() => accountStore.account, (value) => {
    if (value) {
      Sentry.setUser({ id: value.userId, username: value.username });
    }
  });
};

export default {
  install(app: App) {
    if (currentEnv === 'prod') {
      initSentry(app);
      initSentryUserInfo();
    }
  },
};
