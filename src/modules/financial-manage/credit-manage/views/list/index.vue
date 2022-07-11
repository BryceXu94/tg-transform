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
        <div class="flex">
          <el-button
            v-if="CAN_INITIAL"
            type="primary"
            @click="handleInitialCredit"
          >
            初始授信
          </el-button>
          <el-button
            v-if="CAN_EXPORT"
            type="primary"
            @click="handleExport"
          >
            导出
          </el-button>
        </div>
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
        @handleReset="handleResetGroup"
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
            handleChangeStatus,
            handleUpdate,
            CAN_VIEW_CUSTOMER_DETAIL,
            CAN_VIEW_USAGE,
            CAN_TOGGLE,
            CAN_UPDATE,
            CAN_VIEW_CUSTOMER,
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
            handleChangeStatus,
            handleUpdate,
            CAN_VIEW_GROUP_DETAIL,
            CAN_VIEW_GROUP_USAGE,
            CAN_TOGGLE_GROUP,
            CAN_UPDATE_GROUP,
            CAN_VIEW_GROUP,
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
    <initial-dialog
      ref="initialDialogEl"
      @success="handleAuthSearch()"
    />
    <update-dialog
      ref="updateDialogEl"
      @success="handleAuthSearch()"
    />
    <!-- 导出 -->
    <export-dialog
      ref="exportDialogEl"
    />
    <submit-tips-dialog
      :content="editRowName"
      v-model:visible="visibleToggle"
      @success="handleConfirmStatus"
    >
      <div v-if="tipsDialogType === TIPS_DIALOG_TYPE_ENUM.ENABLE">
        操作状态启用，则该{{currentName}}可使用授信额度下单，是否继续确认？
      </div>
      <div v-else-if="tipsDialogType === TIPS_DIALOG_TYPE_ENUM.DIASBLE">
        操作状态禁用，则该{{currentName}}无法使用授信额度，是否继续确认？
      </div>
      <div v-else-if="tipsDialogType === TIPS_DIALOG_TYPE_ENUM.DIASBLE_REMIND">
        操作状态禁用，该{{currentName}}授信余额
        <strong class="color-error">存在未回款的款项</strong>，是否继续确认？
      </div>
    </submit-tips-dialog>
  </app-page>
</template>

<script lang="tsx">
import { defineComponent, ref, computed } from 'vue';

import { ElMessage } from 'element-plus';
import InitialDialog from './components/initial-dialog/index.vue';
import UpdateDialog from './components/update-dialog/index.vue';
import ExportDialog from './components/export-dialog/index.vue';

import { useList } from '@/hooks/use-list';
import { useConditionPermissionList, IConditionPermissionItem } from '@/hooks/use-condition-permission-list';
import { regionAreaListApi } from '@/api/query-options';
import {
  getCreditCustomerList,
  getCreditGroupList,
  updateCreditStatus,
} from '../../api';
import { IGetCreditCustomerListReq, IGetCreditGroupListReq } from '../../api/types';
import { CREDIT_SUBJECT_ENUM, CREDIT_SUBJECT_LIST } from '@/constant';
import {
  TIPS_DIALOG_TYPE_ENUM,
  STATUS_ENUM,
  STATUS_LIST,
  STATUS_NUMBER_ENUM,
  STATUS_NUMBER_LIST,
} from '../../constant';
import { usePermissionConfig } from '../../use-permission-config';
import { IListItemCustomer, IListItemGroup } from './types';
import { renderColumns, renderColumnsGroup } from './composables/tableData';

export default defineComponent({
  name: 'FinancialManageCreditList',
  components: {
    InitialDialog,
    UpdateDialog,
    ExportDialog,
  },
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
          permissionCode: `CSS-CWGL-SXGL-${item.regionCode}`,
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
      CAN_VIEW_CUSTOMER_DETAIL,
      CAN_VIEW_GROUP_DETAIL,
      CAN_VIEW_USAGE,
      CAN_INITIAL,
      CAN_UPDATE,
      CAN_TOGGLE,
      CAN_VIEW_CUSTOMER,
      CAN_EXPORT,
      CAN_VIEW_GROUP_USAGE,
      CAN_TOGGLE_GROUP,
      CAN_UPDATE_GROUP,
      CAN_VIEW_GROUP,
    } = usePermissionConfig();
    const initialDialogEl = ref<typeof InitialDialog | null>(null); // 初始弹窗实例
    const updateDialogEl = ref<typeof InitialDialog | null>(null); // 调整弹窗实例
    const exportDialogEl = ref<typeof ExportDialog | null>(null); // 导出弹框实例
    const editRow = ref<IListItemCustomer|IListItemGroup>({} as IListItemCustomer); // 编辑项
    const currentTab = ref(CREDIT_SUBJECT_ENUM.CUSTOMER); // 当前Tab
    const editRowName = ref('');
    // 客户维度
    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleCurrentChange,
      handleSizeChange,
    } = useList<IListItemCustomer, IGetCreditCustomerListReq>({
      request: {
        api: getCreditCustomerList,
        params: {
          customerName: '',
          amountStatus: '',
          regionCode: regionDefaultCondition.value,
          pageNum: 1,
          pageSize: 10,
        },
      },
    });
    // 集团维度
    const {
      params: paramsGroup,
      tableTotal: tableTotalGroup,
      tableData: tableDataGroup,
      handleSearch: handleSearchGroup,
      handleReset: handleResetGroup,
      handleCurrentChange: handleCurrentChangeGroup,
      handleSizeChange: handleSizeChangeGroup,
    } = useList<IListItemGroup, IGetCreditGroupListReq>({
      request: {
        api: getCreditGroupList,
        params: {
          groupName: '',
          amountStatus: '',
          pageNum: 1,
          pageSize: 10,
        },
      },
    });
    const total = computed(
      () => (currentTab.value === CREDIT_SUBJECT_ENUM.GROUP ? tableTotalGroup.value : tableTotal.value),
    );
    const currentName = computed(
      () => (currentTab.value === CREDIT_SUBJECT_ENUM.GROUP ? '集团' : '客户'),
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
      if (currentTab.value === CREDIT_SUBJECT_ENUM.GROUP) {
        handleSearchGroup(pageNum || paramsGroup.value.pageNum);
      } else {
        if (!handleAuth()) return;
        handleSearch(pageNum || params.value.pageNum);
      }
    };
    // 重置
    const handleAuthReset = () => {
      if (!handleAuth()) return;
      handleReset();
      params.value.regionCode = regionDefaultCondition.value;
    };
    const handleAuthSizeChange = (pageSize: number) => {
      if (currentTab.value === CREDIT_SUBJECT_ENUM.GROUP) {
        handleSizeChangeGroup(pageSize);
      } else {
        if (!handleAuth()) return;
        handleSizeChange(pageSize);
      }
    };
    const handleAuthCurrentChange = (pageNum: number) => {
      if (currentTab.value === CREDIT_SUBJECT_ENUM.GROUP) {
        handleCurrentChangeGroup(pageNum);
      } else {
        if (!handleAuth()) return;
        handleCurrentChange(pageNum);
      }
    };

    // 初始授信
    const handleInitialCredit = () => {
      initialDialogEl.value?.handleInit(currentTab.value);
    };

    const visibleToggle = ref(false); // 状态更改弹窗显隐
    const tipsDialogType = ref<TIPS_DIALOG_TYPE_ENUM | ''>(''); // 状态更改弹窗类型
    // 更改启用状态
    const handleChangeStatus = (row: IListItemCustomer|IListItemGroup) => {
      if (row.amountStatus === STATUS_ENUM.ENABLE || row.amountStatus === STATUS_NUMBER_ENUM.ENABLE) {
        if (row.existUncollectedAmount) {
          tipsDialogType.value = TIPS_DIALOG_TYPE_ENUM.DIASBLE_REMIND;
        } else {
          tipsDialogType.value = TIPS_DIALOG_TYPE_ENUM.DIASBLE;
        }
      } else {
        tipsDialogType.value = TIPS_DIALOG_TYPE_ENUM.ENABLE;
      }
      editRow.value = row;
      editRowName.value = currentTab.value === CREDIT_SUBJECT_ENUM.GROUP
        ? (row as IListItemGroup).groupName
        : (row as IListItemCustomer).customerName;
      visibleToggle.value = true;
    };
    // 确认启用状态
    const handleConfirmStatus = async () => {
      try {
        await updateCreditStatus({
          creditMark: currentTab.value,
          customerId: currentTab.value === CREDIT_SUBJECT_ENUM.GROUP
            ? (editRow.value as IListItemGroup).groupId
            : (editRow.value as IListItemCustomer).customerId,
          operateType: [STATUS_ENUM.ENABLE, STATUS_NUMBER_ENUM.ENABLE].includes(editRow.value.amountStatus)
            ? STATUS_ENUM.DIASBLE
            : STATUS_ENUM.ENABLE,
        });
        ElMessage.success('操作成功');
        visibleToggle.value = false;
        handleAuthSearch();
      } catch (error) {
        console.log('请求更改启用状态失败', error);
      }
    };

    // 调整
    const handleUpdate = (row: IListItemCustomer|IListItemGroup) => {
      updateDialogEl.value?.handleInit(row, currentTab.value);
    };

    // 导出
    const handleExport = () => {
      exportDialogEl.value?.handleInit(currentTab.value);
    };

    // Tab切换
    const handleTabChange = (key: CREDIT_SUBJECT_ENUM) => {
      if (key === CREDIT_SUBJECT_ENUM.CUSTOMER) {
        handleAuthReset();
      } else {
        handleResetGroup();
      }
    };

    const init = async () => {
      try {
        await getRegionAreaList();
        // 默认值
        params.value.regionCode = regionDefaultCondition.value;
        handleAuthSearch();
      } catch (e) {
        console.log(e);
      }
    };
    init();

    // 初始化权限 & 默认值
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
          name: '客户区域：',
          component: 'select',
          valueName: 'regionCode',
          placeholder: '请选择客户区域',
          options: regionPermissionList.value,
          clearable: false,
        },
        {
          name: '启用状态：',
          component: 'select',
          valueName: 'amountStatus',
          placeholder: '请选择启用状态',
          options: [
            {
              label: '全部',
              value: '',
            },
            ...STATUS_LIST,
          ],
        },
      ];
    });

    return {
      CAN_VIEW_CUSTOMER_DETAIL,
      CAN_VIEW_GROUP_DETAIL,
      CAN_VIEW_USAGE,
      CAN_INITIAL,
      CAN_UPDATE,
      CAN_TOGGLE,
      CAN_VIEW_CUSTOMER,
      CAN_VIEW_GROUP_USAGE,
      CAN_TOGGLE_GROUP,
      CAN_UPDATE_GROUP,
      CAN_VIEW_GROUP,
      TIPS_DIALOG_TYPE_ENUM,
      CREDIT_SUBJECT_ENUM,
      CREDIT_SUBJECT_LIST,
      CAN_EXPORT,
      initialDialogEl,
      updateDialogEl,
      exportDialogEl,
      visibleToggle,
      tipsDialogType,
      editRow,
      editRowName,
      currentTab,
      params,
      paramsGroup,
      total,
      tableData,
      tableDataGroup,
      currentName,

      handleAuthSearch,
      handleAuthReset,
      handleAuthSizeChange,
      handleAuthCurrentChange,
      handleResetGroup,
      handleInitialCredit,
      handleChangeStatus,
      handleConfirmStatus,
      handleUpdate,
      handleTabChange,
      renderColumns,
      renderColumnsGroup,
      handleExport,
      searchConfig,
      searchConfigGroup: [
        {
          name: '集团名称：',
          component: 'input',
          valueName: 'groupName',
          placeholder: '请输入集团名称',
          maxlength: '100',
        },
        {
          name: '客户名称：',
          component: 'input',
          valueName: 'customerName',
          placeholder: '请输入客户名称',
          maxlength: '100',
        },
        {
          name: '启用状态：',
          component: 'select',
          valueName: 'amountStatus',
          placeholder: '请选择启用状态',
          options: [
            {
              label: '全部',
              value: '',
            },
            ...STATUS_NUMBER_LIST,
          ],
        },
      ],
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
