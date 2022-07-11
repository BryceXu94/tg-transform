<!--
 * @Descripttion: 资料文件
 * @Author: weitongxue
-->
<template>
  <div class="information-info">
    <div class="information-info__title flex flex-justify-between flex-align-center">
      <span>资料文件</span>
      <el-button
        v-if="isCreate && CAN_CREATE_DOCUMENT_DATA"
        type="success"
        @click="handleSave"
      >暂存</el-button>
      <div v-else>
        <el-button
          type="primary"
          v-show="!isEdit && !edit && CAN_UPDATE_DOCUMENT_DATA"
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
    <div class="information-info__content">
      <el-form
        :model="form"
        label-width="200px"
        ref="formRef"
      >
        <el-form-item
          label="营业执照附件："
          prop="businessLicenseList"
          :rules="[
            {
              required: true,
              message: '请上传营业执照附件',
              trigger: 'blur',
            },
          ]"
        >
          <upload
            :limit="1"
            v-model="form.businessLicenseList"
            :sizeLimit="10"
            type="imageList"
            :disabled="!edit && !isCreate"
            accept="image/png,image/jpg,image/jpeg"
            tip="支持格式：*.png、*.jpg、*.jpeg，单个文件不能超过10MB"
          />
        </el-form-item>
        <el-form-item
          label="付款账户证明："
          prop="paymentProofImageList"
        >
          <upload
            :limit="9"
            v-model="form.paymentProofImageList"
            :sizeLimit="10"
            type="fileList"
            :disabled="!edit && !isCreate"
            accept="image/png,image/jpg,image/jpeg,.xlsx,.xls,.doc,.docx,.pdf"
            tip="支持格式：*.png、*.jpg、*.jpeg、*.xlsx、*.xls、*.doc、*.docx、*.pdf，单个文件不能超过10MB"
          />
        </el-form-item>
        <el-form-item label="框架合同样本：">
          <upload
            :limit="9"
            v-model="form.contractFileList"
            :sizeLimit="30"
            :disabled="!edit && !isCreate"
            type="fileList"
            accept="image/png,image/jpg,image/jpeg,.xlsx,.xls,.doc,.docx,.pdf"
            tip="支持格式：*.png、*.jpg、*.jpeg、*.xlsx、*.xls、*.doc、*.docx、*.pdf，单个文件不能超过30MB"
          />
        </el-form-item>
        <el-form-item label="法人身份证：">
          <upload
            :limit="2"
            v-model="form.idCardImageList"
            :sizeLimit="10"
            :disabled="!edit && !isCreate"
            type="fileList"
            accept="image/png,image/jpg,image/jpeg,.xlsx,.xls,.doc,.docx,.pdf"
            tip="支持格式：*.png、*.jpg、*.jpeg、*.xlsx、*.xls、*.doc、*.docx、*.pdf，单个文件不能超过10MB"
          />
        </el-form-item>
        <el-form-item label="客户评分表：">
          <upload
            :limit="9"
            v-model="form.customerScoreFileList"
            :sizeLimit="10"
            :disabled="!edit && !isCreate"
            type="fileList"
            accept="image/png,image/jpg,image/jpeg,.xlsx,.xls,.doc,.docx,.pdf"
            tip="支持格式：*.png、*.jpg、*.jpeg、*.xlsx、*.xls、*.doc、*.docx、*.pdf，单个文件不能超过10MB"
          />
        </el-form-item>
        <el-form-item label="资产证明：">
          <upload
            :limit="9"
            v-model="form.assetsProofFileList"
            :sizeLimit="10"
            :disabled="!edit && !isCreate"
            type="fileList"
            accept="image/png,image/jpeg,image/jpg,pdf,.doc,.docx,xls,.xlsx,zip,rar,jar"
            tip="支持jpg/jpeg/png/pdf/doc/docx/excel/zip/rar/jar格式，大小不超10mb"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, watch, inject } from 'vue';
import { useRoute } from 'vue-router';

import { ElForm } from 'element-plus';

import { updateCustomerFilesInfoApi } from '@/modules/customer-manage/customer-manage/api';
import {
  IProfileFilesSaveReq,
  IDetailProfileFilesRes,
  IProfileFilesSave } from '@/modules/customer-manage/customer-manage/api/types';
import { MODULE_BLOCK_ENUM, TABS_ENUM } from '@/modules/customer-manage/customer-manage/constant';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
import { cloneDeep } from 'lodash-es';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<IDetailProfileFilesRes>,
      default: () => {},
    },
  },
  setup(props) {
    const $route = useRoute();
    const customerId = $route.params.id! as string;
    const routeName = $route.name;
    const formRef = ref<InstanceType<typeof ElForm> | null>(null);
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
      CAN_CREATE_DOCUMENT_DATA,
      CAN_UPDATE_DOCUMENT_DATA,
    } = usePermissionConfig();

    const form = ref<IProfileFilesSave>({
      businessLicenseList: [],
      paymentProofImageList: [],
      contractFileList: [],
      idCardImageList: [],
      customerScoreFileList: [],
      assetsProofFileList: [],
    });

    const formStr = ref('');
    watch(() => props.data, () => {
      form.value = props.data;
      formStr.value = JSON.stringify(cloneDeep(form.value));
    }, { immediate: true });

    const handleSave = async () => {
      try {
        await formRef.value?.validate();
        const params: IProfileFilesSaveReq = {
          ...form.value,
          customerId,
          editModuleList: [MODULE_BLOCK_ENUM.PROFILE_FILES],
        };
        await updateCustomerFilesInfoApi(params);
        edit.value = false;
        if (!isCreate.value) {
          handleRefresh?.(TABS_ENUM.TAB_INFORMATION);
        }

        formStr.value = JSON.stringify(cloneDeep(form.value));
        useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
      } catch (e) {
        console.log(e);
      }
      console.log(form);
    };

    // 是否提示保存
    const validateData = () => {
      return formStr.value === JSON.stringify(form.value);
    };

    // 取消
    const handleCancel = () => {
      formRef.value?.clearValidate();
      edit.value = false;
      form.value = cloneDeep(JSON.parse(formStr.value));
    };

    const handleEdit = () => {
      edit.value = true;
      formStr.value = JSON.stringify(cloneDeep(form.value));
    };

    return {
      form,
      isCreate,
      edit,
      isEdit,
      formRef,
      CAN_CREATE_DOCUMENT_DATA,
      CAN_UPDATE_DOCUMENT_DATA,

      handleCancel,
      handleEdit,
      handleSave,
      validateData,
    };
  },
});
</script>

<style lang="scss" scoped>
.information-info {
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
    padding: 40px 0px 20px;
  }
}
</style>
