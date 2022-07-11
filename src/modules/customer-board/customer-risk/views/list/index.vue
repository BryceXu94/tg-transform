<template>
  <app-page>
    <template #fheader>
      <search-area
        v-model="params"
        @handleSearch="handleAuthSearch"
        @handleReset="handleAuthReset"
        :config="searchConfig"
      >
        <template #organization>
          <el-cascader
            v-model="params.cascader"
            :options="cascaderOption"
            @change="handleChangeCascader"
            collapse-tags
            :props="{
              multiple: true,
            }"
            :show-all-levels="false"
            style="width: 100%"
          ></el-cascader>
        </template>
        <template #seaCustomer>
          <div class="flex sea_customer">
            <div class="label">展示公海客户</div>
            <el-switch v-model="params.includePublic" />
          </div>
        </template>
      </search-area>
    </template>
    <template #header>
      <header-area>
        <template #default>
          <condition-select
            :conditionInfo="conditionInfo"
            v-model="params.riskTrend"
            @conditionChange="handleConditionChange"
          />
        </template>
        <template #button>
          <div>最近一次同步：{{$filters.formatTime(lastUpdateDate, 'YYYY-MM-DD')}}</div>
        </template>
      </header-area>
    </template>
    <template #main="{ height }">
      <tgo-table
        :height="height"
        :key="height"
        :data="tableData"
        :columns="tableColumns"
      />
    </template>
    <template #ffooter>
      <el-row
        style="width: 100%"
        type="flex"
        justify="end"
      >
        <pagination
          :total="tableTotal"
          :current-page="params.pageNum"
          :page-size="params.pageSize"
          @size-change="handleAuthSizeChange"
          @current-change="handleAuthCurrentChange"
        />
      </el-row>
    </template>
  </app-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useList } from '@/hooks/use-list';
import { useSearchConfig } from './hooks/use-search-config';
import { useTableColumns } from './hooks/use-table-columns';
import { useInitSearch } from '@/modules/customer-board/customer-risk/hooks/use-init-search';
import { usePermissionConfig } from '@/modules/customer-board/customer-risk/use-permission-config';
import RiskLogDialog from './components/risk-log-dialog/index.vue';
import { handleOpenDialog } from '@/hooks/use-dialog';
import {
  getFinanceRiskInfoPageApi,
  getFinanceRiskInfoLastUpdateDateApi,
} from '@/modules/customer-board/customer-risk/api';
import {
  IFinanceRiskInfoPageReq,
  IFinanceRiskInfoPageRes,
  IFinanceRiskInfoPageResListItem,
} from './type';
import { RISK_STATE_LIST, RISK_QUERY_PARAMS_KEY } from '@/modules/customer-board/customer-risk/constant';

export default defineComponent({
  beforeRouteEnter(_, from) {
    if (from.name !== 'CustomerOperateBiCustomerRiskProfile') {
      sessionStorage.removeItem(RISK_QUERY_PARAMS_KEY);
    }
  },
  setup() {
    const {
      SHOW_SEA_CUSTOMER,
    } = usePermissionConfig();

    const lastUpdateDate = ref('');

    const queryParams: IFinanceRiskInfoPageReq = {
      regionCode: '',
      userIds: [],
      includePublic: SHOW_SEA_CUSTOMER.value,
      riskLevel: [],
      customerName: '',
      riskTrend: '',
      pageNum: 1,
      pageSize: 10,
    };

    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<IFinanceRiskInfoPageRes, IFinanceRiskInfoPageReq>({
      request: {
        api: getFinanceRiskInfoPageApi,
        params: queryParams,
        handleParams(paramsObj) {
          delete paramsObj.cascader;
          return paramsObj;
        },
        handleCustomReset() {
          return {
            ...queryParams,
            // eslint-disable-next-line no-use-before-define
            regionCode: defaultRegion.value,
            // eslint-disable-next-line no-use-before-define
            userIds: allUserIds.value,
            // eslint-disable-next-line no-use-before-define
            cascader: allCascader.value,
          };
        },
      },
    });

    const getProfileQueryParams = () => {
      let profileQueryParams = {};
      try {
        profileQueryParams = JSON.parse(sessionStorage.getItem(RISK_QUERY_PARAMS_KEY) || '{}');
      } catch (e) {
        console.error(e);
      }
      Object.assign(params.value, profileQueryParams);
      sessionStorage.removeItem(RISK_QUERY_PARAMS_KEY);
    };

    const handleViewLog = (row: IFinanceRiskInfoPageResListItem) => {
      handleOpenDialog(RiskLogDialog, {
        params: {
          customerId: row.customerId,
        },
      });
    };

    const {
      regionList,
      defaultRegion,
      cascaderOption,
      allCascader,
      allUserIds,
      getCascaderOptions,
      handleChangeCascader,
      initRegionList,
    } = useInitSearch(params);

    const { searchConfig } = useSearchConfig({
      regionList,
      SHOW_SEA_CUSTOMER,
    });

    const { tableColumns } = useTableColumns({
      handleViewLog,
    });

    const handleAuth = () => {
      if (!regionList.value.length) {
        ElMessage.error('当前账号暂无所属区域的权限！');
        return false;
      }
      return true;
    };
    // 查询
    const handleAuthSearch = () => {
      if (!handleAuth()) return;
      handleSearch();
    };
    // 重置
    const handleAuthReset = () => {
      if (!handleAuth()) return;
      handleReset();
    };
    const handleAuthSizeChange = (pageSize: number) => {
      if (!handleAuth()) return;
      handleSizeChange(pageSize);
    };
    const handleAuthCurrentChange = (pageNum: number) => {
      if (!handleAuth()) return;
      handleCurrentChange(pageNum);
    };

    const handleConditionChange = () => {
      handleAuthSearch();
    };

    const getFinanceRiskInfoLastUpdateDate = async () => {
      const { data } = await getFinanceRiskInfoLastUpdateDateApi();
      lastUpdateDate.value = data.lastUpdateDate;
    };

    const init = async () => {
      await Promise.all([
        initRegionList(),
        getCascaderOptions(),
      ]);
      getProfileQueryParams();
      handleAuthSearch();
      getFinanceRiskInfoLastUpdateDate();
    };
    init();

    return {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,

      handleAuthSearch,
      handleAuthReset,
      handleAuthSizeChange,
      handleAuthCurrentChange,

      tableColumns,
      handleConditionChange,
      cascaderOption,
      handleChangeCascader,

      lastUpdateDate,
      searchConfig,
      conditionInfo: {
        title: '风险状态：',
        conditionList: [
          {
            label: '全部',
            value: '',
          },
          ...RISK_STATE_LIST,
        ],
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.sea_customer {
  margin-left: -76px;
  .label {
    margin-right: 10px;
    font-size: var(--el-form-label-font-size);
    color: var(--el-text-color-regular);
  }
}
</style>
