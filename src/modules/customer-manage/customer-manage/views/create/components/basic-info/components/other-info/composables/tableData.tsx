import { IColumnsItem } from '@/components/custom-table/package/type.d';
import {
  IBaseInfoUpdateCustomerAddressItem,
} from '@/modules/customer-manage/customer-manage/api/types';
import { YES_NO_LIST, DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant';
import { filters } from '@/core/plugins/filter';

// 发票信息
export const renderColumns = (
  handleDelete: (index: number) => void,
  handleAdd: () => void,
  handleChangeAddress: (list: [], index: number) => void,
  handleIsDefault: (value: string, index: number) => void,
  isEdit: boolean,
  pageTab: string,
):
  IColumnsItem<IBaseInfoUpdateCustomerAddressItem>[] => {
  const renderTem: IColumnsItem<IBaseInfoUpdateCustomerAddressItem>[] = [
    {
      label: '经营地址（省市区）',
      minWidth: '400px',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>经营地址（省市区）</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].province`}
            rules={[
              { required: true, message: '', trigger: ['blur', 'change'] },
            ]}
          >
            <div class="flex flex-align-center">
              <address-picker
                class='flex-1'
                onChange={(list: []) => handleChangeAddress(list, index)}
                province={row?.province}
                city={row?.city}
                area={row?.region}
                gutter={0}
                propList={[`data[${index}].province`, `data[${index}].city`, `data[${index}].region`]}
              />
            </div>
          </el-form-item> : <encryption
            data={{
              businessId: row?.customerAddressId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.ADDRESS,
              content: [row?.region],
              prefix: `${row?.province}${row?.city}`,
              pageTab,
              dateColumn: ['region'],
            }}
          ></encryption>}
        </>
      ),
    },
    {
      label: '经营地址（详细地址）',
      minWidth: '400px',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>经营地址（详细地址）</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].addressDetail`}
            rules={[
              { required: true, message: '请填写详细地址', trigger: ['blur', 'change'] },
            ]}
          >
            <el-input
              class="flex-1"
              v-model={row.addressDetail}
              placeholder="详细地址（如街道、门牌）"
              maxlength={100}
            ></el-input>
          </el-form-item> : <encryption
            data={{
              businessId: row?.customerAddressId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.ADDRESS,
              content: [row?.addressDetail],
              pageTab,
              dateColumn: ['addressDetail'],
            }}
          ></encryption>}
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
            <el-button
              type="text"
              onClick={() => handleAdd()}
            >添加经营地址</el-button>
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
