<template>
  <app-page>
    <template #header>
      <detail-title
        title="客户生命周期"
      ></detail-title>
      <el-form>
        <div class="filter_layout">
          <el-form-item label="漏斗维度">
            <el-radio-group :model-value="curTab" @change="handleChangeTab">
              <el-radio-button
                v-for="item in DIMENSION_LIST"
                :label="item.value"
                :key="item.value"
              >{{item.label}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-popover width="400">
            <template #reference>
              <div class="tips">
                <el-icon class="icon">
                  <warning />
                </el-icon>
                名词解释
              </div>
            </template>
            <div class="popover_layout">
              <div class="title">名称解释</div>
              <div class="li">开发计划：客服线索录入或BD创建开发计划</div>
              <div class="li">建立联系：BD领取客户线索后进行开发中</div>
              <div class="li">客户建档：客户信息录入完成，进入到准入阶段</div>
              <div class="li">发展阶段：发放客户授信额度，可进行下单</div>
              <div class="li">试单阶段：客户已达成合作，进入下单阶段</div>
              <div class="li">回款阶段：完成客户交付进入收款阶段</div>
              <div class="li">取消合作：因其他因素，客户停止与天工合作</div>
            </div>
          </el-popover>
        </div>
      </el-form>
    </template>
    <template #main>
      <div class="statistical_layout">
        <div class="pane">
          <div class="header">
            <div class="title">客户生命周期漏斗图</div>
            <div class="switch" v-if="hasManagerAuth">
              <div class="label">展示公海数据：</div>
              <el-switch v-model="funnelParams.isManager"></el-switch>
            </div>
          </div>
          <div class="query_layout">
            <el-form label-width="100px">
              <el-row>
                <el-col :span="10">
                  <el-form-item label="数据维度">
                    <el-cascader
                      v-model="funnelParams.cascader"
                      :options="cascaderOption"
                      @change="handleChangeCascader"
                      collapse-tags
                      :props="{
                        multiple: true,
                      }"
                      :show-all-levels="false"
                    ></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="时间维度">
                    <el-date-picker
                      v-model="funnelParams.date"
                      type="daterange"
                      unlink-panels
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="YYYY-MM-DD"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label-width="0">
                    <el-button
                      class="margin-left-10"
                      type="primary"
                      @click="getFunnelData"
                    >查询</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="chart">
            <funnel-chart
              :data="funnelData"
            />
          </div>
        </div>
        <div class="pane">
          <div class="header">
            <div class="title">客户生命柱状对比图</div>
            <div class="switch" v-if="hasManagerAuth">
              <div class="label">展示公海数据：</div>
              <el-switch v-model="barParams.isManager"></el-switch>
            </div>
          </div>
          <div class="query_layout">
            <el-form
              label-width="80px"
              :model="barParams"
              :rules="barRules"
              ref="barFormEl"
            >
              <el-row>
                <el-col :span="20">
                  <el-form-item label="对比维度">
                    <el-radio-group
                      :model-value="dateEnum"
                      @change="handleChangeDateEnum"
                    >
                      <el-radio-button
                        :label="item.value"
                        v-for="item in BAR_DATE_LIST"
                        :key="item.value"
                      >{{item.label}}</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label-width="0">
                    <el-button
                      class="margin-left-10"
                      type="primary"
                      @click="getBarData"
                    >查询</el-button>
                  </el-form-item>
                </el-col>
                <template v-if="dateEnum === BAR_DATE_ENUM.CUSTOM">
                  <el-col :span="12">
                    <el-form-item label="开始" prop="formerDate">
                      <el-date-picker
                        v-model="barParams.formerDate"
                        type="daterange"
                        unlink-panels
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        value-format="YYYY-MM-DD"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="结束" prop="latterDate">
                      <el-date-picker
                        v-model="barParams.latterDate"
                        type="daterange"
                        unlink-panels
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        value-format="YYYY-MM-DD"
                      />
                    </el-form-item>
                  </el-col>
                </template>
              </el-row>
            </el-form>
          </div>
          <div class="chart">
            <line-chart
              :data="barData"
            />
          </div>
        </div>
      </div>
    </template>
  </app-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { DIMENSION_LIST, DIMENSION_ENUM, BAR_DATE_ENUM, BAR_DATE_LIST } from './constant';
import {
  getUserOrgOptions,
} from '@/modules/clue-manage/life-cycle/api';
import LineChart from './components/line-chart/index.vue';
import FunnelChart from './components/funnel-chart/index.vue';
import { useBar } from './hooks/use-bar';
import { useFunnel } from './hooks/use-funnel';
import { Warning } from '@element-plus/icons-vue';
import { ICascaderOptionItem } from './type';

export default defineComponent({
  components: {
    LineChart,
    FunnelChart,
    Warning,
  },
  setup() {
    const curTab = ref(DIMENSION_ENUM.CLUES);
    const hasManagerAuth = ref(false);
    const {
      funnelParams,
      funnelData,
      getFunnelData,
      handleChangeCascader,
    } = useFunnel(curTab);
    const {
      dateEnum,
      barData,
      barParams,
      getBarData,
      handleChangeDateEnum,
      barRules,
      barFormEl,
    } = useBar(curTab);
    const cascaderOption = ref<ICascaderOptionItem[]>([]);
    const getCascaderOptions = async () => {
      if (cascaderOption.value.length !== 0) return;
      const { data } = await getUserOrgOptions();
      const bdIds: string[] = [];
      const selectedIds: Array<string[]> = [];
      let isManager = false;
      cascaderOption.value = data.bdRegionList.map((v) => {
        if (v.isManager) {
          isManager = true;
        }
        return {
          label: v.regionName,
          value: v.regionName,
          children: v.orgModelList.map(it => ({
            label: it.orgName,
            value: it.orgId,
            children: it.bdModelList.map((bdItem) => {
              bdIds.push(bdItem.bdId);
              selectedIds.push([v.regionName, it.orgId, bdItem.bdId]);
              return {
                label: bdItem.bdName,
                value: bdItem.bdId,
              };
            }),
          })),
        };
      });
      funnelParams.value.cascader = selectedIds;
      funnelParams.value.userIds = bdIds;
      funnelParams.value.isManager = isManager;
      barParams.value.userIds = bdIds;
      barParams.value.isManager = isManager;
      hasManagerAuth.value = isManager;
    };
    const init = async () => {
      await getCascaderOptions();
      getBarData();
      getFunnelData();
    };
    const handleChangeTab = (val: DIMENSION_ENUM) => {
      curTab.value = val;
      init();
    };
    init();
    return {
      hasManagerAuth,
      handleChangeCascader,
      cascaderOption,
      barRules,
      barFormEl,
      getFunnelData,
      getBarData,
      handleChangeTab,
      handleChangeDateEnum,
      dateEnum,
      curTab,
      funnelData,
      funnelParams,
      barParams,
      barData,
      DIMENSION_LIST,
      BAR_DATE_LIST,
      BAR_DATE_ENUM,
    };
  },
});
</script>
名称解释

<style lang="scss" scoped>
.filter_layout{
  display: flex;
  justify-content: space-between;
  .tips{
    display: flex;
    align-items: center;
    .icon {
      font-size: 18px;
      margin-right: 5px;
    }
  }
}
  .popover_layout{
    .title{
      font-weight: 500;
      line-height: 28px;
      font-size: 16px;
      color: #333;
    }
    .li {
      line-height: 24px;
    }
  }
.statistical_layout{
  display: flex;
  justify-content: space-between;
  .pane{
    flex: 1;
    border: 1px solid #eee;
    padding: 10px;
    margin-left: 20px;
    border-radius: 4px;
    &:first-of-type {
      margin-left: 0;
    }
    .header{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 10px;
      .title{
        font-size: 16px;
        line-height: 48px;
        font-weight: 500;
      }
      .switch {
        display: flex;
        align-items: center;
        .label{
          font-size: 12px;
          color: var(--el-text-color-regular);
        }
      }
    }
    .query_layout{}
    .chart {
      height: 400px;
    }
  }
}
</style>
