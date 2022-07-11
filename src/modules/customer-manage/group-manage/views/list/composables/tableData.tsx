import { filters } from '@/core/plugins/filter';
import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { IListItem } from '../types';

export const renderColumns = (
  CAN_VIEW: boolean,
  CAN_UPDATE: boolean,
): IColumnsItem<IListItem>[] => [
  {
    label: '集团编码',
    minWidth: '120px',
    prop: 'groupCode',
    render: row => (
      <div>
        {CAN_VIEW ? (
          <router-link
            to={{
              name: 'CustomerManageGroupDetail',
              params: {
                id: row.groupId,
              },
            }}
           >
            {row.groupCode}
          </router-link>
        ) : (
          <div>{row.groupCode}</div>
        )}
      </div>
    ),
  },
  {
    label: '集团名称',
    minWidth: '130px',
    prop: 'groupName',
  },
  {
    label: '旗下主体数量',
    minWidth: '110px',
    prop: 'customerNum',
  },
  {
    label: '创建时间',
    minWidth: '170px',
    prop: 'createdTime',
    render: row => (
      <div>{filters.formatTime(row.createdTime)}</div>
    ),
  },
  {
    label: '创建人员',
    minWidth: '90px',
    prop: 'creatorName',
  },
  {
    label: '操作',
    width: '70px',
    fixed: 'right',
    render: row => (
      CAN_UPDATE ? (
        <router-link
          to={{
            name: 'CustomerManageUpdateGroup',
            params: {
              id: row.groupId,
            },
          }}
        >
          <el-button type="text">
            编辑
          </el-button>
        </router-link>
      ) : null
    ),
  },
];
