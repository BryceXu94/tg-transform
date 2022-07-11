import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CSS-SPGL-SXSQ-SXSQ': 'CSS-SPGL-SXSQ-SXSQ',
    'CSS-SPGL-SXSQ-FSSPBM': 'CSS-SPGL-SXSQ-FSSPBM', // 兼容旧路由
    'CSS-SPGL-SXSQ-KHBM': 'CSS-SPGL-SXSQ-KHBM',
    'CSS-SPGL-SXSQ-CX': 'CSS-SPGL-SXSQ-CX',
    'CSS-SPGL-SXSQ-SPJD': 'CSS-SPGL-SXSQ-SPJD',
    'CSS-SPGL-SXSQ-CXTJ': 'CSS-SPGL-SXSQ-CXTJ',
    'CSS-SPGL-SXSQ-JTWD-FSSPBM': 'CSS-SPGL-SXSQ-JTWD-FSSPBM',
    'CSS-SPGL-SXSQ-JTWD-JTBM': 'CSS-SPGL-SXSQ-JTWD-JTBM',
    'CSS-SPGL-SXSQ-JTWD-CX': 'CSS-SPGL-SXSQ-JTWD-CX',
    'CSS-SPGL-SXSQ-JTWD-CXTJ': 'CSS-SPGL-SXSQ-JTWD-CXTJ',
    'CSS-SPGL-SXSQ-KHWD-FSSPBM': 'CSS-SPGL-SXSQ-KHWD-FSSPBM',
  };
  return {
    /*
    * 授信申请
    * 控制：审批管理-授信申请-授信申请
    * 跳转路由名称：ApprovalManageCreateCreditApplication
    * */
    CAN_CREATE: computed(() => has(codeMap['CSS-SPGL-SXSQ-SXSQ'])),
    /*
    * 客户维度-飞书审批编码
    * 控制：审批管理-授信申请-飞书审批编码
    * 跳转路由名称：ApprovalManageCreditApplicationDetail
    * */
    CAN_VIEW: computed(() => has(codeMap['CSS-SPGL-SXSQ-KHWD-FSSPBM'])),
    /*
    * 客户编码
    * 控制：审批管理-授信申请-客户编码
    * 跳转路由名称：CustomerManageCustomerDetail
    * */
    CAN_VIEW_CUSTOMER: computed(() => has(codeMap['CSS-SPGL-SXSQ-KHBM'])),
    /*
    * 撤销
    * 控制：审批管理-授信申请-撤销
    * 跳转路由名称：
    * */
    CAN_REVOKE: computed(() => has(codeMap['CSS-SPGL-SXSQ-CX'])),
    /*
    * 审批进度
    * 控制：审批管理-授信申请详情-审批进度
    * 跳转路由名称：
    * */
    CAN_VIEW_PROGRESS: computed(() => has(codeMap['CSS-SPGL-SXSQ-SPJD'])),
    /*
    * 重新提交
    * 控制：审批管理-授信申请-重新提交
    * 跳转路由名称：ApprovalManageResubmitCreditApplication
    * */
    CAN_RESUBMIT: computed(() => has(codeMap['CSS-SPGL-SXSQ-CXTJ'])),
    /*
    * 集团维度-飞书审批编码
    * 控制：审批管理-授信申请-集团维度-飞书审批编码
    * 跳转路由名称：ApprovalManageCreditApplicationDetail
    * */
    CAN_VIEW_GROUP_DETAIL: computed(() => has(codeMap['CSS-SPGL-SXSQ-JTWD-FSSPBM'])),
    /*
    * 集团维度-集团编码
    * 控制：审批管理-授信申请-集团维度-集团编码
    * 跳转路由名称：CustomerManageGroupDetail
    * */
    CAN_VIEW_GROUP: computed(() => has(codeMap['CSS-SPGL-SXSQ-JTWD-JTBM'])),
    /*
    * 集团维度-撤销
    * 控制：审批管理-授信申请-集团维度-撤销
    * 跳转路由名称：
    * */
    CAN_REVOKE_GROUP: computed(() => has(codeMap['CSS-SPGL-SXSQ-JTWD-CX'])),
    /*
    * 集团维度-重新提交
    * 控制：审批管理-授信申请-集团维度-重新提交
    * 跳转路由名称：ApprovalManageResubmitCreditApplication
    * */
    CAN_RESUBMIT_GROUP: computed(() => has(codeMap['CSS-SPGL-SXSQ-JTWD-CXTJ'])),
  };
};
