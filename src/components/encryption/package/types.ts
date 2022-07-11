import { DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant/global';

type IFormat = (content: string) => string;
export interface IEncryptionData {
  /**
   * 业务id
   */
  businessId: string;
  /**
   * 解密内容类型
   */
  dataType: DESENSITIZE_DECRYPT_TYPE_ENUM;
  /**
   * 密文
   */
  content?: string | string[];
  unit?: string;
  prefix?: string;
  suffix?: string;
  /**
   * 页面url
   */
  pageUrl?: string;
  /**
   * 页面pageTab
   */
  pageTab?: string;
  /**
   * 解密字段
   */
  dateColumn?: string | string[];
  format: IFormat;
}

export interface IDesensitizeData {
  content: string;
  secret: string;
  dateColumn: string;
}
