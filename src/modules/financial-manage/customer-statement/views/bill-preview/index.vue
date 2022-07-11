<template>
  <app-page>
    <template #header>
      <detail-title>
        <el-button
          v-if="CAN_PRINT"
          type="primary"
          plain
          @click="handlePint"
        >
          打印
        </el-button>
      </detail-title>
      <div class="title">{{bill.collectingAccount}}</div>
      <el-form label-suffix="：" label-width="92px">
        <responsive-row>
          <el-form-item label="客户名称">
            {{bill.customerName}}
          </el-form-item>
          <el-form-item label="账单号">
            {{bill.billCode}}
            <el-tag
              v-if="bill.statementType"
              effect="plain"
              type="warning"
              class="margin-left-10"
            >
              {{$filters.getEnumLabel(OUTGOING_TYPE_LIST, bill.statementType)}}
            </el-tag>
          </el-form-item>
          <el-form-item label="账单类型">
            {{$filters.getEnumLabel(BILL_TYPE_LIST, bill.billType)}}
          </el-form-item>
          <el-form-item label="对账周期">
            {{$filters.formatTime(bill.billStartTime, 'YYYY/MM/DD')}}
            - {{$filters.formatTime(bill.billEndTime, 'YYYY/MM/DD')}}
          </el-form-item>
          <el-form-item label="账单金额">
            {{toThousands(bill.billAmount)}}元
          </el-form-item>
          <el-form-item label="账单状态">
            <el-row>
              <div class="margin-right-15">
                对账：
                <span :class="`color-${RECONCILE_STATUS_COLOR[bill.statementState]}`">
                  {{$filters.getEnumLabel(RECONCILE_STATUS_LIST, bill.statementState) || '-'}}
                </span>
              </div>
              <div v-if="bill.billType === BILL_TYPE_ENUM.FINANCE" class="margin-right-15">
                支用：
                <span :class="`color-${EXPAND_STATUS_COLOR[bill.supportState]}`">
                  {{$filters.getEnumLabel(EXPAND_STATUS_LIST, bill.supportState) || '-'}}
                </span>
              </div>
              <div>
                回款：
                <span :class="`color-${RECOVERIES_STATUS_COLOR[bill.paybackState]}`">
                  {{$filters.getEnumLabel(RECOVERIES_STATUS_LIST, bill.paybackState) || '-'}}
                </span>
              </div>
            </el-row>
          </el-form-item>
        </responsive-row>
      </el-form>
    </template>
    <template #main="{ height }">
      <custom-table
        border
        :key="height"
        :data="bill.details || []"
        :columns="renderColumns()"
        :span-method="objectSpanMethod"
        show-summary
        :summary-method="getSummaries"
      />
    </template>
    <export-dialog
      ref='exportEl'
      :data="bill"
      :list="bill.details"
    />
  </app-page>
</template>

<script lang="tsx">
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { toThousands, formatFloat } from '@tiangong/utils';
import { plus } from 'number-precision';

import ExportDialog from '../../components/export-dialog/index.vue';

import { useOperation } from '../../hooks/use-operation';
import {
  BILL_TYPE_ENUM,
  OUTGOING_TYPE_LIST,
  BILL_TYPE_LIST,
  RECONCILE_STATUS_LIST,
  EXPAND_STATUS_LIST,
  RECOVERIES_STATUS_LIST,
  RECONCILE_STATUS_COLOR,
  EXPAND_STATUS_COLOR,
  RECOVERIES_STATUS_COLOR,
} from '../../constant';
import { usePermissionConfig } from '../../use-permission-config';
import { renderColumns } from './composables/tableData';
import { ISpanMethodProps, ISummaryMethodProps } from './types';

export default defineComponent({
  components: {
    ExportDialog,
  },
  setup() {
    const $route = useRoute();
    const {
      CAN_PRINT,
    } = usePermissionConfig();
    const exportEl = ref<InstanceType<typeof ExportDialog>>();
    const {
      bill,
      fetchBill,
    } = useOperation();

    // 打印
    const handlePint = () => {
      exportEl.value?.print();
    };

    // 单元格合并
    const objectSpanMethod = (info: ISpanMethodProps) => {
      if ([10, 11, 12, 13, 14].includes(info.columnIndex)) {
        if (info.row.groupSize > 0) {
          return {
            rowspan: info.row.groupSize,
            colspan: 1,
          };
        }
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
      return {
        rowspan: 1,
        colspan: 1,
      };
    };

    // 合计
    const getSummaries = (param: ISummaryMethodProps) => {
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
          'receiptedAmount'].includes(column.property)
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
          'deliveryCount'].includes(column.property)
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
    };

    const init = () => {
      if ($route.params?.id) {
        fetchBill($route.params?.id as string);
      }
    };

    watch(() => $route?.params?.id, () => {
      init();
    }, { immediate: true });

    return {
      CAN_PRINT,
      BILL_TYPE_ENUM,
      OUTGOING_TYPE_LIST,
      BILL_TYPE_LIST,
      RECONCILE_STATUS_LIST,
      EXPAND_STATUS_LIST,
      RECOVERIES_STATUS_LIST,
      RECONCILE_STATUS_COLOR,
      EXPAND_STATUS_COLOR,
      RECOVERIES_STATUS_COLOR,
      toThousands,
      exportEl,
      bill,
      renderColumns,
      handlePint,
      objectSpanMethod,
      getSummaries,
    };
  },
});
</script>

<style scoped lang="scss">
.title {
  height: 28px;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  margin-bottom: 24px;
  text-align: center;
}
</style>
