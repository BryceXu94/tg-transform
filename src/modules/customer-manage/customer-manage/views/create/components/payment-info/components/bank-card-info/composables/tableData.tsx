import { IColumnsItem } from '@/components/custom-table/package/type.d';
import DictionarySelect from '@/components/dictionary-select/index.vue';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import {
  ACCOUNT_TYPE_LIST,
  ACCOUNT_TYPE_ENUM,
  ENABLE_DISABLE_LIST,
} from '@/constant/global';
import { filters } from '@/core/plugins/filter';
import {
  IAccountingPeriodSaveBankAccountListItem,
} from '@/modules/customer-manage/customer-manage/api/types';
import { DESENSITIZE_DECRYPT_TYPE_ENUM, BUSINESS_MODE_ENUM } from '@/constant';

// 银行卡检验
const bankCardValidate = (rule: any, value: any, callback: (err?: Error) => void) => {
  if (!(/^[0-9]+$/.test(value))) {
    callback(new Error('请输入正确的银行卡格式！'));
  } else {
    callback();
  }
};

// 银行卡信息
export const renderColumns = (
  length: number,
  handleDelete: (index: number) => void,
  handleAdd: () => void,
  isEdit: boolean,
  handleSelectBank: (item: { label: string; value: string; }, index: number) => void,
  pageTab: string,
  businessType: string,
): IColumnsItem<IAccountingPeriodSaveBankAccountListItem>[] => {
  const renderTem: IColumnsItem<IAccountingPeriodSaveBankAccountListItem>[] = [
    {
      label: '银行卡名称',
      minWidth: '150px',
      renderHeader: () => {
        return (
          <div>
            <span class='must-icon__red'></span>
            <span>银行卡名称</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].bankCode`}
            rules={[
              { required: true, message: '请选择银行', trigger: ['blur', 'change'] },
            ]}
          >
            <DictionarySelect
              v-model={row.bankCode}
              placeholder="请选择银行"
              dictionary={CX_DICTIONARY_KEY.BANK_CODE}
              onChange={(val: string, e: { label: string; value: string; }) => { handleSelectBank(e, index); }}
              key={index}
            />
          </el-form-item> : <div>{row?.bankName}</div>}
        </>
      ),
    },
    {
      label: '开户行支行',
      minWidth: '150px',
      renderHeader: () => {
        return (
          <div>
            <span class='must-icon__red'></span>
            <span>开户行支行</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].subBankName`}
            rules={[
              { required: true, message: '请输入开户行支行', trigger: ['blur', 'change'] },
            ]}
          >
            <el-input
              maxlength={100}
              v-model={row.subBankName} placeholder="请输入开户行支行" />
          </el-form-item> : <encryption
            data={{
              businessId: row?.bankAccountId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.BACK_ACCOUNT_NAME,
              content: row?.subBankName,
              pageTab,
              dateColumn: 'subBankName',
            }}
          ></encryption>}
        </>
      ),
    },
    {
      label: '开户人',
      minWidth: '150px',
      renderHeader: () => {
        return (
          <div>
            <span class='must-icon__red'></span>
            <span>开户人</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].accountHolder`}
            rules={[
              { required: true, message: '请输入开户人', trigger: ['blur', 'change'] },
            ]}
          >
            <el-input maxlength={100} v-model={row.accountHolder} placeholder="请输入开户人" />
          </el-form-item> : <encryption
            data={{
              businessId: row?.bankAccountId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
              content: row?.accountHolder,
              pageTab,
              dateColumn: 'accountHolder',
            }}
          ></encryption>}
        </>
      ),
    },
    {
      label: '银行卡账号',
      minWidth: '400px',
      renderHeader: () => {
        return (
          <div>
            <span class='must-icon__red'></span>
            <span>银行卡账号</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].accountNo`}
            rules={[{ required: true, validator: bankCardValidate, trigger: ['blur', 'change'] }]}
          >
            <el-input
              precision={0}
              maxlength={100}
              v-model={row.accountNo}
              placeholder="请输入银行卡账号" />
          </el-form-item> : <encryption
            data={{
              businessId: row?.bankAccountId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.BACK_ACCOUNT_NO,
              content: row?.accountNo,
              pageTab,
              dateColumn: 'accountNo',
            }}
          ></encryption>}
        </>
      ),
    },
    {
      label: '账号类型',
      minWidth: '400px',
      renderHeader: () => {
        return (
          <div>
            <span class='must-icon__red'></span>
            <span>账号类型</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].accountType`}
            rules={[
              { required: true, message: '请选择账号类型', trigger: ['blur', 'change'] },
            ]}
          >
            <el-select style="width: 100%" v-model={row.accountType} placeholder="请选择账号类型">
              {ACCOUNT_TYPE_LIST.filter(info => info.value === ACCOUNT_TYPE_ENUM.PUBLIC).map((item) => {
                return (<el-option value={item.value} label={item?.label}></el-option>);
              })}
            </el-select>
          </el-form-item> : <div>{filters.getEnumLabel(ACCOUNT_TYPE_LIST, row.accountType!)}</div>}
        </>
      ),
    },
    {
      label: '启用状态',
      minWidth: '150px',
      renderHeader: () => {
        return (
          <div>
            <span class='must-icon__red'></span>
            <span>启用状态</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].enableState`}
          >
            <el-switch
              active-value={'YES'}
              inactive-value={'NO'}
              v-model={row.enableState} />
          </el-form-item> : <div>{filters.getEnumLabel(ENABLE_DISABLE_LIST, row.enableState!)}</div>}
        </>
      ),
    },
    {
      label: '',
      width: '120px',
      renderHeader: () => {
        return (
          <div>
            <el-button type="text" onClick={() => handleAdd()}>添加银行卡信息</el-button>
          </div>
        );
      },
      render: (row, index) => (
        <el-form-item
          label=""
          prop={`data[${index}].status`}
        >
          {(businessType === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS
          || (businessType === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS && length > 1)) && <el-button
            class="btn-red"
            type="text"
            onClick={() => handleDelete(index)}
          >删除</el-button>}
        </el-form-item>
      ),
    },
  ];

  return isEdit ? renderTem : renderTem.splice(0, renderTem.length - 1);
};
