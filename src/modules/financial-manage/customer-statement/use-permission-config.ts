import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CCS-CWGL-KHDZD-CKXQ': 'CCS-CWGL-KHDZD-CKXQ',
    'CCS-CWGL-KHDZD-GGZDLX': 'CCS-CWGL-KHDZD-GGZDLX',
    'CCS-CWGL-KHDZD-DY': 'CCS-CWGL-KHDZD-DY',
    'CCS-CWGL-KHDZD-DCTP': 'CCS-CWGL-KHDZD-DCTP',
    'CCS-CWGL-KHDZD-CZRZ': 'CCS-CWGL-KHDZD-CZRZ',
    'CCS-CWGL-KHDZD-KHBH': 'CCS-CWGL-KHDZD-KHBH',
    'CCS-CWGL-KHDZD-KHQR': 'CCS-CWGL-KHDZD-KHQR',
    'CCS-CWGL-KHDZD-DCEXCEL': 'CCS-CWGL-KHDZD-DCEXCEL',
    'CCS-CWGL-KHDZD-YL': 'CCS-CWGL-KHDZD-YL',
    'CCS-CWGL-KHDZD-CKMX': 'CCS-CWGL-KHDZD-CKMX',
  };
  return {
    /*
    * 查看详情
    * 控制：财务管理-客户对账单-查看详情
    * 跳转路由名称：FinancialManageCustomerStatementBill
    * */
    CAN_VIEW_DETAIL: computed(() => has(codeMap['CCS-CWGL-KHDZD-CKXQ'])),
    /*
    * 更改账单类型
    * 控制：财务管理-客户对账单-更改账单类型
    * 跳转路由名称：
    * */
    CAN_CHANGE_TYPE: computed(() => has(codeMap['CCS-CWGL-KHDZD-GGZDLX'])),
    /*
    * 打印
    * 控制：财务管理-客户对账单-打印
    * 跳转路由名称：
    * */
    CAN_PRINT: computed(() => has(codeMap['CCS-CWGL-KHDZD-DY'])),
    /*
    * 导出图片
    * 控制：财务管理-客户对账单-账单信息-导出图片
    * 跳转路由名称：
    * */
    CAN_EXPORT_IMAGE: computed(() => has(codeMap['CCS-CWGL-KHDZD-DCTP'])),
    /*
    * 导出excel
    * 控制：财务管理-客户对账单-账单信息-导出excel
    * 跳转路由名称：
    * */
    CAN_EXPORT_EXCEL: computed(() => has(codeMap['CCS-CWGL-KHDZD-DCEXCEL'])),
    /*
    * 操作日志
    * 控制：财务管理-客户对账单-账单信息-操作日志
    * 跳转路由名称：
    * */
    CAN_VIEW_LOG: computed(() => has(codeMap['CCS-CWGL-KHDZD-CZRZ'])),
    /*
    * 客户驳回
    * 控制：财务管理-客户对账单-账单信息-客户驳回
    * 跳转路由名称：
    * */
    CAN_REVOKE: computed(() => has(codeMap['CCS-CWGL-KHDZD-KHBH'])),
    /*
    * 客户确认
    * 控制：财务管理-客户对账单-账单信息-客户确认
    * 跳转路由名称：
    * */
    CAN_CONFIRM: computed(() => has(codeMap['CCS-CWGL-KHDZD-KHQR'])),
    /*
    * 预览
    * 控制：财务管理-客户对账单-账单信息-预览
    * 跳转路由名称：FinancialManageCustomerStatementBillPreview
    * */
    CAN_PREVIEW: computed(() => has(codeMap['CCS-CWGL-KHDZD-YL'])),
    /*
    * 查看明细
    * 控制：财务管理-客户对账单-账单信息-查看明细
    * 跳转路由名称：FinancialManageCustomerStatementBillDetail
    * */
    CAN_VIEW_BILL: computed(() => has(codeMap['CCS-CWGL-KHDZD-CKMX'])),
  };
};
