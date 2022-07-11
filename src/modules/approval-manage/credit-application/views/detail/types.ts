import { CREDIT_SUBJECT_ENUM } from '@/constant';
import { IGetUserRegionAndDepartmentRes } from '@/api/global/type';
import {
  ICreateCreditApplicationReq,
  IGetCreditApplicationDetailRes,
  ICreateGroupCreditApplicationReq,
  IGetGroupCreditApplicationDetailRes,
} from '@/modules/approval-manage/credit-application/api/types';

type IDetail = ICreateCreditApplicationReq
  & IGetCreditApplicationDetailRes
  & ICreateGroupCreditApplicationReq
  & IGetGroupCreditApplicationDetailRes
interface IForm extends IDetail {
  subjectType?: CREDIT_SUBJECT_ENUM;
  customerName?: string;
  groupName?: string;
}
export type IFormData = Partial<IForm>

type IUserRegionAndDepartmentRes = Omit<IGetUserRegionAndDepartmentRes, 'bdRegionCode'|'bdRegionName'>
export interface ICurrentBdData extends IUserRegionAndDepartmentRes {
  regionCode: string;
  regionName: string;
  departmentName: string;
  departmentId: string;
}
