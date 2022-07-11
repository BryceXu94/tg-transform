<template>
  <app-page class="demand-list">
    <template #fheader>
      <search-area
        v-model="params"
        @handleSearch="handleSearch()"
        @handleReset="handleReset()"
        :config="searchConfig"
      >
        <template #monthSellWell>
          <input-number
            v-model="params.monthSellWell"
            :max="999999.99"
            :precision="2"
            :min="0"
            placeholder="请输入月畅销款数"
          >
            <template #prepend>大于等于</template>
          </input-number>
        </template>
        <template #saleRange>
          <input-number-ranger
            v-model:rangeStart="params.priceMin"
            v-model:rangeEnd="params.priceMax"
            :max="999999.99"
            :precision="2"
            :min="0"
            placeholder="请输入"
          />
        </template>
        <template #mainCategory>
          <el-cascader
            :options="PIMS_CATEGORY_OPTIONS"
            v-model="params.mainCategory"
            collapse-tags
            class="select-full"
            :props="{
              value: 'label',
              multiple: true,
            }"
          ></el-cascader>
        </template>
      </search-area>
    </template>
    <template #header>
      <header-area>
        <template #default>
          <condition-select
            :conditionInfo="typeConditionInfo"
            v-model="params.trackState"
            @conditionChange="handleConditionChange"
          />
        </template>
        <template #button>
          <el-button
            @click="handleAuditTrack(selectedTracks)"
            :disabled="selectedTracks.length === 0"
            v-if="CAN_AUDIT"
          >
            批量审核
          </el-button>
          <router-link
            v-if="CAN_CREATE"
            :to="{
              name: 'ClueManageCustomerClueCreate',
            }"
            class="margin-left-10"
          >
            <el-button
              type="primary"
            >
              新增线索
            </el-button>
          </router-link>
        </template>
      </header-area>
    </template>
    <template #main="{ height }">
      <tgo-table
        :height="height"
        :key="height"
        :data="tableData"
        :columns="tableColumns"
        @selectionChange="handleSelectionChange"
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
    <audit-modal
      :tracks="auditModalConfig.tracks"
      v-model:visible="auditModalConfig.visible"
      @success="handleSearch(params.pageNum)"
    />
  </app-page>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useList } from '@/hooks/use-list';
import { useTableColumns } from './hooks/use-table-columns';
import { TRACK_STATE_LIST } from '@/modules/clue-manage/customer-clue/constant';
import {
  getCluesList,
  getCluesStatistical,
} from '@/modules/clue-manage/customer-clue/api';
import {
  IGetCluesStatisticalRes,
} from '@/modules/clue-manage/customer-clue/api/type';
import {
  IParams,
  IDataItem,
} from './type';
import { getUserOptionsByUserName } from '@/api/query-options';
import { usePermissionConfig } from '@/modules/clue-manage/customer-clue/use-permission-config';
import { useSearch } from './hooks/use-search';
import { useDictionary } from '@/hooks/use-dictionary';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { useOperation } from '@/modules/clue-manage/customer-clue/hooks/use-operation';
import AuditModal from '@/modules/clue-manage/customer-clue/components/audit-modal/index.vue';
import { plus } from 'number-precision';

export default defineComponent({
  name: 'ClueManageCustomerClueList',
  components: {
    AuditModal,
  },
  setup() {
    const { getDictionaryOptions } = useDictionary();
    const { searchConfig } = useSearch();
    // 权限
    const {
      CAN_CREATE,
      CAN_AUDIT,
    } = usePermissionConfig();
    const statisticalInfo = ref<IGetCluesStatisticalRes['trackStateCountList']>([]);

    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<IDataItem, IParams>({
      request: {
        api: getCluesList,
        params: {
          customerName: '',
          auditResult: '',
          creatorName: '',
          createdEndTime: '',
          createdStartTime: '',
          mainCategory: [],
          monthSellWell: '',
          priceMin: '',
          priceMax: '',
          trackState: '',
          pageNum: 1,
          pageSize: 10,
        },
        handleParams(paramsObj) {
          // eslint-disable-next-line no-use-before-define
          getStatistical();
          // eslint-disable-next-line no-use-before-define
          selectedTracks.value = [];
          return {
            ...paramsObj,
          };
        },
      },
    });
    // 获取线索状态tab统计
    const getStatistical = async () => {
      const { trackState, pageNum, pageSize, ...rest } = params.value;
      const { data } = await getCluesStatistical(rest);
      statisticalInfo.value = data.trackStateCountList;
    };
    const {
      selectedTracks,
      handleActiveTrack,
      handleAuditTrack,
      auditModalConfig,
    } = useOperation({
      reloadFn: () => handleSearch(params.value.pageNum),
    });
    const { tableColumns } = useTableColumns({
      handleActiveTrack,
      handleAuditTrack,
    });
    const typeConditionInfo = computed(() => {
      const total = statisticalInfo.value.reduce((count, current) => plus(count, current.count), 0);
      const conditionList: {
        value: string;
        label: string;
      }[] = [
        {
          value: '',
          label: `全部(${total})`,
        },
      ];
      TRACK_STATE_LIST.forEach((v) => {
        const row = statisticalInfo.value.find(it => it.trackState === v.value);
        const count = row?.count || 0;
        conditionList.push({
          value: v.value,
          label: `${v.label}(${count})`,
        });
      });
      return {
        title: '线索状态：',
        conditionList,
      };
    });

    const handleConditionChange = () => {
      handleSearch();
    };

    const init = async () => {
      handleSearch();
    };
    init();
    const handleSelectionChange = (rows: IDataItem[]) => {
      selectedTracks.value = rows.map(v => ({
        id: v.trackId!,
        name: v.customerName!,
      }));
    };
    const PIMS_CATEGORY_OPTIONS = computed(() => getDictionaryOptions(CX_DICTIONARY_KEY.PIMS_CATEGORY, 3));
    return {
      handleActiveTrack,
      handleAuditTrack,
      auditModalConfig,
      selectedTracks,
      PIMS_CATEGORY_OPTIONS,
      handleSelectionChange,
      searchConfig,
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,

      getUserOptionsByUserName,

      tableColumns,
      handleConditionChange,

      typeConditionInfo,

      CAN_AUDIT,
      CAN_CREATE,
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
.cascaderTooltip{
  z-index: 10000;
  background-color: red;
}
</style>
