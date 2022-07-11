import { computed, Ref } from 'vue';
import { ITableColumnsItem } from '@/components/tgo-table/package/type';
import { IContactListItem } from '../../type';
import { useDictionary } from '@/hooks/use-dictionary';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';

export const useColumns = (props: {
  rules: Ref<any>;
  handleDeleteContact: (index: number) => void;
}) => {
  const { getDictionaryOptions } = useDictionary();
  const POST_NAME_OPTIONS = computed(() => getDictionaryOptions(CX_DICTIONARY_KEY.POST_NAME));
  const columns = computed<ITableColumnsItem<IContactListItem>[]>(() => {
    const { handleDeleteContact, rules } = props;
    return [
      {
        renderHeader: () => (
          <div>
            <span class='must-icon__red' />
            <span>联系人</span>
          </div>
        ),
        render: (row, _column, index) => (
          <el-form-item
            prop={`[${index}].contactName`}
            rules={rules.value.contactName}
          >
            <el-input
              v-model={[row.contactName, ['trim']]}
              placeholder='请输入联系人'
              maxlength={50}
            />
          </el-form-item>
        ),
      },
      {
        renderHeader: () => (
          <div>
            <span class='must-icon__red' />
            <span>所属职务</span>
          </div>
        ),
        render: (row, _column, index) => (
          <el-form-item
            prop={`[${index}].post`}
            rules={rules.value.post}
          >
            <el-select
              v-model={row.post}
            >
              {POST_NAME_OPTIONS.value.map(v => (
                <el-option
                  key={v.value}
                  value={v.value}
                  label={v.label}
                  disabled={v.disabled}
                />
              ))}
            </el-select>
          </el-form-item>
        ),
      },
      {
        renderHeader: () => (
          <div>
            <span class='must-icon__red' />
            <span>联系电话</span>
          </div>
        ),
        render: (row, _column, index) => (
          <el-form-item
            prop={`[${index}].phone`}
            rules={rules.value.phone}
          >
            <el-input
              v-model={[row.phone, ['trim']]}
              placeholder='请输入电话'
              maxlength={18}
            />
          </el-form-item>
        ),
      },
      {
        label: '联系人邮箱',
        render: (row, _column, index) => (
          <el-form-item
            prop={`[${index}].email`}
            rules={rules.value.email}
          >
            <el-input
              v-model={[row.email, ['trim']]}
              placeholder='请输入邮箱'
              maxlength={100}
            />
          </el-form-item>
        ),
      },
      {
        label: '备注',
        render: (row, _column, index) => (
          <el-form-item
            prop={`[${index}].remark`}
            rules={rules.value.remark}
          >
            <el-input
              v-model={[row.remark, ['trim']]}
              placeholder='请输入备注'
              maxlength={500}
            />
          </el-form-item>
        ),
      },
      {
        label: '操作',
        width: '80px',
        render: (_row, _column, index) => (
          <el-form-item>
            <el-button
              type="text"
              onClick={() => handleDeleteContact(index)}
            >删除</el-button>
          </el-form-item>
        ),
      },
    ];
  });
  return {
    columns,
  };
};
