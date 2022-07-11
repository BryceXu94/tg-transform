import { IDataPermissionConfigPageRes } from '../../api/type';

// 数据列表项
export type IListItemData = IDataPermissionConfigPageRes['list'][0];

// 创建/编辑
export enum CREATE_EDIT_ENUM {
  /** 编辑 */
  EDIT = 'edit',
  /** 创建 */
  CREATE = 'create',
}
