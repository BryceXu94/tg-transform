<template>
  <div class="detail-container container">
    <detail-title title="集团信息">
      <template #default>
        <el-button @click="handleBack">返回列表</el-button>
        <el-button
          v-if="readOnly && CAN_VIEW_LOG"
          type="primary"
          @click="handleLog"
        >
          操作日志
        </el-button>
        <el-button
          v-if="!readOnly"
          type="primary"
          @click="handleSubmit"
        >
          提交
        </el-button>
      </template>
    </detail-title>
    <!-- 集团信息 -->
    <group-info
      ref="groupEl"
      v-model="groupData"
      :readOnly="readOnly"
    />
    <!-- 关联旗下主体信息 -->
    <subject-info
      ref="subjectEl"
      v-model:data="groupData.customerVoList"
      :groupData="groupData"
      :readOnly="readOnly"
    />
    <operation-drawer
      title="操作日志"
      v-model="visibleLog"
      :request="getLogList"
      :requestParams="logRequestParams"
      :config="logConfig"
    />
  </div>
</template>

<script lang="tsx">
import { defineComponent, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { ElMessageBox, ElMessage } from 'element-plus';
import OperationDrawer from '@/components/operation-drawer/index.vue';
import GroupInfo from './components/group-info/index.vue';
import SubjectInfo from './components/subject-info/index.vue';

import { useMenuStore } from '@/store/menu';
import { getLogList } from '@/api/global';
import { LOG_OPERATE_TYPE_LIST, YES_OR_NO_NUMBER_ENUM } from '@/constant/global';
import {
  getGroupDetail,
  getEncryptGroupDetail,
  createGroup,
  updateGroup,
} from '../../api';
import { IGetGroupDetailRes } from '../../api/types';
import { usePermissionConfig } from '../../use-permission-config';

export default defineComponent({
  components: {
    OperationDrawer,
    GroupInfo,
    SubjectInfo,
  },

  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const {
      CAN_UPDATE,
      CAN_VIEW_LOG,
    } = usePermissionConfig();
    // 表单实例
    const groupEl = ref<InstanceType<typeof GroupInfo> | null>(null);
    const subjectEl = ref<InstanceType<typeof SubjectInfo> | null>(null);
    // 是否只读
    const readOnly = ref(true);
    // 是否新增
    const isCreate = ref(true);
    const formData = {
      groupId: '',
      groupName: '',
      groupCode: '',
      contactName: '',
      contactPhone: '',
      contaceEmail: '',
      positionName: '',
      positionCode: '',
      remark: '',
      customerVoList: [],
      groupIfInitAmount: false,
    };
    const groupData = ref<IGetGroupDetailRes>({ ...formData });

    const visibleLog = ref(false); // 操作日志显隐
    const logRequestParams = ref({
      buzId: $route.params?.id as string,
    });
    // 查看操作日志
    const handleLog = () => {
      visibleLog.value = true;
    };

    // 请求详情
    const fetchDetail = async () => {
      try {
        const getGroupDetailApi = readOnly.value ? getEncryptGroupDetail : getGroupDetail;
        const { data } = await getGroupDetailApi({
          id: $route.params?.id as string,
        });
        groupData.value = data;
        logRequestParams.value.buzId = $route.params?.id as string;
      } catch (error) {
        console.log(error);
      }
    };

    // 初始化
    const init = async () => {
      if ($route?.params?.id) {
        isCreate.value = false;
        readOnly.value = !($route.name === 'CustomerManageUpdateGroup' && CAN_UPDATE.value);
        fetchDetail();
      } else {
        isCreate.value = true;
        readOnly.value = false;
        groupData.value = { ...formData };
        groupData.value.customerVoList.push({
          customerId: '',
          customerCode: '',
          customerName: '',
          registrationAddress: '',
          isCreditUseRecord: YES_OR_NO_NUMBER_ENUM.NO,
        });
      }
      subjectEl.value?.handleInit();
    };

    // 返回列表
    const handleBack = () => {
      $router.push({
        name: 'CustomerManageGroupList',
      });
    };

    // 提交
    const handleSubmit = async () => {
      try {
        await groupEl.value?.validate();
        await subjectEl.value?.validate();
        if (groupData.value.customerVoList.length < 1) {
          ElMessage.error('至少必须录入一条主体信息');
          return;
        }
        await ElMessageBox.confirm('提交则信息生效，是否继续确认', '提交提示');
        const customerIdList = groupData.value.customerVoList.map(item => item.customerId);
        if (isCreate.value) {
          await createGroup({
            ...groupData.value,
            customerIdList,
          });
        } else {
          await updateGroup({
            ...groupData.value,
            customerIdList,
          });
        }
        ElMessage.success('操作成功');
        useMenuStore().deleteKeepAlive('CustomerManageGroupList');
        handleBack();
      } catch (error) {
        console.log(error);
      }
    };

    watch(() => $route?.params?.id, () => {
      init();
    }, { immediate: true });

    return {
      CAN_VIEW_LOG,
      groupEl,
      subjectEl,
      readOnly,
      visibleLog,
      groupData,
      handleBack,
      handleSubmit,
      handleLog,
      getLogList,
      logRequestParams,
      logConfig: {
        timeKey: 'createdTime',
        userKey: 'creatorName',
        contentKey: 'logType',
        operateList: LOG_OPERATE_TYPE_LIST,
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
