import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CSS-PZGL-SJQX-CJ': 'CSS-PZGL-SJQX-CJ',
    'CSS-PZGL-SJQX-BJ': 'CSS-PZGL-SJQX-BJ',
    'CSS-PZGL-SJQX-SC': 'CSS-PZGL-SJQX-SC',
    'CSS-PZGL-SJQX-CZRZ': 'CSS-PZGL-SJQX-CZRZ',
  };
  return {
    /*
    * 创建
    * 控制：配置管理-数据权限-创建
    * 跳转路由名称：
    * */
    CAN_CREATE: computed(() => has(codeMap['CSS-PZGL-SJQX-CJ'])),
    /*
    * 编辑
    * 控制：配置管理-数据权限-编辑
    * 跳转路由名称：
    * */
    CAN_EDIT: computed(() => has(codeMap['CSS-PZGL-SJQX-BJ'])),
    /*
    * 删除
    * 控制：配置管理-数据权限-删除
    * 跳转路由名称：
    * */
    CAN_DELETE: computed(() => has(codeMap['CSS-PZGL-SJQX-SC'])),
    /*
    * 操作日志
    * 控制：配置管理-数据权限-操作日志
    * 跳转路由名称：
    * */
    CAN_VIEW_LOG: computed(() => has(codeMap['CSS-PZGL-SJQX-CZRZ'])),
  };
};
