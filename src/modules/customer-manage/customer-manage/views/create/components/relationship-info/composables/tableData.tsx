import { IColumnsItem } from '@/components/custom-table/package/type.d';
import { computed } from 'vue';
import DictionarySelect from '@/components/dictionary-select/index.vue';
import { IDetailContactsCustomerContactListItem } from '@/modules/customer-manage/customer-manage/api/types';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { filters } from '@/core/plugins/filter';
import {
  ENABLE_DISABLE_LIST,
  BUSINESS_MODE_ENUM,
  DESENSITIZE_DECRYPT_TYPE_ENUM,
} from '@/constant/global';
import { PROFILE_STATE_ENUM } from '@/modules/customer-manage/customer-manage/constant';
import { useDictionary } from '@/hooks/use-dictionary';

// 获取数据字典（所属职务）
const { getDictionaryOptions } = useDictionary();
const postList = computed(() => getDictionaryOptions(CX_DICTIONARY_KEY.POST_NAME) || []);

// 联系信息
export const renderColumns = (length: number,
  handleDelete: (index: number) => void,
  handleAddUser: () => void,
  isEdit: boolean,
  state: string,
  businessType: string,
  pageTab: string): IColumnsItem<IDetailContactsCustomerContactListItem>[] => {
  const renderTem: IColumnsItem<IDetailContactsCustomerContactListItem>[] = [
    {
      label: '联系人姓名',
      minWidth: '150px',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>联系人姓名</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].contactName`}
            rules={[
              { required: true, message: '请输入联系人姓名', trigger: ['blur', 'change'] },
            ]}
          >
            {/* 自营业务并且审核通过不能修改 ||平台业务并且不等于待提交 */}
            <el-input
              v-model={row.contactName}
              placeholder="请输入联系人姓名"
              maxlength="50"
              disabled={!!row?.customerContactId && (
                (PROFILE_STATE_ENUM.AUDIT_PASSED === state
                  && businessType === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS)
                || (businessType === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS
                  && state !== PROFILE_STATE_ENUM.WAIT_COMMIT && !!state))}
            >
            </el-input>
          </el-form-item> : <encryption
            data={{
              businessId: row?.customerContactId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
              content: row?.contactName,
              pageTab,
              dateColumn: 'contactName',
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
      label: '所属职务',
      minWidth: '150px',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>所属职务</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].post`}
            rules={[
              { required: true, message: '请选择所属职务', trigger: ['blur', 'change'] },
            ]}
          >
            <DictionarySelect
              v-model={row.post}
              placeholder="请选择所属职务"
              dictionary={CX_DICTIONARY_KEY.POST_NAME}
            />
          </el-form-item> : <div>{filters.getEnumLabel(postList.value, row?.post)}</div>}
        </>
      ),
    },
    {
      label: '联系人电话',
      minWidth: '150px',
      renderHeader: () => {
        return (
          <div>
            <span class="must-icon__red"></span>
            <span>联系人电话</span>
          </div>
        );
      },
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].phone`}
            rules={[
              {
                required: true,
                trigger: ['blur'],
                validator: (rule: any, value: any, callback: (err?: Error) => void) => {
                  if (!value.length) {
                    callback(new Error('请输入联系人电话'));
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
              v-model={row.phone}
              maxlength="18"
              placeholder="请输入联系人电话"
              disabled={!!row?.customerContactId && (
                (PROFILE_STATE_ENUM.AUDIT_PASSED === state
                  && businessType === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS)
                || ((businessType === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS
                  && state !== PROFILE_STATE_ENUM.WAIT_COMMIT) && !!state))}
            >
            </el-input>
          </el-form-item> : <encryption
            data={{
              businessId: row?.customerContactId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
              content: row?.phone,
              pageTab,
              dateColumn: 'phone',
            }}
          ></encryption>}
        </>
      ),
    },
    {
      label: '联系人微信',
      minWidth: '150px',
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].weChatId`}
          >
            <el-input
              v-model={row.weChatId}
              placeholder="请输入联系人微信"
              maxlength="100"
            >
            </el-input>
          </el-form-item> : <encryption
            data={{
              businessId: row?.customerContactId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
              content: row?.weChatId,
              pageTab,
              dateColumn: 'weChatId',
            }}
          ></encryption>}
        </>
      ),
    },
    {
      label: '联系人邮箱',
      minWidth: '180px',
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].email`}
            rules={row.email ? {
              type: 'email',
              message: '请输入正确的邮箱格式',
              trigger: ['blur', 'change'],
            } : {}
            }
          >
            <el-input
              v-model={row.email}
              placeholder="请输入联系人邮箱"
              maxlength="100"
              disabled={!!row?.customerContactId && (
                (PROFILE_STATE_ENUM.AUDIT_PASSED === state
                  && businessType === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS)
                || ((businessType === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS
                  && state !== PROFILE_STATE_ENUM.WAIT_COMMIT) && !!state))}
            >
            </el-input>
          </el-form-item> : <encryption
            data={{
              businessId: row?.customerContactId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.EMAIL,
              content: row?.email,
              pageTab,
              dateColumn: 'email',
            }}
          ></encryption>}
        </>
      ),
    },
    {
      label: '备注信息',
      minWidth: '150px',
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].remark`}
          >
            <el-input
              v-model={row.remark}
              type="textarea"
              maxlength="500"
              placeholder="请输入备注信息"
            >
            </el-input>
          </el-form-item> : <encryption
            data={{
              businessId: row?.customerContactId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
              content: row?.remark,
              pageTab,
              dateColumn: 'remark',
            }}
          ></encryption>}
        </>
      ),
    },
    {
      label: '启用状态',
      minWidth: '150px',
      render: (row, index) => (
        <>
          {isEdit ? <el-form-item
            label=""
            prop={`data[${index}].enable`}
          >
            <el-switch v-model={row.enable}
              active-value={'YES'}
              inactive-value={'NO'} />
          </el-form-item> : <div>{filters.getEnumLabel(ENABLE_DISABLE_LIST, row?.enable)}</div>}
        </>

      ),
    },
    {
      label: '',
      width: '120px',
      renderHeader: () => {
        return (
          <div>
            <el-button type="text" onClick={() => handleAddUser()}>添加联系人</el-button>
          </div>
        );
      },
      render: (row, index) => (
        <el-form-item
          label=""
          prop={`data[${index}].enable`}
        >
          {/* 自营业务不等于审核通过 || 平台业务等于待提交 || state为空（创建） */}
          {length > 1 && (((PROFILE_STATE_ENUM.AUDIT_PASSED !== state
            && businessType === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS) || !row.customerContactId)
            || (businessType === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS
              && (!state || state === PROFILE_STATE_ENUM.WAIT_COMMIT))) && <el-button
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
