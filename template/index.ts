import { defineComponent, ref, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import BasicInfo from './components/basic-info/index.vue';
import OperateInfo from './components/operate-info/index.vue';
import RelationshipInfo from './components/relationship-info/index.vue';
import PaymentInfo from './components/payment-info/index.vue';
import RiskInfo from './components/risk-info/index.vue';
import InformationInfo from './components/information-info/index.vue';
import SystemInfo from './components/system-info/index.vue';
import ExamineInfo from './components/examine-info/index.vue';
import RecordsAudit from './components/records-audit-dialog.vue';
import { handleOpenDialog } from '@/hooks/use-dialog';

import {
  getEncryptCustomerBasicInfoApi,
  getEncryptCustomerBusinessInfoApi,
  getEncryptCustomerContactsInfoApi,
  getEncryptCustomerAccountingInfoApi,
  getCustomerRiskInfoApi,
  getCustomerAuditInfoApi,
  getCustomerProfileInfoApi,
  getCustomerRelation,
  getCustomerCommonInfoApi,
  getOperationListApi,
} from '@/modules/customer-manage/customer-manage/api';
import {
  IDetailBaseInfoRes,
  IDetailBusinessInfoRes,
  IDetailContactsRes,
  IDetailAccountingPeriodRes,
  IDetailRiskInfoRes,
  IAuditProcessAuditListRes,
  IDetailProfileFilesRes,
  IGetCustomerRelationRes,
  IAuditProcessGetAuditInfoRes,
} from '@/modules/customer-manage/customer-manage/api/types';
import {
  CUSTOMER_STATUS_LIST,
  PROFILE_STATE_LIST,
  PROFILE_STATE_ENUM,
  TABS_ENUM,
  LOG_OPERATE_TYPE_LIST,
} from '@/modules/customer-manage/customer-manage/constant';
import { BUSINESS_MODE_ENUM } from '@/constant';
import OperationDrawer from '@/components/operation-drawer/index.vue';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';

export default defineComponent({
  components: {
    BasicInfo,
    OperateInfo,
    RelationshipInfo,
    PaymentInfo,
    RiskInfo,
    InformationInfo,
    SystemInfo,
    ExamineInfo,
    OperationDrawer,
  },
  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const customerId = $route.params.id as string;

    // tabs
    const activeTab = ref(TABS_ENUM.TAB_BASIC);

    // 业务类型
    const businessType = ref('');
    // 获取客户综合信息（头部）
    const commonInfo = ref({} as IAuditProcessGetAuditInfoRes);
    const getCommonInfo = async () => {
      const res = await getCustomerCommonInfoApi(customerId);
      commonInfo.value = res?.data;
      if (!businessType.value) {
        businessType.value = res?.data.businessType;
      }
    };

    // 权限
    const { CAN_AUDIT_ARCHIVES, CAN_VIEW_LOG } = usePermissionConfig();

    // 获取详情
    const basicInfo = ref({} as IDetailBaseInfoRes);
    const businessInfo = ref({} as IDetailBusinessInfoRes);
    const relationshipInfo = ref({} as IDetailContactsRes);
    const accountInfo = ref({} as IDetailAccountingPeriodRes);
    const riskInfo = ref({} as IDetailRiskInfoRes);
    const profileInfo = ref({} as IDetailProfileFilesRes);
    const relationInfo = ref<IGetCustomerRelationRes[]>([]);
    const auditInfo = ref([] as IAuditProcessAuditListRes[]);
    const queryFetch = (tab: TABS_ENUM) => {
      const queryObj: Record<TABS_ENUM, () => void> = {
        // 基本信息
        [TABS_ENUM.TAB_BASIC]: async () => {
          try {
            const res = await getEncryptCustomerBasicInfoApi(customerId);
            basicInfo.value = res?.data;
            businessType.value = res?.data?.businessType;
          } catch (e) {
            console.log(e);
          }
        },
        // 运营信息
        [TABS_ENUM.TAB_OPERATE]: async () => {
          try {
            const res = await getEncryptCustomerBusinessInfoApi(customerId);
            businessInfo.value = res?.data;
            businessType.value = res?.data?.businessType;
          } catch (e) {
            console.log(e);
          }
        },
        // 联系管理
        [TABS_ENUM.TAB_RELATIONSHIP]: async () => {
          try {
            const res = await getEncryptCustomerContactsInfoApi(customerId);
            relationshipInfo.value = res?.data;
            businessType.value = res?.data?.businessType;
          } catch (e) {
            console.log(e);
          }
        },
        // 货款帐期
        [TABS_ENUM.TAB_PAYMENT]: async () => {
          try {
            const res = await getEncryptCustomerAccountingInfoApi(customerId);
            accountInfo.value = res?.data;
            businessType.value = res?.data?.businessType;
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
        // 审核记录
        [TABS_ENUM.TAB_EXAMINE]: async () => {
          try {
            const res = await getCustomerAuditInfoApi(customerId);
            auditInfo.value = res?.data;
          } catch (e) {
            console.log(e);
          }
        },
      };
      getCommonInfo();
      if (queryObj[tab]) queryObj[tab]();
    };
    queryFetch(TABS_ENUM.TAB_BASIC);

    // 操作日志
    const visibleLog = ref(false);
    const logParams = ref({
      buzId: customerId,
    });
    const handleLog = () => {
      visibleLog.value = true;
    };

    // 返回列表
    const goToList = () => {
      $router.push({
        name: 'CustomerManageCustomerList',
      });
    };

    // 注册刷新事件
    provide<() => void>('handleRefresh', () => queryFetch(activeTab.value));

    return {
      activeTab,
      RecordsAudit,
      basicInfo, // 基本信息
      businessInfo, // 运营信息
      relationshipInfo, // 联系管理
      accountInfo, // 货款帐期
      riskInfo, // 风险信息
      profileInfo, // 资料文件
      relationInfo, // 关联管理
      auditInfo, // 审核信息
      commonInfo,
      visibleLog,
      logParams,
      logConfig: {
        timeKey: 'createdTime',
        userKey: 'creatorName',
        contentKey: 'logType',
        operateList: LOG_OPERATE_TYPE_LIST,
      },
      CUSTOMER_STATUS_LIST,
      PROFILE_STATE_LIST,
      PROFILE_STATE_ENUM,
      // 权限
      CAN_AUDIT_ARCHIVES,
      CAN_VIEW_LOG,
      businessType,
      BUSINESS_MODE_ENUM,

      queryFetch,
      handleLog,
      goToList,
      handleOpenDialog,
      getOperationListApi,
    };
  },
});