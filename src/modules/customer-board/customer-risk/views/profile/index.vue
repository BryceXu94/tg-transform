<template>
  <app-page class="risk_profile">
    <template #fheader>
      <search-area
        v-model="params"
        @handleSearch="getCustomerRiskProfile"
        @handleReset="handleReset"
        :config="searchConfig"
        class="search_area"
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
            clearable
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
    <template #main>
      <main class="risk_profile_main">
        <article class="risk_profile_article">
          <section class="statistic">
            <ul class="list">
              <li
                class="item"
                v-for="(item, index) in pieChartData"
                :key="index"
              >
                <div class="info">
                  <span>{{item.config.desc}}</span>
                  <span :class="['number', item.config.className]">{{item.data.value}}</span>
                  <router-link
                    v-if="CAN_VIEW_LIST"
                    :to="{
                      name: 'CustomerOperateBiCustomerRiskList',
                    }"
                    @click="handleViewList({
                      riskLevel: [item.config.riskLevel]
                    })"
                  >
                    <el-button type="text">
                      查看详情
                    </el-button>
                  </router-link>
                </div>
                <pie-chart
                  class="chart"
                  :data="[item.data]"
                  :config="item.config"
                />
              </li>
            </ul>
          </section>
          <section class="trend">
            <bar-chart
              class="chart"
              :data="barChartData"
              :xAxisData="barChartXAxisData"
            />
          </section>
        </article>
        <aside class="risk_profile_aside">
          <div class="description">
            <p><span class="title">近期风险上升客户</span>{{riskRiskInfo?.riskCustomerCount}}</p>
            <router-link
              v-if="CAN_VIEW_LIST && +riskRiskInfo?.riskCustomerCount"
              :to="{
                name: 'CustomerOperateBiCustomerRiskList',
              }"
              @click="handleViewList({
                riskTrend: RISK_STATE_ENUM.UP,
                updateStartDate: updateStartDate,
                updateEndDate: updateEndDate,
              })"
            >
              <el-button type="text">
                查看详情
              </el-button>
            </router-link>
          </div>
          <el-scrollbar class="list" v-if="riskRiskInfo?.riskRiseInfoList?.length">
            <ul>
              <li
                class="item"
                v-for="(item, index) in riskRiskInfo.riskRiseInfoList"
                :key="index"
              >
                <p class="title">{{item.customerName}}</p>
                <div class="risk">
                  <span class="label">风险变化：</span>
                  <span class="high">{{$filters.getEnumLabel(RISK_LEVEL_LIST, item.riskLevelHistory)}}</span>
                  <el-icon><caret-right /></el-icon>
                  <span class="higher">{{$filters.getEnumLabel(RISK_LEVEL_LIST, item.riskLevelLast)}}</span>
                </div>
                <div><span class="label">更新日期：</span>{{$filters.formatTime(item.riskUpdateDate, 'YYYY-MM-DD')}}</div>
              </li>
            </ul>
          </el-scrollbar>
          <empty class="empty" v-else />
        </aside>
      </main>
    </template>
  </app-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import PieChart from './components/pie-chart/index.vue';
import BarChart from './components/bar-chart/index.vue';
import { CaretRight } from '@element-plus/icons-vue';
import {
  getFinanceRiskInfoRiskStatisticApi,
  getFinanceRiskInfoRiskRiseApi,
  getFinanceRiskInfoRiskStatisticStateApi,
} from '@/modules/customer-board/customer-risk/api';
import {
  IFinanceRiskInfoRiskProfileReq,
  IFinanceRiskInfoRiskRiseRes,
  IFinanceRiskInfoRiskStatisticStateResItem,
  IPieChartData,
  IBarChartData,
  IQueryParams,
} from './type';
import { usePermissionConfig } from '@/modules/customer-board/customer-risk/use-permission-config';
import { useSearchConfig } from './hooks/use-search-config';
import { useInitSearch } from '@/modules/customer-board/customer-risk/hooks/use-init-search';
import {
  RISK_STATE_ENUM,
  RISK_LEVEL_LIST,
  RISK_QUERY_PARAMS_KEY,
  RISK_STATISTIC_CONFIG,
} from '@/modules/customer-board/customer-risk/constant';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';

export default defineComponent({
  components: {
    PieChart,
    BarChart,
    CaretRight,
  },
  setup() {
    const today = dayjs();
    const {
      CAN_VIEW_LIST,
      SHOW_SEA_CUSTOMER,
    } = usePermissionConfig();

    const riskRiskInfo = ref<IFinanceRiskInfoRiskRiseRes>({
      riskCustomerCount: '0',
      riskRiseInfoList: [],
    });

    const pieChartData = ref<IPieChartData[]>([]);
    const barChartData = ref<IBarChartData[]>([]);
    const barChartXAxisData = ref<string[]>([]);

    const params = ref<IFinanceRiskInfoRiskProfileReq>({
      regionCode: '',
      userIds: [],
      includePublic: SHOW_SEA_CUSTOMER.value,
    });

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

    const handleAuth = () => {
      if (!regionList.value.length) {
        ElMessage.error('当前账号暂无所属区域的权限！');
        return false;
      }
      return true;
    };

    const getCustomerRiskProfileParams = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { cascader, ...reset } = params.value;
      return reset;
    };

    const getFinanceRiskInfoRiskStatistic = async (
      financeRiskInfoRiskStatisticState: IFinanceRiskInfoRiskStatisticStateResItem[],
    ) => {
      const res = await getFinanceRiskInfoRiskStatisticApi(getCustomerRiskProfileParams());
      const data = res?.data || {
        middleRiskList: [],
        higherRiskList: [],
        highRiskList: [],
        dateList: [],
      };
      data.middleRiskList.push(financeRiskInfoRiskStatisticState?.[2].count || '0');
      data.highRiskList.push(financeRiskInfoRiskStatisticState?.[0].count || '0');
      data.higherRiskList.push(financeRiskInfoRiskStatisticState?.[1].count || '0');
      data.dateList.push(today.format('MM-DD'));

      const dateListL = data.dateList.length;
      if (dateListL > 12) {
        const count = dateListL - 12;
        data.middleRiskList.splice(0, count);
        data.higherRiskList.splice(0, count);
        data.highRiskList.splice(0, count);
        data.dateList.splice(0, count);
      } else {
        data.dateList.length = 12;
        data.dateList.fill('', dateListL);
      }

      barChartData.value = [
        { name: '中风险', data: data.middleRiskList },
        { name: '较高风险', data: data.higherRiskList },
        { name: '高风险', data: data.highRiskList },
      ];
      barChartXAxisData.value = data.dateList;
    };

    const getFinanceRiskInfoRiskStatisticState = async () => {
      const { data } = await getFinanceRiskInfoRiskStatisticStateApi(getCustomerRiskProfileParams());

      pieChartData.value = data
        ?.sort((a, b) => +b.riskLevel - +a.riskLevel)
        .map((item, index) => {
          return {
            data: { value: item.count },
            config: {
              title: `${item.ratio}%`,
              ...RISK_STATISTIC_CONFIG[index],
            },
          };
        });

      return data;
    };

    const getCustomerRiskProfile = async () => {
      if (!handleAuth()) return;
      const financeRiskInfoRiskStatisticState = await getFinanceRiskInfoRiskStatisticState();
      getFinanceRiskInfoRiskStatistic(financeRiskInfoRiskStatisticState);
      const { data } = await getFinanceRiskInfoRiskRiseApi(getCustomerRiskProfileParams());
      riskRiskInfo.value = data;
    };

    const handleReset = () => {
      params.value.regionCode = defaultRegion.value;
      params.value.userIds = allUserIds.value;
      params.value.includePublic = SHOW_SEA_CUSTOMER.value;
      params.value.cascader = allCascader.value;
      getCustomerRiskProfile();
    };

    const handleViewList = (queryParams: IQueryParams) => {
      sessionStorage.setItem(RISK_QUERY_PARAMS_KEY, JSON.stringify({
        ...params.value,
        ...queryParams,
      }));
    };

    const init = async () => {
      await Promise.all([
        initRegionList(),
        getCascaderOptions(),
      ]);
      getCustomerRiskProfile();
    };
    init();

    return {
      params,
      riskRiskInfo,
      pieChartData,
      barChartData,
      barChartXAxisData,
      cascaderOption,
      getCustomerRiskProfile,
      RISK_STATE_ENUM,
      RISK_LEVEL_LIST,
      handleReset,
      handleChangeCascader,
      searchConfig,
      CAN_VIEW_LIST,
      handleViewList,
      updateEndDate: today.format('YYYY-MM-DD'),
      updateStartDate: today.subtract(7, 'day').format('YYYY-MM-DD'),
    };
  },
});
</script>

<style lang="scss" scoped>
@mixin layout() {
  padding: 10px;
  background: #fff;
}

.risk_profile {
  .search_area {
    background: #fff;
    padding-top: 18px;
    margin-bottom: 10px;
    :deep(.el-form-item__label) {
      width: 60px !important;
    }
  }
  &_main {
    display: flex;
    height: 100%;
  }
  &_article {
    width: 70%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    .statistic {
      margin-bottom: 10px;
      .list {
        display: flex;
        justify-content: space-between;
      }
      .item {
        @include layout();
        height: 100px;
        flex: 1;
        display: flex;
        margin-right: 10px;
      }
      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-top: 10px;
        padding-left: 10px;
        .number {
          flex: 1;
          font-weight: bold;
          margin-top: 10px;
        }
        // .detail {
        //   color: $grey;
        // }
      }
      .chart {
        width: 80px;
        padding-right: 10px;
      }
    }
    .trend {
      @include layout();
      flex: 1;
      margin-right: 10px;
    }
  }
  &_aside {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    @include layout();
    .description {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-weight: bold;
        margin-right: 10px;
      }
    }
    .list {
      flex: 1;
    }
    .item {
      border: 1px solid rgb(242, 242, 242);
      border-radius: 3px;
      @include layout();
      margin: 10px 0;
      .title {
        font-weight: bold;
        @include ellipsis();
      }
      .risk {
        display: flex;
        align-items: center;
        margin: 10px 0;
      }
      .label {
        color: $grey;
      }
    }
    .empty {
      margin: auto;
    }
  }
  .higher {
    color: #EC808D;
  }
  .high {
    color: #F59A23;
  }
  .medium {
    color: #555;
  }
  .low {
    color: #4B7902;
  }
  :deep(.page-content) {
    padding: 0;
    background: inherit !important;
  }
}
.sea_customer {
  margin-left: -76px;
  .label {
    margin-right: 10px;
    font-size: var(--el-form-label-font-size);
    color: var(--el-text-color-regular);
  }
}
</style>
