// 客户分页列表
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ICustomerPageAPI {
  export interface ListItem {
    /**
     * 客户ID
     */
    customerId: string;
    /**
     * 客户编码
     */
    customerCode: string;
    /**
     * 客户全称
     */
    customerName: string;
    /**
     * 客户简称
     */
    customerSimple: string;
    /**
     * 客户状态；0:禁用，1：启用
     */
    customerStatus: string;
    /**
     * 额度管理状态；0:停用，1:启用
     */
    amountStatus: string;
    /**
     * 期初额度
     */
    initAmount: string;
    /**
     * 可用额度
     */
    availableAmount: string;
  }
  export interface IResponse {
    page: string;
    total: string;
    list: ListItem[];
  }
  export interface IRequest {
    /**
     * 客户全称
     */
    customerName?: string;
    /**
     * 客户简称
     */
    customerSimple?: string;
    /**
     * 客户编码
     */
    customerCode?: string;
    pageNum?: number;
    pageSize?: number;
  }
}

// 新建客户
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ICustomerCreateAPI {
  export interface IRequest {
    /**
     * 客户全称
     */
    customerName: string;
    /**
     * 客户简称
     */
    customerSimple?: string;
    /**
     * 客户状态；0:禁用，1：启用
     */
    customerStatus: string;
    /**
     * 客户详细地址
     */
    customerAddress: string;
    /**
     * 客户电话
     */
    customerPhone: string;
    /**
     * 省
     */
    customerProvince: string;
    /**
     * 市
     */
    customerCity: string;
    /**
     * 区
     */
    customerArea: string;
  }
  export type IResponse = string;
}

// 获取客户详情
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ICustomerDetailAPI {
  export interface IRequest {
    [k: string]: unknown;
  }
  export interface IResponse {
    /**
     * 客户ID
     */
    customerId: string;
    /**
     * 客户编码
     */
    customerCode: string;
    /**
     * 客户全称
     */
    customerName: string;
    /**
     * 来源系统编码
     */
    sourceSystemCode: string;
    /**
     * 来源系统名称
     */
    sourceSystemName: string;
    /**
     * 客户简称
     */
    customerSimple: string;
    /**
     * 客户状态；0:禁用，1：启用
     */
    customerStatus: string;
    /**
     * 客户详细地址
     */
    customerAddress: string;
    /**
     * 客户电话
     */
    customerPhone: string;
    /**
     * 省
     */
    customerProvince: string;
    /**
     * 市
     */
    customerCity: string;
    /**
     * 区
     */
    customerArea: string;
    /**
     * 创建时间
     */
    createdTime: string;
  }
}

// 获取客户额度
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ICustomerAmountDetailAPI {
  export interface IRequest {
    [k: string]: unknown;
  }
  export interface InitAmountsItem {
    /**
     * 单据号
     */
    billCode: string;
    /**
     * 来源系统编码
     */
    sourceSystemCode: string;
    /**
     * 来源系统名称
     */
    sourceSystemName: string;
    /**
     * 功能模块
     */
    billName: string;
    /**
     * 调整类型；1=调整期初额度，2=调整可用额度，3=变动可用额度
     */
    adjustType: string;
    /**
     * 金额
     */
    amount: string;
    /**
     * 允超金额（元）
     */
    allowOverAmount: string;
    /**
     * 允超比例(%)
     */
    allowOverScale: string;
    /**
     * 备注
     */
    remark: string;
    /**
     * 调整原因
     */
    adjustReason: string;
    /**
     * 操作人
     */
    creatorName: string;
    /**
     * 操作时间
     */
    createdTime: string;
  }
  export interface IResponse {
    /**
     * 额度管理状态；0:停用，1:启用
     */
    amountStatus: string;
    /**
     * 期初额度
     */
    initAmount: string;
    /**
     * 可用额度
     */
    availableAmount: string;
    /**
     * 期初额度列表
     */
    initAmounts: InitAmountsItem[];
  }
}
// 更新保存额度信息
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ICustomerAmountUpdateAPI {
  export interface IRequest {
    /**
     * 客户ID
     */
    customerId: string;
    /**
     * 额度状态；0:禁用，1：启用
     */
    amountStatus: string;
  }
  export interface IResponse {}
}

// 新增期初额度
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ICustomerAmountInitAddAPI {
  export interface IRequest {
    /**
     * 客户ID
     */
    customerId: string;
    /**
     * 来源系统编码
     */
    sourceSystemCode?: string;
    /**
     * 来源系统名称
     */
    sourceSystemName?: string;
    /**
     * 单据名称
     */
    billName?: string;
    /**
     * 调整类型；1=调整期初额度，2=调整可用额度，3=变动可用额度
     */
    adjustType?: string;
    /**
     * 金额
     */
    amount: string;
    /**
     * 允超金额（元）
     */
    allowOverAmount: string;
    /**
     * 允超比例(%)
     */
    allowOverScale: string;
    /**
     * 备注
     */
    remark?: string;
    /**
     * 调整原因
     */
    adjustReason: string;
  }
  export interface IResponse {}
}

// 获取客户额度明细记录
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ICustomerAdjustAmountDetailPageAPI {
  export interface IRequest {
    /**
     * 客户ID
     */
    customerId: string;
    pageNum?: number;
    pageSize?: number;
  }
  export interface ListItem {
    /**
     * 来源系统名称
     */
    sourceSystemName: string;
    /**
     * 单据号
     */
    billCode: string;
    /**
     * 功能模块
     */
    billName: string;
    /**
     * 调整类型；1=调整期初额度，2=调整可用额度，3=变动可用额度
     */
    adjustType: string;
    /**
     * 金额
     */
    adjustAmount: string;
    /**
     * 调整原因
     */
    adjustReason: string;
    /**
     * 备注
     */
    remark: string;
    /**
     * 操作人
     */
    creatorName: string;
    /**
     * 操作时间
     */
    createdTime: string;
  }
  export interface IResponse {
    page: string;
    total: string;
    list: ListItem[];
  }
}

// 调整（添加）额度
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ICustomerAdjustAmountAddRecordAPI {
  export interface IRequest {
    /**
     * 客户ID
     */
    customerId: string;
    /**
     * 单据号
     */
    billCode?: string;
    /**
     * 金额
     */
    adjustAmount: string;
    /**
     * 调整原因
     */
    adjustReason: string;
    /**
     * 备注
     */
    remark?: string;
  }
  export interface IResponse {}
}

// 查询对外关系
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ICustomerExtRelationListAPI {
  export interface IRequest {
    [k: string]: unknown;
  }
  export interface ListItem {
    /**
     * 主键ID
     */
    relationId: string;
    /**
     * 客户编码
     */
    sourceCustomerCode: string;
    /**
     * 客户全称
     */
    sourceCustomerName: string;
    /**
     * 来源系统名称
     */
    sourceSystemName: string;
    /**
     * 来源系统编码
     */
    sourceSystemCode: string;
  }
  export type IResponse = ListItem[];
}

// 保存对外关系
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ICustomerExtRelationSaveAPI {
  export interface ListItem {
    /**
     * 客户编码
     */
    sourceCustomerCode: string;
    /**
     * 客户全称
     */
    sourceCustomerName: string;
    /**
     * 来源系统名称
     */
    sourceSystemName: string;
    /**
     * 来源系统编码
     */
    sourceSystemCode: string;
    /**
     * 主键ID，更新的必须填，新增的可不填
     */
    relationId?: string;
  }
  export interface IRequest {
    /**
     * 客户ID
     */
    customerId: string;
    /**
     * 外部客户列表
     */
    list: ListItem[];
  }
  export interface IResponse {}
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ICustomerUpdateAPI {
  export interface IRequest {
    /**
     * 客户ID
     */
    customerId: string;
    /**
     * 客户全称
     */
    customerName: string;
    /**
     * 客户简称
     */
    customerSimple?: string;
    /**
     * 客户状态；0:禁用，1：启用
     */
    customerStatus: string;
    /**
     * 客户详细地址
     */
    customerAddress: string;
    /**
     * 客户电话
     */
    customerPhone: string;
    /**
     * 省
     */
    customerProvince: string;
    /**
     * 市
     */
    customerCity: string;
    /**
     * 区
     */
    customerArea: string;
  }
  export interface IResponse {}
}
