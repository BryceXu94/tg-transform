<template>
  <app-page>
    <template #fheader>
      <div class="header-tab">
        <tabs
          :config="CREDIT_SUBJECT_LIST"
          :border="false"
          v-model="currentTab"
          @change="handleTabChange"
        />
        <router-link
          v-if="CAN_CREATE"
          :to="{
            name: 'ApprovalManageCreateCreditApplication',
          }"
        >
          <el-button type="primary">
            授信申请
          </el-button>
        </router-link>
      </div>
      <search-area
        v-show="currentTab === CREDIT_SUBJECT_ENUM.CUSTOMER"
        v-model="params"
        :config="searchConfig"
        @handleSearch="handleAuthSearch"
        @handleReset="handleAuthReset"
      />
      <search-area
        v-show="currentTab === CREDIT_SUBJECT_ENUM.GROUP"
        v-model="paramsGroup"
        :config="searchConfigGroup"
        @handleSearch="handleAuthSearch"
        @handleReset="handleAuthReset"
      />
    </template>
    <template #header>
      <condition-select
        :conditionInfo="conditionConfig"
        v-model="approvalState"
        @conditionChange="handleAuthSearch()"
      />
    </template>
    <template #main="{ height }">
      <!-- 客户维度 -->
      <div v-show="currentTab === CREDIT_SUBJECT_ENUM.CUSTOMER">
        <custom-table
          border
          :key="height"
          :height="height"
          :data="tableData"
          :columns="renderColumns(
            handleRevoke,
            CAN_VIEW,
            CAN_VIEW_CUSTOMER,
            CAN_REVOKE,
            CAN_RESUBMIT,
          )"
        />
      </div>
      <!-- 集团维度 -->
      <div v-show="currentTab === CREDIT_SUBJECT_ENUM.GROUP">
        <custom-table
          border
          :key="height"
          :height="height"
          :data="tableDataGroup"
          :columns="renderColumnsGroup(
            handleRevoke,
            CAN_VIEW_GROUP_DETAIL,
            CAN_VIEW_GROUP,
            CAN_REVOKE_GROUP,
            CAN_RESUBMIT_GROUP,
          )"
        />
      </div>
    </template>
    <template #ffooter>
      <el-row
        style="width: 100%"
        justify="end"
      >
        <pagination
          :total="total"
          :current-page="currentTab === CREDIT_SUBJECT_ENUM.GROUP ? paramsGroup.pageNum : params.pageNum"
          :size="currentTab === CREDIT_SUBJECT_ENUM.GROUP ? paramsGroup.pageSize : params.pageSize"
          @size-change="handleAuthSizeChange"
          @current-change="handleAuthCurrentChange"
        />
      </el-row>
    </template>
  </app-page>
</template>

<script lang="tsx">
import { computed, defineComponent, ref } from 'vue';
import { formatTime } from '@tiangong/utils';

import { ElMessage } from 'element-plus';
import TipsDialog from '../../components/tips-dialog/index.vue';

import { handleOpenDialog } from '@/hooks/use-dialog';
import { useList } from '@/hooks/use-list';
import { useConditionPermissionList, IConditionPermissionItem } from '@/hooks/use-condition-permission-list';
import { regionAreaListApi } from '@/api/query-options';
import { getCreditApplicationList, getGroupCreditApplicationList } from '../../api';
import { CREDIT_SUBJECT_ENUM, CREDIT_SUBJECT_LIST, CREDIT_SUBJECT_ROUTE_ENUM } from '@/constant';
import {
  TIPS_DIALOG_TYPE_ENUM,
  APPROVE_STATUS_TAB_LIST,
  APPROVE_STATUS_ENUM,
} from '../../constant';
import { usePermissionConfig } from '../../use-permission-config';
import { renderColumns, renderColumnsGroup } from './composables/tableData';
import { IListItem, IParams, IListItemGroup, IParamsGroup } from './types';

export default defineComponent({
  name: 'ApprovalManageCreditApplicationList',
  setup() {
    // 区域
    const regionPermissionList = ref<IConditionPermissionItem[]>([]);
    const regionDefaultCondition = ref('');
    const getRegionAreaList = async () => {
      const res = await regionAreaListApi();
      const data = res?.data ?? [];
      const list = data.map((item) => {
        return {
          label: item.regionName!,
          value: item.regionCode!,
          permissionCode: `CCS-SPGL-SXSQ-${item.regionCode}`,
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
      CAN_CREATE,
      CAN_VIEW,
      CAN_VIEW_CUSTOMER,
      CAN_REVOKE,
      CAN_RESUBMIT,
      CAN_VIEW_GROUP_DETAIL,
      CAN_VIEW_GROUP,
      CAN_REVOKE_GROUP,
      CAN_RESUBMIT_GROUP,
    } = usePermissionConfig();
    const approvalState = ref<APPROVE_STATUS_ENUM|''>('');
    const baseParams: IParams = {
      applyUserNameLike: '',
      applyTimeStart: '',
      applyTimeEnd: '',
      regionCode: regionDefaultCondition.value,
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
    } = useList<IListItem, IParams>({
      request: {
        api: getCreditApplicationList,
        params: {
          ...baseParams,
          customerNameLike: '',
        },
        handleParams(paramsObj) {
          // 处理时间
          if (paramsObj.applyDate?.length === 2) {
            [paramsObj.applyTimeStart, paramsObj.applyTimeEnd] = paramsObj.applyDate;
          }
          delete paramsObj.applyDate;
          paramsObj.approvalState = approvalState.value;
          return {
            ...paramsObj,
          };
        },
      },
    });
    const {
      params: paramsGroup,
      tableTotal: tableTotalGroup,
      tableData: tableDataGroup,
      handleSearch: handleSearchGroup,
      handleReset: handleResetGroup,
      handleSizeChange: handleSizeChangeGroup,
      handleCurrentChange: handleCurrentChangeGroup,
    } = useList<IListItemGroup, IParamsGroup>({
      request: {
        api: getGroupCreditApplicationList,
        params: {
          ...baseParams,
          groupNameLike: '',
        },
        handleParams(paramsObj) {
          // 处理时间
          if (paramsObj.applyDate?.length === 2) {
            [paramsObj.applyTimeStart, paramsObj.applyTimeEnd] = paramsObj.applyDate;
          }
          delete paramsObj.applyDate;
          paramsObj.approvalState = approvalState.value;
          return {
            ...paramsObj,
          };
        },
        handleCustomReset: () => {
          return {
            ...baseParams,
            regionCode: regionDefaultCondition.value,
          } as IParams;
        },
      },
    });

    const visibleRevoke = ref(false); // 撤销弹窗显隐
    const currentTab = ref(CREDIT_SUBJECT_ENUM.CUSTOMER); // 当前Tab
    const total = computed(
      () => (currentTab.value === CREDIT_SUBJECT_ENUM.GROUP ? tableTotalGroup.value : tableTotal.value),
    );

    const handleAuth = () => {
      if (!regionPermissionList.value.length) {
        ElMessage.error('当前账号暂无客户区域的权限！');
        return false;
      }
      return true;
    };
    // 查询
    const handleAuthSearch = (pageNum?: number) => {
      if (!handleAuth()) return;
      if (currentTab.value === CREDIT_SUBJECT_ENUM.GROUP) {
        handleSearchGroup(pageNum || paramsGroup.value.pageNum);
      } else {
        handleSearch(pageNum || params.value.pageNum);
      }
    };
    // 重置
    const handleAuthReset = () => {
      if (!handleAuth()) return;
      approvalState.value = '';
      if (currentTab.value === CREDIT_SUBJECT_ENUM.GROUP) {
        handleResetGroup();
      } else {
        handleReset();
      }
    };
    const handleAuthSizeChange = (pageSize: number) => {
      if (!handleAuth()) return;
      if (currentTab.value === CREDIT_SUBJECT_ENUM.GROUP) {
        handleSizeChangeGroup(pageSize);
      } else {
        handleSizeChange(pageSize);
      }
    };
    const handleAuthCurrentChange = (pageNum: number) => {
      if (!handleAuth()) return;
      if (currentTab.value === CREDIT_SUBJECT_ENUM.GROUP) {
        handleCurrentChangeGroup(pageNum);
      } else {
        handleCurrentChange(pageNum);
      }
    };

    // Tab切换
    const handleTabChange = () => {
      handleAuthReset();
    };

    const init = async () => {
      try {
        await getRegionAreaList();
        // 默认值
        params.value.regionCode = regionDefaultCondition.value;
        paramsGroup.value.regionCode = regionDefaultCondition.value;
        handleAuthSearch();
      } catch (e) {
        console.log(e);
      }
    };
    init();

    // 撤销
    const handleRevoke = (row: IListItem | IListItemGroup) => {
      handleOpenDialog(TipsDialog, {
        data: row,
        action: TIPS_DIALOG_TYPE_ENUM.REVOKE,
        name: currentTab.value === CREDIT_SUBJECT_ENUM.GROUP
          ? row.crmGroupCreditCustomer?.groupName : row.crmCreditCustomer?.customerName,
        amount: row.applyAmount,
        subjectType: currentTab.value,
        onSuccess: () => handleAuthSearch(),
      });
    };

    const baseConfig = [
      {
        name: '申请人：',
        component: 'input',
        valueName: 'applyUserNameLike',
        placeholder: '请输入申请人',
        maxlength: '100',
      },
      {
        name: '申请时间：',
        component: 'datePicker',
        valueName: ['applyTimeStart', 'applyTimeEnd'],
        placeholder: ['开始日期', '结束日期'],
        disabledDate: (time: Date) => {
          return time.getTime() > new Date(formatTime(Date.now())).getTime();
        },
      },
    ];

    // 初始化权限 & 默认值
    const searchConfig = computed(() => {
      return [
        {
          name: '客户名称：',
          component: 'input',
          valueName: 'customerNameLike',
          placeholder: '请输入客户名称',
          maxlength: '100',
        },
        {
          name: '所属区域：',
          component: 'select',
          valueName: 'regionCode',
          placeholder: '请选择所属区域',
          options: regionPermissionList.value,
          clearable: false,
        },
        ...baseConfig,
      ];
    });
    const searchConfigGroup = computed(() => {
      return [
        {
          name: '集团名称：',
          component: 'input',
          valueName: 'groupNameLike',
          placeholder: '请输入集团名称',
          maxlength: '100',
        },
        {
          name: '所属区域：',
          component: 'select',
          valueName: 'regionCode',
          placeholder: '请选择所属区域',
          options: regionPermissionList.value,
          clearable: false,
        },
        ...baseConfig,
      ];
    });

    return {
      CAN_CREATE,
      CAN_VIEW,
      CAN_VIEW_CUSTOMER,
      CAN_REVOKE,
      CAN_RESUBMIT,
      CAN_VIEW_GROUP_DETAIL,
      CAN_VIEW_GROUP,
      CAN_REVOKE_GROUP,
      CAN_RESUBMIT_GROUP,
      TIPS_DIALOG_TYPE_ENUM,
      CREDIT_SUBJECT_ENUM,
      CREDIT_SUBJECT_LIST,
      CREDIT_SUBJECT_ROUTE_ENUM,
      currentTab,
      visibleRevoke,
      params,
      paramsGroup,
      approvalState,
      tableTotal,
      tableData,
      tableDataGroup,
      total,
      handleAuthSearch,
      handleAuthReset,
      handleAuthSizeChange,
      handleAuthCurrentChange,
      handleRevoke,
      handleTabChange,
      renderColumns,
      renderColumnsGroup,
      searchConfig,
      searchConfigGroup,
      conditionConfig: {
        title: '审批状态：',
        conditionList: [
          {
            label: '全部',
            value: '',
          },
          ...APPROVE_STATUS_TAB_LIST,
        ],
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.header-tab {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
