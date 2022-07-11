<template>
  <div :style="{marginTop: '60px'}">
    <div class="margin-bottom-10">
      <tabs
        :config="TAB_LIST"
        :border="false"
        v-model="currentTab"
      />
    </div>
    <tgo-table
      v-show="currentTab === TAB_ENUM.SUB"
      :data="detail.subBill"
      :columns="tableColumnsSub"
      show-summary
      :summary-method="getSummaries"
    />
    <tgo-table
      v-show="currentTab === TAB_ENUM.DEDUCTION"
      :data="detail.deducts"
      :columns="tableColumnsDeduction"
      show-summary
      :summary-method="getSummaries"
    />
    <tgo-table
      v-show="currentTab === TAB_ENUM.BONUS"
      :data="detail.rewards"
      :columns="tableColumnsBonus"
      show-summary
      :summary-method="getSummaries"
    />
    <tgo-table
      v-show="currentTab === TAB_ENUM.DETAIL"
      :data="detail.receipts"
      :columns="tableColumnsDetail"
      show-summary
      :summary-method="getSummaries"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { toThousands, formatFloat } from '@tiangong/utils';
import { plus } from 'number-precision';

import {
  IGetCustomerBillDetailRes,
  IBillSubListItem,
  IBillDeductionListItem,
  IBillBonusListItem,
  IBillDetailListItem,
} from '@/modules/financial-manage/customer-statement/api/types';
import { useTableColumns } from '../../hooks/use-table-columns';
import { TAB_ENUM, TAB_LIST } from '../../constant';
import { ISummaryMethodProps } from './type';

export default defineComponent({
  props: {
    detail: {
      type: Object as PropType<IGetCustomerBillDetailRes>,
      required: true,
    },
  },
  setup() {
    const currentTab = ref(TAB_ENUM.SUB);

    const {
      tableColumnsSub,
      tableColumnsDeduction,
      tableColumnsBonus,
      tableColumnsDetail,
    } = useTableColumns();

    // 合计
    const getSummaries = ((
      param: ISummaryMethodProps<IBillSubListItem&IBillDeductionListItem&IBillBonusListItem&IBillDetailListItem>,
    ) => {
      const { columns, data } = param;

      const sums: string[] = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if ([
          'goodsAmount',
          'deductAmount',
          'otherReceiptAmount',
          'actualSettleGoodsAmount',
          'preReceiptAmount',
          'receiptedAmount',
          'pendingReceiptedAmount',
          'amount',
          'receiptAmount',
          'actualReceiptAmount'].includes(column.property as string)
        ) {
          sums[index] = toThousands(formatFloat(values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!Number.isNaN(value)) {
              return plus(prev, curr);
            }
            return prev;
          }, 0), { round: false }));
        } else if ([
          'orderCount',
          'deliveryCount'].includes(column.property as string)
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

    return {
      TAB_ENUM,
      TAB_LIST,
      tableColumnsSub,
      tableColumnsDeduction,
      tableColumnsBonus,
      tableColumnsDetail,
      currentTab,
      getSummaries,
    };
  },
});
</script>
