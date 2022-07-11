import { IGetCluesDetailRes } from '@/modules/clue-manage/customer-clue/api/type';

export type IBusinessInfo = IGetCluesDetailRes['businessInfoModel'];
export type IPlatformInfoItem = IGetCluesDetailRes['ecommercePlatformList'][0];
export type IContactListItem = IGetCluesDetailRes['contactList'][0];
