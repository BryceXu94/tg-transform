<template>
  <detail-title :title="`总账单${detail?.billCode ?? ''}`" />
  <el-form
    label-suffix="："
    label-width="90px"
  >
    <responsive-row :col="col6">
      <el-form-item label="公司名称">{{detail?.customerName || '-'}}</el-form-item>
      <el-form-item label="对账周期">
        {{detail?.billStartTime ? $filters.formatTime(detail?.billStartTime, 'YYYY/MM/DD') : ''}}
        - {{detail?.billEndTime ? $filters.formatTime(detail?.billEndTime, 'YYYY/MM/DD') : ''}}
      </el-form-item>
      <el-form-item label="逾期日期">{{$filters.formatTime(detail?.overdueDate ?? '', 'YYYY-MM-DD')}}</el-form-item>
      <el-form-item label="出账月份">{{detail?.billMonth || '-'}}</el-form-item>
      <el-form-item label="出账信息">
        {{detail?.statementType ? $filters.getEnumLabel(OUTGOING_TYPE_LIST, detail?.statementType) : '-'}}，
        {{detail?.chargeOffDate === PERIOD_DATE_ORDER_ENUM.ORDER_SIGN
          ? $filters.getEnumLabel(PERIOD_DATE_ORDER_LIST, detail?.chargeOffDate )
          : (detail?.chargeOffDate || '-')}}
      </el-form-item>
      <el-form-item label="账单状态">
        {{detail?.statementState ? $filters.getEnumLabel(RECONCILE_STATUS_LIST, detail?.statementState) : '-'}}
      </el-form-item>
      <el-form-item label="创建时间">{{$filters.formatTime(detail?.createdTime ?? '')}}</el-form-item>
    </responsive-row>
  </el-form>
  <tgo-table
    :data="list"
    :columns="tableColumnsSummary"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { useTableColumns } from '../../hooks/use-table-columns';
import { IGetCustomerBillDetailRes } from '@/modules/financial-manage/customer-statement/api/types';
import {
  PERIOD_DATE_ORDER_ENUM,
  PERIOD_DATE_ORDER_LIST,
} from '@/modules/customer-manage/customer-manage/constant';
import {
  OUTGOING_TYPE_LIST,
  RECONCILE_STATUS_LIST,
} from '@/modules/financial-manage/customer-statement/constant';
import { IBillSummaryListItem } from '../../type';

export default defineComponent({
  props: {
    detail: {
      type: Object as PropType<IGetCustomerBillDetailRes>,
      required: true,
    },
    list: {
      type: Array as PropType<IBillSummaryListItem[]>,
      required: true,
    },
  },
  setup() {
    const {
      tableColumnsSummary,
    } = useTableColumns();

    return {
      OUTGOING_TYPE_LIST,
      RECONCILE_STATUS_LIST,
      PERIOD_DATE_ORDER_ENUM,
      PERIOD_DATE_ORDER_LIST,
      tableColumnsSummary,
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
