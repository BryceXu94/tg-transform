<template>
  <app-page class="develop-list">
    <template #fheader>
      <search-area
        v-model="params"
        @handleSearch="handleSearch"
        @handleReset="handleReset"
        :config="searchAreaConfig"
      >
        <template #customerAddress>
          <address-cascader
            v-model="params.addressList"
          />
        </template>
      </search-area>
    </template>
    <template #header>
      <header-area>
        <template #default>
          <tabs
            :config="TAB_TYPE_LIST"
            :border="false"
            v-model="activeTab"
            @change="handleTabsClick"
          />
        </template>
        <template #button>
          <div v-if="activeTab === TAB_TYPE_ENUM.DEVELOP_FOLLOW">
            <el-button
              v-if="CAN_TRANSFER"
              @click="handleTransferBD"
              :disabled="!multipleSelection.length"
            >
              转移BD
            </el-button>
            <el-button
              v-if="CAN_FREE"
              type="primary"
              @click="handleOpenReleaseCustomerDialog"
              :disabled="!multipleSelection.length"
            >
              释放至公海
            </el-button>
          </div>
          <div v-if="activeTab === TAB_TYPE_ENUM.HIGH_SEAS_CLUE">
            <el-button
              v-if="CAN_ACTIVE"
              @click="handleOpenActiveClueDialog"
              :disabled="!multipleSelection.length"
            >
              重新激活
            </el-button>
            <el-button
              v-if="CAN_CLAIM"
              @click="handleBDClaim"
              :disabled="!multipleSelection.length"
            >
              BD认领
            </el-button>
            <el-button
              v-if="CAN_DISTRIBUTE"
              @click="handleBDDistribute"
              type="primary"
              :disabled="!multipleSelection.length"
            >
              分配BD
            </el-button>
          </div>
        </template>
      </header-area>
    </template>
    <template #main="{ height }">
      <div v-show="activeTab === TAB_TYPE_ENUM.DEVELOP_FOLLOW">
        <custom-table
          border
          :height="height"
          :key="height"
          :data="tableData"
          :columns="developRenderColumns(calculateTime,
                                         handleOpenActiveClueDialog,
                                         handleDevelopFeedback,
                                         handleSubmitResult,
                                         handleViewCustomerDetail,
                                         CAN_ACTIVE,
                                         CAN_FEEDBACK,
                                         CAN_SUBMIT,
                                         CAN_VIEW,
                                         CAN_VIEW_CUSTOMER_DETAIL,
                                         customizeFormatContent,
          )"
          @selectionChange="handleSelectionChange"
        />
      </div>
      <div v-show="activeTab === TAB_TYPE_ENUM.HIGH_SEAS_CLUE">
        <custom-table
          border
          :height="height"
          :key="height"
          :data="tableData"
          :columns="clueRenderColumns(calculateTime,
                                      CAN_VIEW,
          )"
          @selectionChange="handleSelectionChange"
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </template>
    <!-- 释放至公海 -->
    <submit-tips-dialog
      :title="releaseCustomerInfo.title"
      :content="releaseCustomerInfo.content"
      v-model:visible="releaseCustomerInfo.visible"
      @success="handleReleaseCustomer"
    >
      <div>请确认是否需要释放至公海？释放后可在公海线索中重新分配BD</div>
    </submit-tips-dialog>
    <!-- 激活线索 -->
    <submit-tips-dialog
      :title="activeClueInfo.title"
      v-model:visible="activeClueInfo.visible"
      @success="handleActiveClue"
    >
      <div>请确认线索是否需要激活？激活后可重新编辑与提交至审核</div>
    </submit-tips-dialog>
  </app-page>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

import { useList } from '@/hooks/use-list';
import CustomTable from '@/components/custom-table';
import { developRenderColumns, clueRenderColumns } from './composables/tableData';

import {
  customerClueDevPage,
  devPublic,
  customerClueDevActivation,
} from '@/modules/clue-manage/develop-follow/api';
import {
  ICustomerClueDevPageReq,
  ICustomerClueDevPageRes,
  ICustomerClueDevPageResListItem,
} from '@/modules/clue-manage/develop-follow/api/types';
import { IConfigItem } from '@/components/search-area/package/types';

import {
  TAB_TYPE_ENUM,
  TAB_TYPE_LIST,
  CLUE_TYPE_LIST,
  DEVELOP_STATE_ENUM,
  DEVELOP_STATE_LIST,
  BD_OPERATE_TYPE_ENUM,
} from '@/modules/clue-manage/develop-follow/constant';
import { YES_OR_NO_NUMBER_ENUM } from '@/constant/global';
import BDOperateDialog from './components/bd-operate-dialog.vue';
import DevelopFeedbackDialog from './components/develop-feedback-dialog.vue';
import SubmitResultDialog from './components/submit-result-dialog.vue';
import { handleOpenDialog } from '@/hooks/use-dialog';
import { getRegionList } from '@/api/global';
import { IRegionListResItem } from '@/api/global/type';
import AddressCascader from '@/components/address-cascader';
import { usePermissionConfig } from '@/modules/clue-manage/develop-follow/use-permission-config';
import { useDictionary } from '@/hooks/use-dictionary/';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { getLabelByVal } from '@/core/plugins/filter';

export default defineComponent({
  name: 'ClueManageDevelopList',
  components: {
    CustomTable,
    AddressCascader,
  },
  setup() {
    const $router = useRouter();

    const { getDictionaryOptions } = useDictionary();
    // 线索开发情况
    const CRM_CLUE_DEVELOPMENT = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_CLUE_DEVELOPMENT) || [];
    });
    // 线索无效原因
    const CRM_CLUE_INVALID = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_CLUE_INVALID) || [];
    });

    const activeTab = ref(TAB_TYPE_ENUM.DEVELOP_FOLLOW);
    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<ICustomerClueDevPageRes, ICustomerClueDevPageReq>({
      request: {
        api: customerClueDevPage,
        params: {
          customerNameLike: '',
          clueType: '',
          devStatus: '',
          bdNameLike: '',
          clueCreatorNameLike: '',
          devSpeedPageType: activeTab.value,
          addressList: [],
          regionCode: '',
          pageNum: 1,
          pageSize: 10,
        },
        handleParams: (paramsObj) => {
          paramsObj.devSpeedPageType = activeTab.value;
          paramsObj.addressList = paramsObj.addressList?.map((item) => {
            const address = item as any as string[];
            return {
              province: address[0],
              city: address[1],
              region: address[2],
            };
          });
          return {
            ...paramsObj,
          };
        },
      },
    });

    const multipleSelection = ref<ICustomerClueDevPageResListItem[]>([]);
    const handleSelectionChange = (val: []) => {
      multipleSelection.value = val;
    };

    const getSelectedCustomerNames = () => multipleSelection.value
      .map(item => item?.customerName)
      .join(',');
    // const getSelectedCustomerIds = () => multipleSelection.value
    //   .map(item => item?.customerId);
    const getSelectedDevIds = () => multipleSelection.value
      .map(item => item?.devId);

    const handleTabsClick = (tab: TAB_TYPE_ENUM) => {
      params.value.devSpeedPageType = tab;
      multipleSelection.value = [];
      handleReset();
    };

    // 释放至公海
    const releaseCustomerInfo = reactive({
      visible: false,
      title: '释放至公海',
      content: '',
    });
    const handleOpenReleaseCustomerDialog = () => {
      if (multipleSelection.value.every(item => [
        DEVELOP_STATE_ENUM.IN_DEVELOP,
        DEVELOP_STATE_ENUM.INVALID,
      ].includes(item?.devState))) {
        releaseCustomerInfo.content = getSelectedCustomerNames();
        releaseCustomerInfo.visible = true;
      } else {
        ElMessage.warning('请选择开发中的线索进行释放至公海操作');
      }
    };
    const handleReleaseCustomer = async () => {
      await devPublic({ devIdList: getSelectedDevIds() });
      ElMessage.success('操作成功！');
      handleSearch();
    };

    // 激活线索
    const activeClueInfo = reactive({
      visible: false,
      title: '激活线索',
      row: {} as ICustomerClueDevPageResListItem,
    });
    const handleOpenActiveClueDialog = (row?: ICustomerClueDevPageResListItem) => {
      if (row) {
        activeClueInfo.row = row;
      } else {
        activeClueInfo.row = {} as ICustomerClueDevPageResListItem;
        if (multipleSelection.value.some(item => item?.devState !== DEVELOP_STATE_ENUM.INVALID)) {
          ElMessage.warning('请选择开发中的线索进行激活操作');
          return;
        }
      }
      activeClueInfo.visible = true;
    };
    const handleActiveClue = async () => {
      await customerClueDevActivation({
        devIdList: activeClueInfo.row.devId ? [activeClueInfo.row.devId] : getSelectedDevIds(),
      });
      ElMessage.success('操作成功！');
      handleSearch(params.value.pageNum);
    };

    const handleOperateBD = (type: BD_OPERATE_TYPE_ENUM) => {
      handleOpenDialog(BDOperateDialog, {
        params: {
          customerName: getSelectedCustomerNames(),
          detailIdList: getSelectedDevIds(),
          type,
          onSuccess: handleSearch,
        },
      });
    };
    // 转移BD
    const handleTransferBD = () => {
      if (multipleSelection.value.every(item => item?.devState === DEVELOP_STATE_ENUM.IN_DEVELOP)) {
        handleOperateBD(BD_OPERATE_TYPE_ENUM.TRANSFER_BD);
      } else {
        ElMessage.warning('请选择开发中的线索进行转移操作');
      }
    };
    // BD分配
    const handleBDDistribute = () => {
      if (multipleSelection.value.some(item => item?.devState === DEVELOP_STATE_ENUM.INVALID)) {
        ElMessage.warning('请先激活该线索再进行分配操作');
      } else {
        handleOperateBD(BD_OPERATE_TYPE_ENUM.BD_DISTRIBUTE);
      }
    };
    // BD认领
    const handleBDClaim = () => {
      if (multipleSelection.value.some(item => item?.devState === DEVELOP_STATE_ENUM.INVALID)) {
        ElMessage.warning('请先激活该线索再进行认领操作');
      } else {
        handleOperateBD(BD_OPERATE_TYPE_ENUM.BD_CLAIM);
      }
    };

    // 开发反馈
    const handleDevelopFeedback = (row: ICustomerClueDevPageResListItem) => {
      handleOpenDialog(DevelopFeedbackDialog, {
        params: {
          devId: row.devId,
          onSuccess: () => handleSearch(params.value.pageNum),
        },
      });
    };

    // 提交结果
    const handleSubmitResult = (row: ICustomerClueDevPageResListItem) => {
      handleOpenDialog(SubmitResultDialog, {
        params: {
          row,
          onSuccess: () => handleSearch(params.value.pageNum),
        },
      });
    };
    // handleDevelopFeedback({} as ICustomerClueDevPageResListItem);

    // 查看档案
    const handleViewCustomerDetail = (row: ICustomerClueDevPageResListItem) => {
      const routeData = $router.resolve({
        name: 'CustomerManageCustomerDetail',
        params: {
          id: row?.jumpCustomerId,
        },
      });
      window.open(routeData.href, '_blank');
    };

    const regionListOptions = ref<IRegionListResItem[]>([]);
    const getRegionOptions = async () => {
      const { data } = await getRegionList();
      regionListOptions.value = data;
    };

    const init = async () => {
      handleSearch();
      getRegionOptions();
    };
    init();

    // 权限
    const {
      CAN_TRANSFER,
      CAN_FREE,
      CAN_ACTIVE,
      CAN_CLAIM,
      CAN_DISTRIBUTE,
      CAN_FEEDBACK,
      CAN_SUBMIT,
      CAN_VIEW,
      CAN_VIEW_CUSTOMER_DETAIL,
    } = usePermissionConfig();

    const searchAreaConfig = computed<IConfigItem[]>(() => {
      let config = [
        {
          name: '客户名称：',
          component: 'input',
          valueName: 'customerNameLike',
          placeholder: '请输入客户名称',
        },
        {
          name: '线索类型：',
          component: 'select',
          valueName: 'clueType',
          placeholder: '请选择',
          options: [
            {
              label: '全部',
              value: '',
            },
            ...CLUE_TYPE_LIST,
          ],
        },
      ] as IConfigItem[];
      config = config.concat(
        activeTab.value === TAB_TYPE_ENUM.DEVELOP_FOLLOW ? [
          {
            name: '开发状态：',
            component: 'select',
            valueName: 'devStatus',
            placeholder: '请选择',
            options: [
              {
                label: '全部',
                value: '',
              },
              ...DEVELOP_STATE_LIST.filter(item => item.value !== DEVELOP_STATE_ENUM.UNASSIGNED),
            ],
          },
          {
            name: '分配时间：',
            component: 'datePicker',
            valueName: ['startDistributionTime', 'endDistributionTime'],
            placeholder: ['开始日期', '结束日期'],
          },
          {
            name: '所属BD：',
            component: 'input',
            valueName: 'bdNameLike',
            placeholder: '请输入所属BD',
          },
        ] : [
          {
            name: '流入时间：',
            component: 'datePicker',
            valueName: ['startPublicTime', 'endPublicTime'],
            placeholder: ['开始日期', '结束日期'],
          },
          {
            name: '创建人：',
            component: 'input',
            valueName: 'clueCreatorNameLike',
            placeholder: '请输入创建人',
          },
        ],
      );
      config = config.concat([
        {
          name: '客户区域：',
          component: 'select',
          valueName: 'regionCode',
          placeholder: '请选择',
          options: [
            {
              label: '全部',
              value: '',
            },
            ...regionListOptions.value.map((item) => {
              return {
                label: item.regionName,
                value: item.regionCode,
              };
            }),
          ],
          clearable: false,
        },
        {
          name: '客户地区：',
          slotName: 'customerAddress',
        },
      ]);
      return config;
    });

    return {
      activeTab,
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,

      TAB_TYPE_ENUM,
      TAB_TYPE_LIST,

      developRenderColumns,
      clueRenderColumns,

      multipleSelection,
      handleSelectionChange,
      handleTabsClick,
      releaseCustomerInfo,
      handleOpenReleaseCustomerDialog,
      handleReleaseCustomer,
      activeClueInfo,
      handleOpenActiveClueDialog,
      handleActiveClue,
      handleTransferBD,
      handleBDDistribute,
      handleBDClaim,
      handleDevelopFeedback,
      handleSubmitResult,
      handleViewCustomerDetail,

      searchAreaConfig,

      CAN_TRANSFER,
      CAN_FREE,
      CAN_ACTIVE,
      CAN_CLAIM,
      CAN_DISTRIBUTE,
      CAN_FEEDBACK,
      CAN_SUBMIT,
      CAN_VIEW,
      CAN_VIEW_CUSTOMER_DETAIL,

      calculateTime: (minuend: number, subtraction?: number) => {
        const days = Math.floor((((subtraction || Date.now()) - minuend) / 1000) / (3600 * 24));
        return days > 0 ? `${days}天` : '-';
      },
      customizeFormatContent: (item: ICustomerClueDevPageResListItem) => {
        // console.log(JSON.stringify(CRM_CLUE_DEVELOPMENT.value));
        const { devState, devVisitCode } = item;
        let { devSpeed } = item;
        if (DEVELOP_STATE_ENUM.IN_DEVELOP === devState && devVisitCode === YES_OR_NO_NUMBER_ENUM.NO) {
          devSpeed = getLabelByVal(CRM_CLUE_DEVELOPMENT.value, devSpeed);
        } if (DEVELOP_STATE_ENUM.INVALID === devState) {
          devSpeed = getLabelByVal(CRM_CLUE_INVALID.value, devSpeed);
        }
        return devSpeed;
      },
    };
  },
});
</script>
