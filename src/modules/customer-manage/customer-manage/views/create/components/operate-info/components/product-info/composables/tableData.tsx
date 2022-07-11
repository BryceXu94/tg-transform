import { IColumnsItem } from '@/components/custom-table/package/type.d';

import DictionarySelect from '@/components/dictionary-select/index.vue';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { filters } from '@/core/plugins/filter';
import { IDictionaryItem } from '@/hooks/use-dictionary/types';
import {
  IDetailBusinessInfoResBrandListItemSaleChannelListItem,
  IDetailBusinessInfoResBrandListItemCooperationModeListItem,
  IDetailBusinessInfoResBrandListItemCoreCategoryListItem,
} from '@/modules/customer-manage/customer-manage/api/types';

// 销售渠道
export const channelRenderColumns = (
  length: number,
  handleChannelDelete: ($index: number, index: number) => void,
  handleChannelAdd: (index: number) => void,
  $index: number,
  isEdit: boolean,
  handleSelectChannel: (e: string, index: number, $index: number) => void,
  channelRepeat: {
    [key: number]: string[];
  } = {},
  saleChannel: IDictionaryItem[],
): IColumnsItem<IDetailBusinessInfoResBrandListItemSaleChannelListItem>[] => {
  const renderTem: IColumnsItem<IDetailBusinessInfoResBrandListItemSaleChannelListItem>[] = [
    {
      label: '销售渠道',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>销售渠道</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].channelCode`}
            rules={[
              { required: true, message: '请选择销售渠道', trigger: ['blur', 'change'] },
            ]}
          >
            <DictionarySelect
              v-model={row.channelCode}
              placeholder="请选择销售渠道"
              dictionary={CX_DICTIONARY_KEY.SALE_CHANNEL}
              key={$index}
              onChange={(e: string) => handleSelectChannel(e, index, $index)}
              disabledOption={channelRepeat[$index]}
            />
          </el-form-item>
            : <div>{filters.getEnumLabel(saleChannel, row?.channelCode)}</div> }
        </>
      ),
    },
    {
      label: '销售占比',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>销售占比</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].salesRatio`}
            rules={[
              { required: true, message: '请输入销售占比', trigger: ['blur', 'change'] },
            ]}
          >
            <input-number
              v-model={row.salesRatio}
              placeholder="请输入销售占比"
              max={100}
              precision={2}
              min={0}
              v-slots={{
                append: () => {
                  return (
                    <div>%</div>
                  );
                },
              }}
            >
            </input-number>
          </el-form-item>
            : <div>{row?.salesRatio && <span>{row?.salesRatio}%</span>}</div>}
        </>
      ),
    },
    {
      label: '',
      width: '100px',
      renderHeader: () => {
        return (
          <div>
            <el-button type="text" onClick={() => handleChannelAdd($index)}>添加渠道</el-button>
          </div>
        );
      },
      render: (row, index) => (
        <el-form-item
          label=""
        >
           {length > 1 && <el-button
            type="text"
            class="btn-red"
            onClick={() => handleChannelDelete($index, index)}
          >删除</el-button>}
        </el-form-item>
      ),
    },
  ];

  return isEdit ? renderTem : renderTem.splice(0, renderTem.length - 1);
};

// 合作模式
export const cooperationRenderColumns = (
  length: number,
  handleCooperationDelete: (parentIndex: number, index: number) => void,
  handleCooperationAdd: (index: number) => void,
  $index: number,
  isEdit: boolean,
  handleSelectType: (type: string, index: number, $index: number) => void,
  cooperationRepeat: {
    [key: number]: string[];
  } = {},
  cooperation: IDictionaryItem[],
): IColumnsItem<IDetailBusinessInfoResBrandListItemCooperationModeListItem>[] => {
  const renderTem: IColumnsItem<IDetailBusinessInfoResBrandListItemCooperationModeListItem>[] = [
    {
      label: '合作模式',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>合作模式</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].cooperationType`}
            rules={[
              { required: true, message: '请选择合作模式', trigger: ['blur', 'change'] },
            ]}
          >
            <DictionarySelect
              v-model={row.cooperationType}
              placeholder="请选择合作模式"
              dictionary={CX_DICTIONARY_KEY.COOPERATION_MODE}
              key={$index}
              onChange={(e: string) => handleSelectType(e, index, $index)}
              disabledOption={cooperationRepeat[$index]}
            />
          </el-form-item> : <div>{filters.getEnumLabel(cooperation, row?.cooperationType)}</div>}
        </>
      ),
    },
    {
      label: '模式占比',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>模式占比</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].cooperationRatio`}
            rules={[
              { required: true, message: '请输入模式占比', trigger: ['blur', 'change'] },
            ]}
          >
            <input-number
              v-model={row.cooperationRatio}
              placeholder="请输入模式占比"
              max={100}
              precision={2}
              min={0}
              v-slots={{
                append: () => {
                  return (
                    <div>%</div>
                  );
                },
              }}
            />
          </el-form-item> : <div>{row?.cooperationRatio && <span>{row?.cooperationRatio}%</span>}</div>}
        </>
      ),
    },
    {
      label: '',
      width: '110px',
      renderHeader: () => {
        return (
          <div>
            <el-button type="text" onClick={() => handleCooperationAdd($index)}>添加合作模式</el-button>
          </div>
        );
      },
      render: (row, index) => (
        <el-form-item
          label=""
        >
           {length > 1 && <el-button
             type="text"
             class="btn-red"
            onClick={() => handleCooperationDelete($index, index)}
          >删除</el-button>}
        </el-form-item>
      ),
    },
  ];

  return isEdit ? renderTem : renderTem.splice(0, renderTem.length - 1);
};

// 核心品类
export const categoryRenderColumns = (
  length: number,
  handleCategoryDelete: ($index: number, index: number) => void,
  handleCategoryAdd: (index: number) => void,
  $index: number,
  isEdit: boolean,
  category: IDictionaryItem[],
  handleSelectCategory: (
    type: string[],
    index: number,
    $index: number) => void,
): IColumnsItem<IDetailBusinessInfoResBrandListItemCoreCategoryListItem>[] => {
  const renderTem: IColumnsItem<IDetailBusinessInfoResBrandListItemCoreCategoryListItem>[] = [
    {
      label: '品类名称',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>品类名称</span>
          </div>
        );
      },
      // eslint-disable-next-line func-names
      render: (row, index) => (function () {
        return (<>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].category`}
            rules={[
              { required: true, message: '请输入品类名称', trigger: ['blur', 'change'] },
            ]}
          >
            <el-cascader
              v-model={row.category}
              options={category}
              clearable
              style="width: 100%"
              placeholder="请输入品类名称"
              onChange={(e: string[]) => { handleSelectCategory(e, index, $index); }}
              props={
                {
                  value: 'label',
                }
              }
              max={100}
            />
          </el-form-item> : <div>{row?.category}</div>}
        </>
        );
      }()),
    },
    {
      label: '品类占比',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>品类占比</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].ratio`}
            rules={[
              { required: true, message: '请输入品类占比', trigger: ['blur', 'change'] },
            ]}
          >
            <input-number
              v-model={row.ratio}
              placeholder="请输入品类占比"
              max={100}
              precision={2}
              min={0}
              v-slots={{
                append: () => {
                  return (
                    <div>%</div>
                  );
                },
              }}
            />
          </el-form-item> : <div>{row?.ratio && <span>{row?.ratio}%</span>}</div>}
        </>
      ),
    },
    {
      label: '加工均价/元',
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].machiningAveragePrice`}
          >
            <input-number
              v-model={row.machiningAveragePrice}
              placeholder="请输入加工均价/元"
              max={100000}
              precision={2}
              min={0}
            />
          </el-form-item> : <div>{row?.machiningAveragePrice}</div>}
        </>
      ),
    },
    {
      label: '客销单价/元',
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].perTicketSales`}
          >
            <input-number
              v-model={row.perTicketSales}
              placeholder="请输入客销单价/元"
              max={100000}
              precision={2}
              min={0}
            />
          </el-form-item> : <div>{row?.perTicketSales}</div>}
        </>
      ),
    },
    {
      label: '',
      width: '100px',
      renderHeader: () => {
        return (
          <div>
            <el-button type="text" onClick={() => handleCategoryAdd($index)}>添加品类</el-button>
          </div>
        );
      },
      render: (row, index) => (
        <el-form-item
          label=""
        >
           {length > 1 && <el-button
            type="text"
            class="btn-red"
            onClick={() => handleCategoryDelete($index, index)}
          >删除</el-button>}
        </el-form-item>
      ),
    },
  ];

  return isEdit ? renderTem : renderTem.splice(0, renderTem.length - 1);
};
