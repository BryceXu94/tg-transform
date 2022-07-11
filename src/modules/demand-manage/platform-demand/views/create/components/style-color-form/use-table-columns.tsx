import { computed, ComputedRef } from 'vue';
import { FormRules } from 'element-plus';
import { ITableColumnsItem } from '@/components/tgo-table/package/type';
import { IDemandSaveSkcListItem } from '@/modules/demand-manage/platform-demand/api/types';
import { Delete } from '@element-plus/icons-vue';

export const useTableColumns = (
  formData: ComputedRef<IDemandSaveSkcListItem>,
  disabledAddSize: ComputedRef<boolean>,
  rules: ComputedRef<FormRules>,
  handleDelSize: (index: number) => void,
  handleAddSize: () => void,
  handleFillQuantity: () => void,
) => {
  const sizeList = computed(() => {
    const { skuList } = formData.value;
    return skuList?.map((item, index) => {
      return {
        label: '',
        minWidth: '110',
        renderHeader: () => (
          <el-row align="middle">
            {item.size}
            <el-button type="text" style="color: #000" onClick={() => handleDelSize(index)}>
              <el-icon class="margin-left-10"><Delete /></el-icon>
            </el-button>
          </el-row>
        ),
        render: () => {
          return (
            <el-form-item
              label=""
              label-width="0"
              prop={`skuList.[${index}].quantity`}
              rules={rules.value.quantity}
              show-message={false}
              key={`skuList.[${item.size}].quantity`}
            >
              <input-number
                v-model={item.quantity}
                placeholder="请输入"
                precision={0}
                min={1}
                max={99999}
              />
            </el-form-item>
          );
        },
      };
    }) ?? [];
  });
  const totals = computed(() => {
    const { skuList } = formData.value;
    return skuList.reduce((total, item) => {
      return total + +item.quantity;
    }, 0);
  });

  const tableColumns = computed<ITableColumnsItem<any>[]>(() => {
    return [
      {
        label: '尺码',
        minWidth: '100',
        render: () => (
          <div>需求数量/件</div>
        ),
      },
      ...sizeList.value,
      {
        label: '合计',
        minWidth: '100',
        render: () => (
          <div>{totals.value}件</div>
        ),
      },
      {
        label: '新增尺码',
        minWidth: '100',
        fixed: 'right',
        renderHeader: () => (
          <el-button
            type="text"
            onClick={handleAddSize}
            disabled={disabledAddSize.value}
          >新增尺码</el-button>
        ),
        render: () => (
          <el-button
            type="text"
            onClick={handleFillQuantity}
          >一键填充</el-button>
        ),
      },
    ];
  });
  return {
    tableColumns,
  };
};
