/* eslint-disable max-classes-per-file */
import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    /** 新增线索 */
    'CCS-KHXSGL-KHXS-XZXS': 'CCS-KHXSGL-KHXS-XZXS',
    /** 编辑线索 */
    'CCS-KHXSGL-KHXS-BJXS': 'CCS-KHXSGL-KHXS-BJXS',
    /** 查看详情 */
    'CCS-KHXSGL-KHXS-CKXQ': 'CCS-KHXSGL-KHXS-CKXQ',
    /** 审核线索 */
    'CCS-KHXSGL-KHXS-SHXS': 'CCS-KHXSGL-KHXS-SHXS',
    /** 激活线索 */
    'CCS-KHXSGL-KHXS-JHXS': 'CCS-KHXSGL-KHXS-JHXS',
    /** 查看操作日志 */
    'CCS-KHXSGL-KHXS-CKCZRZ': 'CCS-KHXSGL-KHXS-CKCZRZ',
  };
  return {
    /*
    * 新增线索
    * 控制：线索管理-客户线索-新增线索
    * 跳转路由名称：ClueManageCustomerClueCreate
    * */
    CAN_CREATE: computed(() => has(codeMap['CCS-KHXSGL-KHXS-XZXS'])),
    /*
    * 编辑线索
    * 控制：线索管理-客户线索-编辑线索
    * 跳转路由名称：ClueManageCustomerClueUpdate
    * */
    CAN_UPDATE: computed(() => has(codeMap['CCS-KHXSGL-KHXS-BJXS'])),
    /*
    * 查看详情
    * 控制：线索管理-客户线索-查看详情
    * 跳转路由名称：ClueManageCustomerClueDetail
    * */
    CAN_VIEW_DETAIL: computed(() => has(codeMap['CCS-KHXSGL-KHXS-CKXQ'])),
    /*
    * 审核线索
    * 控制：线索管理-客户线索-审核线索
    * 跳转路由名称：
    * */
    CAN_AUDIT: computed(() => has(codeMap['CCS-KHXSGL-KHXS-SHXS'])),
    /*
    * 激活线索
    * 控制：线索管理-客户线索-激活线索
    * 跳转路由名称：
    * */
    CAN_ACTIVE: computed(() => has(codeMap['CCS-KHXSGL-KHXS-JHXS'])),
    /*
    * 查看操作日志
    * 控制：线索管理-客户线索-查看操作日志
    * 跳转路由名称：
    * */
    CAN_VIEW_OPERATION_LOG: computed(() => has(codeMap['CCS-KHXSGL-KHXS-CKCZRZ'])),
  };
};
