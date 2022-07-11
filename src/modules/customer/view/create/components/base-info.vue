<template>
  <div>
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      label-width="158px"
    >
      <el-row :gutter="20">
        <el-col
          :xs="xs"
          :sm="sm"
          :md="md"
          :lg="lg"
          :xl="xl"
        >
          <el-form-item label="客户编码：">
            <el-input
              clearable
              disabled
              :model-value="form.customerCode"
              placeholder="系统自动生成"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :xs="xs"
          :sm="sm"
          :md="md"
          :lg="lg"
          :xl="xl"
        >
          <el-form-item label="创建时间：">
            <el-input
              disabled
              clearable
              :model-value="$filters.formatTime(form.createdTime, 'YYYY-MM-DD HH:mm:ss')"
              placeholder="系统自动生成"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :xs="xs"
          :sm="sm"
          :md="md"
          :lg="lg"
          :xl="xl"
        >
          <el-form-item
            label="客户全称："
            prop="customerName"
          >
            <el-input
              clearable
              :disabled="readOnly"
              maxlength="50"
              v-model="form.customerName"
              placeholder="请输入客户全称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :xs="xs"
          :sm="sm"
          :md="md"
          :lg="lg"
          :xl="xl"
        >
          <el-form-item
            label="客户状态："
            prop="customerStatus"
          >
            <el-switch
              :disabled="readOnly"
              v-model="form.customerStatus"
              :active-value="CUSTOMER_STATUS_ENUM.OPEN"
              :inactive-value="CUSTOMER_STATUS_ENUM.CLOSE"
              active-color="#13ce66"
              inactive-color="#bbb"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col
          :xs="xs"
          :sm="sm"
          :md="md"
          :lg="lg"
          :xl="xl"
        >
          <el-form-item label="客户简称：">
            <el-input
              clearable
              :disabled="readOnly"
              v-model="form.customerSimple"
              maxlength="50"
              placeholder="请输入客户简称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :xs="xs"
          :sm="sm"
          :md="md"
          :lg="lg"
          :xl="xl"
        >
          <el-form-item
            label="客户电话："
            prop="customerPhone"
          >
            <el-input
              clearable
              :disabled="readOnly"
              v-model="form.customerPhone"
              maxlength="50"
              placeholder="请输入客户电话"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :xs="xs"
          :sm="sm"
          :md="18"
          :lg="18"
          :xl="18"
        >
          <el-form-item
            label="客户所在属城市："
            prop="customerArea"
          >
            <address-picker
              :gutter="10"
              :span="[8,8,8]"
              :disabled="readOnly"
              v-model:province="form.customerProvince"
              v-model:city="form.customerCity"
              v-model:area="form.customerArea"
            />
          </el-form-item>
        </el-col>
        <el-col
          :xs="xs"
          :sm="sm"
          :md="18"
          :lg="18"
          :xl="18"
        >
          <el-form-item
            label="客户详细地址："
            prop="customerAddress"
          >
            <el-input
              clearable
              :disabled="readOnly"
              placeholder="请输入供应商详细地址"
              v-model="form.customerAddress"
              type="textarea"
              maxlength="255"
              show-word-limit
              :rows="3"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import {
  ICustomerCreateAPI,
  ICustomerDetailAPI, ICustomerUpdateAPI,
} from '@/modules/customer/api/type';
import { crateCustomer, getCustomerDetails, updateCustomer } from '@/modules/customer/api';
import { CUSTOMER_STATUS_ENUM } from '@/modules/customer/constant/baseInfo';
import { cloneDeep } from 'lodash-es';
import { ElForm } from 'element-plus';

export default defineComponent({
  name: 'base-info',
  emits: ['saveSuccess'],
  props: {
    customerId: {
      type: String,
      default: '',
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  components: {
  },
  setup(props, { emit }) {
    const customerId = ref<string>('');
    const [xs, sm, md, lg, xl] = [24, 24, 13, 13, 13]; // [24,24,8,6,6]
    const formRef = ref<InstanceType<typeof ElForm> | null>(null);
    const form = ref<
      ICustomerCreateAPI.IRequest | ICustomerDetailAPI.IResponse | ICustomerUpdateAPI.IRequest
      >({
        customerName: '',
        customerSimple: '',
        customerStatus: CUSTOMER_STATUS_ENUM.OPEN,
        customerAddress: '',
        customerPhone: '',
        customerProvince: '',
        customerCity: '',
        customerArea: '',
        customerCode: '',
        createdTime: '',
      });
    const originForm = ref<ICustomerCreateAPI.IRequest | ICustomerDetailAPI.IResponse>(cloneDeep(form.value));
    const saveSuccess = (id: string) => {
      emit('saveSuccess', id);
    };
    const getDetails = async (id = props.customerId) => {
      if (id) {
        const { data } = await getCustomerDetails(id);
        form.value = data;
        originForm.value = cloneDeep(form.value);
      }
    };
    const handleSave = async () => {
      await formRef.value?.validate();
      // 更新
      if (customerId.value) {
        // 更新
        await updateCustomer({
          customerId: customerId.value,
          customerName: form.value.customerName,
          customerSimple: form.value.customerSimple,
          customerStatus: form.value.customerStatus,
          customerAddress: form.value.customerAddress,
          customerPhone: form.value.customerPhone,
          customerProvince: form.value.customerProvince,
          customerCity: form.value.customerCity,
          customerArea: form.value.customerArea,
        });
      } else {
        // 创建
        const { data } = await crateCustomer(form.value);
        saveSuccess(data);
      }
      originForm.value = cloneDeep(form.value);
    };
    const isChange = () => {
      return !(JSON.stringify(form.value) === JSON.stringify(originForm.value));
    };
    watch(() => props.customerId, async (val: string) => {
      customerId.value = val;
      if (val) {
        await getDetails(val);
      }
    });
    onMounted(() => {
      getDetails();
    });
    return {
      xs,
      sm,
      md,
      lg,
      xl,
      rules: {
        customerStatus: [
          { required: true, message: '客户状态不能为空', trigger: 'change' },
        ],
        customerName: [
          { required: true, message: '客户名称不能为空', trigger: 'change' },
        ],
        customerAddress: [
          { required: true, message: '详细地址不能为空', trigger: 'change' },
        ],
        customerPhone: [
          { required: true, message: '客户电话不能为空', trigger: 'change' },
        ],
        customerArea: [
          { required: true, message: '客户所在属城市不能为空', trigger: 'change' },
        ],
      },
      form,
      handleSave,
      isChange,
      formRef,
      CUSTOMER_STATUS_ENUM,
    };
  },
});
</script>

<style scoped lang="scss">
.el-form-item{
  width: 100%;
}
</style>
