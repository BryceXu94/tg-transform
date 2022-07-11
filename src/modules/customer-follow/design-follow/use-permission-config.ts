import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CCS-KHGJ-SJGJ-ZYKH': 'CCS-KHGJ-SJGJ-ZYKH',
    'CCS-KHGJ-SJGJ-SFZGH': 'CCS-KHGJ-SJGJ-SFZGH',
    'CCS-KHGJ-SJGJ-BDSJZ': 'CCS-KHGJ-SJGJ-BDSJZ',
    'CCS-KHGJ-SJGJ-SJGJ-KHBM': 'CCS-KHGJ-SJGJ-SJGJ-KHBM',
    'CCS-KHGJ-SJGJ-GHKH-KHBM': 'CCS-KHGJ-SJGJ-GHKH-KHBM',
  };
  return {
    /*
    * 转移客户
    * 控制：客户跟进-设计跟进-转移客户
    * 跳转路由名称：
    * */
    CAN_TRANSFER: computed(() => has(codeMap['CCS-KHGJ-SJGJ-ZYKH'])),
    /*
    * 释放至公海
    * 控制：客户跟进-设计跟进-释放至公海
    * 跳转路由名称：
    * */
    CAN_FREE: computed(() => has(codeMap['CCS-KHGJ-SJGJ-SFZGH'])),
    /*
    * 绑定设计组
    * 控制：客户跟进-设计跟进-绑定BD
    * 跳转路由名称：
    * */
    CAN_BIND: computed(() => has(codeMap['CCS-KHGJ-SJGJ-BDSJZ'])),
    /*
    * 设计跟进-客户编码
    * 控制：客户跟进-设计跟进-设计跟进-客户编码
    * 跳转路由名称：CustomerManageCustomerDetail
    * */
    CAN_VIEW_FOLLOW_DETAIL: computed(() => has(codeMap['CCS-KHGJ-SJGJ-SJGJ-KHBM'])),
    /*
    * 公海客户-客户编码
    * 控制：客户跟进-设计跟进-公海客户-客户编码
    * 跳转路由名称：CustomerManageCustomerDetail
    * */
    CAN_VIEW_PUBLIC_DETAIL: computed(() => has(codeMap['CCS-KHGJ-SJGJ-GHKH-KHBM'])),
  };
};
