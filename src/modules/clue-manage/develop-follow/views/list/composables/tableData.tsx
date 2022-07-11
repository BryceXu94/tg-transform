import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { formatTime } from '@tiangong/utils';
import { filters } from '@/core/plugins/filter';
import {
  CLUE_TYPE_ENUM,
  CLUE_TYPE_LIST,
  DEVELOP_STATE_ENUM,
  DEVELOP_STATE_LIST,
} from '@/modules/clue-manage/develop-follow/constant';
import { ICustomerClueDevPageResListItem } from '@/modules/clue-manage/develop-follow/api/types';
import { Warning } from '@element-plus/icons-vue';

export const developRenderColumns = (
  calculateTime: (distributionTime: number, conversionTime?: number) => string,
  handleOpenActiveClueDialog: (row: ICustomerClueDevPageResListItem) => void,
  handleDevelopFeedback: (row: ICustomerClueDevPageResListItem) => void,
  handleSubmitResult: (row: ICustomerClueDevPageResListItem) => void,
  handleViewCustomerDetail: (row: ICustomerClueDevPageResListItem) => void,
  CAN_ACTIVE: boolean,
  CAN_FEEDBACK: boolean,
  CAN_SUBMIT: boolean,
  CAN_VIEW: boolean,
  CAN_VIEW_CUSTOMER_DETAIL: boolean,
  customizeFormatContent: (row: ICustomerClueDevPageResListItem) => string,
): IColumnsItem<ICustomerClueDevPageResListItem>[] => {
  return [
    {
      type: 'selection',
      width: '50',
    },
    {
      label: '客户名称',
      minWidth: '200',
      render: row => (
        <div class="margin-bottom-5">
          <copy-text>
            {CAN_VIEW ? (
              <router-link
                to={{
                  name: 'ClueManageDevelopDetail',
                  params: {
                    id: row?.devId,
                  },
                }}
              >
                {row?.customerName}
              </router-link>
            ) : (
              <div>{row?.customerName}</div>
            )}
          </copy-text>
          {row?.clueType && (
            <status-label
              value={row.clueType}
              options={CLUE_TYPE_LIST}
              mode="tag"
              class="margin-right-10"
            />
          )}
          {row?.regionName && (
            <el-tag type="success">{row.regionName}</el-tag>
          )}
        </div>
      ),
    },
    {
      label: '所属BD',
      minWidth: '100',
      render: row => (
        <div>{row?.ownerName}</div>
      ),
    },
    {
      label: '开发状态',
      minWidth: '100',
      render: row => (
        <div class={{
          'color-primary': DEVELOP_STATE_ENUM.IN_DEVELOP === row.devState,
          'color-success': DEVELOP_STATE_ENUM.CONVERTED === row.devState,
          'color-warning': DEVELOP_STATE_ENUM.INVALID === row.devState,
        }} >
          {filters.getEnumLabel(DEVELOP_STATE_LIST, row.devState ?? '')}
        </div >
      ),
    },
    {
      label: '开发进度',
      minWidth: '150',
      render: row => (
        <div class='flex flex-align-center'>
          {customizeFormatContent(row)}
          {row.remark
            && <el-tooltip
              effect="dark"
              content={row.remark}
              placement="top"
            >
              <el-icon
                class="text-color-red margin-left-5"
              ><Warning /></el-icon>
            </el-tooltip>
          }
        </div>
      ),
    },
    {
      label: '开发天数',
      minWidth: '100',
      render: row => (
        <div>{calculateTime(row?.distributionTime, row?.conversionTime)}</div>
      ),
    },
    {
      label: '分配时间',
      minWidth: '150',
      render: row => (
        <div>{formatTime(row?.distributionTime)}</div>
      ),
    },
    {
      label: '操作',
      minWidth: '200',
      fixed: 'right',
      render: row => (
        <div>
          {CAN_SUBMIT && DEVELOP_STATE_ENUM.IN_DEVELOP === row.devState
            && <el-button type="text" onClick={() => handleSubmitResult(row)}>提交结果</el-button>}
          {CAN_FEEDBACK && DEVELOP_STATE_ENUM.IN_DEVELOP === row.devState
            && <el-button type="text" onClick={() => handleDevelopFeedback(row)}>开发反馈</el-button>}
          {CAN_ACTIVE && DEVELOP_STATE_ENUM.INVALID === row.devState
            && <el-button type="text" onClick={() => handleOpenActiveClueDialog(row)}>重新激活</el-button>}
          {CAN_VIEW_CUSTOMER_DETAIL && row?.jumpCustomerId && DEVELOP_STATE_ENUM.CONVERTED === row.devState
            && <el-button type="text" onClick={() => handleViewCustomerDetail(row)}>查看档案</el-button>}
        </div>
      ),
    },
  ];
};

export const clueRenderColumns = (
  calculateTime: (publicTime: number) => string,
  CAN_VIEW: boolean,
): IColumnsItem<ICustomerClueDevPageResListItem>[] => {
  return [
    {
      type: 'selection',
      width: '50',
    },
    {
      label: '客户名称',
      minWidth: '200',
      render: row => (
        <div class="margin-bottom-5">
          <copy-text>
            {CAN_VIEW ? (
              <router-link
                to={{
                  name: 'ClueManageDevelopDetail',
                  params: {
                    id: row?.devId,
                  },
                }}
              >
                {row?.customerName}
              </router-link>
            ) : (
              <div>{row?.customerName}</div>
            )}
          </copy-text>
          {row?.clueType && (
            <status-label
              value={row.clueType}
              options={CLUE_TYPE_LIST}
              mode="tag"
              class="margin-right-10"
            />
          )}
          {row?.regionName && (
            <el-tag type="success">{row.regionName}</el-tag>
          )}
        </div>
      ),
    },
    {
      label: '开发状态',
      minWidth: '100',
      render: row => (
        <div>
          {filters.getEnumLabel(DEVELOP_STATE_LIST, row.devState ?? '')}
        </div>
      ),
    },
    {
      label: '公海时长',
      minWidth: '100',
      render: row => (
        <div>{calculateTime(row?.publicTime)}</div>
      ),
    },
    {
      label: '释放公海次数',
      minWidth: '100',
      render: row => (
        <div>{row?.publicCount}</div>
      ),
    },
    {
      label: '线索创建人',
      minWidth: '100',
      render: row => (
        <div>{row?.clueCreatorName}</div>
      ),
    },
    {
      label: '线索流入时间',
      minWidth: '150',
      render: row => (
        <div>{formatTime(row?.publicTime)}</div>
      ),
    },
  ];
};
