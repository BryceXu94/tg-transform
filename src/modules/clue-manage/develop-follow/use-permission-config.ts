import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CCS-KHXSGL-KFGJ-CKXQ': 'CCS-KHXSGL-KFGJ-CKXQ',
    'CCS-KHXSGL-KFGJ-ZYBD': 'CCS-KHXSGL-KFGJ-ZYBD',
    'CCS-KHXSGL-KFGJ-SFZGH': 'CCS-KHXSGL-KFGJ-SFZGH',
    'CCS-KHXSGL-KFGJ-CXJH': 'CCS-KHXSGL-KFGJ-CXJH',
    'CCS-KHXSGL-KFGJ-BDRL': 'CCS-KHXSGL-KFGJ-BDRL',
    'CCS-KHXSGL-KFGJ-FPBD': 'CCS-KHXSGL-KFGJ-FPBD',
    'CCS-KHXSGL-KFGJ-KFFK': 'CCS-KHXSGL-KFGJ-KFFK',
    'CCS-KHXSGL-KFGJ-TJJG': 'CCS-KHXSGL-KFGJ-TJJG',
    'CCS-KHXSGL-KFGJ-CKDA': 'CCS-KHXSGL-KFGJ-CKDA',
    'CCS-KHXSGL-KFGJ-CZRZ': 'CCS-KHXSGL-KFGJ-CZRZ',
  };
  return {
    /*
    * 查看详情
    * 控制：线索管理-开发跟进-查看详情
    * 跳转路由名称：ClueManageDevelopDetail
    * */
    CAN_VIEW: computed(() => has(codeMap['CCS-KHXSGL-KFGJ-CKXQ'])),
    /*
    * 转移BD
    * 控制：线索管理-开发跟进-转移BD
    * 跳转路由名称：
    * */
    CAN_TRANSFER: computed(() => has(codeMap['CCS-KHXSGL-KFGJ-ZYBD'])),
    /*
    * 释放至公海
    * 控制：线索管理-开发跟进-释放至公海
    * 跳转路由名称：
    * */
    CAN_FREE: computed(() => has(codeMap['CCS-KHXSGL-KFGJ-SFZGH'])),
    /*
    * 重新激活
    * 控制：线索管理-开发跟进-重新激活
    * 跳转路由名称：
    * */
    CAN_ACTIVE: computed(() => has(codeMap['CCS-KHXSGL-KFGJ-CXJH'])),
    /*
    * BD认领
    * 控制：线索管理-开发跟进-BD认领
    * 跳转路由名称：
    * */
    CAN_CLAIM: computed(() => has(codeMap['CCS-KHXSGL-KFGJ-BDRL'])),
    /*
    * 分配BD
    * 控制：线索管理-开发跟进-分配BD
    * 跳转路由名称：
    * */
    CAN_DISTRIBUTE: computed(() => has(codeMap['CCS-KHXSGL-KFGJ-FPBD'])),
    /*
    * 开发反馈
    * 控制：线索管理-开发跟进-开发反馈
    * 跳转路由名称：
    * */
    CAN_FEEDBACK: computed(() => has(codeMap['CCS-KHXSGL-KFGJ-KFFK'])),
    /*
    * 提交结果
    * 控制：线索管理-开发跟进-提交结果
    * 跳转路由名称：
    * */
    CAN_SUBMIT: computed(() => has(codeMap['CCS-KHXSGL-KFGJ-TJJG'])),
    /*
    * 查看档案
    * 控制：线索管理-开发跟进-查看档案
    * 跳转路由名称：CustomerManageCustomerDetail
    * */
    CAN_VIEW_CUSTOMER_DETAIL: computed(() => has(codeMap['CCS-KHXSGL-KFGJ-CKDA'])),
    /*
    * 操作日志
    * 控制：线索管理-开发跟进-操作日志
    * 跳转路由名称：
    * */
    CAN_VIEW_LOG: computed(() => has(codeMap['CCS-KHXSGL-KFGJ-CZRZ'])),
  };
};
