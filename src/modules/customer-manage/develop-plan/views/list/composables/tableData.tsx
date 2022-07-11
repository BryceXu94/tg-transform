import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { formatTime } from '@tiangong/utils';
import { filters } from '@/core/plugins/filter';
import {
  AUDIT_STATE_LIST,
} from '@/modules/customer-manage/develop-plan/constant';
import { IColumnCustomerInfoPageListItem } from '@/modules/customer-manage/develop-plan/api/types';
import { Warning } from '@element-plus/icons-vue';

export const demandRenderColumns = (
  handleShowRecord: (code: string) => void,
  CAN_VIEW_RECORD: boolean,
): IColumnsItem<IColumnCustomerInfoPageListItem>[] => {
  return [
    {
      label: '客户名称',
      minWidth: '150',
      render: row => (
        <div>{row?.columnCustomerName}</div>
      ),
    },
    {
      label: '信用代码',
      minWidth: '150',
      render: row => (
        <div>{row?.socialCreditCode}</div>
      ),
    },
    {
      label: '创建人',
      minWidth: '100',
      render: row => (
        <div>{row?.creatorName}</div>
      ),
    },
    {
      label: '创建时间',
      minWidth: '150',
      render: row => (
        <div>{formatTime(row?.createdTime)}</div>
      ),
    },
    {
      label: '计划状态',
      minWidth: '100',
      renderHeader: () => {
        return (
          <el-row align="middle">
            计划状态
            <el-tooltip
              effect="dark"
              content="审核通过请前往开发跟进处查看，审核驳回可重新进行审核处理"
              placement="top"
            >
              <el-icon
                size={20}
                class="margin-left-10"
              ><Warning /></el-icon>
            </el-tooltip>
          </el-row>
        );
      },
      render: row => (
        <div>{filters.getEnumLabel(AUDIT_STATE_LIST, row.auditState ?? '')}</div>
      ),
    },
    {
      label: '操作',
      minWidth: '100',
      fixed: 'right',
      render: row => (
        <div>
          {CAN_VIEW_RECORD
            && <el-button type="text" onClick={() => handleShowRecord(row?.columnCustomerId)}>审核记录</el-button>}
        </div>
      ),
    },
  ];
};
