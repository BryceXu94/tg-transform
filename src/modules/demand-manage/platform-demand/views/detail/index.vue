<template>
  <div class="detail-container demand-detail">
    <div class="demand-detail__header">
      <detail-title
        title="查看需求详情"
      >
        <template #status>
          <el-tag
            :class="{
              'margin-left-10': true,
              'el-tag--success': demandDetail?.demandState === DEMAND_STATE_ENUM.COMPLETED,
            }"
          >
            {{
              $filters.getEnumLabel(
                DEMAND_STATE_LIST,
                demandDetail?.demandState === DEMAND_STATE_ENUM.IN_PROGRESS ?
                  demandDetail?.subState : demandDetail?.demandState
              )
            }}
          </el-tag>
          <el-tag
            :class="{
              'margin-left-10': true,
              'el-tag--success': demandDetail.isFirstOrder === ORDER_TYPE_ENUM.FIRST_ORDER,
              'el-tag--warning': demandDetail.isFirstOrder === ORDER_TYPE_ENUM.RETURN_ORDER,
            }"
            v-if="demandDetail?.isFirstOrder"
          >{{ $filters.getEnumLabel(ORDER_TYPE_LIST, demandDetail.isFirstOrder)}}</el-tag>
        </template>
        <div class="demand-detail__btn">
          <!-- 图片形式 -->
          <el-button
            v-if="CAN_VIEW_CONTRACT && contractPictureList?.length"
            type="primary"
            class="view_contract"
            :loading="!contractImageLoaded"
          >
            查看合同
            <el-image
              :src="demandDetail.contractList[0].url"
              :preview-src-list="demandDetail.contractList.map(item => item.url)"
              fit="cover"
              class="view_contract_image"
              preview-teleported
              @load="onContractImageLoad"
            >
            </el-image>
          </el-button>
          <!-- pdf形式 -->
          <el-button
            v-if="CAN_VIEW_CONTRACT && contractPdfList?.length"
            type="primary"
            @click="handlePreview"
          >
            查看合同
          </el-button>
          <el-button
            v-if="CAN_DOWNLOAD_BILLFILE && demandDetail?.billId"
            @click="handleDownloadBillfile"
            type="primary"
          >下载对账单</el-button>
          <el-button
            v-if="CAN_UPDATE && demandDetail.demandState === DEMAND_STATE_ENUM.DEMAND_TO_BE_CONFIRMED"
            @click="handleUpdateDemand"
            type="primary"
          >修改需求</el-button>

          <el-button @click="goToList">返回列表</el-button>
          <el-button v-if="CAN_VIEW_LOG" @click="handleLog">操作日志</el-button>
        </div>
      </detail-title>
    </div>
    <div class="demand-detail__content">
      <el-row class="padding-top-10 padding-left-10">
        <el-image
          style="width: 80px; height: 80px"
          class="margin-right-20"
          :src="demandDetail.customerPictures[0]"
          :preview-src-list="demandDetail.customerPictures"
          fit="cover"
          v-if="demandDetail?.customerPictures?.length"
        ></el-image>
        <el-descriptions class="flex-1">
          <el-descriptions-item label="需求单号" width="33.33%">{{ demandDetail?.demandCode }}</el-descriptions-item>
          <el-descriptions-item label="客户名称" width="33.33%">{{ demandDetail?.customerName }}</el-descriptions-item>
          <el-descriptions-item label="所属区域" width="33.33%">{{ demandDetail?.regionName }}</el-descriptions-item>
          <el-descriptions-item label="联系人">
            <encryption
              style="display: inline-flex"
              v-if="demandDetail.demandId"
              :data="{
                businessId: demandDetail.demandId,
                dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
                content: demandDetail?.contactName,
                dateColumn: 'contactName',
              }"
            ></encryption>
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            <encryption
              style="display: inline-flex"
              v-if="demandDetail.demandId"
              :data="{
                businessId: demandDetail.demandId,
                dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
                content: demandDetail?.contactPhone,
                dateColumn: 'contactPhone',
              }"
            ></encryption>
          </el-descriptions-item>
          <el-descriptions-item label="联系邮箱">{{ demandDetail?.contactEmail }}</el-descriptions-item>
          <el-descriptions-item label="销售BD">{{ demandDetail?.bdName }}</el-descriptions-item>
        </el-descriptions>
      </el-row>
      <el-divider />
      <div class="padding-left-10">
        <el-descriptions>
          <el-descriptions-item label="款号SPU" width="33.33%">
            {{ demandDetail?.styleCode }}
            <el-tag
              :class="{
                'margin-left-5': true,
                'el-tag--success': demandDetail.styleType === DEMAND_TYPE_ENUM.PLATFORM_BUSINESS,
              }"
              v-if="demandDetail?.styleType"
            >{{ $filters.getEnumLabel(DEMAND_TYPE_LIST, demandDetail.styleType) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="款式类别" width="33.33%">{{ demandDetail?.categoryName }}</el-descriptions-item>
          <el-descriptions-item label="订单总数量" width="33.33%">{{ demandDetail?.quantity }}件</el-descriptions-item>
          <el-descriptions-item label="客户款号">{{ demandDetail?.customerStyleCode }}</el-descriptions-item>
          <el-descriptions-item label="码数标准">{{ demandDetail?.sizeTypeName }}</el-descriptions-item>
          <el-descriptions-item label="预计成交额">{{ demandDetail?.preTotalAmount }}元</el-descriptions-item>
          <el-descriptions-item label="品质要求">
            {{ $filters.getEnumLabel(qualityRequirement, demandDetail?.qualityRequireCode) }}
          </el-descriptions-item>
          <el-descriptions-item label="客户品牌">{{ demandDetail?.brandName }}</el-descriptions-item>
        </el-descriptions>
        <custom-table
          border
          :stripe="false"
          :data="demandDetail.skcList"
          :columns="detailRenderColumns(sizeStandard)"
          v-if="demandDetail?.skcList?.length"
        />
      </div>
      <el-divider />
      <el-descriptions class="padding-left-10">
        <el-descriptions-item label="期望交期" width="33.33%">
          {{ $filters.formatTime(demandDetail?.expectDeliveryDate || '', 'YYYY-MM-DD') }}
        </el-descriptions-item>
        <el-descriptions-item label="收货人" width="33.33%">
          <encryption
            style="display: inline-flex"
            v-if="demandDetail.demandId"
            :data="{
              businessId: demandDetail.demandId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
              content: demandDetail?.receiver,
              dateColumn: 'receiver',
            }"
          ></encryption>
        </el-descriptions-item>
        <el-descriptions-item label="收货电话" width="33.33%">
          <encryption
            style="display: inline-flex"
            v-if="demandDetail.demandId"
            :data="{
              businessId: demandDetail.demandId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
              content: demandDetail?.receiptPhone,
              dateColumn: 'receiptPhone',
            }"
          ></encryption>
        </el-descriptions-item>
        <el-descriptions-item label="所在地区" span="1">
          <encryption
            style="display: inline-flex"
            v-if="demandDetail.demandId"
            :data="{
              businessId: demandDetail.demandId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.ADDRESS,
              content: [demandDetail?.receiptRegion],
              prefix: `${demandDetail?.receiptProvince}${demandDetail?.receiptCity}`,
              dateColumn: ['receiptRegion'],
            }"
          ></encryption>
        </el-descriptions-item>
        <el-descriptions-item label="详细地址" span="2">
          <encryption
            style="display: inline-flex"
            v-if="demandDetail.demandId"
            :data="{
              businessId: demandDetail.demandId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.ADDRESS,
              content: [demandDetail?.receiptAddressDetail],
              dateColumn: ['receiptAddressDetail'],
            }"
          ></encryption>
        </el-descriptions-item>
        <el-descriptions-item label="备注信息" span="3">{{ demandDetail?.remark }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <operation-drawer
      title="操作日志"
      v-model="visibleLog"
      :request="getDemandLogsApi"
      :requestParams="logParams"
      :config="logConfig"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { exportByBlob } from '@/core/utils/file-download';
import { useDictionary } from '@/hooks/use-dictionary/';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import {
  getEncryptDemandDetailApi,
  getDemandLogsApi,
  billDownloadApi,
} from '@/modules/demand-manage/platform-demand/api';
import {
  IDemandDetailRes,
} from '@/modules/demand-manage/platform-demand/api/types';
import {
  DEMAND_STATE_ENUM,
  DEMAND_STATE_LIST,
  DEMAND_TYPE_ENUM,
  DEMAND_TYPE_LIST,
  ORDER_TYPE_ENUM,
  ORDER_TYPE_LIST,
} from '@/modules/demand-manage/platform-demand/constant';
import { DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant';
import CustomTable from '@/components/custom-table';
import { detailRenderColumns } from './composables/tableData';
import OperationDrawer from '@/components/operation-drawer/index.vue';
import { usePermissionConfig } from '@/modules/demand-manage/platform-demand/use-permission-config';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'DemandManagePlatformDemandDetail',
  components: {
    CustomTable,
    OperationDrawer,
  },
  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const demandId = $route.params.id as string;

    const demandDetail = ref({} as IDemandDetailRes);
    const sizeStandard = ref<string[]>([]);

    const { getDictionaryOptions } = useDictionary();
    const qualityRequirement = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.QUALITY_REQUIREMENT) || [];
    });

    const calculateSizeStandard = () => {
      sizeStandard.value = [...new Set(demandDetail.value.skcList.map(skc => skc.skuList.map(sku => sku.size)).flat())];
    };

    const getDemandDetail = async () => {
      const res = await getEncryptDemandDetailApi(demandId);
      demandDetail.value = res?.data;

      calculateSizeStandard();
    };
    getDemandDetail();

    // 权限
    const {
      CAN_UPDATE,
      CAN_VIEW_LOG,
      CAN_VIEW_CONTRACT,
      CAN_DOWNLOAD_BILLFILE,
    } = usePermissionConfig();

    // 下载对账单
    const handleDownloadBillfile = async () => {
      const { data: billFileList } = await billDownloadApi(demandDetail.value.billId);
      if (!billFileList?.length) {
        ElMessage.warning('暂无对账单~');
        return;
      }
      await Promise.all(
        billFileList.map((item) => {
          return exportByBlob({
            method: 'get',
            url: item.url,
            filename: item.fileName,
            loading: true,
          });
        }),
      );
    };

    // 修改需求
    const handleUpdateDemand = () => {
      $router.push({
        name: 'DemandManagePlatformDemandUpdate',
        params: {
          id: demandId,
        },
      });
    };

    // 操作日志
    const visibleLog = ref(false);
    const logParams = ref(demandId);
    const handleLog = () => {
      visibleLog.value = true;
    };

    // 返回列表
    const goToList = () => {
      // $router.back();
      $router.push({
        name: 'DemandManagePlatformDemandList',
      });
    };

    const contractImageLoaded = ref(false);
    const onContractImageLoad = () => {
      contractImageLoaded.value = true;
    };

    // 合同格式（图片形式）
    const contractPictureList = computed(() => {
      return demandDetail.value?.contractList?.filter((item) => {
        const { length } = item.url.split('.');
        return ['png', 'jpg', 'jpeg'].includes(item.url?.split('.')?.[length - 1]);
      });
    });

    // 合同格式（pdf形式）
    const contractPdfList = computed(() => {
      return demandDetail.value?.contractList?.filter((item) => {
        const { length } = item.url.split('.');
        return item.url.split('.')?.[length - 1] === 'pdf';
      });
    });
    const handlePreview = () => {
      if (contractPdfList.value.length > 0) {
        contractPdfList.value.forEach((item) => {
          window.open(`${item.url}?response-content-type=application/pdf`);
        });
      }
    };

    return {
      demandDetail,
      contractPdfList,
      contractPictureList,
      qualityRequirement,
      visibleLog,
      logParams,
      logConfig: {
        timeKey: 'createdTime',
        userKey: 'creatorName',
        constKey: 'content',
      },
      DEMAND_STATE_ENUM,
      DEMAND_STATE_LIST,
      DEMAND_TYPE_ENUM,
      DEMAND_TYPE_LIST,
      ORDER_TYPE_ENUM,
      ORDER_TYPE_LIST,
      DESENSITIZE_DECRYPT_TYPE_ENUM,
      // 权限
      CAN_UPDATE,
      CAN_VIEW_LOG,
      CAN_VIEW_CONTRACT,
      CAN_DOWNLOAD_BILLFILE,

      handleDownloadBillfile,
      handleUpdateDemand,
      handleLog,
      goToList,
      sizeStandard,
      detailRenderColumns,
      getDemandLogsApi,
      contractImageLoaded,
      onContractImageLoad,
      handlePreview,
    };
  },
});
</script>

<style lang="scss" scoped>
.demand-detail {
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
  :deep(.el-descriptions__label) {
    min-width: 70px;
    display: inline-block;
    text-align: right;
  }
  .view_contract {
    position: relative;
    overflow: hidden;
    &_image {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }
}
</style>
