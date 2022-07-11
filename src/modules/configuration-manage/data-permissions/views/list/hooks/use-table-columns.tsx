import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { filters } from '@/core/plugins/filter';
import { DATA_RANGE_LIST } from '@/modules/configuration-manage/data-permissions/constant';
import { IListItemData, CREATE_EDIT_ENUM } from '../type';

// 数据权限
export const dataRenderColumns = (
  handleCreateData: (configId: string, type: string) => void,
  handleDeleteData: (configId: string) => void,
  handleOperation: (configId: string) => void,
  CAN_EDIT: boolean,
  CAN_DELETE: boolean,
  CAN_VIEW_LOG: boolean,
): IColumnsItem<IListItemData>[] => {
  return [
    {
      label: '数据范围',
      minWidth: '90',
      render: row => <div>{filters.getEnumLabel(DATA_RANGE_LIST, row?.configType)}</div>,
    },
    {
      label: '人员名单',
      minWidth: '160',
      render: row => (
        <div>
          {row?.detailVos?.map((item, index) => {
            return (
              <div class="personnel-list">
                <span>{`${item.userName}[${item.userCode}]`}</span>
                <span v-show={index < row.detailVos.length - 1}>、</span>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      label: '数据对象',
      minWidth: '90',
      render: row => <div>{row?.dataObjectName}</div>,
    },
    {
      label: '操作',
      minWidth: '90',
      fixed: 'right',
      render: row => (
        <div>
          {CAN_EDIT && (
            <el-button
              type="text"
              class="margin-right-10"
              onClick={() => handleCreateData(row?.configId, CREATE_EDIT_ENUM.EDIT)}
            >
              编辑
            </el-button>
          )}
          {CAN_DELETE && (
            <el-button
              type="text"
              class="color-error margin-right-10"
              onclick={() => handleDeleteData(row.configId)}
            >
              删除
            </el-button>
          )}
          {CAN_VIEW_LOG && (
            <el-button type="text" onClick={() => handleOperation(row?.configId)}>
              操作日志
            </el-button>
          )}
        </div>
      ),
    },
  ];
};
