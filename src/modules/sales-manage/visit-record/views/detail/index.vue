<template>
  <div class="detail-container visit-detail" :model="visitdetailInfo">
    <detail-title
      title="拜访信息"
      class="visit-detail__header"
    >
      <template #status>
        <el-tag
          v-if="!isStrangerVisitType && visitdetailInfo.isAbnormal===ABNORMAL_STATE_ENUM.WITH"
          :class="{
            'visit-detail__status': true,
            'el-tag--danger': true
          }"
        >异常</el-tag>
      </template>
      <template #default>
        <el-button @click="handleBack">返回列表</el-button>
        <el-button
          type="primary"
          v-if="CAN_VIEW_LOG"
          @click="handleLog"
        >操作日志</el-button>
      </template>
    </detail-title>
    <div class="visit-info">
      <div class="visit-info__content">
        <el-form
          label-width="100px"
        >
          <responsive-row
            :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
          >
            <el-form-item
              label="客户名称："
            >
              {{ visitdetailInfo?.customerName }}
              <status-label
                :value="isStrangerVisitType ? VISIT_TYPE_ENUM.STRANGER_VISIT : visitdetailInfo?.customerType"
                :options="CUSTOMER_TYPE_LIST"
                mode="tag"
                class="margin-left-10"
              />
            </el-form-item>
            <el-form-item
              label="参考地址："
            >{{ !isStrangerVisitType ? visitdetailInfo?.referenceAddress : '-' }}</el-form-item>
          </responsive-row>
          <responsive-row
            :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
          >
            <el-form-item
              label="客户编码："
            >{{ !isStrangerVisitType ? visitdetailInfo?.customerCode : '-' }}</el-form-item>
            <el-form-item
              label="拜访类型："
            >{{ $filters.getEnumLabel(VISIT_TYPE_LIST, visitdetailInfo?.visitType) }}</el-form-item>
          </responsive-row>
          <responsive-row
            :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
          >
            <el-form-item
              label="签到时间："
            >{{ formatTime(visitdetailInfo?.clockTime) }}</el-form-item>
            <el-form-item
              label="签到位置："
            >{{ visitdetailInfo?.clockAddress }}</el-form-item>
          </responsive-row>
          <el-form-item
            label="签到图片："
          >
            <el-image
              style="width: 100px; height: 100px"
              v-for="(item,key) in visitdetailInfo?.clockPictureList"
              :src="item"
              :preview-src-list="visitdetailInfo?.clockPictureList"
              :key="key"
              :initial-index="key"
            ></el-image>
          </el-form-item>
          <responsive-row
            :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
          >
            <el-form-item
              label="联系人："
            >{{ contactVosInfo.contactName }}</el-form-item>
            <el-form-item
              label="联系电话："
            >{{ contactVosInfo.phone }}</el-form-item>
            <el-form-item
              label="所属职务："
            >{{ $filters.getEnumLabel(POST_NAME_OPTIONS, contactVosInfo.post) }}</el-form-item>
            <el-form-item
              label="联系微信："
            >{{ contactVosInfo.wechatNumber }}</el-form-item>
          </responsive-row>
          <el-form-item
            label="陪访人员："
          ><span
            v-for="(item,key) in visitdetailInfo?.accompanyingVos"
            :key="key"
            class="margin-right-10"
          >
            {{item.personName}}[{{item.personCode}}]</span></el-form-item>
          <el-form-item
            label="拜访总结："
          >
            <el-col
              v-for="item in visitdetailInfo.summaryVos"
              :key="item.summaryId"
            >
              {{item.summaryTypeName}}：{{item.summaryContent}}
            </el-col>
          </el-form-item>
          <el-form-item
            label="拜访照片："
          >
            <el-image
              style="width: 100px; height: 100px"
              v-for="(item,key) in visitdetailInfo?.visitPictureList"
              :src="item"
              :preview-src-list="visitdetailInfo?.visitPictureList"
              :key="key"
              :initial-index="key"
            ></el-image>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <detail-title title="异常反馈" />
    <div class="abnormal-info">
      <div class="abnormal-info__content">
        <el-form
          label-width="100px"
        >
          <el-form-item
            label="异常反馈："
          >{{visitdetailInfo?.customerVisitFeedbackVo?.feedbackContent}}</el-form-item>
          <el-form-item
            label="图片凭证："
          >
            <el-image
              v-for="(item,key) in visitdetailInfo?.feedbackPictureList"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="visitdetailInfo?.feedbackPictureList"
              :key="key"
              :initial-index="key"
            ></el-image>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <operation-drawer
      title="操作日志"
      v-model="visibleLog"
      :request="getSalesLogsApi"
      :requestParams="logParams"
      :config="logConfig"
    />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { formatTime } from '@tiangong/utils';
import { useRoute, useRouter } from 'vue-router';
import { getVisitPersonInfoApi, getSalesLogsApi } from '@/modules/sales-manage/visit-record/api';
import {
  ABNORMAL_STATE_ENUM,
  ABNORMAL_STATE_LIST,
  OPERATION_LOG_TYPE_LIST,
  VISIT_TYPE_LIST,
  CUSTOMER_TYPE_LIST,
  VISIT_TYPE_ENUM,
} from '../../constant/index';
import { ICustomerVisitDetailRes } from '@/modules/sales-manage/visit-record/api/types';
import OperationDrawer from '@/components/operation-drawer/index.vue';
import { usePermissionConfig } from '../../use-permission-config';
import { useDictionary } from '@/hooks/use-dictionary';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';

export default defineComponent({
  components: {
    OperationDrawer,
  },
  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const {
      CAN_VIEW_LOG,
    } = usePermissionConfig();

    const { getDictionaryOptions } = useDictionary();
    const POST_NAME_OPTIONS = computed(() => getDictionaryOptions(CX_DICTIONARY_KEY.POST_NAME));

    const visibleLog = ref(false); // 操作日志显隐
    const logParams = ref({
      buzId: $route.params.id as string,
    });
    // 查看操作记录
    const handleLog = () => {
      visibleLog.value = true;
    };
    // 获取拜访详情
    const visitdetailInfo = ref({} as ICustomerVisitDetailRes);
    const contactVosInfo = computed(() => {
      if (visitdetailInfo.value.contactVos?.length) {
        return visitdetailInfo.value.contactVos[0];
      }
      return {
        contactName: '',
        phone: '',
        post: '',
        wechatNumber: '',
      };
    });
    const getVisitDetailInfo = async () => {
      try {
        const { data } = await getVisitPersonInfoApi({
          visitId: $route.params.id as string,
        });
        visitdetailInfo.value = data;
        logParams.value.buzId = $route.params.id as string;
      } catch (error) {
        console.log(error);
      }
    };
    // 返回列表
    const handleBack = () => {
      $router.push({
        name: 'SalesManageVisitRecordList',
      });
    };

    watch(() => $route?.params?.id, () => {
      if ($route?.params?.id) {
        getVisitDetailInfo();
      }
    }, { immediate: true });

    // 上门陌拜
    const isStrangerVisitType = computed(() => visitdetailInfo.value.visitType === VISIT_TYPE_ENUM.STRANGER_VISIT);

    return {
      CAN_VIEW_LOG,
      ABNORMAL_STATE_ENUM,
      ABNORMAL_STATE_LIST,
      VISIT_TYPE_LIST,
      CUSTOMER_TYPE_LIST,
      VISIT_TYPE_ENUM,
      isStrangerVisitType,
      visibleLog,
      visitdetailInfo,
      contactVosInfo,
      formatTime,
      logParams,
      handleLog,
      handleBack,
      getSalesLogsApi,
      logConfig: {
        timeKey: 'createdTime',
        userKey: 'creatorName',
        remarkKey: '',
        contentKey: 'logType',
        operateList: OPERATION_LOG_TYPE_LIST,
      },
      POST_NAME_OPTIONS,
    };
  },
});
</script>
<style lang="scss" scoped>
.visit-detail {
  padding: 20px 20px 30px;
  &__header {
    position: relative;
  }
  &__status {
    position: absolute;
    top: 5px;
    left: 80px;
  }
}
.visit-info,.abnormal-info {
  border: 1px solid #eee;
  margin-bottom: 10px;
  padding: 15px 10px 0px;
  &__content {
    padding: 20px;
  }
  .el-image{
  margin-right: 10px;
  }
}

</style>
