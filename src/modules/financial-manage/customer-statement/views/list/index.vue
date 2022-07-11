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
      <condition-select
        :conditionInfo="billConfig"
        v-model="params.billType"
        @conditionChange="handleAuth(handleSearch())"
      />
      <condition-select
        :conditionInfo="reconcileConfig"
        v-model="params.statementState"
        @conditionChange="handleAuth(handleSearch())"
      />
      <condition-select
        :conditionInfo="recoveriesConfig"
        v-model="params.paybackState"
        @conditionChange="handleAuth(handleSearch())"
      />
      <condition-select
        v-show="params.billType === BILL_TYPE_ENUM.FINANCE"
        :conditionInfo="expandConfig"
        v-model="params.supportState"
        @conditionChange="handleAuth(handleSearch())"
      />
    </template>
    <template #main="{ height }">
      <custom-table
        border
        :key="height"
        :height="height"
        :data="tableData"
        :columns="renderColumns(
          handleChangeType,
          CAN_VIEW_DETAIL,
          CAN_CHANGE_TYPE,
        )"
      />
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
      @success="handleAuth(handleSearch(params.pageNum))"
    />
  </app-page>
</template>

<script lang="tsx">
import { defineComponent, ref, computed } from 'vue';
import { formatTime } from '@tiangong/utils';

import { ElMessage } from 'element-plus';
import UpdateDialog from './components/update-dialog/index.vue';

import { useList } from '@/hooks/use-list';
import {
  useConditionPermissionList,
  IConditionPermissionItem,
} from '@/hooks/use-condition-permission-list';
import { YES_OR_NO_NUMBER_LIST } from '@/constant';
import { getRegionList } from '@/api/global';
import { getCustomerStatementList } from '../../api';
import {
  BILL_TYPE_ENUM,
  BILL_TYPE_LIST,
  RECONCILE_STATUS_LIST,
  RECOVERIES_STATUS_LIST,
  EXPAND_STATUS_LIST,
  OUTGOING_TYPE_LIST,
} from '../../constant';
import { usePermissionConfig } from '../../use-permission-config';
import { IParams, IListItem } from './types';
import { renderColumns } from './composables/tableData';

export default defineComponent({
  name: 'FinancialManageCustomerStatementList',
  components: {
    UpdateDialog,
  },
  setup() {
    const regionPermissionList = ref<IConditionPermissionItem[]>([]);
    const regionDefaultCondition = ref('');
    const getRegionAreaList = async () => {
      const res = await getRegionList();
      const data = res?.data ?? [];
      const list = data.map((item) => {
        return {
          label: item.regionName!,
          value: item.regionCode!,
          permissionCode: `CCS-CWGL-KHDZD-${item.regionCode}`,
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

    const {
      CAN_VIEW_DETAIL,
      CAN_CHANGE_TYPE,
    } = usePermissionConfig();
    const updateDialogEl = ref<typeof UpdateDialog | null>(null); // 调整弹窗实例
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
        api: getCustomerStatementList,
        params: {
          customerName: '',
          billCode: '',
          billStartMonth: '',
          billEndMonth: '',
          statementType: '',
          createdStartTime: '',
          createdEndTime: '',
          regionCode: regionDefaultCondition.value,
          cmName: '',
          bdName: '',
          billType: '',
          statementState: '',
          paybackState: '',
          supportState: '',
          isOverdue: '',
          pageNum: 1,
          pageSize: 10,
        },
        handleParams(paramsObj) {
          // 处理时间
          if (paramsObj.billDate?.length === 2) {
            [paramsObj.billStartMonth, paramsObj.billEndMonth] = paramsObj.billDate;
          }
          delete paramsObj.billDate;
          if (paramsObj.createDate?.length === 2) {
            [paramsObj.createdStartTime, paramsObj.createdEndTime] = paramsObj.createDate;
          }
          delete paramsObj.createDate;
          if (paramsObj.billType !== BILL_TYPE_ENUM.FINANCE) {
            paramsObj.supportState = '';
          }
          return {
            ...paramsObj,
          };
        },
      },
    });

    // 编辑
    const handleChangeType = (row: IListItem) => {
      updateDialogEl.value?.handleInit(row);
    };

    const handleAuth = <T extends (...args: unknown[]) => ReturnType<T>>(cb: any, param?: unknown[]) => {
      if (!regionPermissionList.value.length) {
        ElMessage.error('当前账号暂无客户区域的权限！');
        return;
      }
      if (param) {
        cb.call(this, ...param);
      } else {
        cb.call(this);
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
      return [
        {
          name: '客户名称：',
          component: 'input',
          valueName: 'customerName',
          placeholder: '请输入客户名称',
          maxlength: '100',
        },
        {
          name: '客户账单号：',
          component: 'input',
          valueName: 'billCode',
          placeholder: '请输入客户账单号',
          maxlength: '100',
        },
        {
          name: '账单月份：',
          component: 'datePicker',
          valueName: ['billStartMonth', 'billEndMonth'],
          placeholder: ['开始年月', '结束年月'],
          type: 'monthrange',
          valueFormat: 'YYYY-MM',
          disabledDate: (time: Date) => {
            return time.getTime() > new Date(formatTime(Date.now())).getTime();
          },
        },
        {
          name: '出账类型：',
          component: 'select',
          valueName: 'statementType',
          placeholder: '请选择出账类型',
          options: [
            {
              label: '全部',
              value: '',
            },
            ...OUTGOING_TYPE_LIST,
          ],
        },
        {
          name: '创建时间：',
          component: 'datePicker',
          valueName: ['createdStartTime', 'createdEndTime'],
          placeholder: ['开始日期', '结束日期'],
          disabledDate: (time: Date) => {
            return time.getTime() > new Date(formatTime(Date.now())).getTime();
          },
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
          name: 'CM：',
          component: 'input',
          valueName: 'cmName',
          placeholder: '请输入CM',
          maxlength: '100',
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
        },
      ];
    });

    return {
      CAN_VIEW_DETAIL,
      CAN_CHANGE_TYPE,
      BILL_TYPE_ENUM,
      updateDialogEl,
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      handleChangeType,
      handleAuth,
      renderColumns,
      searchConfig,
      billConfig: {
        title: '账单类型：',
        conditionList: [
          {
            label: '全部',
            value: '',
          },
          ...BILL_TYPE_LIST,
        ],
      },
      reconcileConfig: {
        title: '对账状态：',
        conditionList: [
          {
            label: '全部',
            value: '',
          },
          ...RECONCILE_STATUS_LIST,
        ],
      },
      recoveriesConfig: {
        title: '回款状态：',
        conditionList: [
          {
            label: '全部',
            value: '',
          },
          ...RECOVERIES_STATUS_LIST,
        ],
      },
      expandConfig: {
        title: '支用状态：',
        conditionList: [
          {
            label: '全部',
            value: '',
          },
          ...EXPAND_STATUS_LIST,
        ],
      },
    };
  },
});
</script>
