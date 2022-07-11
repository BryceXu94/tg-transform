import { CUSTOM_AUDIT_RESULT_ENUM } from './constant';
import { AUDIT_RESULT_ENUM } from '@/modules/clue-manage/customer-clue/constant';

export interface IFormData {
  auditResult: CUSTOM_AUDIT_RESULT_ENUM;
  rejectReason: AUDIT_RESULT_ENUM;
  remark: string;
}

export interface ITrackItem {
  id: string;
  name: string;
}
