import { QuestionFilled } from '@element-plus/icons-vue';
import { IDictionaryItem } from '@/hooks/use-dictionary/types';
import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { ACCOUNT_TYPE_LIST, ENABLE_DISABLE_LIST, DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant/global';
import { filters } from '@/core/plugins/filter';

// 结算周期
export const periodRenderColumns = (
  handleShowExplain: () => void,
  periodOptions: IDictionaryItem[],
): IColumnsItem<any>[] => {
  return [
    {
      label: '期数',
      type: 'index',
      width: '80',
    },
    {
      label: '回款周期(天)',
      renderHeader: () => {
        return (
          <el-row align='middle'>
            回款周期(天)
            <el-icon
              size={18}
              class="margin-left-10"
              style={{ cursor: 'pointer' }}
              onClick={handleShowExplain}
            >
              <QuestionFilled />
            </el-icon>
            </el-row>
        );
      },
      render: row => (
        <div>{filters.getEnumLabel(periodOptions, row?.settlementPeriodDays)}</div>
      ),
    },
    {
      label: '回款比例',
      render: row => (
        <div>{row?.returnPercent && <span>{row?.returnPercent}%</span>}</div>
      ),
    },
  ];
};

// 发票信息
export const invoiceRenderColumns = (
  pageTab: string,
): IColumnsItem<any>[] => {
  return [
    {
      label: '接收邮箱',
      render: row => (
        <encryption
          data={{
            businessId: row?.customerAddressId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.EMAIL,
            content: row?.email,
            pageTab,
            dateColumn: 'email',
          }}
        ></encryption>
      ),
    },
    {
      label: '收件人',
      render: row => (
        <encryption
          data={{
            businessId: row?.customerAddressId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
            content: row?.recipient,
            pageTab,
            dateColumn: 'recipient',
          }}
        ></encryption>
      ),
    },
    {
      label: '收件电话',
      render: row => (
        <encryption
          data={{
            businessId: row?.customerAddressId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
            content: row?.recipientPhone,
            pageTab,
            dateColumn: 'recipientPhone',
          }}
        ></encryption>
      ),
    },
    {
      label: '收件地址',
      render: row => (
        <encryption
          data={{
            businessId: row?.customerAddressId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.ADDRESS,
            content: [row?.region, row?.addressDetail],
            prefix: `${row?.province}${row?.city}`,
            pageTab,
            dateColumn: ['region', 'addressDetail'],
          }}
        ></encryption>
      ),
    },
  ];
};

// 银行卡信息
export const bankRenderColumns = (
  pageTab: string,
): IColumnsItem<any>[] => {
  return [
    {
      label: '银行卡名称',
      render: row => (
        <div>{row?.bankName}</div>
      ),
    },
    {
      label: '开户行支行',
      render: row => (
        <encryption
          data={{
            businessId: row?.bankAccountId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.BACK_ACCOUNT_NAME,
            content: row?.subBankName,
            pageTab,
            dateColumn: 'subBankName',
          }}
        ></encryption>
      ),
    },
    {
      label: '开户人',
      render: row => (
        <encryption
          data={{
            businessId: row?.bankAccountId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
            content: row?.accountHolder,
            pageTab,
            dateColumn: 'accountHolder',
          }}
        ></encryption>
      ),
    },
    {
      label: '银行卡账号',
      render: row => (
        <encryption
          data={{
            businessId: row?.bankAccountId,
            dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.BACK_ACCOUNT_NO,
            content: row?.accountNo,
            pageTab,
            dateColumn: 'accountNo',
          }}
        ></encryption>
      ),
    },
    {
      label: '账户类型',
      render: row => (
        <div>{filters.getEnumLabel(ACCOUNT_TYPE_LIST, row?.accountType)}</div>
      ),
    },
    {
      label: '启用状态',
      render: row => (
        <div>{filters.getEnumLabel(ENABLE_DISABLE_LIST, row?.enableState)}</div>
      ),
    },
  ];
};
