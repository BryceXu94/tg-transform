<template>
  <app-page>
    <template #fheader>
      <search-area
        v-model="params"
        :config="searchConfig"
        @handleSearch="handleAuth(handleSearch)"
        @handleReset="handleAuth(handleReset)"
      />
    </template>
    <template #header>
      <header-area>
        <template #default>
          <condition-select
            :conditionInfo="paybackTypeConfig"
            v-model="params.paybackClassifyState"
            @conditionChange="handleChangePaybackType"
          />
          <condition-select
            :conditionInfo="paybackStatusConfig"
            v-model="params.paybackState"
            @conditionChange="handleAuth(handleSearch)"
          />
        </template>
        <template #button>
          <el-button
            v-if="CAN_EXPORT"
            type="primary"
            @click="handleExport"
          >
            导出
          </el-button>
        </template>
      </header-area>
    </template>
    <template #main="{ height }">
      <custom-table
        border
        :key="height"
        :height="height"
        :data="tableData"
        :columns="renderColumns(
          handleSetDate,
          CAN_VIEW_DETAIL,
          CAN_SET_MONEY_BACK_DATE,
        )"
      />
    </template>
    <template #footer>
      <el-row
        style="width: 100%"
        justyfy="start"
        align="middle"
      >
        <div>
          <span class="font-bold ">计划回款小计：</span>
          {{toThousands(summaryData?.planRepaymentCount ?? 0)}}元
        </div>
        <div class="margin-left-30">
          <span class="font-bold ">实际回款小计：</span>
          {{toThousands(summaryData?.actualRepaymentCount ?? 0)}}元
        </div>
        <div class="margin-left-30">
          <span class="font-bold ">待回款小计：</span>
          {{toThousands(summaryData?.waitRepaymentCount ?? 0)}}元
        </div>
        <el-tooltip
          effect="dark"
          content="默认统计当前月份的所有客户的回款计划。如果输入查询条件，则根据查询条件进行统计回款计划。"
          placement="top"
        >
          <el-icon
            :size="18"
            class="margin-left-15"
          ><question-filled /></el-icon>
        </el-tooltip>
      </el-row>
    </template>
    <template #ffooter>
      <el-row
        style="width: 100%"
        justify="end"
      >
        <pagination
          :total="tableTotal"
          :current-page="params.pageNum"
          :size="params.pageSize"
          @size-change="(...p: unknown[]) => handleAuth(handleSizeChange, p)"
          @current-change="(...p: unknown[]) => handleAuth(handleCurrentChange, p)"
        />
      </el-row>
    </template>
    <update-dialog
      ref="updateDialogEl"
      @success="handleSearch(params.pageNum)"
    />
  </app-page>
</template>

<script lang="tsx">
import { defineComponent, ref, computed } from 'vue';
import { toThousands } from '@tiangong/utils';

import { ElMessage } from 'element-plus';
import { QuestionFilled } from '@element-plus/icons-vue';
import UpdateDialog from './components/update-dialog/index.vue';

import { exportByBlob } from '@/core/utils/file-download';
import { useList } from '@/hooks/use-list';
import {
  useConditionPermissionList,
  IConditionPermissionItem,
} from '@/hooks/use-condition-permission-list';
import { getRegionList } from '@/api/global';
import { getMoneyBackSchemeList, getMoneyBackSchemeSummary } from '../../api';
import { IGetMoneyBackSchemeSummaryRes } from '../../api/types';
import { YES_OR_NO_NUMBER_LIST } from '@/constant';
import {
  PAYBACK_TYPE_LIST,
  RECOVERIES_STATUS_LIST,
  PAYBACK_TYPE_ENUM,
  BILL_TYPE_LIST,
} from '../../constant';
import { usePermissionConfig } from '../../use-permission-config';
import { IParams, IListItem } from './types';
import { renderColumns } from './composables/tableData';

export default defineComponent({
  components: {
    QuestionFilled,
    UpdateDialog,
  },
  setup() {
    const {
      CAN_VIEW_DETAIL,
      CAN_SET_MONEY_BACK_DATE,
      CAN_EXPORT,
    } = usePermissionConfig();
    const regionPermissionList = ref<IConditionPermissionItem[]>([]);
    const regionDefaultCondition = ref('');
    const updateDialogEl = ref<typeof UpdateDialog | null>(null); // 调整弹窗实例
    const summaryData = ref<IGetMoneyBackSchemeSummaryRes>({
      planRepaymentCount: '',
      actualRepaymentCount: '',
      waitRepaymentCount: '',
    });
    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<IListItem, IParams>({
      request: {
        api: getMoneyBackSchemeList,
        params: {
          customerName: '',
          billCode: '',
          planRepaymentStartDate: '',
          planRepaymentEndDate: '',
          paybackClassifyState: PAYBACK_TYPE_ENUM.CURRENT,
          paybackState: '',
          bdName: '',
          overdueStartDate: '',
          overdueEndDate: '',
          isOverdue: '',
          regionCode: regionDefaultCondition.value,
          billType: '',
          pageNum: 1,
          pageSize: 10,
        },
        handleParams(paramsObj) {
          // 处理时间
          if (paramsObj.planRepaymentDate?.length === 2) {
            [paramsObj.planRepaymentStartDate, paramsObj.planRepaymentEndDate] = paramsObj.planRepaymentDate;
          }
          delete paramsObj.planRepaymentDate;
          if (paramsObj.overdueDate?.length === 2) {
            [paramsObj.overdueStartDate, paramsObj.overdueEndDate] = paramsObj.overdueDate;
          }
          delete paramsObj.overdueDate;
          return {
            ...paramsObj,
          };
        },
      },
    });

    // 请求汇总数据
    const fetchSummary = async () => {
      try {
        const { data } = await getMoneyBackSchemeSummary({
          ...params.value,
        });
        summaryData.value = data;
      } catch (error) {
        console.log(error);
      }
    };

    const getRegionAreaList = async () => {
      const res = await getRegionList();
      const data = res?.data ?? [];
      const list = data.map((item) => {
        return {
          label: item.regionName!,
          value: item.regionCode!,
          permissionCode: `CCS-CWGL-HKJH-${item.regionCode}`,
        };
      });
      const {
        permissionList,
        defaultCondition,
      } = useConditionPermissionList(
        list,
        true,
      );
      regionPermissionList.value = permissionList;
      regionDefaultCondition.value = defaultCondition!;
    };

    const handleAuth = <T extends (...args: any) => ReturnType<T>>(cb: T, param?: unknown[]) => {
      if (!regionPermissionList.value.length) {
        ElMessage.error('当前账号暂无客户区域的权限！');
        return;
      }
      if (param) {
        cb.call(this, ...param);
      } else {
        cb.call(this);
      }
      fetchSummary();
    };

    const handleChangePaybackType = () => {
      params.value = {
        ...params.value,
        overdueStartDate: '',
        overdueEndDate: '',
      };
      handleAuth(handleSearch);
    };

    // 设置预计回款日
    const handleSetDate = (row: IListItem) => {
      updateDialogEl.value?.handleInit(row);
    };

    // 导出
    const handleExport = async () => {
      try {
        await exportByBlob({
          method: 'post',
          url: '/crm-finance/web/v1/repayment-plan/export-excel',
          filename: '回款计划.xlsx',
          data: params.value,
          loading: true,
        });
      } catch (error) {
        console.log(error);
      }
    };

    const init = async () => {
      try {
        await getRegionAreaList();
        // 默认值
        params.value.regionCode = regionDefaultCondition.value;
        handleAuth(handleSearch);
      } catch (e) {
        console.log(e);
      }
    };
    init();

    const searchConfig = computed(() => {
      const baseList = [
        {
          name: '客户名称：',
          component: 'input',
          valueName: 'customerName',
          placeholder: '请输入客户名称',
          maxlength: '100',
        },
        {
          name: '账单号：',
          component: 'input',
          valueName: 'billCode',
          placeholder: '请输入账单号',
          maxlength: '100',
        },
        {
          name: '预计回款日：',
          component: 'datePicker',
          valueName: ['planRepaymentStartDate', 'planRepaymentEndDate'],
          placeholder: ['开始日期', '结束日期'],
          valueFormat: 'YYYY-MM-DD',
        },
        {
          name: 'BD：',
          component: 'input',
          valueName: 'bdName',
          placeholder: '请输入BD',
          maxlength: '100',
        },
        {
          name: '是否逾期：',
          component: 'select',
          valueName: 'isOverdue',
          placeholder: '请选择是否逾期',
          options: [
            {
              label: '全部',
              value: '',
            },
            ...YES_OR_NO_NUMBER_LIST,
          ],
          clearable: false,
        },
        {
          name: '所属区域：',
          component: 'select',
          valueName: 'regionCode',
          placeholder: '请选择所属区域',
          options: regionPermissionList.value,
          clearable: false,
        },
        {
          name: '账单类型：',
          component: 'select',
          valueName: 'billType',
          placeholder: '请选择账单类型',
          clearable: false,
          options: [
            {
              label: '全部',
              value: '',
            },
            ...BILL_TYPE_LIST,
          ],
        },
      ];
      return params.value.paybackClassifyState === '' ? [
        ...baseList,
        {
          name: '逾期日期：',
          component: 'datePicker',
          valueName: ['overdueStartDate', 'overdueEndDate'],
          placeholder: ['开始日期', '结束日期'],
          valueFormat: 'YYYY-MM-DD',
        },
      ] : baseList;
    });

    return {
      CAN_VIEW_DETAIL,
      CAN_SET_MONEY_BACK_DATE,
      CAN_EXPORT,
      updateDialogEl,
      params,
      tableTotal,
      tableData,
      summaryData,
      handleAuth,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      handleSetDate,
      handleExport,
      handleChangePaybackType,
      renderColumns,
      toThousands,
      searchConfig,
      paybackTypeConfig: {
        title: '回款分类：',
        conditionList: [
          {
            label: '全部',
            value: '',
          },
          ...PAYBACK_TYPE_LIST,
        ],
      },
      paybackStatusConfig: {
        title: '回款状态：',
        conditionList: [
          {
            label: '全部',
            value: '',
          },
          ...RECOVERIES_STATUS_LIST,
        ],
      },
    };
  },
});
</script>
