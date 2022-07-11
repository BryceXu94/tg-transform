// 操作日志-操作类型
export enum LOG_OPERATE_TYPE_ENUM {
  /* 创建 */
  DATA_CONFIG_CREATE = 'DATA_CONFIG_CREATE',
  /* 编辑 */
  DATA_CONFIG_UPDATE = 'DATA_CONFIG_UPDATE',
}

export const LOG_OPERATE_TYPE_LIST = [
  { value: LOG_OPERATE_TYPE_ENUM.DATA_CONFIG_CREATE, label: '创建' },
  { value: LOG_OPERATE_TYPE_ENUM.DATA_CONFIG_UPDATE, label: '编辑' },
];

// 数据范围状态
export enum DATA_RANGE_ENUM {
  /** 销售部业务单据 */
  SALES_DEPT_DATA = 'sales_dept_data',
}

export const DATA_RANGE_LIST = [
  { value: DATA_RANGE_ENUM.SALES_DEPT_DATA, label: '销售部业务单据' },
];

// 数据对象类型
export enum DATA_OBJECT_ENUM {
  /** 指定部门 */
  SPECIFY_DEPARTMENT = '1',
}

export const DATA_OBJECT_LIST = [{ value: DATA_OBJECT_ENUM.SPECIFY_DEPARTMENT, label: '指定部门' }];
