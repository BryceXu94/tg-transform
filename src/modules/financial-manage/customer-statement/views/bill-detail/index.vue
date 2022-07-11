<template>
  <div class="detail-container container">
    <detail-title :title="`子账单明细${detail?.billDetailCode ?? ''}`" />
    <el-form
      label-suffix="："
      label-width="90px"
      class="margin-bottom-20"
    >
      <responsive-row :col="col6">
        <el-form-item label="订单号">{{detail?.saleOrderCode || '-'}}</el-form-item>
        <el-form-item label="制单">{{detail?.manufacturingOrderCode || '-'}}</el-form-item>
        <el-form-item label="生产款号">{{detail?.styleNumber || '-'}}</el-form-item>
        <el-form-item label="客款">{{detail?.customerStyleNumber || '-'}}</el-form-item>
      </responsive-row>
    </el-form>
    <detail-title title="客户扣款" />
    <div class="wrap">
      <tgo-table
        :data="detail.deducts"
        :columns="tableColumnsDeduction"
        show-summary
        :summary-method="getSummaries"
      />
    </div>
    <detail-title title="客户奖励" />
    <div class="wrap">
      <tgo-table
        :data="detail.rewards"
        :columns="tableColumnsBonus"
        show-summary
        :summary-method="getSummaries"
      />
    </div>
    <detail-title title="收款明细" />
    <div class="wrap">
      <tgo-table
        :data="detail.receipts"
        :columns="tableColumnsCollection"
        show-summary
        :summary-method="getSummaries"
      />
    </div>
    <detail-title title="发货明细" />
    <tgo-table
      :data="detail.deliveryReturns"
      :columns="tableColumnsShip"
      show-summary
      :summary-method="getSummaries"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { toThousands, formatFloat } from '@tiangong/utils';
import { plus } from 'number-precision';

import { getCustomerSubBillDetail } from '@/modules/financial-manage/customer-statement/api';
import {
  ISubBillDeductionListItem,
  ISubBillBonusListItem,
  ISubBillCollectionListItem,
  ISubBillShipListItem,
  IGetCustomerSubBillDetailRes,
} from '@/modules/financial-manage/customer-statement/api/types';
import { DELIVERY_TYPE_ENUM } from '@/modules/financial-manage/customer-statement/constant';
import { useTableColumns } from './hooks/use-table-columns';
import { ISummaryMethodProps, ISizeConfigItem } from './type';

export default defineComponent({
  setup() {
    const $route = useRoute();
    // const billId = $route.params.id as string;
    const detail = ref({
      deducts: [],
      rewards: [],
      receipts: [],
      deliveryReturns: [],
      sizeSort: [],
    } as IGetCustomerSubBillDetailRes);

    const {
      sizeConfig,
      tableColumnsDeduction,
      tableColumnsBonus,
      tableColumnsCollection,
      tableColumnsShip,
    } = useTableColumns();

    // 请求子账单明细
    const fetchDetail = async () => {
      try {
        const { data } = await getCustomerSubBillDetail({ billDetailCode: $route.params.id as string });
        const config: ISizeConfigItem[] = [];
        const deliveryReturns = data?.deliveryReturns ? data.deliveryReturns.map((item) => {
          const sizeObj: {[key: string]: string;} = {};
          const sizes: {
              [key: string]: string;
            }[] = item.sizeDetail ? JSON.parse(item.sizeDetail) : [];
          sizes.forEach((sItem) => {
            sizeObj[`size-${sItem.sizeName}` as string] = sItem.sizeQualityCount || '';
            if (config.find(size => size.size === sItem.sizeName)) return;
            config.push({
              size: sItem.sizeName,
              prop: `size-${sItem.sizeName}`,
            });
          });
          return {
            ...item,
            ...sizeObj,
          };
        }) : [];
        const sizeSort: {[key: string]: number;} = data.sizeSort.reduce(
          (obj, item, index) => ({
            ...obj,
            [item]: index,
          }),
          {},
        );
        sizeConfig.value = config.sort((a, b) => sizeSort[a.size] - sizeSort[b.size]);
        detail.value = {
          ...data,
          deducts: data?.deducts ?? [],
          rewards: data?.rewards ?? [],
          receipts: data?.receipts ?? [],
          deliveryReturns,
        };
      } catch (error) {
        console.log(error);
      }
    };

    // 合计
    const getSummaries = ((
      param: ISummaryMethodProps<
        ISubBillDeductionListItem&ISubBillBonusListItem&ISubBillCollectionListItem&ISubBillShipListItem
      >,
    ) => {
      const { columns, data } = param;

      const sums: string[] = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }

        let values: number[] = [];
        if (['totalCount', 'deliveryAmount'].includes(column.property as string)
          || (column.property && String(column.property).includes('size-'))
        ) {
          values = data.map((item: {[key: string]: string;}) => {
            if (item.type === DELIVERY_TYPE_ENUM.RETURN) {
              return -item[String(column.property)];
            }
            return Number(item[String(column.property)]);
          });
        } else {
          values = data.map(item => Number(item[column.property]));
        }
        if (
          [
            'amount',
            'receiptAmount',
            'actualReceiptAmount',
            'deliveryAmount',
          ].includes(column.property as string)
        ) {
          sums[index] = toThousands(formatFloat(values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!Number.isNaN(value)) {
              return plus(prev, curr);
            }
            return prev;
          }, 0), { round: false }));
        } else if ([
          'totalCount',
        ].includes(column.property as string)
          || (column.property && String(column.property).includes('size-'))
        ) {
          sums[index] = toThousands(values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!Number.isNaN(value)) {
              return plus(prev, curr);
            }
            return prev;
          }, 0));
        } else {
          sums[index] = '';
        }
      });
      return sums;
    });

    const init = () => {
      if ($route.params?.id) {
        fetchDetail();
      }
    };

    watch(() => $route?.params?.id, () => {
      init();
    }, { immediate: true });

    return {
      tableColumnsDeduction,
      tableColumnsBonus,
      tableColumnsCollection,
      tableColumnsShip,
      detail,
      getSummaries,
      col6: {
        sm: 24,
        md: 6,
        lg: 6,
        xl: 6,
      },
    };
  },
});

</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}
.wrap {
  margin-bottom: 50px;
}
</style>
