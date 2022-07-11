import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CCS-CWGL-HKPZ-DC': 'CCS-CWGL-HKPZ-DC',
  };
  return {
    /*
    * 导出
    * 控制：财务管理-回款凭证-导出
    * */
    CAN_EXPORT: computed(() => has(codeMap['CCS-CWGL-HKPZ-DC'])),
  };
};
