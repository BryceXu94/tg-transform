<template>
  <app-page class="tenant-list">
    <template #fheader>
      <search-area
        v-model="params"
        @handleSearch="handleSearch"
        @handleReset="handleReset"
        :config="config"
      />
    </template>
    <template #header>
      <header-area>
        <template #default>
          <tabs
            :config="TABS_TYPE_LIST"
            :border="false"
            v-model="activeTab"
            @change="handleTabsClick"
          />
        </template>
        <template
          #button
        >
          <el-button
            type="primary"
            v-if="CAN_CREATE && activeTab === TABS_TYPE_ENUM.TENANT_LIST"
            @click="() => {
              handleOpenDialog(CreateTenantDialog, {
                params: {
                  onSuccess: handleSearch,
                  type: CREATE_EDIT_ENUM.CREATE,
                },
              });
            }"
          >
            创建租户
          </el-button>
          <el-button
            type="primary"
            v-if="CAN_CREATE_ACCOUNT && activeTab === TABS_TYPE_ENUM.ACCOUNT_NO_LIST"
            @click="() => {
              handleOpenDialog(CreateAccountDialog, {
                params: {
                  onSuccess: handleSearch,
                  type: CREATE_EDIT_ENUM.CREATE,
                },
              });
            }"
          >
            创建账号
          </el-button>
        </template>
      </header-area>
    </template>
    <template #main="{ height }">
      <custom-table
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
    <!-- 停用/启用 -->
    <submit-tips-dialog
      v-model:visible="tenantEnable.visible"
      @success="handleEnableOrDisableSuccess"
    >
      <div class="padding-left-20">
        <div>客户名称：{{tenantItem.customerName}}</div>
        <div v-if="activeTab === TABS_TYPE_ENUM.ACCOUNT_NO_LIST">
          <div class="flex">
            账号：<encryption
              :data="{
                businessId: tenantItem?.userId,
                dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
                content: tenantItem?.userName,
                dateColumn: 'managerUserName',
              }"
              @updateContent="(result: any) => {
                tenantItem.userName = result?.[0]?.content;
              }"
            >
            </encryption>
            [
            <encryption
              :data="{
                businessId: tenantItem?.userId,
                dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
                content: tenantItem?.phone,
                dateColumn: 'phone',
              }"
              @updateContent="(result: any) => {
                tenantItem.phone = result?.[0]?.content;
              }"
            >
            </encryption>
            ]
          </div>

        </div>
        <div>操作状态{{tenantEnable.type === ENABLE_DISABLE_ENUM.DISABLE ? '停用' : '启用'}}，是否继续确认？</div>
      </div>
    </submit-tips-dialog>
    <!-- 操作日志 -->
    <operation-drawer
      v-model="operation.visible"
      :request="getLogList"
      :requestParams="{
        buzId: operation.tenantId
      }"
      :config="logConfig"
    />
  </app-page>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';

import { useList } from '@/hooks/use-list';
import CustomTable from '@/components/custom-table';

import {
  getCustomerTenantPageApi,
  customerTenantEnableApi,
  customerTenantDisableApi,
  getCustomerTenantUserPageApi,
  handleAccountEnableOrDisableApi,
  customerTenantDetailApi,
  getAccountDetailApi,
} from '@/modules/tenant-manage/tenant-manage/api';
import { getLogList } from '@/api/global';
import {
  ICustomerTenantPageReq,
  ICustomerTenantPageRes,
  ICustomerTenantPageListItem,
  IUserPageRes,
  IUserPageResListItem,
} from '@/modules/tenant-manage/tenant-manage/api/types';
import { ENABLE_DISABLE_LIST, YES_OR_NO_NUMBER_ENUM, DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant';
import { LOG_OPERATE_TYPE_LIST, TABS_TYPE_LIST, TABS_TYPE_ENUM } from '@/modules/tenant-manage/tenant-manage/constant';
import {
  renderColumns,
  accountRenderColumns } from '@/modules/tenant-manage/tenant-manage/views/list/composables/tableData';
import { ElMessage } from 'element-plus';

import CreateTenantDialog from './components/create-tenant-dialog.vue';
import OperationDrawer from '@/components/operation-drawer/index.vue';
import CreateAccountDialog from './components/create-account-dialog.vue';
import { handleOpenDialog } from '@/hooks/use-dialog';
import { usePermissionConfig } from '../../use-permission-config';
import { ENABLE_DISABLE_ENUM, CREATE_EDIT_ENUM } from './types/index';

export default defineComponent({
  name: 'TenantManageList',
  components: {
    CustomTable,
    OperationDrawer,
  },
  setup() {
    // tabs
    const activeTab = ref(TABS_TYPE_ENUM.TENANT_LIST);

    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<ICustomerTenantPageRes | IUserPageRes, ICustomerTenantPageReq>({
      request: {
        api: getCustomerTenantPageApi,
        params: {
          pageNum: 1,
          pageSize: 10,
          customerName: '', // 客户名称
          phone: '',
          isEnable: '',
        },
        resetApi: () => {
          return activeTab.value === TABS_TYPE_ENUM.TENANT_LIST
            ? getCustomerTenantPageApi : getCustomerTenantUserPageApi;
        },
      },
    });
    handleSearch();

    const handleTabsClick = (tab: TABS_TYPE_ENUM) => {
      tableData.value = [];
      activeTab.value = tab;
      handleSearch();
    };

    const {
      CAN_CREATE,
      CAN_EDIT,
      CAN_DISABLED,
      CAN_ENABLE,
      CAN_VIEW_LOG,
      CAN_CREATE_ACCOUNT,
      CAN_EDIT_ACCOUNT,
      CAN_ACCOUNT_ENABLE,
      CAN_ACCOUNT_DISABLED,
      CAN_VIEW__ACCOUNT_LOG,
    } = usePermissionConfig();

    // 编辑租户
    const handleCreateTenant = async (
      tenantId: string,
      type: string,
    ) => {
      try {
        const { data } = await customerTenantDetailApi(tenantId);
        const { customerName, customerId, phone, userName, ssoTenantId } = data;
        handleOpenDialog(CreateTenantDialog, {
          params: {
            onSuccess: handleSearch,
            customerName,
            customerId,
            phone,
            userName,
            type,
            ssoTenantId,
          },
        });
      } catch (e) {
        console.error(e);
      }
    };

    // 编辑账号
    const handleCreateAccount = async (userId: string, type: string) => {
      const { data } = await getAccountDetailApi(userId);
      handleOpenDialog(CreateAccountDialog, {
        params: {
          onSuccess: handleSearch,
          data,
          type,
        },
      });
    };

    // 停用/启用
    const tenantItem = ref({} as ICustomerTenantPageListItem | IUserPageResListItem);
    const tenantEnable = reactive({
      visible: false,
      type: '',
    });
    const handleEnableOrDisable = (
      row: ICustomerTenantPageListItem | IUserPageResListItem,
      type: ENABLE_DISABLE_ENUM,
    ) => {
      tenantItem.value = Object.assign({}, row);
      tenantEnable.type = type;
      tenantEnable.visible = true;
    };

    // 租户启用/停用
    const handleTenantEnableOrDisable = async () => {
      try {
        if (tenantEnable.type === ENABLE_DISABLE_ENUM.DISABLE) {
          await customerTenantDisableApi((tenantItem.value as ICustomerTenantPageListItem).tenantId);
        } else {
          await customerTenantEnableApi((tenantItem.value as ICustomerTenantPageListItem).tenantId);
        }
        ElMessage.success('操作成功');
        handleSearch();
      } catch (e) {
        console.log(e);
      }
    };

    // 账号启用/停用
    const handleAccountEnableOrDisable = async () => {
      await handleAccountEnableOrDisableApi((tenantItem.value as IUserPageResListItem).userId!, {
        enableState: tenantEnable.type === ENABLE_DISABLE_ENUM.ENABLE
          ? YES_OR_NO_NUMBER_ENUM.YES : YES_OR_NO_NUMBER_ENUM.NO,
      });
      ElMessage.success('操作成功');
      handleSearch();
    };

    const handleEnableOrDisableSuccess = async () => {
      if (activeTab.value === TABS_TYPE_ENUM.TENANT_LIST) {
        handleTenantEnableOrDisable();
      } else {
        handleAccountEnableOrDisable();
      }
    };

    // 操作日志
    const operation = reactive({
      visible: false,
      tenantId: '',
    });
    const handleOperation = async (id: string) => {
      operation.tenantId = id;
      operation.visible = true;
    };

    const columns = computed(() => {
      return activeTab.value === TABS_TYPE_ENUM.TENANT_LIST
        ? renderColumns(
          handleCreateTenant,
          handleEnableOrDisable,
          handleOperation,
          CAN_EDIT.value,
          CAN_DISABLED.value,
          CAN_ENABLE.value,
          CAN_VIEW_LOG.value,
        ) : accountRenderColumns(
          handleCreateAccount,
          handleEnableOrDisable,
          handleOperation,
          CAN_EDIT_ACCOUNT.value,
          CAN_ACCOUNT_DISABLED.value,
          CAN_ACCOUNT_ENABLE.value,
          CAN_VIEW__ACCOUNT_LOG.value,
        );
    });

    return {
      params,
      tableTotal,
      tableData,
      tenantItem,
      tenantEnable,
      operation,
      activeTab,
      CAN_CREATE,
      CAN_CREATE_ACCOUNT,
      TABS_TYPE_LIST,
      TABS_TYPE_ENUM,
      CREATE_EDIT_ENUM,
      ENABLE_DISABLE_ENUM,
      DESENSITIZE_DECRYPT_TYPE_ENUM,
      columns,

      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      handleTenantEnableOrDisable,
      handleEnableOrDisable,
      handleCreateTenant,
      CreateTenantDialog,
      CreateAccountDialog,
      handleOpenDialog,
      handleOperation,
      getLogList,
      handleTabsClick,
      handleEnableOrDisableSuccess,
      logConfig: {
        timeKey: 'createdTime',
        userKey: 'creatorName',
        contentKey: 'logType',
        operateList: LOG_OPERATE_TYPE_LIST,
      },
      config: [
        {
          name: '客户名称：',
          component: 'input',
          valueName: 'customerName',
          placeholder: '请输入客户名称',
        },
        {
          name: '用户账号：',
          component: 'input',
          valueName: 'phone',
          placeholder: '请输入用户账号',
        },
        {
          name: '状态：',
          component: 'select',
          valueName: 'isEnable',
          placeholder: '请选择',
          options: [
            {
              label: '全部',
              value: '',
            },
            ...ENABLE_DISABLE_LIST,
          ],
        },
      ],
    };
  },
});
</script>
