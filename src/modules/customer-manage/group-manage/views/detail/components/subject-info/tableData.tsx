import { getCustomerOptions } from '@/api/query-options';
import { ICustomerInfoSearchResItem } from '@/api/query-options/type.d';
import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { YES_OR_NO_NUMBER_ENUM } from '@/constant';
import { ISubjectItem } from '../../types';

export const renderColumns = (
  handleDelete: (index: number) => void,
  handleChangeCustomer: (ops: ICustomerInfoSearchResItem, index: number) => void,
  formatCustomerOps: (res: any, dataKey: string) => void,
  readOnly: boolean,
  canDelete: boolean,
  groupIfInitAmount: boolean,
  formRules: (
    key: string,
    rules: any,
    value: any,
    callback: (err?: string) => void,
  ) => void,
): IColumnsItem<ISubjectItem>[] => {
  const arrBase: IColumnsItem<ISubjectItem>[] = [
    {
      label: '客户名称',
      minWidth: '120px',
      prop: 'customerName',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red" />客户名称
          </div>
        );
      },
      render: (row, index) => (
        <>
          {readOnly ? (
            row.customerName
          ) : (
            <el-form-item
              prop={`[${index}].customerName`}
              rules={[
                { validator: formRules.bind(this, 'customerName') },
              ]}
            >
              <query-select
                placeholder="请选择客户"
                v-model={[row.customerName, ['trim']]}
                method={getCustomerOptions}
                config={{
                  valueKey: 'customerId',
                  labelKey: 'customerName',
                  keywordQueryKey: 'customerName',
                  valueQueryKey: 'customerName',
                  dataKey: 'data',
                  showValue: true,
                }}
                disabled={groupIfInitAmount && row.isCreditUseRecord === YES_OR_NO_NUMBER_ENUM.YES}
                formatFn={formatCustomerOps}
                onChange={(_: string, option: ICustomerInfoSearchResItem) => handleChangeCustomer(option, index)}
              />
            </el-form-item>
          )}
        </>
      ),
    },
    {
      label: '客户编码',
      minWidth: '120px',
      prop: 'customerCode',
      render: (row, index) => (
        <>
          {readOnly ? (
            row.customerCode
          ) : (
            <el-form-item prop={`[${index}].customerCode`}>
              <el-input v-model={[row.customerCode, ['trim']]} disabled placeholder="自动带出" />
            </el-form-item>
          )}
        </>
      ),
    },
    {
      label: '注册地址',
      minWidth: '200px',
      prop: 'registrationAddress',
      render: (row, index) => (
        <>
          {readOnly ? (
            row.registrationAddress
          ) : (
            <el-form-item prop={`[${index}].registrationAddress`}>
              <el-input v-model={[row.registrationAddress, ['trim']]} disabled placeholder="自动带出" />
            </el-form-item>
          )}
        </>
      ),
    },
  ];
  const arrOperate: IColumnsItem<ISubjectItem>[] = [
    {
      label: '操作',
      width: '80px',
      fixed: 'right',
      render: (row, index) => (
        <div>
          <el-button
            class="color-error"
            type="text"
            onClick={() => handleDelete(index)}
            disabled={!canDelete || (groupIfInitAmount && row.isCreditUseRecord === YES_OR_NO_NUMBER_ENUM.YES)}
          >
            删除
          </el-button>
        </div>
      ),
    },
  ];
  return readOnly ? [...arrBase] : [...arrBase, ...arrOperate];
};
