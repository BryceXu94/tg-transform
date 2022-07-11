<template>
  <app-page class="customer-list">
    <template #fheader>
      <search-area
        v-model="params"
        @handleSearch="handleAuthSearch"
        @handleReset="handleAuthReset"
        :config="activeTab === CUSTOMER_TYPE_ENUM.CUSTOMER_FOLLOW ? config : publicConfig"
      />
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
          v-if="activeTab === CUSTOMER_TYPE_ENUM.CUSTOMER_FOLLOW"
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
      <div v-show="activeTab === CUSTOMER_TYPE_ENUM.CUSTOMER_FOLLOW">
        <custom-table
          border
          :height="height"
          :key="height"
          :data="tableData"
          :columns="renderColumns()"
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
            handleBindBd,
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

import BindingBd from './components/bindingBd-dialog.vue';
import { handleOpenDialog } from '@/hooks/use-dialog';

import { regionAreaListApi } from '@/api/query-options';
import {
  getCustomerFollowListApi,
  releaseCustomerApi,
  getAuditBdInfo,
} from '@/modules/customer-follow/sale-follow/api';
import {
  ICustomerBdDetailPageListItem,
  ICustomerBdDetailPageReq,
  ICustomerBdDetailPageRes,
} from '@/modules/customer-follow/sale-follow/api/types';
import { CUSTOMER_TYPE_ENUM, CUSTOMER_TYPE_LIST } from '@/modules/customer-follow/sale-follow/constant';
import { BUSINESS_MODE_ENUM } from '@/constant';
// import { useConditionPermissionList } from '@/hooks/use-condition-permission-list';

import { usePermissionList } from '@/hooks/use-permission-list';
import { IPermissionItem } from '@/hooks/use-permission-list/type';

import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'CustomerFollowDesignList',
  components: {
    CustomTable,
  },
  setup() {
    const { CAN_TRANSFER, CAN_FREE } = usePermissionConfig();
    const activeTab = ref(CUSTOMER_TYPE_ENUM.CUSTOMER_FOLLOW);
    const {
      permissionList: businessPermissionList,
      defaultCondition: businessDefaultCondition,
    } = usePermissionList<BUSINESS_MODE_ENUM>(
      ref([
        { label: '平台业务', value: BUSINESS_MODE_ENUM.PLATFORM_BUSINESS, permissionCode: 'CSS-KHGL-XSGJ-PTYW' },
        { label: '自营业务', value: BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS, permissionCode: 'CSS-KHGL-XSGJ-ZYYW' },
      ]),
      true,
    );

    // 区域
    const list = ref<IPermissionItem[]>([]);
    const {
      permissionList: regionPermissionList,
      defaultCondition: regionDefaultCondition } = usePermissionList(
      list,
      true,
    );
    const getRegionAreaList = async () => {
      const res = await regionAreaListApi();
      const data = res?.data ?? [];
      list.value = data.map((item) => {
        return {
          label: item.regionName!,
          value: item.regionCode!,
          permissionCode: `CCS-KHGJ-XSGJ-${item.regionCode}`,
        };
      });
    };

    const config = computed(() => {
      return [
        {
          name: '客户名称：',
          component: 'input',
          valueName: 'customerName',
          placeholder: '请输入客户名称',
        },
        {
          name: '所属BD：',
          component: 'input',
          valueName: 'ownerName',
          placeholder: '请输入所属BD',
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
          placeholder: '请选择',
          options: businessPermissionList.value,
          clearable: false,
        },
      ];
    });
    const publicConfig = computed(() => {
      return config.value.filter(item => item.valueName !== 'ownerName');
    });

    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<ICustomerBdDetailPageRes, ICustomerBdDetailPageReq>({
      request: {
        api: getCustomerFollowListApi,
        params: {
          pageNum: 1,
          pageSize: 10,
          customerName: '', // 客户名称
          ownerName: '', // bd名称
          businessType: businessDefaultCondition.value, // 业务模式
          queryType: activeTab.value,
          regionCode: regionDefaultCondition.value, // 客户区域
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

    // tabs
    const handleTabsClick = (tab: CUSTOMER_TYPE_ENUM) => {
      params.value.queryType = tab;
      handleAuthReset();
    };

    // 释放至公海
    const transferCustomer = reactive({
      visible: false,
      content: '',
    });

    // 选择客户
    const multipleSelection = ref<ICustomerBdDetailPageListItem[]>([]);
    const handleSelectionChange = (val: []) => {
      multipleSelection.value = val;
      transferCustomer.content = multipleSelection.value
        .map(item => item?.customerName)
        .join(',');
    };

    const handleReleaseCustomer = async () => {
      try {
        const detailIdList = multipleSelection.value
          .map(item => item?.detailId);
        await releaseCustomerApi({ detailIdList });
        ElMessage.success('操作成功！');
        handleAuthSearch();
      } catch (e) {
        console.log(e);
      }
    };

    // 转移客户
    const handleTransferCustomers = async () => {
      const res = await getAuditBdInfo({
        customerIdList: multipleSelection.value
          .map(item => item?.customerId),
      });
      handleOpenDialog(BindingBd, {
        params: {
          auditBdInfo: res.data,
          customerName: multipleSelection.value
            .map(item => item?.customerName)
            .join(','),
          detailIdList: multipleSelection.value
            .map(item => item?.detailId),
          type: 'transfer',
          onSuccess: handleAuthSearch,
        },
      });
    };

    // 绑定bd
    const handleBindBd = async (row: ICustomerBdDetailPageListItem) => {
      const res = await getAuditBdInfo({
        customerIdList: [row.customerId],
      });
      handleOpenDialog(BindingBd, {
        params: {
          auditBdInfo: res.data,
          customerName: row?.customerName,
          row,
          type: 'binding',
          onSuccess: handleAuthSearch,
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
      params,
      tableTotal,
      tableData,
      activeTab,
      multipleSelection,
      transferCustomer,
      CUSTOMER_TYPE_ENUM,

      renderColumns,
      publicRenderColumns,
      handleTabsClick,
      handleBindBd,
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
