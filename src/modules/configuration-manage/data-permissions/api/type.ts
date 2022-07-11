/**
 * 数据权限列表请求体
 */
export interface IDataPermissionConfigPageReq {
  /**
   * 人员名称
   */
  userName?: string;
  /**
   * 人员id
   */
  userId?: string;
  /**
   * 当前查询的页码
   */
  pageNum?: number;
  /**
   * 当前查询单页的数据量
   */
  pageSize?: number;
}

export interface IDataPermissionConfigPageResDetailVosItem {
  /**
   * 配置详细id
   */
  configDetailId: string;
  /**
   * 配置id主键
   */
  configId: string;
  /**
   * 人员id
   */
  userId: string;
  /**
   * 人员名称
   */
  userName: string;
  /**
   * 人员工号
   */
  userCode?: string;
}

export interface IDataPermissionConfigPageResListItem {
  /**
   * 配置id
   */
  configId: string;
  /**
   * 配置类型(sales_dept_data 销售部业务单据)
   */
  configType: string;
  /**
   * 数据对象(1 部门)
   */
  dataObjectType: string;
  /**
   * 数据对象id
   */
  dataObjectId: string;
  /**
   * 数据对象名称
   */
  dataObjectName: string;
  /**
   * 人员名单
   */
  detailVos: IDataPermissionConfigPageResDetailVosItem[];
}

/**
 * 数据权限列表返回体
 */
export interface IDataPermissionConfigPageRes {
  page: string;
  total: string;
  list: IDataPermissionConfigPageResListItem[];
}

/**
 * 数据权限详情请求体
 */
export interface IDataPermissionConfigDetailReq {
  /**
   * 配置id
   */
  configId: string;
}

export interface IDataPermissionConfigDetailResDetailVosItem {
  /**
   * 配置详细id
   */
  configDetailId: string;
  /**
   * 配置id主键
   */
  configId: string;
  /**
   * 人员id
   */
  userId: string;
  /**
   * 人员名称
   */
  userName: string;
}

/**
 * 数据权限详情返回体
 */
export interface IDataPermissionConfigDetailRes {
  /**
   * 配置id
   */
  configId: string;
  /**
   * 配置类型(sales_dept_data 销售部业务单据)
   */
  configType: string;
  /**
   * 数据对象(1 部门)
   */
  dataObjectType: string;
  /**
   * 数据对象id
   */
  dataObjectId: string;
  /**
   * 数据对象名称
   */
  dataObjectName: string;
  /**
   * 人员名单
   */
  detailVos: IDataPermissionConfigDetailResDetailVosItem[];
}

export interface IDataPermissionConfigSaveReqDetailReqItem {
  /**
   * 配置id主键
   */
  configId?: string;
  /**
   * 人员id
   */
  userId?: string;
  /**
   * 人员名称
   */
  userName?: string;
  /**
   * 人员工号
   */
  userCode?: string;
}

/**
 * 创建数据权限请求体
 */
export interface IDataPermissionConfigSaveReq {
  /**
   * 配置id
   */
  configId?: string;
  /**
   * 配置类型(sales_dept_data 销售部业务单据)
   */
  configType: string;
  /**
   * 数据对象类型(1 部门)
   */
  dataObjectType: string;
  /**
   * 数据对象id
   */
  dataObjectId: string;
  /**
   * 数据对象名称
   */
  dataObjectName: string;
  /**
   * 人员名单
   */
  detailReq?: IDataPermissionConfigSaveReqDetailReqItem[];
}

export interface IDataPermissionConfigUpdateReqDetailReqItem {
  /**
   * 配置id主键
   */
  configId?: string;
  /**
   * 人员id
   */
  userId?: string;
  /**
   * 人员名称
   */
  userName?: string;
  /**
   * 人员工号
   */
  userCode?: string;
}

/**
 * 编辑数据权限请求体
 */
export interface IDataPermissionConfigUpdateReq {
  /**
   * 配置id
   */
  configId?: string;
  /**
   * 配置类型(sales_dept_data 销售部业务单据)
   */
  configType: string;
  /**
   * 数据对象类型(1 部门)
   */
  dataObjectType: string;
  /**
   * 数据对象id
   */
  dataObjectId: string;
  /**
   * 数据对象名称
   */
  dataObjectName: string;
  /**
   * 人员名单
   */
  detailReq?: IDataPermissionConfigUpdateReqDetailReqItem[];
}
