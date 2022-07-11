import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CCS-KHGJ-XSGJ-ZYKH': 'CCS-KHGJ-XSGJ-ZYKH',
    'CCS-KHGJ-XSGJ-SFZGH': 'CCS-KHGJ-XSGJ-SFZGH',
    'CCS-KHGJ-XSGJ-BDBD': 'CCS-KHGJ-XSGJ-BDBD',
    'CCS-KHGJ-XSGJ-XSGJ-KHBM': 'CCS-KHGJ-XSGJ-XSGJ-KHBM',
    'CCS-KHGJ-XSGJ-GHKH-KHBM': 'CCS-KHGJ-XSGJ-GHKH-KHBM',
  };
  return {
    /*
    * 转移客户
    * 控制：客户跟进-销售跟进-转移客户
    * 跳转路由名称：
    * */
    CAN_TRANSFER: computed(() => has(codeMap['CCS-KHGJ-XSGJ-ZYKH'])),
    /*
    * 释放至公海
    * 控制：客户跟进-销售跟进-释放至公海
    * 跳转路由名称：
    * */
    CAN_FREE: computed(() => has(codeMap['CCS-KHGJ-XSGJ-SFZGH'])),
    /*
    * 绑定BD
    * 控制：客户跟进-销售跟进-绑定BD
    * 跳转路由名称：
    * */
    CAN_BIND: computed(() => has(codeMap['CCS-KHGJ-XSGJ-BDBD'])),
    /*
    * 销售跟进-客户编码
    * 控制：客户跟进-销售跟进-销售跟进-客户编码
    * 跳转路由名称：CustomerManageCustomerDetail
    * */
    CAN_VIEW_FOLLOW_DETAIL: computed(() => has(codeMap['CCS-KHGJ-XSGJ-XSGJ-KHBM'])),
    /*
    * 公海客户-客户编码
    * 控制：客户跟进-销售跟进-公海客户-客户编码
    * 跳转路由名称：CustomerManageCustomerDetail
    * */
    CAN_VIEW_PUBLIC_DETAIL: computed(() => has(codeMap['CCS-KHGJ-XSGJ-GHKH-KHBM'])),
  };
};
