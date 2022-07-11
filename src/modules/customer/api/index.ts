import http from '@/core/http';
import {
  ICustomerAdjustAmountAddRecordAPI,
  ICustomerAdjustAmountDetailPageAPI,
  ICustomerAmountDetailAPI, ICustomerAmountInitAddAPI, ICustomerAmountUpdateAPI,
  ICustomerCreateAPI, ICustomerExtRelationListAPI, ICustomerExtRelationSaveAPI,
  ICustomerPageAPI, ICustomerUpdateAPI,
} from '@/modules/customer/api/type';

export const getCustomerList = (data: ICustomerPageAPI.IRequest) => {
  return http.post({
    url: '/ccs-credit/web/v1/customer/page',
    data,
    loading: true,
    isCancelDuplicateUrlRequests: true,
  });
};

// 创建客户
export const crateCustomer = (data: ICustomerCreateAPI.IRequest) => {
  return http.post({
    url: '/ccs-credit/web/v1/customer/create',
    data,
    loading: true,
    isCancelDuplicateUrlRequests: true,
  });
};
// 更新客户
export const updateCustomer = (data: ICustomerUpdateAPI.IRequest) => {
  return http.post({
    url: '/ccs-credit/web/v1/customer/update',
    data,
    loading: true,
    isCancelDuplicateUrlRequests: true,
  });
};

// 客户详情
export const getCustomerDetails = (customerId: string) => {
  return http.get({
    url: `/ccs-credit/web/v1/customer/detail/${customerId}`,
    loading: true,
    isCancelDuplicateUrlRequests: true,
  });
};

// 客户额度查询
export const getCustomerAmountDetails = (customerId: string) => {
  return http.get<ICustomerAmountDetailAPI.IResponse>({
    url: `/ccs-credit/web/v1/customer-amount/detail/${customerId}`,
    loading: true,
    isCancelDuplicateUrlRequests: true,
  });
};

// 添加额度记录
export const addRecord = (data: ICustomerAdjustAmountAddRecordAPI.IRequest, token: string) => {
  return http.post<ICustomerAdjustAmountAddRecordAPI.IResponse>({
    url: `/ccs-credit/web/v1/customer-adjust-amount/add-record?token=${token}`,
    loading: true,
    isCancelDuplicateUrlRequests: true,
    data,
  });
};

// 更新额度状态
export const updateAmount = (data: ICustomerAmountUpdateAPI.IRequest) => {
  return http.post<ICustomerAdjustAmountDetailPageAPI.IResponse>({
    url: '/ccs-credit/web/v1/customer-amount/update',
    loading: true,
    isCancelDuplicateUrlRequests: true,
    data,
  });
};

// 新增期初额度
export const saveInitAmount = (data: ICustomerAmountInitAddAPI.IRequest) => {
  return http.post<ICustomerAmountInitAddAPI.IRequest>({
    url: '/ccs-credit/web/v1/customer-amount-init/add',
    loading: true,
    isCancelDuplicateUrlRequests: true,
    data,
  });
};

// 额度记录查询
export const getCustomerAdjustAmountDetails = (data: ICustomerAdjustAmountDetailPageAPI.IRequest) => {
  return http.post<ICustomerAdjustAmountDetailPageAPI.IResponse>({
    url: '/ccs-credit/web/v1/customer-adjust-amount/detail-page',
    loading: true,
    isCancelDuplicateUrlRequests: true,
    data,
  });
};

// 对外关系查询
export const getCustomerRelation = (customerId: string) => {
  return http.get<ICustomerExtRelationListAPI.ListItem[]>({
    url: `/ccs-credit/web/v1/customer-ext-relation/list/${customerId}`,
    loading: true,
    isCancelDuplicateUrlRequests: true,
  });
};
// 对外关系保存
export const saveCustomerRelation = (data: ICustomerExtRelationSaveAPI.IRequest) => {
  return http.post<ICustomerExtRelationSaveAPI.IResponse>({
    url: '/ccs-credit/web/v1/customer-ext-relation/save',
    loading: true,
    isCancelDuplicateUrlRequests: true,
    data,
  });
};

// 获取token
export const getToken = () => {
  return http.get({
    url: '/ccs-credit/web/v1/tokens/next-token',
    loading: true,
    isCancelDuplicateUrlRequests: true,
  });
};
