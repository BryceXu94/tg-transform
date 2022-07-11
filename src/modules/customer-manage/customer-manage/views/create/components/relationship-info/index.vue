<!--
 * @Descripttion: 联系管理
 * @Author: weitongxue
-->
<template>
  <div class="relationship-info">
    <div class="relationship-info__title flex flex-justify-between">
      <span>联系人信息</span>
      <el-button
        v-if="isCreate && CAN_CREATE_CONTACT_DATA"
        type="success"
        @click="handleSave"
      >暂存</el-button>
      <div v-else>
        <el-button
          type="primary"
          v-show="!isEdit && !edit && CAN_UPDATE_CONTACT_DATA"
          @click="handleEdit"
        >编辑</el-button>
        <div v-show="edit">
          <el-button
            @click="handleCancel"
          >取消</el-button>
          <el-button
            type="primary"
            @click="handleSave"
          >保存</el-button>
        </div>
      </div>
    </div>
    <div class="relationship-info__content">
      <custom-table
        border
        ref="relationshipRef"
        :is-form="true"
        :data="customerContactList"
        :columns="renderColumns(customerContactList.length,
                                handleDelete, handleAddUser,
                                isEdit, state, businessType,
                                pageTab)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, PropType, watch, inject } from 'vue';
import { useRoute } from 'vue-router';
import CustomTable from '@/components/custom-table';

import {
  renderColumns,
} from './composables/tableData';

import {
  updateCustomerContactInfoApi,
  platformContactSaveApi,
} from '@/modules/customer-manage/customer-manage/api';
import { IContactSaveReq, IDetailContactsRes } from '@/modules/customer-manage/customer-manage/api/types';
import { MODULE_BLOCK_ENUM, TABS_ENUM } from '@/modules/customer-manage/customer-manage/constant';
import { BUSINESS_MODE_ENUM, SOURCE_TYPE_LIST } from '@/constant';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
import { cloneDeep } from 'lodash-es';
import { filters } from '@/core/plugins/filter';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<IDetailContactsRes>,
      default: () => {},
    },
    encryptData: {
      type: Object as PropType<IDetailContactsRes>,
      default: () => {},
    },
    state: {
      type: String,
      default: '',
    },
    businessType: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const $route = useRoute();
    const customerId = $route.params.id! as string;
    const routeName = $route.name;
    const relationshipRef = ref<InstanceType<typeof CustomTable> | null>(null);
    const handleRefresh = inject<(item: TABS_ENUM) => void>('handleRefresh');

    // 是否编辑
    const edit = ref(false);
    const isEdit = computed(() => {
      return routeName === 'CustomerManageCreateCustomer' || edit.value;
    });
    // 区分新增还是编辑
    const isCreate = computed(() => {
      // customerCode存在就是创建
      return routeName === 'CustomerManageCreateCustomer';
    });

    // 权限
    const {
      CAN_CREATE_CONTACT_DATA,
      CAN_UPDATE_CONTACT_DATA,
    } = usePermissionConfig();

    const customerContactList = ref([
      {
        contactName: '',
        post: '',
        phone: '',
        weChatId: '',
        email: '',
        remark: '',
        enable: 'NO',
        sourceType: 'CRM后台',
      },
    ]);

    const editedModule = reactive({
      contactInfo: false,
    });
    const contactInfo = computed(() => {
      return (isCreate.value || editedModule.contactInfo)
        ? props?.data?.customerContactList : props?.encryptData?.customerContactList;
    });

    const customerContactStr = ref('');
    watch(() => contactInfo.value, () => {
      if (contactInfo.value?.length) {
        customerContactList.value = contactInfo.value.map((item) => {
          item.sourceType = filters.getEnumLabel(SOURCE_TYPE_LIST, item.sourceType);
          return item;
        });
      }
      customerContactStr.value = JSON.stringify(cloneDeep(customerContactList.value));
    }, { immediate: true });

    // 添加联系人
    const handleAddUser = () => {
      customerContactList.value.push({
        contactName: '',
        post: '',
        phone: '',
        weChatId: '',
        email: '',
        remark: '',
        enable: 'NO',
        sourceType: 'CRM后台',
      });
    };

    // 删除联系人
    const handleDelete = (index: number) => {
      customerContactList.value.splice(index, 1);
    };

    const handleSave = async () => {
      await relationshipRef.value?.handleValidate();
      const params: IContactSaveReq = {
        customerContactList: customerContactList.value,
        customerId,
        editModuleList: [MODULE_BLOCK_ENUM.CONTACTS],
      };
      const res = props.data.businessType === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS
        ? await updateCustomerContactInfoApi(params) : await platformContactSaveApi(params);
      edit.value = false;
      if (!isCreate.value) {
        handleRefresh?.(TABS_ENUM.TAB_RELATIONSHIP);
      }

      customerContactStr.value = JSON.stringify(cloneDeep(customerContactList.value));
      useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
      console.log(res.data?.isAllCompleted, '是否全部填写');
    };

    // 是否提示保存
    const validateData = () => {
      return customerContactStr.value === JSON.stringify(customerContactList.value);
    };

    const handleEdit = () => {
      editedModule.contactInfo = true;
      edit.value = true;
      customerContactStr.value = JSON.stringify(cloneDeep(customerContactList.value));
    };

    // 取消
    const handleCancel = () => {
      relationshipRef.value?.handleResetFields();
      edit.value = false;
      customerContactList.value = cloneDeep(JSON.parse(customerContactStr.value));
    };

    return {
      customerContactList,
      isCreate,
      isEdit,
      edit,
      relationshipRef,
      CAN_CREATE_CONTACT_DATA,
      CAN_UPDATE_CONTACT_DATA,

      handleAddUser,
      handleDelete,
      handleEdit,
      handleCancel,
      renderColumns,
      validateData,
      handleSave,
      pageTab: 'relationshipInfo',
    };
  },
});
</script>

<style lang="scss" scoped>
.relationship-info {
  border: 1px solid #eee;
  margin-bottom: 10px;
  padding: 15px 10px 0px;
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
    padding: 10px 0px;
  }
}
</style>
