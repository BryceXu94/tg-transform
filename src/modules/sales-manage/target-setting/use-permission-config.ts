import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CCS-XSGL-MBSZ-MBSZ': 'CCS-XSGL-MBSZ-MBSZ',
    'CCS-XSGL-MBSZ-MBBG': 'CCS-XSGL-MBSZ-MBBG',
    'CCS-XSGL-MBSZ-CKXQ': 'CCS-XSGL-MBSZ-CKXQ',
    'CCS-XSGL-MBSZ-DC': 'CCS-XSGL-MBSZ-DC',
  };
  return {
    /*
    * 目标设置
    * 控制：销售管理-目标设置-目标设置
    * */
    CAN_MBSZ: computed(() => has(codeMap['CCS-XSGL-MBSZ-MBSZ'])),
    /*
    * 目标变更
    * 控制：销售管理-目标设置-目标变更
    * */
    CAN_MBBG: computed(() => has(codeMap['CCS-XSGL-MBSZ-MBBG'])),
    /*
    * 查看详情
    * 控制：销售管理-目标设置-查看详情
    * 跳转路由名称：SalesManageTargetSettingDetail
    * */
    CAN_VIEW_DETAIL: computed(() => has(codeMap['CCS-XSGL-MBSZ-CKXQ'])),
    /*
    * 导出
    * 控制：销售管理-目标设置-导出
    * */
    CAN_EXPORT: computed(() => has(codeMap['CCS-XSGL-MBSZ-DC'])),
  };
};
