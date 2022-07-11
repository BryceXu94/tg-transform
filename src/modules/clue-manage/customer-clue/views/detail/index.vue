<template>
  <el-form label-width="140px">
    <div class="create_container">
      <detail-title
        title="客户线索信息"
      >
        <template #status>
          <div class="status">
            <status-label
              :value="detailInfo?.trackState"
              :options="TRACK_STATE_LIST"
              mode="tag"
            />
            <el-popover
              :content="detailInfo.auditRemark"
              :width="400"
              v-if="detailInfo.auditRemark"
            >
              <template #reference>
                <div
                  class="remark"
                >审核备注：{{detailInfo.auditRemark}}</div>
              </template>
            </el-popover>
          </div>
        </template>
        <template #default>
          <el-button
            @click="handleBack"
          >返回列表</el-button>
          <el-button
            type="primary"
            v-if="CAN_UPDATE && detailInfo?.trackState === TRACK_STATE_ENUM.WAIT_COMMIT"
            @click="handleToUpdate"
          >编辑</el-button>
          <el-button
            type="success"
            v-if="CAN_UPDATE && detailInfo?.trackState === TRACK_STATE_ENUM.WAIT_COMMIT"
            @click="handleConfirm"
          >提交</el-button>
          <el-button
            type="primary"
            v-if="CAN_AUDIT && detailInfo?.trackState === TRACK_STATE_ENUM.WAIT_AUDIT"
            @click="handleAudit"
          >审核</el-button>
          <el-button
            type="primary"
            v-if="CAN_ACTIVE && detailInfo?.trackState === TRACK_STATE_ENUM.AUDIT_FAILED"
            @click="handleActiveTrack(customerTrackId, true)"
          >激活</el-button>
          <el-button
            v-if="CAN_VIEW_OPERATION_LOG"
            @click="handleOperationLogBtn"
          >操作日志</el-button>
        </template>
      </detail-title>
      <div class="create_container_tabs">
        <tabs
          :config="TAB_LIST"
          v-model="curTab"
        />
      </div>
      <el-form
        label-width="140px"
        label-suffix="："
        v-show="curTab === TAB_ENUM.BASE_INFO"
      >
        <business-info
          :data="detailInfo.businessInfoModel"
        />
        <platform-info
          :data="detailInfo.ecommercePlatformList"
          :mainCategorySum="detailInfo?.mainCategorySum!"
          :monthSellSum="detailInfo?.monthSellSum!"
          :priceMinSum="detailInfo?.priceMinSum!"
          :priceMaxSum="detailInfo?.priceMaxSum!"
        />
        <contact-info
          :data="detailInfo?.contactList"
        />
      </el-form>
      <div v-show="curTab === TAB_ENUM.AUDIT_LOGS">
        <custom-card title="线索审核记录">
          <custom-logs
            ref="logsEl"
            :request="getCluesAuditLogs"
            :requestParams="{
              customerTrackId: customerTrackId,
            }"
            :showFilterBar="true"
            :config="auditLogConfig"
          />
        </custom-card>
      </div>
    </div>
    <audit-modal
      :tracks="auditModalConfig.tracks"
      v-model:visible="auditModalConfig.visible"
      @success="handleConfirmAuditModal"
    />
    <operation-drawer
      title="操作日志"
      v-model="operationConfig.visible"
      :request="getCluesOperationLogs"
      :requestParams="{
        buzId: customerTrackId,
      }"
      :config="operationLogConfig"
      v-if="CAN_VIEW_OPERATION_LOG"
    />
  </el-form>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { TAB_LIST, TAB_ENUM } from './constant';
import {
  IGetCluesDetailRes,
} from '@/modules/clue-manage/customer-clue/api/type';
import {
  AUDIT_LOG_TYPE_LIST,
  TRACK_STATE_LIST,
  TRACK_STATE_ENUM,
  OPERATION_LOG_TYPE_LIST,
} from '@/modules/clue-manage/customer-clue/constant';
import {
  getCluesAuditLogs,
  getEncryptionCluesDetail,
  getCluesDetail,
  confirmClues,
  getCluesOperationLogs,
} from '@/modules/clue-manage/customer-clue/api';
import BusinessInfo from '@/modules/clue-manage/components/business-info/index.vue';
import PlatformInfo from '@/modules/clue-manage/components/platform-info/index.vue';
import ContactInfo from '@/modules/clue-manage/components/contact-info/index.vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useOperation } from '@/modules/clue-manage/customer-clue/hooks/use-operation';
import AuditModal from '@/modules/clue-manage/customer-clue/components/audit-modal/index.vue';
import CustomCard from '@/modules/clue-manage/components/custom-card/index.vue';
import CustomLogs from '@/components/custom-logs';
import OperationDrawer from '@/components/operation-drawer/index.vue';
import { usePermissionConfig } from '@/modules/clue-manage/customer-clue/use-permission-config';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  components: {
    BusinessInfo,
    PlatformInfo,
    ContactInfo,
    AuditModal,
    CustomCard,
    OperationDrawer,
  },
  setup() {
    const {
      CAN_UPDATE,
      CAN_VIEW_DETAIL,
      CAN_AUDIT,
      CAN_ACTIVE,
      CAN_VIEW_OPERATION_LOG,
    } = usePermissionConfig();
    const { deleteKeepAlive } = useMenuStore();
    const operationConfig = ref({
      visible: false,
    });
    const handleOperationLogBtn = () => {
      operationConfig.value.visible = true;
    };
    const logsEl = ref<InstanceType<typeof CustomLogs>>();
    const $route = useRoute();
    const $router = useRouter();
    const customerTrackId = ref('');
    const detailInfo = ref<IGetCluesDetailRes>({
      businessInfoModel: {},
      contactList: [],
      ecommercePlatformList: [],
    });
    const curTab = ref(TAB_ENUM.BASE_INFO);
    // 获取详情
    const getDetailInfo = async () => {
      try {
        const { data } = await getEncryptionCluesDetail({
          id: customerTrackId.value,
        });
        detailInfo.value = data;
      } catch (error) {
        console.log('获取详情失败', error);
      }
    };

    const reload = () => {
      getDetailInfo();
      logsEl.value?.getLogs();
    };
    const {
      handleActiveTrack,
      handleAuditTrack,
      auditModalConfig,
    } = useOperation({
      reloadFn: reload,
    });
    // 提交审核
    const handleConfirm = async () => {
      try {
        await ElMessageBox.confirm('请确认线索是否提交审核？', '提交审核');
        const { data } = await getCluesDetail({
          id: customerTrackId.value,
        });
        await confirmClues({
          businessInfo: data.businessInfoModel,
          ecommercePlatformList: data.ecommercePlatformList,
          contactInfoList: data.contactList,
          trackId: customerTrackId.value,
        });
        ElMessage.success('操作成功');
        deleteKeepAlive('ClueManageCustomerClueList');
        reload();
      } catch (error) {
        console.log('提交审核失败', error);
      }
    };
    // 点击编辑
    const handleToUpdate = () => {
      $router.push({
        name: 'ClueManageCustomerClueUpdate',
        params: {
          id: customerTrackId.value,
        },
      });
    };
    // 点击审核
    const handleAudit = () => {
      handleAuditTrack([{
        id: customerTrackId.value,
        name: detailInfo.value.businessInfoModel.customerName!,
      }]);
    };
    const handleConfirmAuditModal = () => {
      deleteKeepAlive('ClueManageCustomerClueList');
      reload();
    };
    const init = () => {
      const id = $route.params.id as string;
      customerTrackId.value = id;
      getDetailInfo();
    };
    const handleBack = () => {
      $router.back();
    };
    init();
    return {
      handleConfirmAuditModal,
      CAN_VIEW_OPERATION_LOG,
      CAN_UPDATE,
      CAN_VIEW_DETAIL,
      CAN_AUDIT,
      CAN_ACTIVE,
      handleOperationLogBtn,
      operationConfig,
      handleBack,
      logsEl,
      reload,
      handleActiveTrack,
      auditModalConfig,
      handleToUpdate,
      handleConfirm,
      customerTrackId,
      detailInfo,
      curTab,
      TAB_ENUM,
      TAB_LIST,
      getCluesAuditLogs,
      TRACK_STATE_LIST,
      TRACK_STATE_ENUM,
      handleAudit,
      getCluesOperationLogs,
      auditLogConfig: {
        listKey: 'data',
        timeKey: 'createdTime',
        userKey: 'creatorName',
        contentKey: 'logType',
        remarkKey: 'remark',
        operateList: AUDIT_LOG_TYPE_LIST,
      },
      operationLogConfig: {
        listKey: 'data',
        timeKey: 'createdTime',
        userKey: 'creatorName',
        contentKey: 'logType',
        remarkKey: 'remark',
        operateList: OPERATION_LOG_TYPE_LIST,
      },
    };
  },
});
</script>
<style lang="scss" scoped>
.create_container{
  background-color: #fff;
  padding: 20px;
  .status{
    display: flex;
    align-items: center;
    .remark{
      max-width: 200px;
      margin-left: 10px;
      color: var(--el-color-error);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &_tabs{
    padding-bottom: 20px;
  }
}
</style>
