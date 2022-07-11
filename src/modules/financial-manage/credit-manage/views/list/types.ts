import {
  IGetCreditCustomerListRes,
  IGetCreditGroupListRes,
} from '../../api/types';

// 客户列表项
export type IListItemCustomer = IGetCreditCustomerListRes['list'][0];

// 集团列表项
export type IListItemGroup = IGetCreditGroupListRes['list'][0];
