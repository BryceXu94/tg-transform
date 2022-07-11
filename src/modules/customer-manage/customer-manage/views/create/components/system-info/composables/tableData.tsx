import { IColumnsItem } from '@/components/custom-table/package/type.d';
// import DictionarySelect from '@/components/dictionary-select/index.vue';
// import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import {
  IGetCustomerRelationRes,
  IGetCustomerOptionsByRelationRes,
} from '@/modules/customer-manage/customer-manage/api/types';
import { getCustomerOptionsByRelation } from '@/modules/customer-manage/customer-manage/api';

// 联系信息
export const renderColumns = (
  handleDelete: (index: number) => void,
  handleAdd:() => void,
  handleChangeCustomer: (ops: IGetCustomerOptionsByRelationRes, index: number) => void,
  isEdit: boolean,
): IColumnsItem<IGetCustomerRelationRes>[] => {
  const renderTem: IColumnsItem<IGetCustomerRelationRes>[] = [
    // {
    //   label: '来源系统',
    //   minWidth: '150px',
    //   renderHeader: () => {
    //     return (
    //       <div>
    //         <span class="must-icon__red"></span>
    //         <span>来源系统</span>
    //       </div>
    //     );
    //   },
    //   render: (row, index) => (
    //     <>
    //       {isEdit ? <el-form-item
    //         label=""
    //         prop={`data[${index}].sourceSystemCode`}
    //         rules={[
    //           { required: true, message: '请选择来源系统', trigger: ['blur', 'change'] },
    //         ]}
    //       >
    //         <DictionarySelect
    //           v-model={row.sourceSystemCode}
    //           placeholder="请选择来源系统"
    //           dictionary={CX_DICTIONARY_KEY.CSS_EXTERNAL_SYSTEM_SOURCE}
    //           onChange={(val: string, e: {label: string; value: string;}) => { handleSelectSystem(e, index); }}
    //           key={index}
    //           disabled={!!row?.customerId && PROFILE_STATE_ENUM.AUDIT_PASSED === state}
    //         />
    //       </el-form-item> : <div>{row?.sourceSystemName}</div>}
    //     </>
    //   ),
    // },
    {
      label: '客户名称',
      minWidth: '150px',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>客户名称</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].customerName`}
            rules={[
              { required: true, message: '请选择客户', trigger: ['blur', 'change'] },
            ]}
          >
            <query-select
              placeholder="请选择客户"
              v-model={[row.customerName, ['trim']]}
              method={getCustomerOptionsByRelation}
              config={{
                valueKey: 'customerId',
                labelKey: 'customerName',
                keywordQueryKey: 'customerName',
                valueQueryKey: 'customerName',
                dataKey: 'data',
                showValue: true,
              }}
              onChange={(_: string, option: IGetCustomerOptionsByRelationRes) => handleChangeCustomer(option, index)}
            />
          </el-form-item> : <div>{row?.customerName}</div>}
        </>
      ),
    },
    {
      label: '客户编码',
      minWidth: '150px',
      render: (row, index) => (
        <>
          {
            isEdit ? <el-form-item
              label=""
              prop={`data[${index}].customerCode`}
            >
              <el-input
                v-model={[row.customerCode, ['trim']]}
                placeholder="自动带出，不可编辑"
                disabled={true}
              />
            </el-form-item> : <div>{row?.customerCode}</div>
          }
        </>
      ),
    },
    {
      label: '',
      width: '120px',
      renderHeader: () => {
        return (
          <div>
            <el-button type="text" onClick={() => handleAdd()}>添加主体关联</el-button>
          </div>
        );
      },
      render: (row, index) => (
        <el-form-item
          label=""
          prop={`data[${index}].status`}
        >
          <el-button
            class="btn-red"
            type="text"
            onClick={() => handleDelete(index)}
          >
            删除
          </el-button>
        </el-form-item>
      ),
    },
  ];
  return isEdit ? renderTem : renderTem.splice(0, renderTem.length - 1);
};
