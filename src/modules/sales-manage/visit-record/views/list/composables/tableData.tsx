import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { formatTime } from '@tiangong/utils';
import { filters } from '@/core/plugins/filter';
import { Warning } from '@element-plus/icons-vue';
import {
  REGISTER_STATE_LIST,
  ABNORMAL_STATE_LIST,
  ABNORMAL_STATE_ENUM,
  FEEDBACK_STATE_ENUM,
  VISIT_TYPE_LIST,
  CUSTOMER_TYPE_LIST,
} from '@/modules/sales-manage/visit-record/constant';
import { IListItemCustomer } from '../types';

// 拜访记录
export const customerRenderColumns = (
  handleUpdate: (row: IListItemCustomer) => void,
  CAN_VIEW_CUSTOMER_DETAIL: boolean,
  CAN_ABNORMAL_FEEDBACK: boolean,
): IColumnsItem<IListItemCustomer>[] => {
  return [
    {
      label: '签到照片',
      minWidth: '100',
      render: row => (
        <div style="width: 80px; height: 80px">
          {row?.clockPictureList?.length && <el-image
            style="width: 100%; height: 100%"
            src={row.clockPictureList[0]}
            preview-src-list={row.clockPictureList}
            preview-teleported
            fit="cover"
          ></el-image>}
        </div>
      ),
    },
    {
      label: '签到信息',
      minWidth: '170',
      render: row => (
        <div>
          <p>{row?.visitPersonName}</p>
          <p>{formatTime(row?.clockTime)}</p>
        </div>
      ),
    },
    {
      label: '拜访类型',
      minWidth: '100',
      render: row => (
        <div>
          {filters.getEnumLabel(VISIT_TYPE_LIST, row?.visitType)}
        </div>
      ),
    },
    {
      label: '客户名称',
      minWidth: '200',
      render: row => (
        <div>
          <p>{row?.customerName}</p>
          <status-label
            value={row?.customerType}
            options={CUSTOMER_TYPE_LIST}
            mode="tag"
          />
        </div>
      ),
    },
    {
      label: '拜访人员',
      minWidth: '90',
      render: row => (
        <div>{row?.visitPersonName}</div>
      ),
    },
    {
      label: '签到时间',
      minWidth: '170',
      render: row => (
        <div>{formatTime(row?.clockTime)}</div>
      ),
    },
    {
      label: '拜访总结',
      minWidth: '160',
      render: row => (
        <ul class="visit_summary">
          {row?.summaryVos?.slice(0, 2).map((item) => {
            return (
              <el-tooltip
                effect="dark"
                content={`${item?.summaryTypeName}：${item?.summaryContent}`}
                placement="top"
              >
                <li class="visit_summary_item">
                  <span class="color-success">{item?.summaryTypeName}：</span>
                  {item?.summaryContent}
                </li>
              </el-tooltip>
            );
          })}
          {CAN_VIEW_CUSTOMER_DETAIL && row?.summaryVos?.length > 2 ? (
            <router-link
              to={{
                name: 'SalesManageVisitRecordDetail',
                params: {
                  id: row.visitId,
                },
              }}
            >
              <el-button type="text">[...]</el-button>
            </router-link>
          ) : ''}
        </ul>
      ),
    },
    {
      label: '是否登记',
      minWidth: '90',
      render: row => (
        <div>{filters.getEnumLabel(REGISTER_STATE_LIST, row?.isRegister)}</div>
      ),
    },
    {
      renderHeader: () => (
        <div>
          <span style={'position:relative'}>异常标记</span>
          <el-tooltip
            effect="dark"
            content="当打卡位置不在客户经营地址范围之内，则属于异常标记，需要异常反馈"
            placement="top"
          >
            <el-icon style="position:absolute; left:70px; top:4px" size="20">
              <Warning />
            </el-icon>
          </el-tooltip>
        </div>
      ),
      minWidth: '100',
      render: row => (
        <div class={row.isAbnormal === ABNORMAL_STATE_ENUM.WITH ? 'color-error' : ''}>
          {filters.getEnumLabel(ABNORMAL_STATE_LIST, row?.isAbnormal)}
        </div>
      ),
    },
    {
      label: '操作',
      minWidth: '160',
      fixed: 'right',
      render: row => (
        <div>
          {CAN_VIEW_CUSTOMER_DETAIL && (
            <router-link
              to={{
                name: 'SalesManageVisitRecordDetail',
                params: {
                  id: row.visitId,
                },
              }}
            >
              <el-button type="text">查看详情</el-button>
            </router-link>
          )}
          {CAN_ABNORMAL_FEEDBACK
            && row.isAbnormal === ABNORMAL_STATE_ENUM.WITH
            && row.isFeedback === FEEDBACK_STATE_ENUM.FEEDBACK_NONE
            && (
              <el-button type="text" class={'margin-left-12'} onClick={() => handleUpdate(row)}>
                异常反馈
              </el-button>
            )}
        </div>
      ),
    },
  ];
};
