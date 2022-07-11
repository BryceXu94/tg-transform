import { QuestionFilled } from '@element-plus/icons-vue';
import { filters } from '@/core/plugins/filter';
import { IDictionaryItem } from '@/hooks/use-dictionary/types';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import DictionarySelect from '@/components/dictionary-select/index.vue';
import { IColumnsItem } from '@/components/custom-table/package/type.d';
import {
  IDetailAccountingPeriodCustomerAccountingPeriodListItem,
} from '@/modules/customer-manage/customer-manage/api/types';

// 货款账期
export const renderColumns = (
  length: number,
  handleDelete: (index: number) => void,
  handleAdd: () => void,
  handleShowExplain: () => void,
  isEdit: boolean,
  customerSettlementPeriodList: IDetailAccountingPeriodCustomerAccountingPeriodListItem[],
  periodOptions: IDictionaryItem[],
): IColumnsItem<IDetailAccountingPeriodCustomerAccountingPeriodListItem>[] => {
  // 回款周期(天)判断重复校验
  const validate = (rule: any, value: any, callback: (err?: Error) => void) => {
    if (value === '') {
      callback(new Error('请输入回款周期(天)'));
    } else if (customerSettlementPeriodList.filter((item) => {
      return String(item.settlementPeriodDays) === String(value);
    }).length > 1) {
      callback(new Error('回款周期(天)不能重复！'));
    } else {
      callback();
    }
  };
  const renderTem: IColumnsItem<IDetailAccountingPeriodCustomerAccountingPeriodListItem>[] = [
    {
      label: '回款周期(天)',
      minWidth: '150px',
      renderHeader: () => {
        return (
          <el-row align="middle">
            <span class="must-icon__red"></span>
            <span>回款周期(天)</span>
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
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].settlementPeriodDays`}
            rules={{ required: true, validator: validate, trigger: ['blur', 'change'] }}
          >
            <DictionarySelect
              v-model={row.settlementPeriodDays}
              placeholder="请输入回款周期(天)"
              dictionary={CX_DICTIONARY_KEY.SETTLEMENT_PERIOD_DAYS}
              key={index}
            />
          </el-form-item>
            : <div>{filters.getEnumLabel(periodOptions, row?.settlementPeriodDays)}</div>}
        </>
      ),
    },
    {
      label: '回款比例',
      minWidth: '150px',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>回款比例</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
         {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].returnPercent`}
            rules={[
              { required: true, message: '请输入回款比例', trigger: ['blur', 'change'] },
            ]}
          >
            <input-number
              v-model={row.returnPercent}
              placeholder="请输入回款比例"
              max={100}
              min={0}
              precision={2}
              v-slots={{
                append: () => {
                  return (
                    <div>%</div>
                  );
                },
              }}
            />
          </el-form-item>
           : <div>{row?.returnPercent && <span>{row?.returnPercent}%</span>}</div>}
        </>
      ),
    },
    {
      label: '',
      width: '90px',
      renderHeader: () => {
        return (
          <div>
            <el-button type="text" onClick={() => handleAdd()}>添加周期</el-button>
          </div>
        );
      },
      render: (row, index) => (
        <el-form-item
          label=""
        >
           {length > 1 && <el-button
            class="btn-red"
            type="text"
            onClick={() => handleDelete(index)}
          >删除</el-button>}
        </el-form-item>
      ),
    },
  ];
  return isEdit ? renderTem : [{
    label: '期数',
    type: 'index',
    width: '80',
  }, ...renderTem.splice(0, renderTem.length - 1)];
};
