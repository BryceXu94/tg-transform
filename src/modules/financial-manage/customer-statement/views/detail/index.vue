<template>
  <div class="detail-container container">
    <detail-title>
      <el-button
        v-if="CAN_CONFIRM && detail.statementState === RECONCILE_STATUS_ENUM.TO_STATEMENT_CUSTOMER"
        type="primary"
        plain
        @click="handleConfirmOrRevoke(OPERATE_TYPE_ENUM.CONFIRM)"
      >
        客户确认
      </el-button>
      <el-button
        v-if="CAN_REVOKE && detail.statementState === RECONCILE_STATUS_ENUM.TO_STATEMENT_CUSTOMER"
        type="danger"
        plain
        @click="handleConfirmOrRevoke(OPERATE_TYPE_ENUM.REJECT)"
      >
        客户驳回
      </el-button>
      <el-button
        v-if="CAN_PREVIEW"
        type="primary"
        plain
        @click="handlePreview"
      >
        预览
      </el-button>
      <el-dropdown v-if="CAN_EXPORT_IMAGE || CAN_EXPORT_EXCEL">
        <el-button
          type="primary"
          style="margin-right: 12px;margin-left:12px"
          plain
        >
          导出
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-if="CAN_EXPORT_IMAGE" @click="handleExposeImage">导出图片</el-dropdown-item>
            <el-dropdown-item v-if="CAN_EXPORT_EXCEL" @click="handleExposeExcel">导出Excel</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button
        v-if="CAN_VIEW_LOG"
        @click="handleLog"
      >
        操作日志
      </el-button>
    </detail-title>
    <bill-summary :detail="detail" :list="summaryList" />
    <bill-detail :detail="detail" />
    <operation-drawer
      title="操作日志"
      v-model="visibleLog"
      :request="getLogList"
      :requestParams="logRequestParams"
      :config="logConfig"
    />
    <export-dialog
      ref='exportEl'
      :data="bill"
      :list="bill.details"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { ElMessage } from 'element-plus';
import OperationDrawer from '@/components/operation-drawer/index.vue';
import ExportDialog from '../../components/export-dialog/index.vue';
import BillSummary from './components/bill-summary/index.vue';
import BillDetail from './components/bill-detail/index.vue';

import { useMenuStore } from '@/store/menu';
import { useOperation } from '../../hooks/use-operation';
import {
  confirmOrRevokeStatement,
  getLogList,
  getCustomerBillDetail,
} from '../../api';
import { IGetCustomerBillDetailRes } from '../../api/types';
import {
  OPERATE_TYPE_ENUM,
  OPERATE_TYPE_LIST,
  RECONCILE_STATUS_ENUM,
} from '../../constant';
import { usePermissionConfig } from '../../use-permission-config';
import { IBillSummaryListItem } from './type';

export default defineComponent({
  components: {
    OperationDrawer,
    ExportDialog,
    BillSummary,
    BillDetail,
  },
  setup() {
    const $route = useRoute();
    const $router = useRouter();
    let billId = $route.params.id as string;
    const {
      CAN_EXPORT_IMAGE,
      CAN_EXPORT_EXCEL,
      CAN_VIEW_LOG,
      CAN_REVOKE,
      CAN_CONFIRM,
      CAN_PREVIEW,
    } = usePermissionConfig();
    const exportEl = ref<InstanceType<typeof ExportDialog>>();
    const visibleLog = ref(false); // 控制操作日志显隐
    const {
      bill,
      fetchBill,
    } = useOperation();
    const detail = ref({
      subBill: [],
      deducts: [],
      rewards: [],
      receipts: [],
    } as IGetCustomerBillDetailRes);
    const summaryList = ref<IBillSummaryListItem[]>([]); // 汇总列表
    const logRequestParams = ref({
      bizId: $route.params.id as string,
    });

    // 请求账单信息
    const fetchDetail = async () => {
      try {
        // 请求账单信息
        const { data } = await getCustomerBillDetail({ billId: $route.params.id as string });
        billId = $route.params.id as string;
        detail.value = {
          ...data,
          subBill: data?.subBill ?? [],
          deducts: data?.deducts ?? [],
          rewards: data?.rewards ?? [],
          receipts: data?.receipts ?? [],
        };
        summaryList.value = [{
          goodsAmount: data?.goodsAmount ?? '',
          deductAmount: data?.deductAmount ?? '',
          otherReceiptAmount: data?.otherReceiptAmount ?? '',
          actualSettleGoodsAmount: data?.actualSettleGoodsAmount ?? '',
          billAmount: data?.billAmount ?? '',
          preAmount: data?.preAmount ?? '',
          preReceiptAmount: data?.preReceiptAmount ?? '',
          paybackAmount: data?.paybackAmount ?? '',
          waitPaybackAmount: data?.waitPaybackAmount ?? '',
          paybackState: data?.paybackState ?? '',
        }];
        logRequestParams.value.bizId = billId;
        fetchBill(billId);
      } catch (error) {
        console.log(error);
      }
    };

    // 返回列表
    const handleBack = () => {
      $router.push({
        name: 'FinancialManageCustomerStatementList',
      });
    };

    // 客户确认 OR 驳回
    const handleConfirmOrRevoke = async (operate: OPERATE_TYPE_ENUM) => {
      try {
        await confirmOrRevokeStatement({
          billId,
          operate,
        });
        ElMessage.success('操作成功');
        useMenuStore().deleteKeepAlive('FinancialManageCustomerStatementList');
        fetchDetail();
      } catch (error) {
        console.log(error);
      }
    };

    // 导出
    const handleExposeImage = () => {
      exportEl.value?.exportImage();
    };
    const handleExposeExcel = () => {
      exportEl.value?.exportExcel();
    };

    // 查看操作日志
    const handleLog = () => {
      visibleLog.value = true;
    };

    // 预览
    const handlePreview = () => {
      const routeData = $router.resolve({
        name: 'FinancialManageCustomerStatementBillPreview',
        params: {
          id: billId,
        },
      });
      window.open(routeData.href, '_blank');
    };

    const init = () => {
      if ($route.params?.id) {
        fetchDetail();
      }
    };

    watch(() => $route?.params?.id, () => {
      init();
    }, { immediate: true });

    return {
      CAN_CONFIRM,
      CAN_REVOKE,
      CAN_PREVIEW,
      CAN_EXPORT_IMAGE,
      CAN_EXPORT_EXCEL,
      CAN_VIEW_LOG,
      OPERATE_TYPE_ENUM,
      RECONCILE_STATUS_ENUM,
      exportEl,
      bill,
      detail,
      summaryList,
      visibleLog,
      handleBack,
      handleConfirmOrRevoke,
      handleExposeImage,
      handleExposeExcel,
      handlePreview,
      handleLog,
      getLogList,
      logRequestParams,
      logConfig: {
        timeKey: 'createdTime',
        userKey: 'creatorName',
        contentKey: 'logType',
        operateList: OPERATE_TYPE_LIST,
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}
</style>
