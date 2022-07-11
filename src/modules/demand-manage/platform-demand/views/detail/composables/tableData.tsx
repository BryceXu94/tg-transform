import { IColumnsItem } from '@/components/custom-table/package/type.d';
import {
  IV1DemandSkcListItem,
} from '@/modules/demand-manage/platform-demand/api/types';

export const detailRenderColumns = (
  // skcList: IV1DemandSkcListItem[],
  sizeStandard: string[],
): IColumnsItem<IV1DemandSkcListItem>[] => {
  return [
    {
      label: '款式颜色',
      minWidth: '100',
      render: row => (
        <div>{row?.color}</div>
      ),
    },
    ...sizeStandard.map((size) => {
      return {
        label: size,
        minWidth: '100',
        render: row => (
          <div>{row.skuList.find(sku => sku.size === size)?.quantity}件</div>
        ),
      } as IColumnsItem<IV1DemandSkcListItem>;
    }),
    {
      label: '数量合计',
      minWidth: '100',
      render: row => (
        <div>{row?.quantity}件</div>
      ),
    },
    {
      label: '单件合同报价',
      minWidth: '100',
      render: row => (
        <div>{row?.expectPrice}元</div>
      ),
    },
  ];
};
