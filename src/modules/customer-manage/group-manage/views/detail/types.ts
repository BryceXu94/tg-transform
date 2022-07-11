import { IGetGroupDetailRes } from '@/modules/customer-manage/group-manage/api/types';

// 详情-集团信息
export type IGroupData = Omit<IGetGroupDetailRes, 'customerVoList'>;

// 详情-主体信息项
export type ISubjectItem = IGetGroupDetailRes['customerVoList'][0];
