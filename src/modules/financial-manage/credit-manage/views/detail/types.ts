import { IGetCreditDetailRes } from '@/modules/financial-manage/credit-manage/api/types';

// 旗下主体额度信息列表项
export type IListItem = IGetCreditDetailRes['customerAmountDetailList'][0];
