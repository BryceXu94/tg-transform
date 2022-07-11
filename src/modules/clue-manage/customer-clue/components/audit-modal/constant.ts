import { AUDIT_RESULT_ENUM } from '@/modules/clue-manage/customer-clue/constant';

export enum CUSTOM_AUDIT_RESULT_ENUM {
  PASS = 'PASS',
  REJECT = 'REJECT',
}

export const CUSTOM_AUDIT_RESULT_LIST = [
  {
    value: CUSTOM_AUDIT_RESULT_ENUM.PASS,
    label: '合格',
  },
  {
    value: CUSTOM_AUDIT_RESULT_ENUM.REJECT,
    label: '驳回',
  },
];

export const AUDIT_REASON_LIST = [
  {
    value: AUDIT_RESULT_ENUM.AUDIT_FAILED_A,
    label: '不符合画像',
  },
  {
    value: AUDIT_RESULT_ENUM.AUDIT_FAILED_B,
    label: '资料填写不全',
  },
  {
    value: AUDIT_RESULT_ENUM.AUDIT_FAILED_C,
    label: '其他原因',
  },
];
