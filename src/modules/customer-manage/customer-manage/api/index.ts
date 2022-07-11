import http from '@/core/http';
import {
  ICustomerInfoPageReq,
  ICustomerInfoPageRes,
  IInitCustomerSaveReq,
  IInitCustomerSaveRes,
  IDetailBaseInfoRes,
  IDetailContactsRes,
  IDetailAccountingPeriodRes,
  IDetailRiskInfoRes,
  IRiskInfoRes,
  IAuditProcessAuditListRes,
  IBaseInfoUpdateReq,
  IBaseInfoUpdateRes,
  IBusinessInfoSaveRes,
  IContactSaveReq,
  IContactSaveRes,
  IAccountingPeriodSaveReq,
  IAccountingPeriodSaveRes,
  IRiskSaveReq,
  IRiskSaveRes,
  IExternalRelationSaveReq,
  IExternalRelationSaveRes,
  IProfileFilesSaveReq,
  IProfileFilesSaveRes,
  IAuditProcessAddAuditReq,
  IDetailProfileFilesRes,
  IDetailExternalRelationRes,
  IAuditProcessPassAuditReq,
  IAuditProcessGetAuditInfoRes,
  IBaseInfoSaveReq,
  IBusinessInfoSaveReq,
  IAccountingSaveReq,
  ICustomerAllowedOrderTypeReq,
  IDeleteCustomerReq,
  ITransferReviewReq,
  IGetCustomerOptionsByRelationRes,
  IUpdateCustomerRelationReq,
  IGetCustomerRelationRes,
  IDetailBusinessInfoRes,
  ICustomerDisableReq,
  ICustomerDisableRes,
} from './types';

/**
 * 客户档案列表
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115296
 */
export const getCustomerInfoPageApi = (data: ICustomerInfoPageReq) => {
  return http.post<ICustomerInfoPageRes>({
    url: '/crm-customer/web/v1/customer-info/page',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 客户禁用
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115774
 */
export const customerDisableApi = (data: ICustomerDisableReq) => {
  return http.post<ICustomerDisableRes>({
    url: '/crm-customer/web/v1/customer-edit/customer/disable',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 客户启用
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115776
 */
export const customerEnableApi = (data: { customerId: string; }) => {
  return http.post<ICustomerInfoPageRes>({
    url: '/crm-customer/web/v1/customer-edit/customer/enable',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 创建客户
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115604
 */
export const createdCustomerApi = (data: IInitCustomerSaveReq) => {
  return http.post<IInitCustomerSaveRes>({
    url: '/crm-customer/web/v1/customer-edit/init-customer/save',
    isCancelDuplicateUrlRequests: true,
    data,
    loading: true,
  });
};

/**
 * 客户详情-综合信息
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/117318
*/
export const getCustomerCommonInfoApi = (customerId: string) => {
  return http.get<IAuditProcessGetAuditInfoRes>({
    url: `/crm-customer/web/v1/audit-process/get-audit-info/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 客户详情-基本信息
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115716
*/
export const getCustomerBasicInfoApi = (customerId: string) => {
  return http.get<IDetailBaseInfoRes>({
    url: `/crm-customer/web/v1/customer-info/edit-detail/base-info/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

export const getEncryptCustomerBasicInfoApi = (customerId: string) => {
  return http.get<IDetailBaseInfoRes>({
    url: `/crm-customer/web/v1/customer-info/detail/base-info/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 客户详情-运营信息
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115718
*/
export const getCustomerBusinessInfoApi = (customerId: string) => {
  return http.get<IDetailBusinessInfoRes>({
    url: `/crm-customer/web/v1/customer-info/edit-detail/business-info/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

export const getEncryptCustomerBusinessInfoApi = (customerId: string) => {
  return http.get<IDetailBusinessInfoRes>({
    url: `/crm-customer/web/v1/customer-info/detail/business-info/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 客户详情-联系管理
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115724
*/
export const getCustomerContactsInfoApi = (customerId: string) => {
  return http.get<IDetailContactsRes>({
    url: `/crm-customer/web/v1/customer-info/edit-detail/contacts/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

export const getEncryptCustomerContactsInfoApi = (customerId: string) => {
  return http.get<IDetailContactsRes>({
    url: `/crm-customer/web/v1/customer-info/detail/contacts/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 客户详情-货款帐期
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115722
*/
export const getCustomerAccountingInfoApi = (customerId: string) => {
  return http.get<IDetailAccountingPeriodRes>({
    url: `/crm-customer/web/v1/customer-info/edit-detail/accounting-period/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

export const getEncryptCustomerAccountingInfoApi = (customerId: string) => {
  return http.get<IDetailAccountingPeriodRes>({
    url: `/crm-customer/web/v1/customer-info/detail/accounting-period/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 客户详情-风险信息
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115720
*/
export const getCustomerRiskInfoApi = (customerId: string) => {
  return http.get<IDetailRiskInfoRes>({
    url: `/crm-customer/web/v1/customer-info/detail/risk-info/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 客户详情-资料文件
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/116538
*/
export const getCustomerProfileInfoApi = (customerId: string) => {
  return http.get<IDetailProfileFilesRes>({
    url: `/crm-customer/web/v1/customer-info/detail/profile-files/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 客户详情-外部关联关系
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/116540
*/
export const getCustomerExternalInfoApi = (customerId: string) => {
  return http.get<IDetailExternalRelationRes[]>({
    url: `/crm-customer/web/v1/customer-info/detail/external-relation/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 客户详情-审核信息
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/116156
*/
export const getCustomerAuditInfoApi = (customerId: string) => {
  return http.get<IAuditProcessAuditListRes[]>({
    url: `/crm-customer/web/v1/audit-process/audit-list/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 客户详情-更新天眼查
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115618
*/
export const updateCustomerRiskInfoApi = (customerId: string) => {
  return http.get<IRiskInfoRes>({
    url: `/crm-customer/web/v1/customer-edit/risk/sync/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/**
 * 客户管理-新增（编辑）-基本信息
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115606
*/
export const updateCustomerBasicInfoApi = (data: IBaseInfoUpdateReq) => {
  return http.post<IBaseInfoUpdateRes>({
    url: '/crm-customer/web/v1/customer-edit/base-info/save',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 客户管理-新增（编辑）- 运营信息
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115610
*/
export const updateCustomerBusinessInfoApi = (data: IBusinessInfoSaveReq) => {
  return http.post<IBusinessInfoSaveRes>({
    url: '/crm-customer/web/v1/customer-edit/business-info/save',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 客户管理-新增（编辑）- 联系管理
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115612
*/
export const updateCustomerContactInfoApi = (data: IContactSaveReq) => {
  return http.post<IContactSaveRes>({
    url: '/crm-customer/web/v1/customer-edit/contact/save',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 客户管理-新增（编辑）- 货款账期
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115608
*/
export const updateCustomerAccountingInfoApi = (data: IAccountingPeriodSaveReq) => {
  return http.post<IAccountingPeriodSaveRes>({
    url: '/crm-customer/web/v1/customer-edit/accounting-period/save',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 客户管理-新增（编辑）- 风险信息
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115616
*/
export const updateCustomerRiskSaveInfoApi = (data: IRiskSaveReq) => {
  return http.post<IRiskSaveRes>({
    url: '/crm-customer/web/v1/customer-edit/risk/save',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 客户管理-新增（编辑）- 资料文件
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115614
*/
export const updateCustomerFilesInfoApi = (data: IProfileFilesSaveReq) => {
  return http.post<IProfileFilesSaveRes>({
    url: '/crm-customer/web/v1/customer-edit/profile-files/save',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 客户管理-新增（编辑）- 系统关联
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/115936
*/
export const updateCustomerSystemInfoApi = (data: IExternalRelationSaveReq) => {
  return http.post<IExternalRelationSaveRes>({
    url: '/crm-customer/web/v1/customer-edit/external-relation/save',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 客户管理-新增（编辑）- 提交审核
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/116152
*/
export const updateCustomerAuditInfoApi = (data: IAuditProcessAddAuditReq) => {
  return http.post({
    url: '/crm-customer/web/v1/audit-process/add-audit',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 客户管理-详情 - 财务审核
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/117312
*/
export const financialAuditApi = (data: IAuditProcessPassAuditReq) => {
  return http.put({
    url: '/crm-customer/web/v1/audit-process/pass-finance-audit',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 客户管理-操作日志
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/116014
*/
export const getOperationListApi = (data: {
  buzId: string;
}) => {
  return http.post({
    url: '/crm-customer/web/v1/operation-log/get-operation-list',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/** *
 * 客户管理-基本信息编辑（平台业务）
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/120812
*/
export const platformBaseInfoSaveApi = (data: IBaseInfoSaveReq) => {
  return http.post({
    url: '/crm-customer/web/v1/platform-customer-edit/base-info/save',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/** *
 * 客户管理-账期编辑（平台业务）
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/120814
*/
export const platformAccountSaveApi = (data: IAccountingSaveReq) => {
  return http.post({
    url: '/crm-customer/web/v1/platform-customer-edit/accounting-period/save',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/** *
 * 客户管理-运营信息编辑（平台业务）
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/120816
*/
export const platformBusinessSaveApi = (data: IBusinessInfoSaveReq) => {
  return http.post({
    url: '/crm-customer/web/v1/platform-customer-edit/business-info/save',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/** *
 * 客户管理-联系人信息编辑（平台业务）
 * yapi:https://yapi.ibaibu.com/project/2106/interface/api/120818
*/
export const platformContactSaveApi = (data: IContactSaveReq) => {
  return http.post({
    url: '/crm-customer/web/v1/platform-customer-edit/contact/save',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 客户详情-运营信息（平台业务）
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/120976
*/
export const getPlatformBusinessInfoApi = (customerId: string) => {
  return http.get<IDetailBusinessInfoRes>({
    url: `/crm-customer/web/v1/customer-info/edit-detail/platform-business-info/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

export const getEncryptPlatformBusinessInfoApi = (customerId: string) => {
  return http.get<IDetailBusinessInfoRes>({
    url: `/crm-customer/web/v1/customer-info/detail/platform-business-info/${customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
  });
};

/** *
 * 客户管理-下单类型修改
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/130096
*/
export const allowedOrderTypeApi = (data: ICustomerAllowedOrderTypeReq) => {
  return http.post({
    url: '/crm-customer/web/v1/customer-edit/customer/allowed-order-type',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/** *
 * 客户管理-删除客户
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/139409
*/
export const deleteCustomerFile = (data: IDeleteCustomerReq) => {
  return http.post({
    url: '/crm-customer/web/v1/customer-edit/customer/delete',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 客户管理-转交审核人
 * yapi: https://yapi.ibaibu.com/mock/2106/crm-customer/web/v1/audit-process/transfer-audit
 */
export const transferReview = (data: ITransferReviewReq) => {
  return http.post({
    url: '/crm-customer/web/v1/audit-process/transfer-audit',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 搜索客户（主体关联）
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/141961
 */
export const getCustomerOptionsByRelation = (data: { customerName: string; }) => {
  return http.get<IGetCustomerOptionsByRelationRes[]>({
    url: `/crm-customer/web/v1/customer-relation/search/${data.customerName}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 客户编辑-主体关联
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/141985
 */
export const updateCustomerRelation = (data: IUpdateCustomerRelationReq) => {
  return http.post({
    url: '/crm-customer/web/v1/customer-edit/customer-relation/save',
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};

/**
 * 客户详情-主体关联
 * yapi: https://yapi.ibaibu.com/project/2106/interface/api/142097
 */
export const getCustomerRelation = (data: { customerId: string; }) => {
  return http.get<IGetCustomerRelationRes[]>({
    url: `/crm-customer/web/v1/customer-info/detail/relation/${data.customerId}`,
    isCancelDuplicateUrlRequests: true,
    loading: true,
    data,
  });
};
