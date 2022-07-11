import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CSS-XSGL-BFJL-DC': 'CSS-XSGL-BFJL-DC',
    'CSS-XSGL-BFJL-CKXQ': 'CSS-XSGL-BFJL-CKXQ',
    'CSS-XSGL-BFJL-YCFK': 'CSS-XSGL-BFJL-YCFK',
    'CSS-XSGL-BFJL-CZRZ': 'CSS-XSGL-BFJL-CZRZ',
  };
  return {
    /*
    * 导出
    * 控制：销售管理-拜访记录-导出
    * 跳转路由名称：
    * */
    CAN_EXPORT_EXCEL: computed(() => has(codeMap['CSS-XSGL-BFJL-DC'])),
    /*
    * 查看详情
    * 控制：销售管理-拜访记录-查看详情
    * 跳转路由名称：SalesManageVisitRecordDetail
    * */
    CAN_VIEW_CUSTOMER_DETAIL: computed(() => has(codeMap['CSS-XSGL-BFJL-CKXQ'])),
    /*
    * 异常反馈
    * 控制：销售管理-拜访记录-异常反馈
    * 跳转路由名称：
    * */
    CAN_ABNORMAL_FEEDBACK: computed(() => has(codeMap['CSS-XSGL-BFJL-YCFK'])),
    /*
    * 操作日志
    * 控制：销售管理-拜访记录详情-操作日志
    * 跳转路由名称：
    * */
    CAN_VIEW_LOG: computed(() => has(codeMap['CSS-XSGL-BFJL-CZRZ'])),
  };
};
