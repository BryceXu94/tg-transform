import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CCS-KHYYKB-KHFX-KHFXLB': 'CCS-KHYYKB-KHFX-KHFXLB',
    'CCS-KHYYKB-KHFX-FXBDJL': 'CCS-KHYYKB-KHFX-FXBDJL',
    'CCS-KHYYKB-KHFX-KHXQ': 'CCS-KHYYKB-KHFX-KHXQ',
    'CCS-KHYYKB-KHFX-ZSGHKH': 'CCS-KHYYKB-KHFX-ZSGHKH',
  };
  return {
    /*
    * 客户风险列表
    * 控制：客户看板-客户风险-客户风险列表
    * 跳转路由名称：CustomerOperateBiCustomerRiskList
    * */
    CAN_VIEW_LIST: computed(() => has(codeMap['CCS-KHYYKB-KHFX-KHFXLB'])),
    /*
    * 风险变动记录
    * 控制：客户看板-客户风险-风险变动记录
    * 跳转路由名称：
    * */
    CAN_VIEW_LOG: computed(() => has(codeMap['CCS-KHYYKB-KHFX-FXBDJL'])),
    /*
    * 客户详情
    * 控制：客户看板-客户风险-客户详情
    * 跳转路由名称：CustomerManageCustomerDetail
    * */
    CAN_VIEW_DETAIL: computed(() => has(codeMap['CCS-KHYYKB-KHFX-KHXQ'])),
    /*
    * 展示公海客户
    * 控制：客户看板-客户风险-展示公海客户
    * 跳转路由名称：
    * */
    SHOW_SEA_CUSTOMER: computed(() => has(codeMap['CCS-KHYYKB-KHFX-ZSGHKH'])),
  };
};
