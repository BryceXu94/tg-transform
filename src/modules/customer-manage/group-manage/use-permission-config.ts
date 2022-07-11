import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CCS-KHGL-JTGL-CJJT': 'CCS-KHGL-JTGL-CJJT',
    'CCS-KHGL-JTGL-JTBM': 'CCS-KHGL-JTGL-JTBM',
    'CCS-KHGL-JTGL-BJ': 'CCS-KHGL-JTGL-BJ',
    'CCS-KHGL-JTGL-CZRZ': 'CCS-KHGL-JTGL-CZRZ',
  };
  return {
    /*
    * 创建集团
    * 控制：客户管理-集团管理-创建集团
    * 跳转路由名称：CustomerManageCreateGroup
    * */
    CAN_CREATE: computed(() => has(codeMap['CCS-KHGL-JTGL-CJJT'])),
    /*
    * 集团编码
    * 控制：客户管理-集团管理-集团编码
    * 跳转路由名称：CustomerManageGroupDetail
    * */
    CAN_VIEW: computed(() => has(codeMap['CCS-KHGL-JTGL-JTBM'])),
    /*
    * 编辑
    * 控制：客户管理-集团管理-编辑
    * 跳转路由名称：CustomerManageUpdateGroup
    * */
    CAN_UPDATE: computed(() => has(codeMap['CCS-KHGL-JTGL-BJ'])),
    /*
    * 操作日志
    * 控制：客户管理-集团详情-操作日志
    * 跳转路由名称：
    * */
    CAN_VIEW_LOG: computed(() => has(codeMap['CCS-KHGL-JTGL-CZRZ'])),
  };
};
