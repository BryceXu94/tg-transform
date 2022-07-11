<!--
 * @Descripttion: 系统关联
 * @Author: weitongxue
-->
<template>
  <div class="system-info">
    <div class="system-info__title flex flex-justify-between flex-align-center">
      <span>其他主体关联信息</span>
      <el-button
        v-if="isCreate && CAN_CREATE_SYSTEM_LINKAGES"
        type="success"
        @click="handleSave"
      >暂存</el-button>
      <div v-else>
        <el-button
          type="primary"
          v-show="!isEdit && !edit && CAN_UPDATE_SYSTEM_LINKAGES"
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
    <div class="system-info__content">
      <custom-table
        border
        :is-form="true"
        ref="systemRef"
        :data="externalRelationList"
        :columns="renderColumns(
          handleDelete,
          handleAdd,
          handleChangeCustomer,
          isEdit,
        )"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, PropType, inject } from 'vue';
import { useRoute } from 'vue-router';

import {
  renderColumns,
} from './composables/tableData';
import CustomTable from '@/components/custom-table';

import { updateCustomerRelation } from '@/modules/customer-manage/customer-manage/api';
import {
  IGetCustomerRelationRes,
  IGetCustomerOptionsByRelationRes,
  IUpdateCustomerRelationReq,
} from '@/modules/customer-manage/customer-manage/api/types';
import { TABS_ENUM } from '@/modules/customer-manage/customer-manage/constant';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
import { cloneDeep } from 'lodash-es';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<IGetCustomerRelationRes[]>,
      default: () => [],
    },
    state: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const $route = useRoute();
    const customerId = $route.params.id! as string;
    const routeName = $route.name;
    const systemRef = ref<InstanceType<typeof CustomTable> | null>(null);
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
      CAN_CREATE_SYSTEM_LINKAGES,
      CAN_UPDATE_SYSTEM_LINKAGES,
    } = usePermissionConfig();

    const externalRelationList = ref<IGetCustomerRelationRes[]>([
      {
        customerId: '',
        customerName: '',
        customerCode: '',
      },
    ]);

    const externalRelationStr = ref('');
    watch(() => props.data, () => {
      externalRelationList.value = props.data;
      externalRelationStr.value = JSON.stringify(cloneDeep(externalRelationList.value));
    }, { immediate: true });

    // 添加外系统信息
    const handleAdd = () => {
      externalRelationList.value.push({
        customerId: '',
        customerName: '',
        customerCode: '',
      });
    };

    // 删除外系统信息
    const handleDelete = (index: number) => {
      externalRelationList.value.splice(index, 1);
    };

    // 选择系统来源
    // const handleSelectSystem = (item: { label: string; value: string;}, index: number) => {
    //   externalRelationList.value[index].sourceSystemName = item?.label;
    // };

    // 选择客户
    const handleChangeCustomer = (option: IGetCustomerOptionsByRelationRes, index: number) => {
      externalRelationList.value[index] = {
        ...externalRelationList.value[index],
        customerCode: option.customerCode,
        customerId: option.customerId,
        customerName: option.customerName,
      };
    };

    const handleSave = async () => {
      try {
        await systemRef.value?.handleValidate();
        const params: IUpdateCustomerRelationReq = {
          customerIdList: externalRelationList.value.map(item => item.customerId),
          customerId,
          // editModuleList: [MODULE_BLOCK_ENUM.EXTERNAL_RELATION],
        };
        await updateCustomerRelation(params);
        edit.value = false;
        if (!isCreate.value) {
          handleRefresh?.(TABS_ENUM.TAB_SYSTEM);
        }
        externalRelationStr.value = JSON.stringify(cloneDeep(externalRelationList.value));
        useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
      } catch (e) {
        console.log(e);
      }
    };

    // 是否提示保存
    const validateData = () => {
      return externalRelationStr.value === JSON.stringify(externalRelationList.value);
    };

    // 取消
    const handleCancel = () => {
      systemRef.value?.handleResetFields();
      edit.value = false;
      externalRelationList.value = cloneDeep(JSON.parse(externalRelationStr.value));
    };
    const handleEdit = () => {
      edit.value = true;
      externalRelationStr.value = JSON.stringify(cloneDeep(externalRelationList.value));
    };

    return {
      externalRelationList,
      isEdit,
      edit,
      isCreate,
      customerId,
      systemRef,
      CAN_CREATE_SYSTEM_LINKAGES,
      CAN_UPDATE_SYSTEM_LINKAGES,

      handleAdd,
      handleDelete,
      renderColumns,
      handleCancel,
      handleEdit,
      handleSave,
      handleChangeCustomer,
      validateData,
    };
  },
});
</script>

<style lang="scss" scoped>
.system-info {
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
