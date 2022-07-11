/*
* 资源开放类型
* */
export enum RESOURCE_STATUS_ENUM {
  /*
  * 停用
  * */
  DISABLE = '0',
  /*
  * 启用
  * */
  ENABLE = '1',
}

/*
* 资源状态
* */
export enum RESOURCE_OPEN_TYPE_ENUM {
  /*
  * 隐私
  * */
  PRIVATE = '0',
  /*
  * 公开
  * */
  PUBLIC = '1',
}

/*
* 资源类型
* */
export enum RESOURCE_TYPE_ENUM {
  /* 目录 */
  CATALOGUE = '1',
  /*
  * 菜单
  * */
  MENU = '2',
  /*
  * 按钮
  * */
  BUTTON = '3',
}

export interface IGetUserResourceItemRes {
  /*
  * 后端URL
  * */
  backEndUrl?: string;
  /*
  * 子资源
  * */
  children?: IGetUserResourceItemRes[];
  /*
  * 创建人
  * */
  createBy?: string;
  /*
  * 前端路由地址
  * */
  frontEndUrl: string;
  /*
  * 是否公开
  * */
  open?: RESOURCE_OPEN_TYPE_ENUM;
  /*
  * 资源父节点ID
  * */
  parentId?: string;
  /*
  * 资源父节点名称
  * */
  parentName?: string;
  /*
  * 资源编码
  * */
  resourceCode?: string;
  /*
  * 资源主键ID
  * */
  resourceId?: string;
  /*
  * 资源名称
  * */
  resourceName: string;
  /*
  * 资源类型
  * */
  resourceType: RESOURCE_TYPE_ENUM;
  /*
  * 资源类型名称
  * */
  resourceTypeName?: string;
  /*
  * 状态
  * */
  status?: RESOURCE_STATUS_ENUM;

  /*
  * 菜单图标
  * */
  icon?: string;
}
