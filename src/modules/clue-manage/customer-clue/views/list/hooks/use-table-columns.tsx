import { ITableColumnsItem } from '@/components/tgo-table/package/type';
import {
  TRACK_STATE_LIST,
  TRACK_STATE_ENUM,
  AUDIT_STATE_LIST,
} from '@/modules/clue-manage/customer-clue/constant';
import { IDataItem } from '../type';
import { computed } from 'vue';
import { usePermissionConfig } from '@/modules/clue-manage/customer-clue/use-permission-config';
import { getLabelByVal } from '@/core/plugins/filter';
import { Warning } from '@element-plus/icons-vue';

export const useTableColumns = (props: {
  handleActiveTrack: (id: string) => void;
  handleAuditTrack: (tracks: {id: string; name: string;}[]) => void;
}) => {
  const {
    CAN_UPDATE,
    CAN_VIEW_DETAIL,
    CAN_AUDIT,
    CAN_ACTIVE,
  } = usePermissionConfig();
  const tableColumns = computed<ITableColumnsItem<IDataItem>[]>(() => {
    const {
      handleActiveTrack,
      handleAuditTrack,
    } = props;
    const config:ITableColumnsItem<IDataItem>[] = [
      {
        type: 'selection',
        prop: 'selection',
        selectable: (row) => {
          return row.trackState === TRACK_STATE_ENUM.WAIT_AUDIT;
        },
      },
      {
        label: '客户名称',
        minWidth: '150',
        render: row => (
          <div class="margin-bottom-5">
            <copy-text text={row.customerName}>
              {CAN_VIEW_DETAIL.value ? (
                <router-link
                  to={{
                    name: 'ClueManageCustomerClueDetail',
                    params: {
                      id: row?.trackId,
                    },
                  }}
                >
                  {row?.customerName}
                </router-link>
              ) : (
                <span>{row?.customerName}</span>
              )}
            </copy-text>
          </div>
        ),
      },
      {
        label: '线索状态',
        minWidth: '100',
        type: 'enum',
        prop: 'trackState',
        options: TRACK_STATE_LIST,
      },
      {
        label: '审核结果',
        minWidth: '100',
        render: row => (
          <div>
            <div class='flex flex-align-center'>
              {[
                TRACK_STATE_ENUM.AUDIT_FAILED,
                TRACK_STATE_ENUM.AUDIT_PASSED,
              ].includes(row.trackState!)
                ? (
                  <div>{getLabelByVal(TRACK_STATE_LIST, row.trackState!)}</div>
                ) : '-'
              }
              {row.auditRemark && (
                <el-tooltip content={row.auditRemark}>
                  <el-icon class='text-color-red margin-left-5'><Warning /></el-icon>
                </el-tooltip>
              )}
            </div>
            {row.trackState === TRACK_STATE_ENUM.AUDIT_FAILED && (
              <div class='text-color-grey'>{getLabelByVal(AUDIT_STATE_LIST, row.auditResult!)}</div>
            )}
          </div>
        ),
      },
      {
        label: '主营品类',
        minWidth: '150',
        prop: 'mainCategory',
        ellipsis: true,
      },
      {
        label: '售价区间',
        minWidth: '100',
        render: row => (
          <div>
            {row.priceMinSum}-{row.priceMaxSum}
          </div>
        ),
      },
      {
        minWidth: '120',
        prop: 'monthSellSum',
        renderHeader: () => (
          <div class='flex flex-align-center'>
            <span class='margin-right-5'>月畅销款数</span>
            <el-tooltip content='月销单品过千的款数' placement='top'>
              <el-icon><Warning /></el-icon>
            </el-tooltip>
          </div>
        ),
      },
      {
        label: '创建人',
        minWidth: '80',
        prop: 'creatorName',
      },
      {
        label: '创建时间',
        minWidth: '170',
        prop: 'createdTime',
        type: 'date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      {
        label: '操作',
        minWidth: '80',
        fixed: 'right',
        render: row => (
          <div class='flex flex-align-center'>
            {CAN_UPDATE.value && row.trackState === TRACK_STATE_ENUM.WAIT_COMMIT && (
              <router-link
                to={{
                  name: 'ClueManageCustomerClueUpdate',
                  params: {
                    id: row?.trackId,
                  },
                }}
                class='margin-right-10'
              >
                <el-button type="text">编辑</el-button>
              </router-link>
            )}
            {CAN_AUDIT.value && row.trackState === TRACK_STATE_ENUM.WAIT_AUDIT && (
              <el-button
                type="text"
                onClick={() => handleAuditTrack([{
                  id: row.trackId!,
                  name: row.customerName!,
                }])}
              >审核线索</el-button>
            )}
            {CAN_ACTIVE.value && row.trackState === TRACK_STATE_ENUM.AUDIT_FAILED && (
              <el-button type="text" onClick={() => handleActiveTrack(row.trackId!)}>激活</el-button>
            )}
          </div>
        ),
      },
    ];
    if (!CAN_AUDIT.value) {
      config.splice(0, 1);
    }
    return config;
  });
  return {
    tableColumns,
  };
};
