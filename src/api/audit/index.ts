import http from '@/core/http';

//  获取飞书审批数据
export const getApprovalInstance = (instanceId: string) => {
  const url = '/factory-audit/web/v1/approval/instance/get';
  return http.get({
    url,
    params: { instanceId },
    loading: true,
  });
};
