import http from '@/core/http';
import { IEnvItem } from '@/core/http/type';
import { DOMAIN_SYSTEM_ENUM, DOMAIN_ENV_ENUM } from '@tiangong/utils';

/**
 * 获取环境配置 不传 获取所有环境
 */
export function getDomainList(domainEnv?: DOMAIN_ENV_ENUM) {
  return http.get<IEnvItem[]>({
    url: `/api/domain/conf/${domainEnv}`,
    loading: true,
    server: DOMAIN_SYSTEM_ENUM.tiangong,
  });
}
