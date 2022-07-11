import {
  IUpdateUserPasswordReq,
} from '@/api/account/type';

export interface IFormData extends IUpdateUserPasswordReq{
  confirmPassword: string;
}
