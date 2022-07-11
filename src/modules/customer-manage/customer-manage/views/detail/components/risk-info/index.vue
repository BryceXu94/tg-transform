<template>
  <div class="risk-info">
    <div class="risk-info__title flex flex-justify-between flex-align-center">
      <span>风险信息</span>
      <el-button
        v-if="CAN_UPDATE_SYK_EYE_CHECK"
        type="success"
        @click="skyEyeCheck.visible = true"
      >更新天眼查</el-button>
    </div>
    <!-- 合作风险 -->
    <div v-if="CAN_VIEW_RISK_DATA">
      <div class="risk-info__content">
        <ul class="content-row">
          <li>
            <span class="label">自身风险总量</span>
            <span class="tag">{{riskInfo?.selfRiskCount}}条</span>
          </li>
          <li>
            <span class="label">周边风险总量</span>
            <span class="tag">{{riskInfo?.aroundRiskCount}}条</span>
          </li>
          <li>
            <span class="label">历史风险总量</span>
            <span class="tag">{{riskInfo?.historyRiskCount}}条</span>
          </li>
          <li>
            <span class="label">预警提醒总量</span>
            <span class="tag">{{riskInfo?.earlyWarningRiskCount}}条</span>
          </li>
        </ul>
        <ul class="content-row">
          <li>
            <span class="label">法律诉讼总量</span>
            <span class="tag">{{riskInfo?.lawsuitCount}}条</span>
          </li>
          <li>
            <span class="label">失信被执行总量</span>
            <span class="tag">{{riskInfo?.zhixingCount}}条</span>
          </li>
          <li>
            <span class="label">限制消费令总量</span>
            <span class="tag">{{riskInfo?.consumptionRestrictionCount}}条</span>
          </li>
        </ul>
      </div>
      <div class="margin-top-20 padding-10">
        <el-form>
          <el-form-item label="风险截图附件：">
            <el-image
              v-for="item in riskInfo?.fileReqList"
              :key="item"
              style="width: 100px; height: 100px"
              class="margin-right-15"
              :src="item.url"
              :preview-src-list="riskInfo?.fileReqList.map(item => item.url)"
            >
            </el-image>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <empty v-else />
  </div>
  <!-- 跟新天眼查 -->
  <submit-tips-dialog
    title="更新天眼查"
    v-model:visible="skyEyeCheck.visible"
    @success="upDateSkyEyeCheck"
  >
    <div>客户全称：{{customerName}}</div>
    <div>提交则视为触发天眼查系统对接更新客户档案信息</div>
  </submit-tips-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, computed, PropType } from 'vue';
import { useRoute } from 'vue-router';

import {
  renderColumns,
} from './composables/tableData';
import { ElMessage } from 'element-plus';
import {
  updateCustomerRiskInfoApi,
} from '@/modules/customer-manage/customer-manage/api';
import { IDetailRiskInfoRes } from '@/modules/customer-manage/customer-manage/api/types';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  emits: ['success'],
  props: {
    data: {
      type: Object as PropType<IDetailRiskInfoRes>,
      default: () => {},
    },
    customerName: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const $route = useRoute();
    const customerId = $route.params.id as string;

    // 风险信息
    const riskInfo = computed(() => props.data);

    // 更新天眼查
    const skyEyeCheck = reactive({
      visible: false,
      content: '',
    });

    const upDateSkyEyeCheck = async () => {
      try {
        await updateCustomerRiskInfoApi(customerId);
        ElMessage.success('操作成功！');
        useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
        emit('success');
      } catch (e) {
        console.log(e);
      }
    };

    // 权限
    const {
      CAN_VIEW_RISK_DATA,
      CAN_UPDATE_SYK_EYE_CHECK,
    } = usePermissionConfig();

    return {
      skyEyeCheck,
      riskInfo,
      CAN_VIEW_RISK_DATA,
      CAN_UPDATE_SYK_EYE_CHECK,

      upDateSkyEyeCheck,
      renderColumns,
    };
  },
});
</script>

<style lang="scss" scoped>
.risk-info {
  border: 1px solid #eee;
  margin-bottom: 10px;
  padding: 15px 10px;
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
    border: 1px solid #eee;
    margin-top: 20px;
    .content-row {
      padding: 15px 10px;
      border-bottom: 1px solid #eee;
      li {
        display: inline-block;
        margin-right: 30px;
        margin: 10px 0px;
        .label {
          display: inline-block;
          width: 160px;
          text-align: right;
        }
        .tag {
          display: inline-block;
          padding: 10px 30px;
          margin-left: 15px;
          border: 1px solid rgba(245, 86, 86, 1);
          color: #F55656;
          background-color: rgba(253, 238, 237, 1);
          border-radius: 3px;
        }
      }
    }
    .content-row:last-of-type {
      border-bottom: none;
    }
  }
}
</style>
