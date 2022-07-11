import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CSS-CWGL-SXGL-KHWD-CKXQ': 'CSS-CWGL-SXGL-KHWD-CKXQ',
    'CSS-CWGL-SXGL-JTWD-CKXQ': 'CSS-CWGL-SXGL-JTWD-CKXQ',
    'CSS-CWGL-SXGL-SYMX': 'CSS-CWGL-SXGL-SYMX',
    'CSS-CWGL-SXGL-CSSX': 'CSS-CWGL-SXGL-CSSX',
    'CSS-CWGL-SXGL-TZ': 'CSS-CWGL-SXGL-TZ',
    'CSS-CWGL-SXGL-QYTY': 'CSS-CWGL-SXGL-QYTY',
    'CSS-CWGL-SXGL-KHBM': 'CSS-CWGL-SXGL-KHBM',
    'CSS-CWGL-SXGL-CZRZ': 'CSS-CWGL-SXGL-CZRZ',
    'CCS-CWGL-SXGL-DC': 'CCS-CWGL-SXGL-DC',
    'CCS-CWGL-SXGL-JTWD-JTBM': 'CCS-CWGL-SXGL-JTWD-JTBM',
    'CCS-CWGL-SXGL-JTWD-TZ': 'CCS-CWGL-SXGL-JTWD-TZ',
    'CCS-CWGL-SXGL-JTWD-SYMX': 'CCS-CWGL-SXGL-JTWD-SYMX',
    'CCS-CWGL-SXGL-JTWD-QYTY': 'CCS-CWGL-SXGL-JTWD-QYTY',
  };
  return {
    /*
    * 查看客户详情
    * 控制：财务管理-授信管理-客户维度-查看详情
    * 跳转路由名称：FinancialManageCreditDetail
    * */
    CAN_VIEW_CUSTOMER_DETAIL: computed(() => has(codeMap['CSS-CWGL-SXGL-KHWD-CKXQ'])),
    /*
    * 查看集团详情
    * 控制：财务管理-授信管理-集团维度-查看详情
    * 跳转路由名称：FinancialManageCreditDetail
    * */
    CAN_VIEW_GROUP_DETAIL: computed(() => has(codeMap['CSS-CWGL-SXGL-JTWD-CKXQ'])),
    /*
    * 使用明细
    * 控制：财务管理-授信管理-使用明细
    * 跳转路由名称：FinancialManageCreditUsageDetail
    * */
    CAN_VIEW_USAGE: computed(() => has(codeMap['CSS-CWGL-SXGL-SYMX'])),
    /*
    * 初始授信
    * 控制：财务管理-授信管理-初始授信
    * 跳转路由名称：
    * */
    CAN_INITIAL: computed(() => has(codeMap['CSS-CWGL-SXGL-CSSX'])),
    /*
    * 调整
    * 控制：财务管理-授信管理-调整
    * 跳转路由名称：
    * */
    CAN_UPDATE: computed(() => has(codeMap['CSS-CWGL-SXGL-TZ'])),
    /*
    * 启用停用
    * 控制：财务管理-授信管理-启用停用
    * 跳转路由名称：
    * */
    CAN_TOGGLE: computed(() => has(codeMap['CSS-CWGL-SXGL-QYTY'])),
    /*
    * 客户编码
    * 控制：财务管理-授信管理-客户编码
    * 跳转路由名称：CustomerManageCustomerDetail
    * */
    CAN_VIEW_CUSTOMER: computed(() => has(codeMap['CSS-CWGL-SXGL-KHBM'])),
    /*
    * 操作日志
    * 控制：财务管理-授信管理详情-操作日志
    * 跳转路由名称：
    * */
    CAN_VIEW_LOG: computed(() => has(codeMap['CSS-CWGL-SXGL-CZRZ'])),
    /**
     * 导出
     * 控制：财务管理-授信管理-导出
    */
    CAN_EXPORT: computed(() => has(codeMap['CCS-CWGL-SXGL-DC'])),
    /*
    * 集团维度-集团编码
    * 控制：财务管理-授信管理-集团维度-集团编码
    * 跳转路由名称：CustomerManageGroupDetail
    * */
    CAN_VIEW_GROUP: computed(() => has(codeMap['CCS-CWGL-SXGL-JTWD-JTBM'])),
    /*
    * 集团维度-调整
    * 控制：财务管理-授信管理-集团维度-调整
    * 跳转路由名称：
    * */
    CAN_UPDATE_GROUP: computed(() => has(codeMap['CCS-CWGL-SXGL-JTWD-TZ'])),
    /*
    * 集团维度-使用明细
    * 控制：财务管理-授信管理-集团维度-使用明细
    * 跳转路由名称：FinancialManageCreditUsageDetail
    * */
    CAN_VIEW_GROUP_USAGE: computed(() => has(codeMap['CCS-CWGL-SXGL-JTWD-SYMX'])),
    /*
    * 集团维度-启用停用
    * 控制：财务管理-授信管理-集团维度-启用停用
    * 跳转路由名称：
    * */
    CAN_TOGGLE_GROUP: computed(() => has(codeMap['CCS-CWGL-SXGL-JTWD-QYTY'])),
  };
};
