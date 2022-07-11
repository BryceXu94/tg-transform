import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { formatTime } from '@tiangong/utils';
import { filters } from '@/core/plugins/filter';
import {
  DEMAND_STATE_ENUM,
  DEMAND_STATE_LIST,
  DEMAND_TYPE_ENUM,
  DEMAND_TYPE_LIST,
  ORDER_TYPE_ENUM,
  ORDER_TYPE_LIST,
  ORDER_STATE_LIST,
  ORDER_ERROR_STATE_LIST,
} from '@/modules/demand-manage/platform-demand/constant';
import { IDemandPageListItem } from '@/modules/demand-manage/platform-demand/api/types';

export const demandRenderColumns = (
  CAN_VIEW: boolean,
  CAN_UPDATE: boolean,
  CAN_CREATE_AGAIN: boolean,
): IColumnsItem<IDemandPageListItem>[] => {
  const placeholder = '--';
  return [
    {
      label: '图片',
      minWidth: '100',
      fixed: 'left',
      render: row => (
        <div style="width: 80px; height: 80px">
          {row?.customerPictures?.length && <el-image
            style="width: 100%; height: 100%"
            src={row.customerPictures[0]}
            preview-src-list={row.customerPictures}
            preview-teleported
            fit="cover"
          ></el-image>}
        </div>
      ),
    },
    {
      label: '款号SPU',
      minWidth: '150',
      render: row => (
        <div class="margin-bottom-5">
          <copy-text>
            {CAN_VIEW ? (
              <router-link
                to={{
                  name: 'DemandManagePlatformDemandDetail',
                  params: {
                    id: row?.demandId,
                  },
                }}
              >
                {row?.styleCode}
              </router-link>
            ) : (
              <span>{row?.styleCode}</span>
            )}
          </copy-text>
          {row?.regionName && <el-tag type="warning" effect="plain">{row.regionName}</el-tag>}
          {row?.styleType && <el-tag
            class="margin-left-10"
            type={
              row.styleType === DEMAND_TYPE_ENUM.PLATFORM_BUSINESS ? 'success' : ''
            }
          >{filters.getEnumLabel(DEMAND_TYPE_LIST, row.styleType)}</el-tag>}
        </div>
      ),
    },
    {
      label: '需求单号',
      minWidth: '150',
      render: row => (
        <div>{row?.demandCode}</div>
      ),
    },
    {
      label: '客户款号',
      minWidth: '150',
      render: row => (
        <div>{row?.customerStyleCode || placeholder}</div>
      ),
    },
    {
      label: '平台单号',
      minWidth: '150',
      render: row => (
        <div>
          <p>{row?.platformOrderCode || placeholder}</p>
          {row?.isFirstOrder && <el-tag
            class="margin-bottom-5"
            type={
              row.isFirstOrder === ORDER_TYPE_ENUM.FIRST_ORDER ? 'success' : 'warning'
            }>
            {filters.getEnumLabel(ORDER_TYPE_LIST, row.isFirstOrder)}
          </el-tag>}
        </div>
      ),
    },
    {
      label: '客户',
      minWidth: '150',
      render: row => (
        <div>{row?.customerName}</div>
      ),
    },
    {
      label: '进度情况',
      minWidth: '100',
      render: row => (
        <div style={{ color: row?.demandState === DEMAND_STATE_ENUM.COMPLETED ? '#5fcd5a' : '' }}>
          {filters.getEnumLabel(DEMAND_STATE_LIST,
            row?.demandState === DEMAND_STATE_ENUM.IN_PROGRESS ? row?.subState : row?.demandState)}
        </div>
      ),
    },
    {
      label: '订单进度',
      minWidth: '100',
      render: row => (
        <div>
          <p>{filters.getEnumLabel(ORDER_STATE_LIST, row?.orderState) || placeholder}</p>
          <p>{filters.getEnumLabel(ORDER_ERROR_STATE_LIST, row?.orderErrorState)}</p>
        </div>
      ),
    },
    {
      label: '销售BD',
      minWidth: '150',
      render: row => (
        <div>{row?.bdName}</div>
      ),
    },
    {
      label: '预计成交额',
      minWidth: '100',
      render: row => (
        <div>{row?.preTotalAmount}元</div>
      ),
    },
    {
      label: '订单单价',
      minWidth: '150',
      render: row => (
        <div>{row?.orderPrice}元</div>
      ),
    },
    {
      label: '订单数量',
      minWidth: '100',
      render: row => (
        <div>{row?.quantity}件</div>
      ),
    },
    {
      label: '客户期望交期',
      minWidth: '150',
      render: row => (
        <div>{formatTime(row?.expectDeliveryDate, 'yyyy-MM-dd')}</div>
      ),
    },
    {
      label: '创建信息',
      minWidth: '230',
      render: row => (
        <div>
          <p>创建人：{row?.creatorName}</p>
          <p>创建时间：{formatTime(row?.createdTime)}</p>
        </div>
      ),
    },
    {
      label: '操作',
      minWidth: '100',
      fixed: 'right',
      render: row => (
        <div>
          {CAN_VIEW
            && <router-link
              to={{
                name: 'DemandManagePlatformDemandDetail',
                params: {
                  id: row?.demandId,
                },
              }}
            >
              <el-button type="text">查看详情</el-button>
            </router-link>}
          {CAN_UPDATE && row?.demandState === DEMAND_STATE_ENUM.DEMAND_TO_BE_CONFIRMED
            && <router-link
              to={{
                name: 'DemandManagePlatformDemandUpdate',
                params: {
                  id: row?.demandId,
                },
              }}
            >
              <el-button type="text">修改需求</el-button>
            </router-link>}
          {CAN_CREATE_AGAIN && row?.demandState === DEMAND_STATE_ENUM.COMPLETED
            && <router-link
              to={{
                name: 'DemandManagePlatformDemandCreateAgain',
                params: {
                  id: row?.demandId,
                },
              }}
            >
              <el-button type="text">再次下单</el-button>
            </router-link>}
        </div>
      ),
    },
  ];
};
