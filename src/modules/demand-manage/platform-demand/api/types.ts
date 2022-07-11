import {
  DEMAND_STATE_ENUM,
  DEMAND_TYPE_ENUM,
  ORDER_TYPE_ENUM,
  ORDER_STATE_ENUM,
  ORDER_ERROR_STATE_ENUM,
} from '@/modules/demand-manage/platform-demand/constant';
import { FileUploadResponseItem } from '@/api/open/type.d';

export type IDemandState = {
  demandState?: string;
  subState?: string[];
};
export interface IDemandPageReq {
  /**
   * 款式编码（SPU）
   */
  styleCode?: string;
  /**
   * 客户名称
   */
  customerName?: string;
  /**
   * 销售BD
   */
  bdName?: string;
  /**
   * 客户款号 模糊搜索
   */
  customerStyleCode?: string;
  /**
   * 创建人 模糊搜索
   */
  creatorName?: string;
  /**
   * 期望交期
   */
  expectDeliveryDate?: string;
  /**
   * 所属区域code
   */
  regionCode?: string;
  /**
   * 创建时间-开始
   */
  createdTimeBegin?: string;
  /**
   * 创建时间-结束
   */
  createdTimeEnd?: string;
  /**
   * 状态编码
   * 待需求确认-10、进行中-20、已完成-30、已关闭-50
   * 2010-工厂匹配中、2020-待确认生产、2030-已确认生产、2040-待签署合同、2050-工厂签署中
   */
  state?: number;
  demandState?: string;
  subState?: string[];
  /**
   * 订单状态
   */
  orderState?: ORDER_STATE_ENUM | '';
  /**
   * 当前查询的页码
   */
  pageNum?: number;
  /**
   * 当前查询单页的数据量
   */
  pageSize?: number;
}
export interface IDemandPageListItem {
  demandId: string;
  demandCode: string;
  /**
   * 款式图片
   */
  customerPictures: string[];
  /**
   * 款式编码（SPU）
   */
  styleCode: string;
  /**
   * 款式类型
   */
  styleType: DEMAND_TYPE_ENUM;
  /**
  * 款式类型
  */
  isFirstOrder: ORDER_TYPE_ENUM;
  /**
  * 平台订单号
  */
  platformOrderCode: string;
  /**
   * 客户id
   */
  customerId: string;
  /**
   * 客户名称
   */
  customerName: string;
  /**
   * 需求状态 待需求确认-10、进行中-20、已完成-30、已关闭-50
   */
  demandState: DEMAND_STATE_ENUM;
  /**
   * 需求子状态 2010-工厂匹配中、2020-待确认生产、2030-已确认生产、2040-待签署合同、2050-工厂签署中
   */
  subState: DEMAND_STATE_ENUM;
  /**
  * 销售BD名字
  */
  bdName: string;
  /**
   * 订单数量
   */
  quantity: number | string;
  /**
   * 期望交期
   */
  expectDeliveryDate: string;
  /**
   * 所在区域名称
   */
  regionName: string;
  /**
   * 创建人
   */
  creatorName: string;
  /**
   * 创建时间
   */
  createdTime: string;
  /**
   * 客户款号
   */
  customerStyleCode: string;
  /**
   * 预计成交额
   */
  preTotalAmount: string;
  /**
   * 订单单价 不同SKC不同价格时显示最小~最大，不同SKC相同价格时直接显示
   */
  orderPrice: string;
  /**
   * 订单状态
   */
  orderState: ORDER_STATE_ENUM;
  /**
   * 订单异常状态
   */
  orderErrorState: ORDER_ERROR_STATE_ENUM;
}
export interface IDemandPageRes {
  /**
   * 当前页码, 主要给 web 端做分页校验
   */
  page: string;
  /**
   * 总数据量
   */
  total: string;
  /**
   * 分页数据
   */
  list: IDemandPageListItem[];
}

export type IDemandCountResItem = {
  /**
   * 名称
   */
  name: string;
  /**
   * 数量
   */
  count: string;
  /**
   * 对应需求主状态
   */
  demandState: string;
  /**
   * 对应需求子状态
   */
  subState: string[];
};

export type IOrderCountResItem = {
  /**
   * 名称
   */
  name: string;
  /**
   * 数量
   */
  count: string;
  /**
   * 对应订单状态
   */
  orderState: ORDER_STATE_ENUM | '';
};

export interface IV1DemandSkuListItem {
  /**
   * 尺码
   */
  size: string;
  /**
   * 下单数
   */
  quantity: number | string;
}
export interface IV1DemandSkcListItem {
  /**
   * 颜色
   */
  color: string;
  /**
   * 期望单价
   */
  expectPrice: string;
  /**
   * 实际单价
   */
  realPrice: string;
  /**
   * 下单总数
   */
  quantity: number | string;
  /**
   * 需求尺码下单数据
   */
  skuList: IV1DemandSkuListItem[];
}
export interface IV1DemandLogsItem {
  /**
   * 业务id
   */
  bizId: string;
  bizType: 'DEMAND' | 'ORDER';
  /**
   * 日志信息
   */
  content: string;
  operatorType: 'CUSTOMER' | 'STAFF';
  /**
   * 创建时间
   */
  createdTime: string;
}
export interface IV1DemandResContractListItem {
  /**
   * URL地址
   */
  url: string;
  /**
   * 文件名
   */
  fileName: string;
}
export interface IDemandSaveReqCustomerStyle {
  /**
   * 客户id
   */
  customerId?: string;
  /**
   * 客户款号
   */
  customerStyleCode?: string;
  /**
   * SPU编号
   */
  styleCode?: string;
  /**
   * 尺码类型code 如：chinese_size_code
   */
  sizeTypeCode?: string;
  /**
   * 尺码类型名称 如：国际
   */
  sizeTypeName?: string;
  /**
   * 款式品类(分类以-隔开)（如：code1-code2-code3）
   */
  categoryCode?: string;
  /**
   * 款式品类名(分类以-隔开)（如：女装-上装-T恤）
   */
  categoryName?: string;
  /**
   * 图片
   */
  customerPicture?: string[];
  /**
   * 品质要求code
   */
  qualityRequireCode?: string;
  /**
   * 品质要求名称
   */
  qualityRequireName?: string;
}
export interface IDemandDetailRes {
  /**
   * 需求id
   */
  demandId: string;
  /**
   * 需求编号
   */
  demandCode: string;
  /**
   * 款式类型
   */
  styleType: DEMAND_TYPE_ENUM;
  /**
   * 款式类型
   */
  isFirstOrder: ORDER_TYPE_ENUM;
  /**
   * 主状态
   */
  demandState: string;
   /**
    * 子状态
    */
  subState: string;
  /**
   * 客户Id
   */
  customerId: string;
  /**
   * 客户名称
   */
  customerName: string;
  /**
   * 款式号(spu)
   */
  styleCode: string;
  /**
   * 款式图片
   */
  customerPictures: string[];
  /**
   * 款式品类名
   */
  categoryName: string;
  /**
   * 联系人id
   */
  contactId: string;
  /**
   * 联系人名字
   */
  contactName: string;
  /**
   * 联系人电话
   */
  contactPhone: string;
  /**
   * 联系人邮箱
   */
  contactEmail: string;
  /**
   * 销售BD名字
   */
  bdName: string;
  /**
   * 期望交期
   */
  expectDeliveryDate: string;
  /**
   * 收货人
   */
  receiver: string;
  /**
   * 收货电话
   */
  receiptPhone: string;
  /**
   * 收货地址-省份
   */
  receiptProvince: string;
  /**
   * 收货地址-城市
   */
  receiptCity: string;
  /**
   * 收货地址-区域
   */
  receiptRegion: string;
  /**
   * 收货地址-详细地址
   */
  receiptAddressDetail: string;
  /**
   * 品质要求code
   */
  qualityRequireCode: string;
  /**
   * 品质要求名称
   */
  qualityRequireName: string;
  /**
   * 尺码类型code 如：chinese_size_code
   */
  sizeTypeCode: string;
  /**
   * 尺码类型名称 如：国际
   */
  sizeTypeName: string;
  /**
   * 客户款号
   */
  customerStyleCode: string;
  /**
   * 所在区域id
   */
  regionId: string;
  /**
   * 所在区域名称 如：华南
   */
  regionName: string;
 /**
   * 品牌ID
   */
  brandId: string;
  /**
   * 品牌名称
   */
  brandName: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 下单总数
   */
  quantity: number | string;
  /**
   * 需求颜色下单数据
   */
  skcList: IV1DemandSkcListItem[];
  /**
   * 需求日志
   */
  logs: IV1DemandLogsItem[];
  /**
   * 合同文件
   */
  contractList: IV1DemandResContractListItem[];
  /**
   * 对账单id
   */
  billId: string;
  /**
   * 预计成交额
   */
  preTotalAmount: string;
  /**
   * 客供款式信息
   */
  customerStyle: IDemandSaveReqCustomerStyle;
}

export interface IDemandSaveSkuListItem {
  /**
   * 颜色
   */
  color?: string;
  /**
   * 尺码，如：XXL
   */
  size?: string;
  /**
   * 下单数量
   */
  quantity: number | string;
  _index?: number;
  _checked?: boolean;
}
export interface IDemandSaveSkcListItem {
  /**
   * 设计款号(skc)
   */
  designCode?: string;
  /**
   * 颜色
   */
  color: string;
  /**
   * 期望单价
   */
  expectPrice: string;
  /**
   * 需求颜色SKU下单数据
   */
  skuList: IDemandSaveSkuListItem[];
}
export interface IDemandSaveReq {
  /**
   * 需求id 小程序端确认需求时传参
   */
  demandId?: string;
  /**
   * 客户id
   */
  customerId?: string;
  /**
   * 联系人id
   */
  contactId: string;
  /**
   * 联系人名字
   */
  contactName: string;
  /**
   * 联系人电话
   */
  contactPhone: string;
  /**
   * 联系人邮箱
   */
  contactEmail: string;
  /**
   * 需求类型
   */
  styleType: DEMAND_TYPE_ENUM;
   /**
   * 尺码标准
   */
  codeStandard?: string;
  /**
   * 款式品类(分类以-隔开)（如：code1-code2-code3）
   */
  categoryCode?: string[];
  /**
   * 款式图片
   */
  stylePicture?: FileUploadResponseItem[];
  /**
   * 款式编码（SPU）
   */
  styleCode: string;
  /**
   * 客户款号
   */
  customerStyleCode?: string;
  /**
   * 品质要求code
   */
  qualityRequireCode: string;
  /**
   * 期望交期
   */
  expectDeliveryDate: string;
  /**
   * 收货人
   */
  receiver: string;
  /**
   * 收货电话
   */
  receiptPhone: string;
  /**
   * 收货地址-省份
   */
  receiptProvince: string;
  /**
   * 收货地址-城市
   */
  receiptCity: string;
  /**
   * 收货地址-区域
   */
  receiptRegion: string;
  receiptAddressDetail: string;
  /**
   * 品牌ID
   */
  brandId: string;
  /**
   * 品牌名称
   */
  brandName: string;
  /**
   * 尺码类型code 如：chinese_size_code
   */
  sizeTypeCode: string;
  /**
   * 尺码类型名称 如：国际
   */
  sizeTypeName: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 需求SKC下单数据
   */
  skcList: IDemandSaveSkcListItem[];
  /**
   * 需求SKC下单数据
   */
  customerStyle: IDemandSaveReqCustomerStyle;

  [propName: string]: any;
}

export type IDemandLogsResItem = {
  /**
   * 业务id
   */
  bizId: string;
  bizType: 'DEMAND' | 'ORDER';
  /**
   * 日志信息
   */
  content: string;
  operatorType: 'CUSTOMER' | 'STAFF';
  /**
   * 创建时间
   */
  createdTime: string;
};

export type IBillDownloadResItem = {
  /**
   * URL地址
   */
  url: string;
  /**
   * 文件名
   */
  fileName: string;
};
