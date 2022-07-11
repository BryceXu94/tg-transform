<template>
  <div class="examine-info">
    <div class="examine-info__title margin-bottom-10">档案审核记录</div>
    <div class="examine-info__content">
      <el-timeline v-if="auditList.length && CAN_VIEW_AUDIT_RECORD">
        <el-timeline-item
          v-for="(item, index) in auditList"
          :key="index"
          placement="top"
          :color="index === 0 ? '#0499ff' : '#cccccc'"
          :hide-timestamp="true"
        >
          <div class="line-height-20">
            <div class="timestamp">
              {{item.operationTime}}--{{item.operationName}}
              <el-button
                v-if="
                  CAN_TRANSFER_REVIEW
                    && item.auditProcessState === ARCHIVES_AUDIT_STATE.WAIT
                    && [AUDIT_MESSAGE_ENUM.BDM_AUDIT, AUDIT_MESSAGE_ENUM.CM_AUDIT].includes(item.message)
                "
                type="text"
                class="margin-left-10"
                style="height: 13px; font-size: 13px;"
                @click="handleTransfer(item)"
              >
                转交审核人
              </el-button>
            </div>
            <div
              v-if="item.message"
              style="line-height: 1.5em;"
              class="margin-top-5"
            >
              {{item?.messageInfo}}
            </div>
            <div
              v-if="item.remark"
              style="line-height: 1.5em;"
              class="margin-top-5"
            >
              备注信息：
              <div class="margin-top-10">
                <span class="examine-info__remark">{{item.remark}}</span>
              </div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
      <empty v-else />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed, inject } from 'vue';

import TransferReviewDialog from '../transfer-review-dialog.vue';

import { handleOpenDialog } from '@/hooks/use-dialog';
import { filters } from '@/core/plugins/filter';
import { IAuditProcessAuditListRes } from '@/modules/customer-manage/customer-manage/api/types';
import {
  ARCHIVES_AUDIT_STATE,
  AUDIT_MESSAGE_ENUM,
  TABS_ENUM,
} from '@/modules/customer-manage/customer-manage/constant';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<IAuditProcessAuditListRes[]>,
      default: () => [],
    },
  },
  setup(props) {
    const handleRefresh = inject<(item: TABS_ENUM) => void>('handleRefresh');

    // 审核信息
    const auditList = computed(() => {
      return props.data?.map((item) => {
        item.operationTime = filters.formatTime(item.operationTime);
        item.operationName = item.operationName ? item.operationName : '';
        return item;
      });
    });

    // 转交审核人
    const handleTransfer = (item: IAuditProcessAuditListRes) => {
      handleOpenDialog(TransferReviewDialog, {
        detailId: item.detailId,
        originUserId: item.operationId,
        success: () => {
          handleRefresh?.(TABS_ENUM.TAB_EXAMINE);
        },
      });
    };

    // 权限
    const {
      CAN_VIEW_AUDIT_RECORD,
      CAN_TRANSFER_REVIEW,
    } = usePermissionConfig();

    return {
      auditList,
      ARCHIVES_AUDIT_STATE,
      AUDIT_MESSAGE_ENUM,
      CAN_VIEW_AUDIT_RECORD,
      CAN_TRANSFER_REVIEW,
      handleTransfer,
    };
  },
});
</script>

<style lang="scss" scoped>
.examine-info {
  border: 1px solid #eee;
  margin-bottom: 10px;
  padding: 15px 10px;
  .timestamp {
    display: flex;
    align-items: center;
    color: var(--el-text-color-secondary);
    line-height: 1;
    font-size: var(--el-font-size-small);
    margin-bottom: 8px;
    padding-top: 4px;
  }
  &__title {
    display: flex;
    align-items: center;
    position: relative;
    font-weight: bold;
    padding-left: 10px;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 3px;
      height: 16px;
      background-color: var(--el-color-primary);
      transform: translateY(-50%);
    }
  }
  &__content {
    padding: 20px 50px;
  }
  &__remark {
   background-color: rgba(248, 248, 248, 1);
   display: inline-block;
   padding: 5px 10px;
  }
}
</style>
