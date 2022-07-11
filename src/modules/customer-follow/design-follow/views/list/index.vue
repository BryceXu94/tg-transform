<template>
  <app-page class="customer-list">
    <template #fheader>
      <search-area
        v-model="params"
        @handleSearch="handleAuthSearch"
        @handleReset="handleAuthReset"
        :config="CUSTOMER_TYPE_ENUM.DESIGN_FOLLOW === activeTab ? config : publicConfig"
      >
      </search-area>
    </template>
    <template #header>
      <header-area>
        <template #default>
          <tabs
            :config="tabsConfig"
            :border="false"
            v-model="activeTab"
            @change="handleTabsClick"
          />
        </template>
        <template
          #button
          v-if="activeTab === CUSTOMER_TYPE_ENUM.DESIGN_FOLLOW"
        >
          <el-button
            v-if="CAN_TRANSFER"
            type="primary"
            @click="handleTransferCustomers"
            :disabled="!multipleSelection.length"
          >
            转移客户
          </el-button>
          <el-button
            v-if="CAN_FREE"
            type="primary"
            @click="transferCustomer.visible = true"
            :disabled="!multipleSelection.length"
          >
            释放至公海
          </el-button>
        </template>
      </header-area>
    </template>
    <template #main="{ height }">
      <div v-show="activeTab === CUSTOMER_TYPE_ENUM.DESIGN_FOLLOW">
        <custom-table
          border
          :height="height"
          :key="height"
          :data="tableData"
          :columns="renderColumns( CAN_VIEW_FOLLOW_DETAIL)"
          @selectionChange="handleSelectionChange"
        />
      </div>
      <div v-show="activeTab === CUSTOMER_TYPE_ENUM.PUBLIC_CUSTOMER">
        <custom-table
          border
          :height="height"
          :key="height"
          :data="tableData"
          :columns="publicRenderColumns(
            CAN_VIEW_PUBLIC_DETAIL,
            CAN_BIND,
            handleBindDesign,
          )"
        />
      </div>
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
    <!-- 释放至公海 -->
    <submit-tips-dialog
      :content="transferCustomer.content"
      v-model:visible="transferCustomer.visible"
      @success="handleReleaseCustomer"
    >
      <div>提交则以上客户会自动流入公海池，需要另外绑定跟进，是否继续确认？</div>
    </submit-tips-dialog>
  </app-page>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';

import { useList } from '@/hooks/use-list';
import CustomTable from '@/components/custom-table';
import { renderColumns, publicRenderColumns } from './composables/tableData';
import { usePermissionConfig } from '../../use-permission-config';

import BindingDesignDialog from './components/binding-design-dialog.vue';
import { handleOpenDialog } from '@/hooks/use-dialog';

import { getRelationFollowListApi, releaseCustomerApi } from '@/modules/customer-follow/design-follow/api';
import { getCustomerOptions, regionAreaListApi } from '@/api/query-options';
import {
  ICustomerGroupRelationPageResListItem,
  ICustomerGroupRelationPageReq,
  ICustomerGroupRelationPageRes,
} from '@/modules/customer-follow/design-follow/api/types';
import {
  CUSTOMER_TYPE_ENUM,
  CUSTOMER_TYPE_LIST,
  BUSINESS_TYPE_ENUM,
  HANDLE_TYPE,
} from '@/modules/customer-follow/design-follow/constant';
import { useConditionPermissionList, IConditionPermissionItem } from '@/hooks/use-condition-permission-list';

import { usePermissionList } from '@/hooks/use-permission-list';

import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'CustomerManageCustomerList',
  components: {
    CustomTable,
  },
  setup() {
    const BUSINESS_TYPE_PERMISSION = ref([
      { label: '平台业务', value: BUSINESS_TYPE_ENUM.PLATFORM_BUSINESS, permissionCode: 'CSS-KHGL-SJGJ-PTYW' },
      { label: '自营业务', value: BUSINESS_TYPE_ENUM.SELF_OPERATED_BUSINESS, permissionCode: 'CSS-KHGL-SJGJ-ZYYW' },
    ]);
    const {
      CAN_TRANSFER,
      CAN_FREE,
      CAN_VIEW_FOLLOW_DETAIL,
      CAN_VIEW_PUBLIC_DETAIL,
      CAN_BIND,
    } = usePermissionConfig();
    const {
      permissionList: businessPermissionList,
      defaultCondition: businessDefaultCondition,
    } = usePermissionList<BUSINESS_TYPE_ENUM>(
      BUSINESS_TYPE_PERMISSION,
      true,
    );

    // 区域
    const regionPermissionList = ref<IConditionPermissionItem[]>([]);
    const regionDefaultCondition = ref('');
    const config = computed(() => {
      return [
        {
          name: '客户名称：',
          component: 'input',
          valueName: 'customerName',
          placeholder: '请输入客户名称',
        },
        {
          name: '所属设计组：',
          component: 'input',
          valueName: 'groupName',
          placeholder: '请输入所属设计组',
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
          name: '业务模式：',
          component: 'select',
          valueName: 'businessType',
          placeholder: '请输入业务模式',
          options: businessPermissionList.value,
          clearable: false,
        },
      ];
    });
    const publicConfig = computed(() => {
      return config.value.filter(item => item.valueName !== 'ownerName');
    });
    const getRegionAreaList = async () => {
      const res = await regionAreaListApi();
      const data = res?.data ?? [];
      const list = data.map((item) => {
        return {
          label: item.regionName!,
          value: item.regionCode!,
          permissionCode: `CCS-KHGJ-SJGJ-${item.regionCode}`,
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

    const activeTab = ref(CUSTOMER_TYPE_ENUM.DESIGN_FOLLOW);
    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<ICustomerGroupRelationPageRes, ICustomerGroupRelationPageReq>({
      request: {
        api: getRelationFollowListApi,
        params: {
          pageNum: 1,
          pageSize: 10,
          customerName: '', // 客户名称
          groupName: '', // 设计组名称
          businessType: businessDefaultCondition.value, // 业务模式
          regionCode: regionDefaultCondition.value, // 客户区域
          queryType: activeTab.value,
        },
        handleParams: (paramsObj) => {
          paramsObj.queryType = activeTab.value;
          return {
            ...paramsObj,
          };
        },
      },
    });

    const handleAuth = () => {
      if (!businessPermissionList.value.length) {
        ElMessage.error('当前账号暂无业务模式的权限！');
        return false;
      } if (!regionPermissionList.value.length) {
        ElMessage.error('当前账号暂无客户区域的权限！');
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
      params.value.businessType = businessDefaultCondition.value;
      params.value.regionCode = regionDefaultCondition.value;
    };
    const handleAuthSizeChange = (pageSize: number) => {
      if (!handleAuth()) return;
      handleSizeChange(pageSize);
    };
    const handleAuthCurrentChange = (pageNum: number) => {
      if (!handleAuth()) return;
      handleCurrentChange(pageNum);
    };

    // 释放至公海
    const transferCustomer = reactive({
      visible: false,
      content: '',
    });

    // 选择客户
    const multipleSelection = ref<ICustomerGroupRelationPageResListItem[]>([]);
    const handleSelectionChange = (val: []) => {
      multipleSelection.value = val;
      transferCustomer.content = multipleSelection.value
        .map(item => item?.customerName)
        .join(',');
    };

    // tabs
    const handleTabsClick = (tab: CUSTOMER_TYPE_ENUM) => {
      params.value.queryType = tab;
      multipleSelection.value = [];
      handleReset();
    };

    const handleReleaseCustomer = async () => {
      try {
        const businessIdList = multipleSelection.value
          .map(item => item?.businessId);
        await releaseCustomerApi({ businessIdList });
        ElMessage.success('操作成功！');
        handleSearch();
      } catch (e) {
        console.log(e);
      }
    };

    // 转移客户
    const handleTransferCustomers = () => {
      handleOpenDialog(BindingDesignDialog, {
        params: {
          customerName: multipleSelection.value
            .map(item => item?.customerName)
            .join(','),
          detailIdList: multipleSelection.value,
          type: HANDLE_TYPE.TRANSFER,
          onSuccess: handleSearch,
        },
      });
    };

    // 绑定设计组
    const handleBindDesign = (row: ICustomerGroupRelationPageResListItem) => {
      handleOpenDialog(BindingDesignDialog, {
        params: {
          customerName: row?.customerName,
          row,
          type: HANDLE_TYPE.BINDING,
          onSuccess: handleSearch,
        },
      });
    };

    // 初始化权限 & 默认值
    const init = async () => {
      try {
        await getRegionAreaList();
        // 默认值
        params.value.businessType = businessDefaultCondition.value;
        params.value.regionCode = regionDefaultCondition.value;
        await handleAuthSearch();
      } catch (e) {
        console.log(e);
      }
    };
    init();

    return {
      CAN_TRANSFER,
      CAN_FREE,
      CAN_VIEW_FOLLOW_DETAIL,
      CAN_VIEW_PUBLIC_DETAIL,
      CAN_BIND,
      params,
      tableTotal,
      tableData,
      activeTab,
      multipleSelection,
      transferCustomer,
      CUSTOMER_TYPE_ENUM,

      getCustomerOptions,
      renderColumns,
      publicRenderColumns,
      handleTabsClick,
      handleBindDesign,
      handleTransferCustomers,
      handleReleaseCustomer,
      handleSelectionChange,
      handleAuthSearch,
      handleAuthReset,
      handleAuthSizeChange,
      handleAuthCurrentChange,
      tabsConfig: CUSTOMER_TYPE_LIST,
      config,
      publicConfig,
    };
  },
});
</script>
