<template>
  <div class="detail-container develop-detail">
    <div class="develop-detail__header">
      <detail-title
        title="客户开发详情"
      >
        <template #status>
          <status-label
            :value="developDetail.devState"
            :options="DEVELOP_STATE_LIST"
            mode="tag"
            class="margin-left-10"
            v-if="developDetail?.devState"
          />
          <status-label
            :value="developDetail.clueType"
            :options="CLUE_TYPE_LIST"
            mode="tag"
            class="margin-left-10"
            v-if="developDetail?.clueType"
          />
        </template>
        <div class="develop-detail__btn">
          <el-button
            v-if="CAN_CLAIM && DEVELOP_STATE_ENUM.UNASSIGNED === developDetail?.devState"
            @click="handleOperateBD(BD_OPERATE_TYPE_ENUM.BD_CLAIM)"
            type="primary"
          >
            BD认领
          </el-button>
          <el-button
            v-if="CAN_DISTRIBUTE && DEVELOP_STATE_ENUM.UNASSIGNED === developDetail?.devState"
            @click="handleOperateBD(BD_OPERATE_TYPE_ENUM.BD_DISTRIBUTE)"
            type="primary"
          >
            分配BD
          </el-button>
          <el-button
            v-if="CAN_TRANSFER && DEVELOP_STATE_ENUM.IN_DEVELOP === developDetail?.devState"
            @click="handleOperateBD(BD_OPERATE_TYPE_ENUM.TRANSFER_BD)"
            type="primary"
          >
            转移BD
          </el-button>
          <el-button
            v-if="CAN_FREE && DEVELOP_STATE_ENUM.IN_DEVELOP === developDetail?.devState"
            type="primary"
            @click="handleOpenReleaseCustomerDialog"
          >
            释放至公海
          </el-button>
          <el-button
            v-if="CAN_FEEDBACK && DEVELOP_STATE_ENUM.IN_DEVELOP === developDetail?.devState"
            @click="handleDevelopFeedback"
            type="primary"
          >
            开发反馈
          </el-button>
          <el-button
            v-if="CAN_SUBMIT && DEVELOP_STATE_ENUM.IN_DEVELOP === developDetail?.devState"
            @click="handleSubmitResult"
            type="primary"
          >
            提交结果
          </el-button>
          <el-button
            v-if="CAN_VIEW_CUSTOMER_DETAIL && DEVELOP_STATE_ENUM.CONVERTED === developDetail?.devState"
            @click="handleViewCustomerDetail"
            type="primary"
          >
            查看档案
          </el-button>
          <el-button
            v-if="CAN_ACTIVE && DEVELOP_STATE_ENUM.INVALID === developDetail?.devState"
            type="primary"
            @click="handleOpenActiveClueDialog"
          >
            重新激活
          </el-button>
          <el-button @click="goToList">返回列表</el-button>
          <el-button v-if="CAN_VIEW_LOG" @click="handleLog">操作日志</el-button>
        </div>
      </detail-title>
    </div>
    <div class="develop-detail__content">
      <el-tabs
        v-model="activeTab"
      >
        <el-tab-pane label="基本信息" name="tab-basic">
          <basic-info :clueType="developDetail?.clueType" :cluesDetail="cluesDetail" />
        </el-tab-pane>
        <el-tab-pane label="开发历程" name="tab-history">
          <develop-history :devId="devId" ref="historyRef" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <operation-drawer
      title="操作日志"
      v-model="visibleLog"
      :request="operationLogGetOperationList"
      :requestParams="logParams"
      :config="logConfig"
    />
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import {
  customerClueDevGet,
  customerClueDevDetail,
  operationLogGetOperationList,
  devPublic,
  customerClueDevActivation,
} from '@/modules/clue-manage/develop-follow/api';
import {
  ICustomerClueDevGetRes,
  ICustomerClueDevDetailRes,
  IOperationLogGetOperationListResItem,
} from '@/modules/clue-manage/develop-follow/api/types';
import {
  DETAIL_TABS_ENUM,
  CLUE_TYPE_LIST,
  DEVELOP_STATE_ENUM,
  DEVELOP_STATE_LIST,
  BD_OPERATE_TYPE_ENUM,
} from '@/modules/clue-manage/develop-follow/constant';
import BasicInfo from './components/basic-info/index.vue';
import DevelopHistory from './components/develop-history/index.vue';
import OperationDrawer from '@/components/operation-drawer/index.vue';
import BDOperateDialog from '../list/components/bd-operate-dialog.vue';
import DevelopFeedbackDialog from '../list/components/develop-feedback-dialog.vue';
import SubmitResultDialog from '../list/components/submit-result-dialog.vue';
import { handleOpenDialog } from '@/hooks/use-dialog';
import { usePermissionConfig } from '@/modules/clue-manage/develop-follow/use-permission-config';
import { useDictionary } from '@/hooks/use-dictionary/';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { getLabelByVal } from '@/core/plugins/filter';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  name: 'ClueManageDevelopDetail',
  components: {
    BasicInfo,
    DevelopHistory,
    OperationDrawer,
  },
  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const developId = $route.params.id as string;

    const { getDictionaryOptions } = useDictionary();
    // 线索开发情况
    const CRM_CLUE_DEVELOPMENT = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_CLUE_DEVELOPMENT) || [];
    });
    CRM_CLUE_DEVELOPMENT.value;
    // 线索无效原因
    const CRM_CLUE_INVALID = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_CLUE_INVALID) || [];
    });
    CRM_CLUE_INVALID.value;

    const activeTab = ref(DETAIL_TABS_ENUM.TAB_BASIC);
    const historyRef = ref<InstanceType<typeof DevelopHistory> | null>(null);

    const developDetail = ref({} as ICustomerClueDevGetRes);
    const devId = computed(() => developDetail.value.devId);
    const customerId = computed(() => developDetail.value.customerId);
    const customerName = computed(() => developDetail.value.customerName);
    const getDevelopDetail = async () => {
      const res = await customerClueDevGet(developId);
      developDetail.value = res?.data;
    };

    const cluesDetail = ref({
      businessInfoModel: {},
      contactList: [],
      ecommercePlatformList: [],
    } as unknown as ICustomerClueDevDetailRes);
    // const developHistory = ref([] as IGetHistoryListResItem[]);
    const queryFetch = (tab: DETAIL_TABS_ENUM) => {
      const queryObj: Record<DETAIL_TABS_ENUM, () => void> = {
        // 基本信息
        [DETAIL_TABS_ENUM.TAB_BASIC]: async () => {
          const res = await customerClueDevDetail(developId);
          cluesDetail.value = res?.data;
        },
        // 开发历程
        [DETAIL_TABS_ENUM.TAB_HISTORY]: async () => {
          historyRef.value?.getDevelopHistory();
        },
      };
      if (queryObj[tab]) queryObj[tab]();
    };

    const init = async (first = false) => {
      first || useMenuStore().deleteKeepAlive('ClueManageDevelopList');
      await getDevelopDetail();
      (first || activeTab.value === DETAIL_TABS_ENUM.TAB_HISTORY) && queryFetch(activeTab.value);
    };
    init(true);

    watch(activeTab, (tab) => {
      queryFetch(tab);
    });

    // 释放至公海
    const releaseCustomerInfo = reactive({
      visible: false,
      title: '释放至公海',
      content: '',
    });
    const handleOpenReleaseCustomerDialog = () => {
      releaseCustomerInfo.content = customerName.value;
      releaseCustomerInfo.visible = true;
    };
    const handleReleaseCustomer = async () => {
      await devPublic({ devIdList: [devId.value] });
      ElMessage.success('操作成功！');
      init();
    };

    // 激活线索
    const activeClueInfo = reactive({
      visible: false,
      title: '激活线索',
    });
    const handleOpenActiveClueDialog = () => {
      activeClueInfo.visible = true;
    };
    const handleActiveClue = async () => {
      await customerClueDevActivation({
        devIdList: [devId.value],
      });
      ElMessage.success('操作成功！');
      init();
    };

    // 转移BD BD分配 BD认领
    const handleOperateBD = (type: BD_OPERATE_TYPE_ENUM) => {
      handleOpenDialog(BDOperateDialog, {
        params: {
          customerName: customerName.value,
          detailIdList: [devId.value],
          type,
          onSuccess: init,
        },
      });
    };

    // 开发反馈
    const handleDevelopFeedback = () => {
      handleOpenDialog(DevelopFeedbackDialog, {
        params: {
          devId: developDetail.value.devId,
          onSuccess: init,
        },
      });
    };

    // 提交结果
    const handleSubmitResult = () => {
      handleOpenDialog(SubmitResultDialog, {
        params: {
          row: developDetail.value,
          onSuccess: init,
        },
      });
    };
    // handleDevelopFeedback();

    // 查看档案
    const handleViewCustomerDetail = () => {
      const routeData = $router.resolve({
        name: 'CustomerManageCustomerDetail',
        params: {
          id: developDetail.value?.jumpCustomerId,
        },
      });
      window.open(routeData.href, '_blank');
    };

    // 权限
    const {
      CAN_TRANSFER,
      CAN_FREE,
      CAN_ACTIVE,
      CAN_CLAIM,
      CAN_DISTRIBUTE,
      CAN_FEEDBACK,
      CAN_SUBMIT,
      CAN_VIEW_CUSTOMER_DETAIL,
      CAN_VIEW_LOG,
    } = usePermissionConfig();

    // 操作日志
    const visibleLog = ref(false);
    const handleLog = () => {
      visibleLog.value = true;
    };

    // 返回列表
    const goToList = () => {
      $router.push({
        name: 'ClueManageDevelopList',
      });
    };

    return {
      activeTab,
      historyRef,
      devId,
      customerId,
      developDetail,
      cluesDetail,
      queryFetch,

      visibleLog,
      logParams: { buzId: developId },
      logConfig: {
        timeKey: 'createdTime',
        userKey: 'creatorName',
        contentKey: 'content',
        remarkKey: 'targetRemark',
        customizeFormatContent: (item: IOperationLogGetOperationListResItem) => {
          const { devState } = item;
          let { devSpeed } = item;
          if (DEVELOP_STATE_ENUM.IN_DEVELOP === devState) {
            devSpeed = getLabelByVal(CRM_CLUE_DEVELOPMENT.value, devSpeed);
          } if (DEVELOP_STATE_ENUM.INVALID === devState) {
            devSpeed = getLabelByVal(CRM_CLUE_INVALID.value, devSpeed);
          }
          return `${item.content}${devSpeed}`;
        },
      },
      handleLog,

      CLUE_TYPE_LIST,
      DEVELOP_STATE_ENUM,
      DEVELOP_STATE_LIST,
      BD_OPERATE_TYPE_ENUM,

      CAN_TRANSFER,
      CAN_FREE,
      CAN_ACTIVE,
      CAN_CLAIM,
      CAN_DISTRIBUTE,
      CAN_FEEDBACK,
      CAN_SUBMIT,
      CAN_VIEW_CUSTOMER_DETAIL,
      CAN_VIEW_LOG,

      goToList,
      operationLogGetOperationList,

      releaseCustomerInfo,
      handleOpenReleaseCustomerDialog,
      handleReleaseCustomer,
      activeClueInfo,
      handleOpenActiveClueDialog,
      handleActiveClue,
      handleOperateBD,
      handleDevelopFeedback,
      handleSubmitResult,
      handleViewCustomerDetail,
    };
  },
});
</script>

<style lang="scss" scoped>
.develop-detail {
  &__header {
    padding: 0 20px;
  }
  &__btn {
    display: flex;
    justify-content: flex-end;
    min-width: 600px;
  }
  &__content {
    padding: 0 20px;
  }
}
</style>
