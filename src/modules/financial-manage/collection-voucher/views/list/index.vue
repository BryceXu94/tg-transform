<template>
  <div>
    <app-page class="collection-voucher-list">
      <template #fheader>
        <search-area
          v-model="params"
          :config="searchConfig"
          @handleSearch="handleSearch"
          @handleReset="handleReset"
        >
          <template #bd>
            <query-select
              v-model="params.bdId"
              :method="getUserInfo"
              placeholder="请选择BD"
              :config="{
                labelKey: 'username',
                valueKey: 'userId',
                keywordQueryKey: 'username',
                valueQueryKey: 'username',
                dataKey: 'data',
                showCode: true,
                codeKey: 'userCode'
              }"
            />
          </template>
          <template #customer>
            <query-select
              placeholder="请选择客户"
              v-model="params.customerId"
              :method="getCustomerOptions"
              :config="{
                valueKey: 'customerId',
                labelKey: 'customerName',
                keywordQueryKey: 'customerName',
                valueQueryKey: 'customerName',
                dataKey: 'data',
                showValue: true,
              }"
              :queryParams="{
                businessType: '',
              }"
            />
          </template>
        </search-area>
      </template>
      <template #header>
        <header-area>
          <template #button>
            <el-button
              type="primary"
              v-if="CAN_EXPORT"
              @click="handelExport"
            >导出</el-button>
          </template>
        </header-area>
      </template>
      <template #main="{ height }">
        <tgo-table
          border
          :height="height"
          :key="height"
          :data="tableData"
          :columns="columns"
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
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </template>
    </app-page>
  </div>
</template>
<script lang="tsx">
import { defineComponent, ref, computed } from 'vue';
import { formatTime } from '@tiangong/utils';
import {
  getUserInfo,
  getCustomerOptions,
  regionAreaListApi,
} from '@/api/query-options';
import { IRegionListResItem } from '@/api/query-options/type.d';

import { useList } from '@/hooks/use-list';
import { useColumns } from './use-columns';
import { exportByBlob } from '@/core/utils/file-download';
import { usePermissionConfig } from '../../use-permission-config';

import { getPayBackPageApi } from '@/modules/financial-manage/collection-voucher/api';
import {
  IPaybackPageReq,
  IPaybackPageRes,
} from '@/modules/financial-manage/collection-voucher/api/type';

export default defineComponent({
  name: 'CollectionVoucherList',
  setup() {
    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<IPaybackPageRes, IPaybackPageReq>({
      request: {
        api: getPayBackPageApi,
        params: {
          pageNum: 1,
          pageSize: 10,
          bdId: '',
          customerId: '',
          regionCode: '',
          beginDate: '',
          endDate: '',
        },
      },
    });
    handleSearch();

    const { columns } = useColumns();

    // 区域
    const regionAreaList = ref<IRegionListResItem[]>([]);
    const getRegionAreaList = async () => {
      const res = await regionAreaListApi();
      regionAreaList.value = res?.data ?? [];
    };
    getRegionAreaList();

    // 搜索
    const searchConfig = computed(() => {
      return [
        {
          name: '所属BD：',
          slotName: 'bd',
        },
        {
          name: '客户名称：',
          slotName: 'customer',
        },
        {
          name: '所属区域：',
          component: 'select',
          valueName: 'regionCode',
          placeholder: '请选择',
          options: [
            {
              label: '全部',
              value: '',
            },
            ...regionAreaList.value.map((item) => {
              return {
                value: item.regionCode,
                label: item.regionName,
              };
            }),
          ],
        },
        {
          name: '创建时间：',
          component: 'datePicker',
          valueName: ['beginDate', 'endDate'],
          placeholder: ['开始日期', '结束日期'],
          disabledDate: (time: Date) => {
            return time.getTime() > new Date(formatTime(Date.now())).getTime();
          },
        },
      ];
    });

    // 权限
    const {
      CAN_EXPORT,
    } = usePermissionConfig();

    // 导出
    const handelExport = async () => {
      const { pageNum, pageSize, ...rest } = params.value;
      console.log(pageNum, pageSize);
      await exportByBlob({
        method: 'post',
        url: '/crm-salesman/web/v1/payback/export',
        data: rest,
        filename: '回款凭证.xlsx',
        loading: true,
      });
    };

    return {
      params,
      tableTotal,
      tableData,
      columns,
      CAN_EXPORT,

      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      getUserInfo,
      getCustomerOptions,
      handelExport,
      searchConfig,
    };
  },
});
</script>

<style scoped lang="scss">
</style>
