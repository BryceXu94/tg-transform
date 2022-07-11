<template>
  <div class="container_layout">
    <detail-title title="关联旗下主体信息" :tips="readOnly ? '' : '至少必须保留一条数据'">
      <template v-if="!readOnly" #default>
        <el-button
          type="primary"
          @click="handleAdd"
        >
          添加主体
        </el-button>
      </template>
    </detail-title>
    <el-form
      ref="formEl"
      :model="data"
    >
      <custom-table
        :data="data"
        :columns="renderColumns(
          handleDelete,
          handleChangeCustomer,
          formatCustomerOps,
          readOnly,
          canDelete,
          groupData.groupIfInitAmount,
          formRules,
        )"
      />
    </el-form>
  </div>
</template>

<script lang="tsx">
import { defineComponent, PropType, ref, computed } from 'vue';
import { get, isEmpty } from 'lodash-es';

import { ElForm, ElMessage } from 'element-plus';

import { YES_OR_NO_NUMBER_ENUM, CUSTOMER_CREDIT_APPROVE_STATUS_ENUM } from '@/constant';
import { ICustomerInfoSearchResItem } from '@/api/query-options/type.d';
import { IGetGroupDetailRes } from '@/modules/customer-manage/group-manage/api/types';
import { ISubjectItem } from '../../types';
import { renderColumns } from './tableData';

export default defineComponent({
  emits: ['update:data'],
  props: {
    data: {
      type: Object as PropType<ISubjectItem[]>,
      required: true,
    },
    groupData: {
      type: Object as PropType<IGetGroupDetailRes>,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const formEl = ref<InstanceType<typeof ElForm>|null>(null);

    // 是否可以删除
    const canDelete = computed(() => {
      return props.data.length > 1;
    });

    // 添加主体
    const handleAdd = () => {
      const data = [...props.data];
      data.push({
        customerId: '',
        customerCode: '',
        customerName: '',
        registrationAddress: '',
        isCreditUseRecord: YES_OR_NO_NUMBER_ENUM.NO,
      });
      emit('update:data', data);
    };

    const deleteIds = new Set();
    // 删除
    const handleDelete = (index: number) => {
      const data = [...props.data];
      const dropItem = data.splice(index, 1);
      deleteIds.add(dropItem[0].customerId);
      emit('update:data', data);
    };

    // 选择用户
    const handleChangeCustomer = (ops: ICustomerInfoSearchResItem, index: number) => {
      const data = [...props.data];
      const row = data[index] || {} as ISubjectItem;
      if (props.groupData.groupIfInitAmount
        && [CUSTOMER_CREDIT_APPROVE_STATUS_ENUM.ENABLE, CUSTOMER_CREDIT_APPROVE_STATUS_ENUM.DISABLED]
          .includes(ops.creditGrantingState! as any)
      ) {
        ElMessage.error('当前集团及客户均已有授信记录，无法关联');
        row.customerName = '';
      } else {
        row.customerId = ops.customerId;
        row.customerCode = ops.customerCode;
        row.customerName = ops.customerName;
        row.registrationAddress = ops.fullRegistrationAddress!;
      }
      emit('update:data', data);
    };

    const formatCustomerOps = (res: any, dataKey: string) => {
      return get(res, dataKey).map((v: ICustomerInfoSearchResItem) => ({
        label: `${v.customerName}${v.groupId && v.groupId !== props.groupData.groupId ? '(已被绑定)' : ''}`,
        value: v.customerId,
        disabled: (!isEmpty(v.groupId) && !deleteIds.has(v.customerId))
          || props.data.findIndex(item => item.customerId === v.customerId) > -1,
        row: v,
      }));
    };

    const validate = async () => {
      await formEl.value?.validate();
    };

    const handleInit = () => {
      deleteIds.clear();
    };

    return {
      formEl,
      canDelete,
      validate,
      handleAdd,
      handleDelete,
      handleChangeCustomer,
      renderColumns,
      handleInit,
      formatCustomerOps,
      formRules: (
        key: string,
        rules: any,
        value: any,
        callback: (err?: string) => void,
      ) => {
        if (value === '' || value === null) {
          callback('内容不能为空');
          return;
        }
        callback();
      },
    };
  },

});
</script>

<style scoped lang="scss">
.container_layout {
  padding: 20px 0 50px;
}
</style>
