import { computed } from 'vue';
import {
  BUSINESS_MODE_NO_LIST,
  DESENSITIZE_DECRYPT_TYPE_ENUM,
} from '@/constant';
import {
  RISK_LEVEL_LIST,
  CREDIT_TYPE_ENUM,
  CREDIT_STATE_LIST,
  BILL_TYPE_LIST,
} from '@/modules/customer-board/customer-risk/constant';
import { ITableColumnsItem } from '@/components/tgo-table/package/type';
import { IFinanceRiskInfoPageResListItem } from '../type';
import { usePermissionConfig } from '@/modules/customer-board/customer-risk/use-permission-config';
import { getLabelByVal } from '@/core/plugins/filter';
import { Top, Bottom } from '@element-plus/icons-vue';

export const useTableColumns = (props: {
  handleViewLog: (row: IFinanceRiskInfoPageResListItem) => void;
}) => {
  const {
    CAN_VIEW_LOG,
    CAN_VIEW_DETAIL,
  } = usePermissionConfig();

  const tableColumns = computed<ITableColumnsItem<IFinanceRiskInfoPageResListItem>[]>(() => {
    const {
      handleViewLog,
    } = props;

    return [
      {
        label: '客户名称',
        minWidth: '150',
        render: row => (
          <div class="margin-bottom-5">
            <copy-text>
              {CAN_VIEW_DETAIL.value ? (
                <router-link
                  to={{
                    name: 'CustomerManageCustomerDetail',
                    params: {
                      id: row?.customerId,
                    },
                  }}
                >
                  {row?.customerName}
                </router-link>
              ) : (
                <span>{row?.customerName}</span>
              )}
            </copy-text>
            {row?.regionName && (
              <el-tag type="warning" effect="plain" class="margin-right-10">{row.regionName}</el-tag>
            )}
            {row?.businessType && (
              <el-tag type='success'>
                {getLabelByVal(BUSINESS_MODE_NO_LIST, row.businessType)}
              </el-tag>
            )}
          </div>
        ),
      },
      {
        label: '风险等级',
        minWidth: '100',
        render: row => (
          <div class="flex flex-align-center">
            {getLabelByVal(RISK_LEVEL_LIST, row?.riskLevel)}
            <el-icon color={['', '#D9001B', '#70B603'][row?.riskTrend]}>
              {['', <Top />, <Bottom />][row?.riskTrend]}
            </el-icon>
          </div>
        ),
      },
      {
        label: '等级更新日期',
        minWidth: '120',
        prop: 'levelUpdateDate',
        type: 'date',
        format: 'YYYY-MM-DD',
      },
      {
        label: '授信状态',
        minWidth: '100',
        type: 'enum',
        prop: 'creditGrantingState',
        options: CREDIT_STATE_LIST,
      },
      {
        label: '授信额度（元）',
        minWidth: '100',
        render: row => (
          <div>
            <encryption
              key={row?.customerId}
              data={{
                businessId: row?.customerId,
                dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.FULLY_DESENSITIZE,
                content: row?.creditAmount,
                dateColumn: 'creditAmount',
              }}
            ></encryption>
            {row?.creditMark === CREDIT_TYPE_ENUM.GROUP_CREDIT ? (
              <el-tag class="margin-top-5">集团授信</el-tag>
            ) : ''}
          </div>
        ),
      },
      {
        label: '可用额度（元）',
        minWidth: '100',
        render: row => (
          <encryption
            key={row?.customerId}
            data={{
              businessId: row?.customerId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.FULLY_DESENSITIZE,
              content: row?.availableAmount,
              dateColumn: 'availableAmount',
            }}
          ></encryption>
        ),
      },
      {
        label: '出账类型',
        minWidth: '100',
        type: 'enum',
        prop: 'billingDate',
        options: BILL_TYPE_LIST,
      },
      {
        label: '待回款金额（元）',
        minWidth: '100',
        render: row => (
          <encryption
            key={row?.customerId}
            data={{
              businessId: row?.customerId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.FULLY_DESENSITIZE,
              content: row?.waitReturnAmount,
              dateColumn: 'waitReturnAmount',
            }}
          ></encryption>
        ),
      },
      {
        label: '所属BD',
        minWidth: '100',
        prop: 'ownerName',
      },
      {
        label: '更新记录',
        minWidth: '100',
        fixed: 'right',
        render: row => (
          <div class='flex flex-align-center'>
            {CAN_VIEW_LOG.value && (
              <el-button type="text" onClick={() => handleViewLog(row)}>查看</el-button>
            )}
          </div>
        ),
      },
    ];
  });
  return {
    tableColumns,
  };
};
