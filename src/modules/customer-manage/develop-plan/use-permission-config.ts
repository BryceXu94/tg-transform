import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CCS-KHGL-KFJH-SHJL': 'CCS-KHGL-KFJH-SHJL',
  };
  return {
    /*
    * 审核记录
    * 控制：客户管理-开发计划-审核记录
    * 跳转路由名称：
    * */
    CAN_VIEW_RECORD: computed(() => has(codeMap['CCS-KHGL-KFJH-SHJL'])),
  };
};
