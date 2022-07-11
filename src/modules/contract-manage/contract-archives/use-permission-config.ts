import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CCS-HTGL-HTDA-YLHT': 'CCS-HTGL-HTDA-YLHT',
    'CCS-HTGL-HTDA-XZHT': 'CCS-HTGL-HTDA-XZHT',
  };
  return {
    /*
    * 合同档案
    * 控制：合同档案-预览合同
    * */
    CAN__PREVIEW_CONTRACT: computed(() => has(codeMap['CCS-HTGL-HTDA-YLHT'])),
    /*
    * 合同档案
    * 控制：合同档案-下载合同
    * */
    CAN__DOWNLOAD_CONTRACT: computed(() => has(codeMap['CCS-HTGL-HTDA-XZHT'])),
  };
};
