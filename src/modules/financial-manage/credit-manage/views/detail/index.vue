<template>
  <div class="detail-container container">
    <detail-title
      title="授信额度信息"
    >
      <template #default>
        <el-button @click="handleBack">返回列表</el-button>
        <el-button
          v-if="CAN_VIEW_LOG"
          type="primary"
          @click="handleLog"
        >
          操作日志
        </el-button>
      </template>
    </detail-title>
    <div class="title">所属集团名称：<strong>{{baseData.groupName ?? '/'}}</strong></div>
    <div class="card-layout">
      <card
        title="总额度(元)"
        :value="baseData.totalAmount"
      />
      <card
        title="可用额度(元)"
        :value="baseData.availableAmount"
        color="#14CC52"
      />
    </div>
    <detail-title title="旗下主体额度信息" />
    <custom-table
      border
      :data="baseData.customerAmountDetailList"
      :columns="renderColumns()"
    />
    <operation-drawer
      title="操作日志"
      v-model="visibleLog"
      :request="getCreditProgressList"
      :requestParams="logRequestParams"
      :config="logConfig"
    />
  </div>
</template>

<script lang="tsx">
import { defineComponent, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import OperationDrawer from '@/components/operation-drawer/index.vue';
import Card from './components/card/index.vue';

import { getCreditProgressList, getCreditDetail } from '../../api';
import { IGetCreditDetailRes } from '../../api/types';
import { CREDIT_SUBJECT_ROUTE_ENUM } from '@/constant';
import { CREDIT_OPERATE_TYPE_LIST } from '../../constant';
import { usePermissionConfig } from '../../use-permission-config';
import { renderColumns } from './composables/tableData';

export default defineComponent({
  components: {
    Card,
    OperationDrawer,
  },

  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const {
      CAN_VIEW_LOG,
    } = usePermissionConfig();
    const type = ref<CREDIT_SUBJECT_ROUTE_ENUM|''>('');
    const visibleLog = ref(false); // 操作日志显隐
    const logRequestParams = ref({
      customerId: $route.params?.id as string,
    });
    const baseData = ref<IGetCreditDetailRes>({
      groupName: '',
      totalAmount: '',
      availableAmount: '',
      customerAmountDetailList: [],
    });

    // 请求详情
    const fetchDetail = async () => {
      try {
        const { data } = await getCreditDetail({
          dimension: ($route.params?.type as string).toLocaleUpperCase(),
          id: $route.params?.id as string,
        });
        baseData.value = data;
        logRequestParams.value.customerId = $route.params?.id as string;
      } catch (error) {
        console.log(error);
      }
    };

    // 返回列表
    const handleBack = () => {
      $router.push({
        name: 'FinancialManageCreditList',
      });
    };

    // 查看审批进度
    const handleLog = () => {
      visibleLog.value = true;
    };

    const init = () => {
      type.value = $route.params?.type as CREDIT_SUBJECT_ROUTE_ENUM;
      if ($route.params?.id) {
        fetchDetail();
      }
    };

    watch(() => $route?.params?.id, () => {
      init();
    }, { immediate: true });

    return {
      CAN_VIEW_LOG,
      CREDIT_SUBJECT_ROUTE_ENUM,
      baseData,
      visibleLog,
      type,
      handleBack,
      handleLog,
      renderColumns,
      getCreditProgressList,
      logRequestParams,
      logConfig: {
        timeKey: 'adjustTime',
        userKey: 'sourceOperator',
        contentKey: 'adjustType',
        operateList: CREDIT_OPERATE_TYPE_LIST,
      },
    };
  },
});
</script>

<style scoped lang="scss">
.container {
  padding: 20px 20px 30px;

  .title {
    line-height: 28px;
    margin-bottom: 20px;
  }

  .card-layout {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }
}
</style>
