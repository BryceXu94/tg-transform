<template>
  <app-page class="demand-list">
    <template #fheader>
      <search-area
        v-model="params"
        @handleSearch="getDemandInfo"
        @handleReset="handleAuthReset"
        :config="searchAreaConfig"
      >
        <template #expectedDelivery>
          <el-date-picker
            v-model="params.expectDeliveryDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择"
          />
        </template>
      </search-area>
    </template>
    <template #header>
      <header-area>
        <template #default>
          <condition-select
            :conditionInfo="demandConditionInfo"
            v-model="params.state"
            @conditionChange="handleDemandConditionChange"
          />
          <condition-select
            :conditionInfo="orderConditionInfo"
            v-model="params.orderState"
            @conditionChange="handleOrderConditionChange"
          />
        </template>
        <template #button>
          <router-link
            v-if="CAN_CREATE"
            :to="{
              name: 'DemandManagePlatformDemandCreate',
            }"
          >
            <el-button
              type="primary"
            >
              发布需求
            </el-button>
          </router-link>
        </template>
      </header-area>
    </template>
    <template #main="{ height }">
      <custom-table
        border
        :height="height"
        :key="height"
        :data="tableData"
        :columns="demandRenderColumns(
          CAN_VIEW,
          CAN_UPDATE,
          CAN_CREATE_AGAIN
        )"
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
import { defineComponent, ref, computed, reactive, nextTick } from 'vue';
import { ElMessage } from 'element-plus';

import { useList } from '@/hooks/use-list';
import CustomTable from '@/components/custom-table';
import { demandRenderColumns } from './composables/tableData';
import { usePermissionList } from '@/hooks/use-permission-list';
import { IPermissionItem } from '@/hooks/use-permission-list/type';

import {
  getDemandPageApi,
  getDemandCountApi,
  getOrderCountApi,
} from '@/modules/demand-manage/platform-demand/api';
import {
  IDemandPageReq,
  IDemandPageRes,
  IDemandCountResItem,
} from '@/modules/demand-manage/platform-demand/api/types';
import { getRegionList } from '@/api/global';
import { getUserOptionsByUserName } from '@/api/query-options';

import { usePermissionConfig } from '@/modules/demand-manage/platform-demand/use-permission-config';

export default defineComponent({
  name: 'DemandManagePlatformDemandList',
  components: {
    CustomTable,
  },
  setup() {
    let demandCountInfo: IDemandCountResItem[] = ([
      {
        name: '全部',
        count: '0',
        demandState: '',
        subState: [],
      },
    ]);
    const queryParams: IDemandPageReq = {
      styleCode: '',
      customerName: '',
      bdName: '',
      customerStyleCode: '',
      creatorName: '',
      expectDeliveryDate: '',
      regionCode: '',
      state: 0,
      demandState: '',
      orderState: '',
      subState: [],
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
    } = useList<IDemandPageRes, IDemandPageReq>({
      request: {
        api: getDemandPageApi,
        params: queryParams,
        handleParams(paramsObj) {
          // eslint-disable-next-line no-use-before-define
          getDemandCount();
          // eslint-disable-next-line no-use-before-define
          getOrderCount();
          const { demandState, subState } = demandCountInfo[paramsObj.state as number];
          paramsObj.demandState = demandState;
          paramsObj.subState = subState;
          delete paramsObj.state;
          return {
            ...paramsObj,
          };
        },
      },
    });

    // 权限
    const {
      CAN_VIEW,
      CAN_CREATE,
      CAN_UPDATE,
      CAN_CREATE_AGAIN,
    } = usePermissionConfig();

    const demandConditionInfo = reactive({
      title: '需求状态：',
      conditionList: [
        {
          label: '全部(0)',
          value: 0,
        },
      ],
    });
    const getDemandCount = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { state, orderState, pageNum, pageSize, ...rest } = params.value;
      const res = await getDemandCountApi(rest);
      demandCountInfo = res?.data || [];
      demandConditionInfo.conditionList = demandCountInfo.map((item, index) => {
        return {
          label: `${item.name}(${item.count})`,
          value: index,
        };
      });
    };

    const orderConditionInfo = reactive({
      title: '订单状态：',
      conditionList: [
        {
          label: '全部(0)',
          value: '',
        },
      ],
    });
    const getOrderCount = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { state, orderState, pageNum, pageSize, ...rest } = params.value;
      const res = await getOrderCountApi(rest);
      const orderCountInfo = res?.data || [];
      orderConditionInfo.conditionList = orderCountInfo.map((item) => {
        return {
          label: `${item.name}(${item.count})`,
          value: item.orderState,
        };
      });
      orderConditionInfo.conditionList.shift();
    };

    const BELONG_AREA_LIST = ref<IPermissionItem<string>[]>([]);
    const {
      permissionList: regionList,
      defaultCondition,
    } = usePermissionList<string>(
      BELONG_AREA_LIST,
      true,
    );

    const searchAreaConfig = computed(() => {
      return [
        {
          name: '款号SPU：',
          component: 'input',
          valueName: 'styleCode',
          placeholder: '请输入款号SPU',
        },
        {
          name: '客户名称：',
          component: 'input',
          valueName: 'customerName',
          placeholder: '请输入客户名称',
        },
        {
          name: '销售BD：',
          component: 'input',
          valueName: 'bdName',
          placeholder: '请输入销售BD',
        },
        {
          name: '客户款号：',
          component: 'input',
          valueName: 'customerStyleCode',
          placeholder: '请输入客户款号',
        },
        {
          name: '创建人：',
          component: 'input',
          valueName: 'creatorName',
          placeholder: '请输入创建人',
        },
        {
          name: '期望交期：',
          slotName: 'expectedDelivery',
        },
        {
          name: '所属区域：',
          component: 'select',
          valueName: 'regionCode',
          placeholder: '请选择',
          options: [
            ...regionList.value.map((item) => {
              return {
                label: item.label,
                value: item.value,
              };
            }),
          ],
          clearable: false,
        },
        {
          name: '创建时间：',
          component: 'datePicker',
          valueName: ['createdTimeBegin', 'createdTimeEnd'],
          placeholder: ['开始日期', '结束日期'],
        },
      ];
    });

    const initRegionList = async () => {
      const res = await getRegionList();
      const belongAreaList = res?.data || [];

      BELONG_AREA_LIST.value = belongAreaList.map((item) => {
        return {
          label: item.regionName,
          value: item.regionCode,
          permissionCode: `CCS-XQGL-PTXQ-SSQY-${item.regionCode}`,
        };
      });
      await nextTick();
      queryParams.regionCode = defaultCondition.value;
      params.value.regionCode = defaultCondition.value;
    };

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

    const getDemandInfo = () => {
      if (!handleAuth()) return;
      handleAuthSearch();
    };

    const handleDemandConditionChange = () => {
      params.value.orderState = '';
      handleAuthSearch();
    };

    const handleOrderConditionChange = () => {
      params.value.state = 0;
      handleAuthSearch();
    };

    const init = async () => {
      await initRegionList();
      getDemandInfo();
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

      getDemandInfo,
      getUserOptionsByUserName,

      demandRenderColumns,
      handleDemandConditionChange,
      handleOrderConditionChange,

      searchAreaConfig,
      demandConditionInfo,
      orderConditionInfo,

      CAN_VIEW,
      CAN_CREATE,
      CAN_UPDATE,
      CAN_CREATE_AGAIN,
    };
  },
});
</script>

<style lang="scss" scoped>
.demand-list {
  :deep(.el-table-fixed-column--left.is-leaf) {
    background-color: var(--el-table-header-bg-color);
  }
}
</style>
