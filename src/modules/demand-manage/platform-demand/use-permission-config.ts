import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CCS-XQGL-PTXQ-CKXQ': 'CCS-XQGL-PTXQ-CKXQ',
    'CCS-XQGL-PTXQ-FBXQ': 'CCS-XQGL-PTXQ-FBXQ',
    'CCS-XQGL-PTXQ-GXXQ': 'CCS-XQGL-PTXQ-GXXQ',
    'CCS-XQGL-PTXQ-ZCXD': 'CCS-XQGL-PTXQ-ZCXD',
    'CCS-XQGL-PTXQ-XZLXR': 'CCS-XQGL-PTXQ-XZLXR',
    'CCS-XQGL-PTXQ-XZSHXX': 'CCS-XQGL-PTXQ-XZSHXX',
    'CCS-XQGL-PTXQ-CZRZ': 'CCS-XQGL-PTXQ-CZRZ',
    'CCS-XQGL-PTXQ-CKHT': 'CCS-XQGL-PTXQ-CKHT',
    'CCS-XQGL-PTXQ-XZDZD': 'CCS-XQGL-PTXQ-XZDZD',
  };
  return {
    /*
    * 查看详情
    * 控制：需求管理-平台需求-查看详情
    * 跳转路由名称：DemandManagePlatformDemandDetail
    * */
    CAN_VIEW: computed(() => has(codeMap['CCS-XQGL-PTXQ-CKXQ'])),
    /*
    * 发布需求
    * 控制：需求管理-平台需求-发布需求
    * 跳转路由名称：DemandManagePlatformDemandCreate
    * */
    CAN_CREATE: computed(() => has(codeMap['CCS-XQGL-PTXQ-FBXQ'])),
    /*
    * 更新需求
    * 控制：需求管理-平台需求-更新需求
    * 跳转路由名称：DemandManagePlatformDemandUpdate
    * */
    CAN_UPDATE: computed(() => has(codeMap['CCS-XQGL-PTXQ-GXXQ'])),
    /*
    * 再次下单
    * 控制：需求管理-平台需求-再次下单
    * 跳转路由名称：DemandManagePlatformDemandCreateAgain
    * */
    CAN_CREATE_AGAIN: computed(() => has(codeMap['CCS-XQGL-PTXQ-ZCXD'])),
    /*
    * 新增联系人
    * 控制：需求管理-平台需求创建-新增联系人
    * 跳转路由名称：CustomerManageUpdateCustomer
    * */
    CAN_ADD_CONTACT: computed(() => has(codeMap['CCS-XQGL-PTXQ-XZLXR'])),
    /*
    * 新增收货信息
    * 控制：需求管理-平台需求创建-新增收货信息
    * 跳转路由名称：CustomerManageUpdateCustomer
    * */
    CAN_ADD_DELIVERY_INFO: computed(() => has(codeMap['CCS-XQGL-PTXQ-XZSHXX'])),
    /*
    * 操作日志
    * 控制：需求管理-平台需求详情-操作日志
    * 跳转路由名称：
    * */
    CAN_VIEW_LOG: computed(() => has(codeMap['CCS-XQGL-PTXQ-CZRZ'])),
    /*
    * 查看合同
    * 控制：需求管理-平台需求详情-查看合同
    * 跳转路由名称：
    * */
    CAN_VIEW_CONTRACT: computed(() => has(codeMap['CCS-XQGL-PTXQ-CKHT'])),
    /*
    * 下载对账单
    * 控制：需求管理-平台需求详情-下载对账单
    * 跳转路由名称：
    * */
    CAN_DOWNLOAD_BILLFILE: computed(() => has(codeMap['CCS-XQGL-PTXQ-XZDZD'])),
  };
};
