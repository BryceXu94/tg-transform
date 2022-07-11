<template>
  <div class="detail-container container">
    <detail-title
      title="授信申请信息"
      :tips="!readOnly ? '审批流程已提前设置，若需变更请联系相关负责人进行变更处理' : ''"
    >
      <template
        v-if="readOnly && form.approvalState"
        #status
      >
        <el-tag
          :class="{
            'margin-left-10': true,
            'el-tag--success': form.approvalState === APPROVE_STATUS_ENUM.APPROVAL_PASS,
            'el-tag--danger': form.approvalState === APPROVE_STATUS_ENUM.APPROVAL_REFUSE
              || form.approvalState === APPROVE_STATUS_ENUM.APPROVAL_QUASH,
          }"
        >
          {{$filters.getEnumLabel(APPROVE_STATUS_LIST, form.approvalState ?? '')}}
        </el-tag>
      </template>
      <template #default>
        <el-button @click="handleBack">返回列表</el-button>
        <el-button
          v-if="readOnly
            && (
              (form.subjectType === CREDIT_SUBJECT_ENUM.CUSTOMER && CAN_RESUBMIT)
              || (form.subjectType === CREDIT_SUBJECT_ENUM.GROUP && CAN_RESUBMIT_GROUP)
            )
            && [APPROVE_STATUS_ENUM.APPROVAL_QUASH, APPROVE_STATUS_ENUM.APPROVAL_REFUSE].includes(form.approvalState!)
          "
          type="primary"
          plain
          @click="handleReSubmit"
        >
          重新提交
        </el-button>
        <el-button
          v-if="!readOnly"
          type="primary"
          @click="handleSubmit"
        >
          提交
        </el-button>
        <el-button
          v-if="readOnly
            && (
              (form.subjectType === CREDIT_SUBJECT_ENUM.CUSTOMER && CAN_REVOKE)
              || (form.subjectType === CREDIT_SUBJECT_ENUM.GROUP && CAN_REVOKE_GROUP)
            )
            && form.approvalState === APPROVE_STATUS_ENUM.APPROVAL_PROGRESS
          "
          type="danger"
          @click="handleRevoke"
        >
          撤销
        </el-button>
        <el-button
          v-if="readOnly && CAN_VIEW_PROGRESS"
          type="primary"
          @click="handleProgress"
        >
          审批进度
        </el-button>
      </template>
    </detail-title>
    <main-info
      ref="mainEl"
      v-model="form"
      :baseData="formData"
      :readOnly="readOnly"
      :currentBdData="currentBdData"
    />
    <tips-dialog
      v-model:visible="visibleTips"
      :action="tipsActionType"
      :data="form"
      :name="form.subjectType === CREDIT_SUBJECT_ENUM.GROUP ? form.groupName : form.customerName"
      :amount="form.applyAmount"
      :subjectType="form.subjectType"
      @success="handleFinishRevoke"
      @submit="handleConfirmSubmit"
    />
    <operation-drawer
      title="审批进度"
      v-model="visibleProgress"
      :isAscending="true"
      :request="progressRequestApi"
      :requestParams="progressRequestParams"
      :config="progressConfig"
    />
  </div>
</template>

<script lang="tsx">
import { defineComponent, ref, watch, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NP from 'number-precision';

import { ElMessage } from 'element-plus';
import OperationDrawer from '@/components/operation-drawer/index.vue';
import TipsDialog from '../../components/tips-dialog/index.vue';
import MainInfo from './components/main-info/index.vue';

import { useAccountStore } from '@/store/account';
import { useMenuStore } from '@/store/menu';
import { getUserRegionAndDepartment } from '@/api/global';
import { getGroupDetail } from '@/modules/customer-manage/group-manage/api';
import {
  createCreditApplication,
  getCreditApplicationDetail,
  getCreditApplicationProgress,
  getCreditApplicationDetailWithDecrypt,
  createGroupCreditApplication,
  getGroupCreditApplicationDetail,
  getGroupCreditApplicationDetailWithDecrypt,
  getGroupCreditApplicationProgress,
  getCustomerDataWithBdByCustomerId,
} from '../../api';
import { IGroupCreditApplicationSubjectItem } from '../../api/types';
import { IFile } from '@/components/upload/package/type';
import { CREDIT_SUBJECT_ROUTE_ENUM, CREDIT_SUBJECT_ENUM } from '@/constant';
import {
  TIPS_DIALOG_TYPE_ENUM,
  CREDIT_APPROVE_TYPE_ENUM,
  CREDIT_APPLY_TYPE_ENUM,
  APPROVE_STATUS_LIST,
  APPROVE_STATUS_ENUM,
  CREDIT_OPERATE_TYPE_LIST,
  TEMPLATE_TYPE_ENUM,
} from '../../constant';
import { usePermissionConfig } from '../../use-permission-config';
import { IFormData, ICurrentBdData } from './types';

export default defineComponent({
  components: {
    MainInfo,
    TipsDialog,
    OperationDrawer,
  },

  setup() {
    const {
      CAN_REVOKE,
      CAN_REVOKE_GROUP,
      CAN_VIEW_PROGRESS,
      CAN_RESUBMIT,
      CAN_RESUBMIT_GROUP,
    } = usePermissionConfig();
    const $route = useRoute();
    const $router = useRouter();
    const { account } = useAccountStore();
    const mainEl = ref<InstanceType<typeof MainInfo> | null>(null); // 表单实例
    const readOnly = ref(true); // 是否只读
    const visibleTips = ref(false); // 提示弹窗显隐
    const visibleProgress = ref(false); // 审批进度显隐
    const progressRequestParams = ref({
      creditApplyId: $route.params?.id as string,
    });
    const formData = {
      subjectType: CREDIT_SUBJECT_ENUM.CUSTOMER,
      bdId: '',
      departmentId: '',
      departmentName: '',
      customerId: '',
      customerName: '',
      regionCode: '',
      regionName: '',
      applyType: CREDIT_APPROVE_TYPE_ENUM.CREDIT,
      creditType: CREDIT_APPLY_TYPE_ENUM.FIRST,
      applyAmount: '',
      applyDesc: '',
      licenseList: [],
      customerProfilesList: [],
      scoringTableList: [],
      groupId: '',
      groupName: '',
      subjectInfoDtoList: [],
    };
    const form = ref<IFormData>({});
    const currentBdData = ref({} as ICurrentBdData); // 当前登陆BD信息
    // 提示弹窗类型
    const tipsActionType = computed(() => {
      return readOnly.value ? TIPS_DIALOG_TYPE_ENUM.REVOKE : TIPS_DIALOG_TYPE_ENUM.SUBMIT;
    });

    // 返回列表
    const handleBack = () => {
      $router.push({
        name: 'ApprovalManageCreditApplicationList',
      });
    };

    // 提交
    const handleSubmit = async () => {
      try {
        await mainEl.value?.validate();
        visibleTips.value = true;
      } catch (error) {
        console.log(error);
      }
    };

    const formatFiles = (data: IFile[]) => {
      return data.map(item => ({
        name: item.name ?? '',
        url: item.url,
      }));
    };

    // 提交确认
    const handleConfirmSubmit = async () => {
      try {
        if (form.value.subjectType === CREDIT_SUBJECT_ENUM.GROUP) {
          // 创建集团
          delete form.value.licenseList;
          delete form.value.customerProfilesList;
          delete form.value.scoringTableList;
          await createGroupCreditApplication({
            ...form.value,
            otherAttachmentList: formatFiles(form.value.otherAttachmentList ?? []),
            applyAmount: NP.times(form.value.applyAmount ?? 0, 10000),
            subjectInfoDtoList: form.value.subjectInfoDtoList?.map(item => ({
              ...item,
              licenseList: formatFiles(item.licenseList ?? []),
              customerProfilesList: formatFiles(item.customerProfilesList ?? []),
              scoringTableList: formatFiles(item.scoringTableList ?? []),
            })) ?? [],
          });
        } else {
          // 创建客户
          await createCreditApplication({
            ...form.value,
            licenseList: formatFiles(form.value.licenseList ?? []),
            customerProfilesList: formatFiles(form.value.customerProfilesList ?? []),
            scoringTableList: formatFiles(form.value.scoringTableList ?? []),
            otherAttachmentList: formatFiles(form.value.otherAttachmentList ?? []),
            applyAmount: NP.times(form.value.applyAmount ?? 0, 10000),
          });
        }
        ElMessage.success('操作成功');
        useMenuStore().deleteKeepAlive('ApprovalManageCreditApplicationList');
        handleBack();
      } catch (error) {
        console.log(error);
      }
    };

    // 撤销
    const handleRevoke = () => {
      visibleTips.value = true;
    };

    // 撤销成功
    const handleFinishRevoke = () => {
      ElMessage.success('操作成功');
      useMenuStore().deleteKeepAlive('ApprovalManageCreditApplicationList');
      handleBack();
    };

    // 查看审批进度
    const handleProgress = async () => {
      visibleProgress.value = true;
    };

    const initCustomer = () => {
      form.value = {
        ...formData,
        subjectType: CREDIT_SUBJECT_ENUM.CUSTOMER,
      };
    };
    const initGroup = () => {
      form.value = {
        ...formData,
        subjectType: CREDIT_SUBJECT_ENUM.GROUP,
      };
    };

    // 请求详情-客户
    const handleGetDetail = async () => {
      try {
        if ($route.name === 'ApprovalManageResubmitCreditApplication') {
          // 重新提交
          const { data: detail } = await getCreditApplicationDetailWithDecrypt({
            creditApplyId: $route.params?.id as string,
          });
          const { data } = await getCustomerDataWithBdByCustomerId({ id: detail?.crmCreditCustomer?.customerId });
          if (!mainEl.value?.canSelectCustomer(data)) {
            initCustomer();
            return;
          }
          let org;
          // 处理只有部门名称没有部门ID或部门不存在情况
          if (detail.departmentName || detail.departmentId) {
            org = data.bdOrgList.find(
              item => item.departmentId === detail.departmentId || item.departmentName === detail.departmentName,
            );
          }
          form.value = {
            ...detail,
            applyAmount: NP.divide(detail?.applyAmount, 10000),
            departmentId: org ? org?.departmentId : data.bdOrgList[0]?.departmentId ?? '',
            departmentName: org ? org?.departmentName : data.bdOrgList[0]?.departmentName ?? '',
            customerId: detail?.crmCreditCustomer?.customerId,
            customerName: detail?.crmCreditCustomer?.customerName,
            subjectType: CREDIT_SUBJECT_ENUM.CUSTOMER,
          };
          await nextTick();
          mainEl.value?.resetCreditData(data, CREDIT_SUBJECT_ENUM.CUSTOMER);
        } else {
          const { data } = await getCreditApplicationDetail({
            creditApplyId: $route.params?.id as string,
          });
          form.value = {
            ...data,
            customerId: data?.crmCreditCustomer?.customerId,
            customerName: data?.crmCreditCustomer?.customerName,
            subjectType: CREDIT_SUBJECT_ENUM.CUSTOMER,
          };
          progressRequestParams.value.creditApplyId = $route.params?.id as string;
        }
      } catch (error) {
        console.log(error);
        initCustomer();
      }
    };

    // 请求详情-集团
    const handleGetDetailGroup = async () => {
      try {
        if ($route.name === 'ApprovalManageResubmitCreditApplication') {
          // 重新提交
          if (!currentBdData.value?.regionCode) {
            ElMessage.error('当前操作人暂无区域信息，请前往绑定');
            initCustomer();
            return;
          }
          const { data: detail } = await getGroupCreditApplicationDetailWithDecrypt({
            creditApplyId: $route.params?.id as string,
          });
          const { data } = await getGroupDetail({ id: detail?.crmGroupCreditVo?.groupId as string });
          if (data.ifExistCustomerCredit) {
            ElMessage.error('当前集团关联客户已有授信记录，不支持进行集团申请');
            initGroup();
            return;
          }
          let subjects: IGroupCreditApplicationSubjectItem[] = mainEl.value?.formatSubjects(data.customerVoList) ?? [];
          if (!subjects.length) {
            ElMessage.error('当前集团未关联已启用客户，无法发起申请');
            initGroup();
            return;
          }
          subjects = subjects.map((item) => {
            const target = detail.subjectInfoDtoList?.find(sItem => sItem.customerId === item.customerId);
            return target || item;
          });
          let org;
          if (detail.departmentName || detail.departmentId) {
            org = currentBdData.value.bdOrgList.find(
              item => item.departmentId === detail.departmentId
                || item.departmentName === detail.departmentName,
            );
          }
          form.value = {
            ...detail,
            ...currentBdData.value,
            applyAmount: NP.divide(detail?.applyAmount, 10000),
            departmentId: org ? org.departmentId : currentBdData.value.departmentId,
            departmentName: org ? org.departmentName : currentBdData.value.departmentName,
            subjectInfoDtoList: subjects,
            groupId: detail?.crmGroupCreditVo?.groupId,
            groupName: detail?.crmGroupCreditVo?.groupName,
            subjectType: CREDIT_SUBJECT_ENUM.GROUP,
          };
          await nextTick();
          mainEl.value?.resetCreditData(data, CREDIT_SUBJECT_ENUM.GROUP);
        } else {
          const { data } = await getGroupCreditApplicationDetail({
            creditApplyId: $route.params?.id as string,
          });
          form.value = {
            ...data,
            groupId: data?.crmGroupCreditVo?.groupId,
            groupName: data?.crmGroupCreditVo?.groupName,
            subjectType: CREDIT_SUBJECT_ENUM.GROUP,
          };
          progressRequestParams.value.creditApplyId = $route.params?.id as string;
        }
      } catch (error) {
        console.log(error);
        initGroup();
      }
    };

    // 获取当前账号的BD信息
    const getCurrentBdData = async () => {
      try {
        const { data } = await getUserRegionAndDepartment({ userId: account!.userId });
        currentBdData.value = {
          bdId: data?.bdId,
          bdName: data?.bdName,
          regionCode: data?.bdRegionCode ?? '',
          regionName: data?.bdRegionName ?? '',
          bdOrgList: data?.bdOrgList ?? [],
          departmentName: data?.bdOrgList?.[0]?.departmentName ?? '',
          departmentId: data?.bdOrgList?.[0]?.departmentId ?? '',
        };
      } catch (error) {
        console.log(error);
      }
    };

    // 重新提交
    const handleReSubmit = () => {
      $router.replace({
        name: 'ApprovalManageResubmitCreditApplication',
        params: {
          id: $route.params?.id,
          type: $route.params?.type,
        },
      });
    };

    // 初始化
    const init = async () => {
      if ($route?.params?.id) {
        if ($route.name === 'ApprovalManageResubmitCreditApplication') {
          await getCurrentBdData();
          readOnly.value = false;
        } else {
          readOnly.value = true;
        }
        if ($route?.params?.type === CREDIT_SUBJECT_ROUTE_ENUM.GROUP) {
          await handleGetDetailGroup();
        } else {
          await handleGetDetail();
        }
      } else if ($route.name === 'ApprovalManageCreateCreditApplication') {
        await getCurrentBdData();
        readOnly.value = false;
        form.value = { ...formData };
      }
    };

    watch(() => $route?.params?.id, () => {
      init();
    }, { immediate: true });

    return {
      CAN_REVOKE,
      CAN_REVOKE_GROUP,
      CAN_VIEW_PROGRESS,
      CAN_RESUBMIT,
      CAN_RESUBMIT_GROUP,
      APPROVE_STATUS_LIST,
      APPROVE_STATUS_ENUM,
      TEMPLATE_TYPE_ENUM,
      CREDIT_SUBJECT_ENUM,
      visibleTips,
      tipsActionType,
      visibleProgress,
      mainEl,
      readOnly,
      form,
      formData,
      currentBdData,
      handleBack,
      handleSubmit,
      handleConfirmSubmit,
      handleRevoke,
      handleFinishRevoke,
      handleProgress,
      handleReSubmit,
      progressRequestApi: $route?.params?.type === 'group'
        ? getGroupCreditApplicationProgress : getCreditApplicationProgress,
      progressRequestParams,
      progressConfig: {
        listKey: 'data.applyProgressLogList',
        timeKey: 'operateTime',
        userKey: 'operateUser',
        contentKey: 'operateType',
        remarkKey: 'operateDesc',
        operateList: CREDIT_OPERATE_TYPE_LIST,
      },
    };
  },
});
</script>

<style scoped lang="scss">
.container {
  padding: 20px 20px 0;
}
</style>
