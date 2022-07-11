import { Env, DOMAIN_ENV_ENUM, PROCESS_ENV_ENUM } from '@tiangong/utils';

export const envInstance = new Env(
  process.env.env as PROCESS_ENV_ENUM,
  /* 本地环境 使用环境 */
  DOMAIN_ENV_ENUM.dev1,
);

// 获取 api 前置路径
export const { API_BASE, currentEnv } = envInstance;
export const ENV_PREFIX = window.location.host;
