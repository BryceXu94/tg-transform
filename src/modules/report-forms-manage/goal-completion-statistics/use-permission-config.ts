import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CCS-BBGL-MBWCTJ-DC': 'CCS-BBGL-MBWCTJ-DC',
  };
  return {
    /*
    * 导出
    * 报表管理-目标完成统计-导出
    * */
    CAN_EXPORT: computed(() => has(codeMap['CCS-BBGL-MBWCTJ-DC'])),
  };
};
