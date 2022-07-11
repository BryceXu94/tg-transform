import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CCS-CWGL-HKJH-DC': 'CCS-CWGL-HKJH-DC',
    'CCS-CWGL-HKJH-ZDH': 'CCS-CWGL-HKJH-ZDH',
    'CCS-CWGL-HKJH-SZYJHKR': 'CCS-CWGL-HKJH-SZYJHKR',
  };
  return {
    /*
    * 导出
    * 控制：财务管理-回款计划-导出
    * 跳转路由名称：
    * */
    CAN_EXPORT: computed(() => has(codeMap['CCS-CWGL-HKJH-DC'])),
    /*
    * 账单号
    * 控制：财务管理-回款计划-账单号
    * 跳转路由名称：FinancialManageCustomerStatementDetail
    * */
    CAN_VIEW_DETAIL: computed(() => has(codeMap['CCS-CWGL-HKJH-ZDH'])),
    /*
    * 设置预计回款日
    * 控制：财务管理-回款计划-设置预计回款日
    * 跳转路由名称：
    * */
    CAN_SET_MONEY_BACK_DATE: computed(() => has(codeMap['CCS-CWGL-HKJH-SZYJHKR'])),
  };
};
