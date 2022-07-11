import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  // ZH: 账户 NO：账号
  const codeMap = {
    'CSS-ZHGL-ZHGLLB-CJZH': 'CSS-ZHGL-ZHGLLB-CJZH',
    'CSS-ZHGL-ZHGLLB-BJZH': 'CSS-ZHGL-ZHGLLB-BJZH',
    'CSS-ZHGL-ZHGLLB-TY': 'CSS-ZHGL-ZHGLLB-TY',
    'CSS-ZHGL-ZHGLLB-QY': 'CSS-ZHGL-ZHGLLB-QY',
    'CSS-ZHGL-ZHGLLB-CZRZ': 'CSS-ZHGL-ZHGLLB-CZRZ',
    'CCS-ZHGL-ZHGLLB-CJNO': 'CCS-ZHGL-ZHGLLB-CJNO',
    'CCS-ZHGL-ZHGLLB-BJNO': 'CCS-ZHGL-ZHGLLB-BJNO',
    'CCS-ZHGL-ZHGLLB-QYNO': 'CCS-ZHGL-ZHGLLB-QYNO',
    'CCS-ZHGL-ZHGLLB-TYNO': 'CCS-ZHGL-ZHGLLB-TYNO',
    'CCS-ZHGL-ZHGLLB-NOCZRZ': 'CCS-ZHGL-ZHGLLB-NOCZRZ',
    'CCS-ZHGL-ZHGLLB-MINI-ROLES': 'CCS-ZHGL-ZHGLLB-MINI-ROLES',
    'CCS-ZHGL-ZHGLLB-APP-ROLES': 'CCS-ZHGL-ZHGLLB-APP-ROLES',
  };
  return {
    /*
    * 租户管理
    * 控制：租户管理-租户管理列表-创建租户
    * TenantManageList
    * */
    CAN_CREATE: computed(() => has(codeMap['CSS-ZHGL-ZHGLLB-CJZH'])),
    /*
    * 租户管理
    * 控制：租户管理-租户管理列表-编辑租户
    * TenantManageList
    * */
    CAN_EDIT: computed(() => has(codeMap['CSS-ZHGL-ZHGLLB-BJZH'])),
    /*
    * 租户管理
    * 控制：租户管理-租户管理列表-停用
    * TenantManageList
    * */
    CAN_DISABLED: computed(() => has(codeMap['CSS-ZHGL-ZHGLLB-TY'])),
    /*
    * 租户管理
    * 控制：租户管理-租户管理列表-启用
    * TenantManageList
    * */
    CAN_ENABLE: computed(() => has(codeMap['CSS-ZHGL-ZHGLLB-QY'])),
    /*
    * 租户管理
    * 控制：租户管理-租户管理列表-操作日志
    * TenantManageList
    * */
    CAN_VIEW_LOG: computed(() => has(codeMap['CSS-ZHGL-ZHGLLB-CZRZ'])),

    /*
    * 账号管理
    * 控制：租户管理-账号管理列表-创建账号
    * TenantManageList
    * */
    CAN_CREATE_ACCOUNT: computed(() => has(codeMap['CCS-ZHGL-ZHGLLB-CJNO'])),
    /*
    * 账号管理
    * 控制：租户管理-账号管理列表-编辑账号
    * TenantManageList
    * */
    CAN_EDIT_ACCOUNT: computed(() => has(codeMap['CCS-ZHGL-ZHGLLB-BJNO'])),
    /*
    * 账号管理
    * 控制：租户管理-账号管理列表-启用账号
    * TenantManageList
    * */
    CAN_ACCOUNT_ENABLE: computed(() => has(codeMap['CCS-ZHGL-ZHGLLB-QYNO'])),
    /*
    * 账号管理
    * 控制：租户管理-账号管理列表-停用账号
    * TenantManageList
    * */
    CAN_ACCOUNT_DISABLED: computed(() => has(codeMap['CCS-ZHGL-ZHGLLB-TYNO'])),
    /*
    * 账号管理
    * 控制：租户管理-账号管理列表-操作日志
    * TenantManageList
    * */
    CAN_VIEW__ACCOUNT_LOG: computed(() => has(codeMap['CCS-ZHGL-ZHGLLB-NOCZRZ'])),
    /*
    * 账号管理
    * 控制：租户管理-账号管理列表-小程序角色
    * TenantManageList
    * */
    CAN__ACCOUNT_MINI_ROLES: computed(() => has(codeMap['CCS-ZHGL-ZHGLLB-MINI-ROLES'])),
    /*
    * 账号管理
    * 控制：租户管理-账号管理列表-APP角色
    * TenantManageList
    * */
    CAN__ACCOUNT_APP_ROLES: computed(() => has(codeMap['CCS-ZHGL-ZHGLLB-APP-ROLES'])),
  };
};
