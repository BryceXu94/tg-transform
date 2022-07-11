<template>
  <div class="detail-container create-detail">
    <!-- 状态 -->
    <div class="create-detail__header" v-if="!isCreate">
      <detail-title
        title="查看客户信息"
      >
        <template #status>
          <el-tag class="margin-left-10">
            {{$filters.getEnumLabel(CUSTOMER_STATUS_LIST, commonInfo?.customerStateEnum)}}</el-tag>
          <el-tag type="warning" class="margin-left-10">
            {{$filters.getEnumLabel(PROFILE_STATE_LIST, commonInfo?.profileStateEnum)}}</el-tag>
          <span
            class="margin-left-10 header-tips"
            v-if="commonInfo?.remark"
          >备注信息：{{commonInfo?.remark}}</span>
        </template>
      </detail-title>
    </div>
    <!-- 操作按钮 -->
    <div class="create-detail__btn">
      <el-button @click="goToList">返回列表</el-button>
      <!-- 自营业务不等于审核通过 || 平台业务等于待提交 || 创建 -->
      <el-button
        v-if="(
          (PROFILE_STATE_ENUM.AUDIT_PASSED !== commonInfo?.profileStateEnum
            && businessType === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS)
          || (businessType === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS
            && [PROFILE_STATE_ENUM.WAIT_COMMIT, PROFILE_STATE_ENUM.WAIT_PROFILE_COMPLETE]
              .includes(commonInfo?.profileStateEnum))
        ) || isCreate && CAN_SAVE_AUDIT"
        type="primary"
        @click="handleSaveAudit"
      >提交审核</el-button>
    </div>
    <!-- tabs主体 自营 -->
    <div class="create-detail__content" v-if="businessType === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS">
      <el-tabs
        v-model="activeTab"
        :before-leave="handleChangeTabs"
      >
        <el-tab-pane label="基本信息" name="tab-basic">
          <basic-info
            :data="basicInfo"
            :encryptData="encryptBasicInfo"
            :state="commonInfo.profileStateEnum"
            ref="basic-info"
          />
        </el-tab-pane>
        <el-tab-pane label="运营信息" name="tab-operate">
          <operate-info
            :data="businessInfo"
            :encryptData="encryptBusinessInfo"
            :businessType="businessType"
            ref="operate-info"
          />
        </el-tab-pane>
        <el-tab-pane label="联系管理" name="tab-relationship">
          <relationship-info
            :data="relationshipInfo"
            :encryptData="encryptRelationshipInfo"
            ref="relationship-info"
            :businessType="businessType"
            :state="commonInfo.profileStateEnum"
          />
        </el-tab-pane>
        <el-tab-pane
          label="货款账期"
          name="tab-payment"
        >
          <payment-info
            :data="accountInfo"
            :encryptData="encryptAccountInfo"
            ref="payment-info"
          />
        </el-tab-pane>
        <el-tab-pane
          label="风险信息"
          name="tab-risk"
        >
          <risk-info
            :data="riskInfo"
            ref="risk-info"
          />
        </el-tab-pane>
        <el-tab-pane
          label="资料文件"
          name="tab-information"
        >
          <information-info
            :data="profileInfo"
            ref="information-info"
          />
        </el-tab-pane>
        <el-tab-pane
          label="主体关联"
          name="tab-system"
        >
          <system-info
            :data="relationInfo"
            :state="commonInfo.profileStateEnum"
            ref="system-info"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- tabs主体 平台 -->
    <div class="create-detail__content" v-if="businessType === BUSINESS_MODE_ENUM.PLATFORM_BUSINESS">
      <el-tabs
        v-model="activeTab"
        :before-leave="handleChangeTabs"
      >
        <el-tab-pane label="基本信息" name="tab-basic">
          <basic-info
            :data="basicInfo"
            :encryptData="encryptBasicInfo"
            :state="commonInfo.profileStateEnum"
            ref="basic-info"
          />
        </el-tab-pane>
        <el-tab-pane label="运营信息" name="tab-operate">
          <operate-info
            :data="businessInfo"
            :encryptData="encryptBusinessInfo"
            :businessType="businessType"
            ref="operate-info"
          />
        </el-tab-pane>
        <el-tab-pane label="联系管理" name="tab-relationship">
          <relationship-info
            :data="relationshipInfo"
            :encryptData="encryptRelationshipInfo"
            ref="relationship-info"
            :businessType="businessType"
            :state="commonInfo.profileStateEnum"
          />
        </el-tab-pane>
        <el-tab-pane
          label="货款账期"
          name="tab-payment"
        >
          <payment-info
            :data="accountInfo"
            :encryptData="encryptAccountInfo"
            ref="payment-info"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 提交审核 -->
    <submit-tips-dialog
      :content="audit.content"
      v-model:visible="audit.visible"
      @success="handleAuditSuccess"
    >
      <div>提交则会流入审批流程，是否继续确认？</div>
      <div>客户: {{commonInfo.customerName}}</div>
    </submit-tips-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  provide,
  computed,
  reactive,
  watch,
  getCurrentInstance,
  onMounted,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

import BasicInfo from './components/basic-info/index.vue';
import OperateInfo from './components/operate-info/index.vue';
import RelationshipInfo from './components/relationship-info/index.vue';
import PaymentInfo from './components/payment-info/index.vue';
import RiskInfo from './components/risk-info/index.vue';
import InformationInfo from './components/information-info/index.vue';
import SystemInfo from './components/system-info/index.vue';
import Audit from './components/audit-dialog.vue';
import { handleOpenDialog } from '@/hooks/use-dialog';

import {
  getCustomerBasicInfoApi,
  getEncryptCustomerBasicInfoApi,
  getCustomerBusinessInfoApi,
  getEncryptCustomerBusinessInfoApi,
  getCustomerContactsInfoApi,
  getEncryptCustomerContactsInfoApi,
  getCustomerAccountingInfoApi,
  getEncryptCustomerAccountingInfoApi,
  getCustomerRiskInfoApi,
  getCustomerProfileInfoApi,
  getCustomerCommonInfoApi,
  updateCustomerAuditInfoApi,
  getCustomerRelation,
} from '@/modules/customer-manage/customer-manage/api';
import {
  IDetailBaseInfoRes,
  IDetailBusinessInfoRes,
  IDetailContactsRes,
  IDetailAccountingPeriodRes,
  IDetailRiskInfoRes,
  IDetailProfileFilesRes,
  IAuditProcessGetAuditInfoRes,
  IGetCustomerRelationRes,
} from '@/modules/customer-manage/customer-manage/api/types';
import {
  PROFILE_STATE_ENUM,
  TABS_ENUM,
  PROFILE_STATE_LIST,
  CUSTOMER_STATUS_LIST,
} from '@/modules/customer-manage/customer-manage/constant';
import { BUSINESS_MODE_ENUM, BUSINESS_MODE_LIST } from '@/constant';
import { ElMessage, ElMessageBox } from 'element-plus';
import { usePermissionConfig } from '../../use-permission-config';
import { filters } from '@/core/plugins/filter';
import { useMenuStore } from '@/store/menu';

type IActiveTab = Exclude<TABS_ENUM, 'tab-examine'>;

export default defineComponent({
  components: {
    BasicInfo,
    OperateInfo,
    RelationshipInfo,
    PaymentInfo,
    RiskInfo,
    InformationInfo,
    SystemInfo,
  },
  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const customerId = $route.params.id as string;
    const routeName = $route.name;

    let queryActiveTab = $route.query.activeTab as IActiveTab;
    queryActiveTab = Object.values(TABS_ENUM).includes(queryActiveTab) ? queryActiveTab : TABS_ENUM.TAB_BASIC;

    // 区分新增还是编辑
    const isCreate = computed(() => {
      // customerCode存在就是创建
      return routeName === 'CustomerManageCreateCustomer';
    });
    const currentInstance = getCurrentInstance()!;
    // 权限
    const {
      CAN_SAVE_AUDIT,
      CAN_UPDATE_OTHER_DATA,
      CAN_UPDATE_SCALE_DATA,
      CAN_UPDATE_DELIVERY_ADDRESS,
      CAN_UPDATE_CONTACT_DATA,
      CAN_UPDATE_INVOICE_DATA,
      CAN_UPDATE_CARD_DATA,
    } = usePermissionConfig();

    const canGetDecryptCustomerBasicInfo = isCreate.value
      || CAN_UPDATE_OTHER_DATA.value || CAN_UPDATE_SCALE_DATA.value;
    const canGetDecryptCustomerBusinessInfo = isCreate.value || CAN_UPDATE_DELIVERY_ADDRESS.value;
    const canGetDecryptCustomerContactsInfo = isCreate.value || CAN_UPDATE_CONTACT_DATA.value;
    const canGetDecryptCustomerAccountingInfo = isCreate.value
      || CAN_UPDATE_INVOICE_DATA.value || CAN_UPDATE_CARD_DATA.value;

    // 获取客户综合信息（头部）
    // 业务类型
    const businessType = ref('');
    const commonInfo = ref({} as IAuditProcessGetAuditInfoRes);
    const getCommonInfo = async () => {
      const res = await getCustomerCommonInfoApi(customerId);
      commonInfo.value = res?.data;
      if (!businessType.value) {
        businessType.value = res?.data.businessType;
      }
    };

    // tabs
    const activeTab = ref<IActiveTab>(queryActiveTab);

    // 获取详情
    const basicInfo = ref({} as IDetailBaseInfoRes);
    const encryptBasicInfo = ref({} as IDetailBaseInfoRes);

    const businessInfo = ref({} as IDetailBusinessInfoRes);
    const encryptBusinessInfo = ref({} as IDetailBusinessInfoRes);
    const relationshipInfo = ref({} as IDetailContactsRes);
    const encryptRelationshipInfo = ref({} as IDetailContactsRes);
    const accountInfo = ref({} as IDetailAccountingPeriodRes);
    const encryptAccountInfo = ref({} as IDetailAccountingPeriodRes);
    const riskInfo = ref({} as IDetailRiskInfoRes);
    const profileInfo = ref({} as IDetailProfileFilesRes);
    const relationInfo = ref([] as IGetCustomerRelationRes[]);

    // 基本信息 处理时间回显
    const formatBasicInfo = () => {
      [basicInfo, encryptBasicInfo].forEach((data) => {
        if (!data.value.companyInfo) return;
        if (data.value.companyInfo.establishmentDate) {
          data.value.companyInfo.establishmentDate = filters.formatTime(
            data.value.companyInfo.establishmentDate, 'YYYY-MM-DD',
          );
        }
        if (data.value.companyInfo.approvalDate) {
          data.value.companyInfo.approvalDate = filters.formatTime(
            data.value.companyInfo.approvalDate, 'YYYY-MM-DD',
          );
        }

        if (!data.value.companyInfo.businessTermSince) {
          data.value.companyInfo.businessTermSince = filters.formatTime(253392422400000, 'YYYY-MM-DD');
        }
        if (!data.value.companyInfo.businessTermEnd) {
          data.value.companyInfo.businessTermEnd = filters.formatTime(253392422400000, 'YYYY-MM-DD');
        }

        if (data.value.companyInfo.businessTermSince) {
          data.value.companyInfo.businessTerm = [filters.formatTime(
            data.value.companyInfo.businessTermSince, 'YYYY-MM-DD',
          ),
          // 无限期253392422400000
          filters.formatTime(data.value.companyInfo.businessTermEnd, 'YYYY-MM-DD')];
        }

        if (data.value.companyInfo.businessType) {
          data.value.companyInfo.businessType = filters.getEnumLabel(
            BUSINESS_MODE_LIST, data.value.companyInfo.businessType,
          );
        }
      });
    };

    const queryFetch = async (tab: IActiveTab) => {
      const queryObj: Record<IActiveTab, () => void> = {
        // 基本信息
        [TABS_ENUM.TAB_BASIC]: async () => {
          try {
            // 先获取加密信息，再判断权限获取明文信息
            if (!isCreate.value) {
              const encryptRes = await getEncryptCustomerBasicInfoApi(customerId);
              encryptBasicInfo.value = encryptRes?.data;
              businessType.value = encryptRes?.data?.businessType;
            }
            if (canGetDecryptCustomerBasicInfo) {
              const res = await getCustomerBasicInfoApi(customerId);
              basicInfo.value = res?.data;
              businessType.value = res?.data?.businessType;
            }
            formatBasicInfo();
          } catch (e) {
            console.log(e);
          }
        },
        // 运营信息
        [TABS_ENUM.TAB_OPERATE]: async () => {
          try {
            if (!isCreate.value) {
              const encryptRes = await getEncryptCustomerBusinessInfoApi(customerId);
              encryptBusinessInfo.value = encryptRes?.data;
              businessType.value = encryptRes?.data?.businessType as string;
            }
            if (canGetDecryptCustomerBusinessInfo) {
              const res = await getCustomerBusinessInfoApi(customerId);
              businessInfo.value = res?.data;
              businessType.value = res?.data?.businessType as string;
            }
          } catch (e) {
            console.log(e);
          }
        },
        // 联系管理
        [TABS_ENUM.TAB_RELATIONSHIP]: async () => {
          try {
            if (!isCreate.value) {
              const encryptRes = await getEncryptCustomerContactsInfoApi(customerId);
              encryptRelationshipInfo.value = encryptRes?.data;
              businessType.value = encryptRes?.data?.businessType;
            }
            if (canGetDecryptCustomerContactsInfo) {
              const res = await getCustomerContactsInfoApi(customerId);
              relationshipInfo.value = res?.data;
              businessType.value = res?.data?.businessType;
            }
          } catch (e) {
            console.log(e);
          }
        },
        // 货款帐期
        [TABS_ENUM.TAB_PAYMENT]: async () => {
          try {
            if (!isCreate.value) {
              const encryptRes = await getEncryptCustomerAccountingInfoApi(customerId);
              encryptAccountInfo.value = encryptRes?.data;
              businessType.value = encryptRes?.data?.businessType;
            }
            if (canGetDecryptCustomerAccountingInfo) {
              const res = await getCustomerAccountingInfoApi(customerId);
              accountInfo.value = res?.data;
              businessType.value = res?.data?.businessType;
            }
          } catch (e) {
            console.log(e);
          }
        },
        // 风险信息
        [TABS_ENUM.TAB_RISK]: async () => {
          try {
            const res = await getCustomerRiskInfoApi(customerId);
            riskInfo.value = res?.data;
          } catch (e) {
            console.log(e);
          }
        },
        // 资料文件
        [TABS_ENUM.TAB_INFORMATION]: async () => {
          try {
            const res = await getCustomerProfileInfoApi(customerId);
            profileInfo.value = res?.data;
          } catch (e) {
            console.log(e);
          }
        },
        // 系统关联
        [TABS_ENUM.TAB_SYSTEM]: async () => {
          try {
            const res = await getCustomerRelation({ customerId });
            relationInfo.value = res?.data;
          } catch (e) {
            console.log(e);
          }
        },
      };
      if (queryObj[tab]) queryObj[tab]();
    };

    onMounted(async () => {
      await getCommonInfo();
    });

    watch(() => activeTab.value, async (val) => {
      queryFetch(val);
    }, { immediate: true });

    const handleTips = () => {
      return ElMessageBox.confirm(
        '当前内容还未保存，确定要切换?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        },
      );
    };
    const handleChangeTabs = async (tab: string, oldTab: TABS_ENUM) => {
      if (oldTab === TABS_ENUM.TAB_BASIC) {
        if (!(currentInstance.refs as typeof BasicInfo)?.['basic-info'].validateData()) {
          await handleTips();
        }
      }
      if (oldTab === TABS_ENUM.TAB_OPERATE) {
        if (!(currentInstance.refs as typeof OperateInfo)?.['operate-info'].validateData()) {
          await handleTips();
        }
      }
      if (oldTab === TABS_ENUM.TAB_RELATIONSHIP) {
        if (!(currentInstance.refs as typeof RelationshipInfo)?.['relationship-info'].validateData()) {
          await handleTips();
        }
      }
      if (oldTab === TABS_ENUM.TAB_PAYMENT) {
        if (!((currentInstance.refs as typeof PaymentInfo)?.['payment-info'].validateData())) {
          await handleTips();
        }
      }
      if (oldTab === TABS_ENUM.TAB_RISK) {
        if (!((currentInstance.refs as typeof RiskInfo)?.['risk-info'].validateData())) {
          await handleTips();
        }
      }
      if (oldTab === TABS_ENUM.TAB_INFORMATION) {
        if (!((currentInstance.refs as typeof InformationInfo)?.['information-info'].validateData())) {
          await handleTips();
        }
      }
      if (oldTab === TABS_ENUM.TAB_SYSTEM) {
        if (!((currentInstance.refs as typeof SystemInfo)?.['system-info'].validateData())) {
          await handleTips();
        }
      }
      return true;
    };

    // 注册刷新事件
    provide<() => void>('handleRefresh', () => queryFetch(activeTab.value));

    // 提交审核
    const audit = reactive({
      content: '',
      visible: false,
    });
    const handleSaveAudit = () => {
      console.log(commonInfo, 'commonInfo');
      // 档案状态待提交，证明没有走过审核流程
      if (isCreate.value
      || (['WAIT_COMMIT'].includes(commonInfo.value.profileStateEnum))) {
        handleOpenDialog(Audit, {
          params: {
            customerName: basicInfo.value?.companyInfo?.customerName,
            bdId: commonInfo.value?.ownerId,
            bdName: commonInfo.value?.ownerName,
            customerId,
          },
        });
      } else {
        audit.visible = true;
      }
    };
    const handleAuditSuccess = async () => {
      try {
        await updateCustomerAuditInfoApi({ businessId: customerId });
        ElMessage.success('操作成功！');
        useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
        $router.push({
          name: 'CustomerManageCustomerList',
        });
      } catch (e) {
        console.log(e);
      }
    };

    // 返回列表
    const goToList = () => {
      // 如果是创建，返回列表都要刷新
      if (isCreate.value) {
        useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
      }
      $router.push({
        name: 'CustomerManageCustomerList',
      });
    };

    return {
      activeTab,
      basicInfo, // 基本信息
      encryptBasicInfo,
      businessInfo, // 运营信息
      encryptBusinessInfo,
      relationshipInfo, // 联系管理
      encryptRelationshipInfo,
      accountInfo, // 货款帐期
      encryptAccountInfo,
      riskInfo, // 风险信息
      profileInfo, // 资料文件
      relationInfo, // 系统关联
      audit,
      isCreate,
      commonInfo,
      PROFILE_STATE_ENUM,
      PROFILE_STATE_LIST,
      CUSTOMER_STATUS_LIST,
      // 权限
      CAN_SAVE_AUDIT,
      businessType,
      BUSINESS_MODE_ENUM,

      handleChangeTabs,
      handleSaveAudit,
      goToList,
      handleAuditSuccess,
    };
  },
});
</script>

<style lang="scss" scoped>
.create-detail {
  &__header {
    padding: 0 20px;
    .header-tips {
      color: red;
      font-size: 12px;
    }
  }
  &__btn {
    position: absolute;
    right: 45px;
    z-index: 100;
  }
  &__content {
    padding: 0 20px;
  }
}
</style>
