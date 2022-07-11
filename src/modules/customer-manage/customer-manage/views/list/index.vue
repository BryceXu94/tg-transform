<template>
  <app-page class="customer-list">
    <template #fheader>
      <search-area
        v-model="params"
        @handleSearch="handleAuthSearch"
        @handleReset="handleAuthReset"
        :config="config"
      />
    </template>
    <template #header>
      <header-area>
        <template #default>
          <condition-select
            :conditionInfo="typeConditionInfo"
            v-model="params.profileState"
            @conditionChange="handleAuthSearch()"
          />
        </template>
        <template #button>
          <el-button
            type="primary"
            @click="handleOpenDialog(CreateCustomer, {
              businessType: BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS
            })"
            v-if="CAN_CREATE"
          >
            创建自营客户
          </el-button>
          <el-button
            type="primary"
            @click="handleOpenDialog(CreateCustomer, {
              businessType: BUSINESS_MODE_ENUM.PLATFORM_BUSINESS
            })"
            v-if="CAN_CREATE_PLATFORM"
          >
            创建平台客户
          </el-button>
          <el-button
            type="primary"
            v-if="CAN_DC"
            @click="handelExport"
          >
            导出
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
        :columns="customerRenderColumns(
          handleEnableDisabled,
          handleToUpdate,
          handleToDetail,
          handleChangeOrderType,
          handleDeleteCustomer,
          CAN_ADD,
          CAN_UPDATE,
          CAN_APPROVE,
          CAN_VIEW,
          CAN_TOGGLE_STATUS,
          CAN_ORDER_TYPE,
          CAN_DELETE_CUSTOMER,
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
    <!-- 停用/启用 -->
    <submit-tips-dialog
      :content="enableOrDisabled.content"
      v-model:visible="enableOrDisabled.visible"
      @success="handleEnableSuccess"
    >
      <div>操作状态启用，该客户可进行下单，是否继续确认？</div>
    </submit-tips-dialog>
  </app-page>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useList } from '@/hooks/use-list';
import CustomTable from '@/components/custom-table';
import { customerRenderColumns } from './composables/tableData';
import { handleOpenDialog } from '@/hooks/use-dialog';

import CreateCustomer from './components/create-customer-dialog.vue';
import ChangeOrderTypeDialog from './components/change-orderType-dialog.vue';
import DeleteDialog from './components/delete-dialog.vue';
import DisabledDialog from './components/disable-dialog.vue';

import {
  getCustomerInfoPageApi,
  customerEnableApi,
} from '@/modules/customer-manage/customer-manage/api';
import { regionAreaListApi } from '@/api/query-options';
import {
  ICustomerInfoPageRes,
  ICustomerInfoPageReq,
} from '@/modules/customer-manage/customer-manage/api/types';
import {
  PROFILE_STATE_LIST,
  CUSTOMER_STATUS_LIST,
  PROFILE_STATE_ENUM,
  CUSTOMER_STATE_ENUM,
} from '@/modules/customer-manage/customer-manage/constant';
import { BUSINESS_MODE_ENUM } from '@/constant';
import { exportByBlob } from '@/core/utils/file-download';

import { formatTime } from '@tiangong/utils';
import { ElMessage } from 'element-plus';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
import { useConditionPermissionList, IConditionPermissionItem } from '@/hooks/use-condition-permission-list';
import { ENABLE_DISABLE_ENUM } from '@/constant/global';

export default defineComponent({
  name: 'CustomerManageCustomerList',
  components: {
    CustomTable,
  },
  setup() {
    const $router = useRouter();
    const {
      permissionList: businessPermissionList,
      defaultCondition: businessDefaultCondition,
    } = useConditionPermissionList<BUSINESS_MODE_ENUM>(
      [
        { label: '平台业务', value: BUSINESS_MODE_ENUM.PLATFORM_BUSINESS, permissionCode: 'CSS-KHGL-KHDA-PTYW' },
        { label: '自营业务', value: BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS, permissionCode: 'CSS-KHGL-KHDA-ZYYW' },
      ],
      true,
    );

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
          permissionCode: `CCS-KHGL-KHDA-${item.regionCode}`,
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
    const baseParams: ICustomerInfoPageReq = {
      pageNum: 1,
      pageSize: 10,
      customerName: '', // 客户名称
      customerState: '', // 客户状态
      bdName: '',
      profileState: '', // 客户档案状态
      businessType: businessDefaultCondition, // 业务模式
      regionCode: regionDefaultCondition.value, // 客户区域
    };

    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<ICustomerInfoPageRes, ICustomerInfoPageReq>({
      request: {
        api: getCustomerInfoPageApi,
        params: { ...baseParams },
        handleCustomReset: () => {
          return { ...baseParams };
        },
      },
    });

    // 权限
    const {
      CAN_CREATE,
      CAN_ADD,
      CAN_UPDATE,
      CAN_APPROVE,
      CAN_VIEW,
      CAN_TOGGLE_STATUS,
      CAN_ORDER_TYPE,
      CAN_DELETE_CUSTOMER,
      CAN_CREATE_PLATFORM,
      CAN_DC,
    } = usePermissionConfig();

    // 补录
    const handleToUpdate = (customerId: string) => {
      $router.push({
        name: 'CustomerManageUpdateCustomer',
        params: {
          id: customerId,
        },
      });
    };

    // 审核
    const handleToDetail = (customerId: string) => {
      $router.push({
        name: 'CustomerManageCustomerDetail',
        params: {
          id: customerId,
        },
      });
    };

    // 启用/停用
    const enableOrDisabled = reactive({
      visible: false,
      content: '',
      customerId: '',
    });
    const handleEnableDisabled = (type: ENABLE_DISABLE_ENUM, customerName: string, customerId: string) => {
      // 启用
      if (type === ENABLE_DISABLE_ENUM.ENABLE) {
        enableOrDisabled.visible = true;
        enableOrDisabled.content = customerName;
        enableOrDisabled.customerId = customerId;
      } else {
        enableOrDisabled.customerId = customerId;
        handleOpenDialog(DisabledDialog, {
          customerId,
          pageNum: params.value.pageNum,
          success: handleSearch,
        });
      }
    };
    const handleEnableSuccess = async () => {
      try {
        await customerEnableApi({
          customerId: enableOrDisabled.customerId,
        });
        ElMessage.success('操作成功！');
        handleSearch(params.value.pageNum);
      } catch (e) {
        console.log(e);
      }
    };
    // 下单类型
    const handleChangeOrderType = (customerId: string, allowedOrderType: string) => {
      handleOpenDialog(ChangeOrderTypeDialog, {
        customerId,
        pageNum: params.value.pageNum,
        allowedOrderType,
        success: handleSearch,
      });
    };
    // 删除客户
    const handleDeleteCustomer = (customerId: string) => {
      handleOpenDialog(DeleteDialog, {
        customerId,
        pageNum: params.value.pageNum,
        success: handleSearch,
      });
    };

    const handleAuth = () => {
      if (!businessPermissionList.length) {
        ElMessage.error('当前账号暂无业务类型的权限！');
        return false;
      } if (!regionPermissionList.value.length) {
        ElMessage.error('当前账号暂无客户区域的权限！');
        return false;
      }
      return true;
    };

    // 导出
    const handelExport = async () => {
      const { pageNum, pageSize, ...rest } = params.value;
      console.log(pageNum, pageSize);
      await exportByBlob({
        method: 'post',
        url: '/crm-customer/web/v1/customer-info/export',
        data: rest,
        filename: '客户档案.xlsx',
        loading: true,
      });
    };
    // 查询
    const handleAuthSearch = () => {
      if (!handleAuth()) return;
      handleSearch();
    };
    // 重置
    const handleAuthReset = () => {
      if (!handleAuth()) return;
      params.value.businessType = businessDefaultCondition;
      params.value.regionCode = regionDefaultCondition.value;
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

    const init = async () => {
      try {
        await getRegionAreaList();

        // 默认值
        params.value.businessType = businessDefaultCondition;
        params.value.regionCode = regionDefaultCondition.value;
        handleAuthSearch();
      } catch (e) {
        console.log(e);
      }
    };
    init();

    // 初始化权限 & 默认值
    const config = computed(() => {
      return [
        {
          name: '客户名称：',
          component: 'input',
          valueName: 'customerName',
          placeholder: '请输入客户名称',
        },
        {
          name: '客户编码：',
          component: 'input',
          valueName: 'customerCode',
          placeholder: '请输入客户编码',
        },
        {
          name: '客户状态：',
          component: 'select',
          valueName: 'customerState',
          placeholder: '请选择',
          options: [
            {
              label: '全部',
              value: '',
            },
            ...CUSTOMER_STATUS_LIST.filter(item => item.value !== CUSTOMER_STATE_ENUM.INIT),
          ],
        },
        {
          name: '业务模式：',
          component: 'select',
          valueName: 'businessType',
          placeholder: '请选择',
          options: businessPermissionList,
          clearable: false,
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
          name: '创建时间：',
          component: 'datePicker',
          valueName: ['createdTimeBegin', 'createdTimeEnd'],
          placeholder: ['开始日期', '结束日期'],
          defaultTime: params.value.createdTimeBegin
            ? [params.value.createdTimeBegin, params.value.createdTimeEnd] : [],
          disabledDate: (time: Date) => {
            return time.getTime() > new Date(formatTime(Date.now())).getTime();
          },
        },
        {
          name: '所属bd：',
          component: 'input',
          valueName: 'bdName',
          placeholder: '请输入所属bd',
        },
      ];
    });

    return {
      BUSINESS_MODE_ENUM,
      params,
      tableTotal,
      enableOrDisabled,
      tableData,
      CreateCustomer,
      // 权限
      CAN_CREATE,
      CAN_ADD,
      CAN_UPDATE,
      CAN_APPROVE,
      CAN_VIEW,
      CAN_TOGGLE_STATUS,
      CAN_ORDER_TYPE,
      CAN_DELETE_CUSTOMER,
      CAN_CREATE_PLATFORM,
      CAN_DC,
      ENABLE_DISABLE_ENUM,

      customerRenderColumns,
      handleEnableDisabled,
      handleEnableSuccess,
      handleOpenDialog,
      handleToUpdate,
      handleToDetail,

      handleAuthSearch,
      handleAuthReset,
      handleAuthSizeChange,
      handleAuthCurrentChange,
      handleChangeOrderType,
      handleDeleteCustomer,
      handelExport,
      config,
      typeConditionInfo: {
        title: '档案状态：',
        conditionList: [
          {
            label: '全部',
            value: '',
          },
          ...PROFILE_STATE_LIST.filter((item) => {
            return ![
              PROFILE_STATE_ENUM.FINANCE_RE_EDIT,
              PROFILE_STATE_ENUM.CM_RE_EDIT,
            ].includes(item.value);
          }),
        ],
      },
    };
  },
});
</script>
