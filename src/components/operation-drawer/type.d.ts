export interface IRequestConfig {
  listKey?: string;
  timeKey?: string;
  userKey?: string;
  contentKey?: string;
  operateList?: {
    value: string;
    label: string;
  }[];
  customizeFormatContent?: (item) => string;
}

export interface IListItem {
  time: string | number;
  user: string;
  content: string;
  remark?: string;
}
