import { useAccountStore } from '@/store/account';

export default function getHeaders() {
  const { account }: { account: any; } = useAccountStore();
  return {
    'CURRENT-USER-ID': account?.id || '',
    'CURRENT-USER-NAME': encodeURIComponent(account?.account || ''),
    'req-agent': 'yunbanfang',
  };
}

// 请求头带上 token 和 sign
export function getTokenSign() {
  const { account }: { account: any; } = useAccountStore();
  return {
    'TG-TOKEN': account?.token ?? '',
    'TG-SIGN': 'TENANT',
  };
}
