<template>
  <div class="create_container">
    <detail-title
      title="查看客户信息"
    >
      <template #default>
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="success"
          @click="handleStage"
          v-if="CAN_UPDATE"
        >暂存线索</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          v-if="CAN_UPDATE"
        >提交审核</el-button>
      </template>
    </detail-title>
    <business-info
      v-model:data="businessInfo"
      ref="businessEl"
    />
    <platform-info
      v-model:data="platformInfo"
      :track-id="customerTrackId"
      ref="platformEl"
    />
    <contact-info
      v-model:data="contactInfo"
      ref="contactEl"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IBusinessInfo, IPlatformInfoItem, IContactListItem } from './type';
import BusinessInfo from './components/business-info/index.vue';
import PlatformInfo from './components/platform-info/index.vue';
import ContactInfo from './components/contact-info/index.vue';
import {
  stageClues,
  confirmClues,
  getCluesDetail,
} from '@/modules/clue-manage/customer-clue/api';
import { TRACK_STATE_ENUM } from '@/modules/clue-manage/customer-clue/constant';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { usePermissionConfig } from '@/modules/clue-manage/customer-clue/use-permission-config';
import dayjs from 'dayjs';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  components: {
    PlatformInfo,
    ContactInfo,
    BusinessInfo,
  },
  setup() {
    const { deleteKeepAlive } = useMenuStore();
    const $route = useRoute();
    const $router = useRouter();
    const { CAN_UPDATE } = usePermissionConfig();
    const customerTrackId = ref('');
    // 工商信息
    const businessInfo = ref<IBusinessInfo>({
      actualPayCapital: '',
      regCapital: '',
    });
    // 运营信息
    const platformInfo = ref<IPlatformInfoItem[]>([]);
    // 联系信息
    const contactInfo = ref<IContactListItem[]>([]);
    // 工商信息组件实例
    const platformEl = ref<InstanceType<typeof PlatformInfo>>();
    // 运营信息组件实例
    const contactEl = ref<InstanceType<typeof ContactInfo>>();
    // 联系信息组件实例
    const businessEl = ref<InstanceType<typeof BusinessInfo>>();
    // 获取详情
    const getDetailInfo = async () => {
      const { data } = await getCluesDetail({
        id: customerTrackId.value,
      });
      if (data.trackState !== TRACK_STATE_ENUM.WAIT_COMMIT) {
        ElMessage.warning('当前线索状态不支持编辑');
        $router.replace({
          name: 'ClueManageCustomerClueList',
        });
        return;
      }
      businessInfo.value = {
        ...data.businessInfoModel,
        establishmentDate: (data.businessInfoModel.establishmentDate
          && dayjs(data.businessInfoModel.establishmentDate).format('YYYY-MM-DD')) || '',
      };
      platformInfo.value = data.ecommercePlatformList;
      contactInfo.value = data.contactList;
    };
    // 提交审核
    const handleConfirm = async () => {
      try {
        await businessEl.value?.validateAll();
        await platformEl.value?.validate();
        await contactEl.value?.validate();
        await ElMessageBox.confirm('请确认线索是否提交审核？', '提交审核');
        await confirmClues({
          businessInfo: businessInfo.value,
          ecommercePlatformList: platformInfo.value,
          contactInfoList: contactInfo.value,
          trackId: customerTrackId.value,
        });
        ElMessage.success('操作成功');
        deleteKeepAlive('ClueManageCustomerClueList');
        $router.replace({
          name: 'ClueManageCustomerClueList',
        });
      } catch (error) {
        console.log('提交审核失败', error);
      }
    };
    // 暂存
    const handleStage = async () => {
      try {
        await businessEl.value?.validateCode();
        await stageClues({
          businessInfo: businessInfo.value,
          ecommercePlatformList: platformInfo.value,
          contactInfoList: contactInfo.value,
          trackId: customerTrackId.value,
        });
        ElMessage.success('暂存成功');
        deleteKeepAlive('ClueManageCustomerClueList');
        $router.replace({
          name: 'ClueManageCustomerClueList',
        });
      } catch (error) {
        console.log('暂存失败', error);
      }
    };
    // 点击取消
    const handleCancel = () => {
      $router.replace({
        name: 'ClueManageCustomerClueList',
      });
    };
    // 初始化
    const init = () => {
      if ($route.name !== 'ClueManageCustomerClueCreate') {
        const id = $route.params.id as string;
        customerTrackId.value = id;
        getDetailInfo();
      }
    };
    init();
    return {
      CAN_UPDATE,
      handleCancel,
      contactInfo,
      platformInfo,
      businessInfo,
      platformEl,
      contactEl,
      businessEl,
      handleConfirm,
      handleStage,
      customerTrackId,
    };
  },
});
</script>
<style lang="scss" scoped>
.create_container{
  background-color: #fff;
  padding: 20px;

}
</style>
