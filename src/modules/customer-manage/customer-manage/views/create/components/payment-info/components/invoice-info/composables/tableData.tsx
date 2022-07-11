import { IColumnsItem } from '@/components/custom-table/package/type.d';
import {
  IAccountingPeriodSaveCustomerShippingAddressListItem,
} from '@/modules/customer-manage/customer-manage/api/types';
import { DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant/global';

// 发票信息
export const renderColumns = (length: number,
  handleDelete: (index: number) => void,
  handleAdd: () => void,
  isEdit: boolean,
  handleChangeInvoiceAddress: (list: [], index: number) => void,
  pageTab: string):
  IColumnsItem<IAccountingPeriodSaveCustomerShippingAddressListItem>[] => {
  const renderTem: IColumnsItem<IAccountingPeriodSaveCustomerShippingAddressListItem>[] = [
    {
      label: '接收邮箱',
      minWidth: '150px',
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].email`}
            rules={
              row.email ? {
                type: 'email',
                message: '请输入正确的邮箱格式',
                trigger: ['blur', 'change'],
              } : {}
            }
          >
            <el-input v-model={row.email} maxlength="100" placeholder="请输入接收邮箱" />
          </el-form-item>
            : <encryption
                data={{
                  businessId: row?.customerAddressId,
                  dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.EMAIL,
                  content: row?.email,
                  pageTab,
                  dateColumn: 'email',
                }}
            >
            </encryption>}
        </>
      ),
    },
    {
      label: '收件人',
      minWidth: '150px',
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].recipient`}
          >
            <el-input
              v-model={row.recipient} placeholder="请输入收件人"
              maxlength={100}
            />
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
      label: '收件电话',
      minWidth: '150px',
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].recipientPhone`}
            rules={[
              {
                trigger: ['blur'],
                validator: (rule: any, value: any, callback: (err?: Error) => void) => {
                  if (value.length && /[^\d-]/.test(value)) {
                    callback(new Error('请输入正确的电话格式'));
                  } else {
                    callback();
                  }
                },
              },
            ]}
          >
            <el-input v-model={row.recipientPhone} maxlength="18" placeholder="请输入收件电话" />
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
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].addressDetail`}
          >
            <div class="flex flex-align-center">
              <address-picker
                class='flex-1'
                onChange={(list: []) => handleChangeInvoiceAddress(list, index)}
                province={row?.province}
                city={row?.city}
                area={row?.region}
                gutter={0}
              />
              <el-input
                class="flex-1"
                v-model={row.addressDetail}
                placeholder="详细地址（如街道、门牌）"
                maxlength={100}
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
      label: '',
      width: '140px',
      renderHeader: () => {
        return (
          <div>
            <el-button type="text" onClick={() => handleAdd()}>添加发票接收信息</el-button>
          </div>
        );
      },
      render: (row, index) => (
        <el-form-item
          label=""
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
