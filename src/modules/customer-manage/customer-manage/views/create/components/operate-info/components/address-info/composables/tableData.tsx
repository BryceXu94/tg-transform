import { IColumnsItem } from '@/components/custom-table/package/type.d';
import {
  IBusinessInfoSaveReqShippingAddressItem,
} from '@/modules/customer-manage/customer-manage/api/types';
import DictionarySelect from '@/components/dictionary-select/index.vue';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { YES_NO_LIST, DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant';
import { filters } from '@/core/plugins/filter';
import { IDictionaryItem } from '@/hooks/use-dictionary/types';

// 地址信息
export const renderColumns = (length: number,
  handleDelete: (index: number) => void,
  handleAdd: () => void,
  isEdit: boolean,
  handleChangeAddress: (list: [], index: number) => void,
  address: IDictionaryItem[],
  handleIsDefault: (value: string, index: number) => void,
  handleSelectType: (value: string, index: number) => void,
  pageTab: string): IColumnsItem<any>[] => {
  const renderTem: IColumnsItem<IBusinessInfoSaveReqShippingAddressItem>[] = [
    {
      label: '收件人',
      minWidth: '150px',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>收件人</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].recipient`}
            rules={[
              { required: true, message: '请输入收件人', trigger: ['blur', 'change'] },
            ]}
          >
            <el-input
              v-model={row.recipient}
              placeholder="请输入收件人"
              maxlength="100"
            >
            </el-input>
          </el-form-item> : <encryption
            data={{
              businessId: row?.customerAddressId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
              content: row?.recipient,
              pageTab,
              dateColumn: 'recipient',
            }}
          ></encryption>}
        </>
      ),
    },
    {
      label: '来源类型：',
      minWidth: '150px',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>来源类型</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].sourceType`}
          >
            <el-input disabled v-model={row.sourceType}></el-input>
          </el-form-item> : <div>{row?.sourceType}</div>}
        </>
      ),
    },
    {
      label: '收件电话',
      minWidth: '150px',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>收件电话</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].recipientPhone`}
            rules={[
              {
                required: true,
                trigger: ['blur'],
                validator: (rule: any, value: any, callback: (err?: Error) => void) => {
                  if (!value.length) {
                    callback(new Error('请输入收件电话'));
                  } else if (/[^\d-]/.test(value)) {
                    callback(new Error('请输入正确的电话格式'));
                  } else {
                    callback();
                  }
                },
              },
            ]}
          >
            <el-input
              v-model={row.recipientPhone}
              maxlength="18"
              placeholder="请输入收件电话"
            >
            </el-input>
          </el-form-item> : <encryption
            data={{
              businessId: row?.customerAddressId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
              content: row?.recipientPhone,
              pageTab,
              dateColumn: 'recipientPhone',
            }}
          ></encryption>}
        </>
      ),
    },
    {
      label: '收件地址',
      minWidth: '400px',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>收件地址</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].addressDetail`}
            rules={[
              { required: true, message: '', trigger: ['blur', 'change'] },
            ]}
          >
            <div class="flex flex-align-center">
              <address-picker
                class='flex-1' onChange={(list: []) => handleChangeAddress(list, index)}
                province={row?.province}
                city={row?.city}
                area={row?.region}
                gutter={0}
                propList={[`data[${index}].province`, `data[${index}].city`, `data[${index}].region`]}
              />
              <el-input
                class="flex-1"
                maxlength={100}
                v-model={row.addressDetail}
                placeholder="详细地址（如街道、门牌）"
              ></el-input>
            </div>
          </el-form-item> : <encryption
            data={{
              businessId: row?.customerAddressId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.ADDRESS,
              content: [row?.region, row?.addressDetail],
              prefix: `${row?.province}${row?.city}`,
              pageTab,
              dateColumn: ['region', 'addressDetail'],
            }}
          ></encryption>}
        </>
      ),
    },
    {
      label: '地址类型',
      minWidth: '120px',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>地址类型</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].type`}
            rules={[
              { required: true, message: '请选择地址类型', trigger: ['blur', 'change'] },
            ]}
          >
            <DictionarySelect
              v-model={row.type}
              placeholder="请选择地址类型"
              dictionary={CX_DICTIONARY_KEY.OPERATION_ADDRESS}
              key={index}
              onChange={(e: string) => handleSelectType(e, index)}
            />
          </el-form-item> : <div>{filters.getEnumLabel(address, row?.type)}</div>}
        </>
      ),
    },
    {
      label: '是否默认',
      minWidth: '100px',
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].isDefault`}
          >
            <el-switch
              active-value={'YES'}
              inactive-value={'NO'}
              v-model={row.isDefault}
              onChange={(e: string) => handleIsDefault(e, index)}
            />
          </el-form-item> : <div>{filters.getEnumLabel(YES_NO_LIST, row.isDefault!)}</div>}
        </>
      ),
    },
    {
      label: '',
      width: '120px',
      renderHeader: () => {
        return (
          <div>
            <el-button type="text" onClick={() => handleAdd()}>添加收货地址</el-button>
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
          >删除</el-button>
        </el-form-item>
      ),
    },
  ];
  return isEdit ? renderTem : renderTem.splice(0, renderTem.length - 1);
};
