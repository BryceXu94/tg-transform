<template>
  <div class="information-info">
    <div class="information-info__title margin-bottom-10">资料文件</div>
    <div class="padding-10" v-if="CAN_VIEW_DOCUMENT_DATA">
      <el-form label-width="150px">
        <el-form-item label="营业执照附件：">
          <upload
            :limit="9"
            v-model="profileFilesInfo.businessLicenseList"
            type="imageList"
            disabled
          />
        </el-form-item>
        <el-form-item label="付款账户证明附件：">
          <upload
            :limit="9"
            v-model="profileFilesInfo.paymentProofImageList"
            type="fileList"
            disabled
          />
        </el-form-item>
        <el-form-item label="框架合同样本附件：">
          <upload
            :limit="9"
            v-model="profileFilesInfo.contractFileList"
            type="fileList"
            disabled
          />
        </el-form-item>
        <el-form-item label="法人身份证附件：">
          <upload
            :limit="9"
            v-model="profileFilesInfo.idCardImageList"
            type="fileList"
            disabled
          />
        </el-form-item>
        <el-form-item label="客户评分表附件：">
          <upload
            :limit="9"
            v-model="profileFilesInfo.customerScoreFileList"
            type="fileList"
            disabled
          />
        </el-form-item>
        <el-form-item label="资产证明附件：">
          <upload
            :limit="9"
            v-model="profileFilesInfo.assetsProofFileList"
            type="fileList"
            disabled
          />
        </el-form-item>
      </el-form>
    </div>
    <empty v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';

import { IDetailProfileFilesRes } from '@/modules/customer-manage/customer-manage/api/types';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<IDetailProfileFilesRes>,
      default: () => {},
    },
  },
  setup(props) {
    // 资料文件
    const profileFilesInfo = computed(() => props.data);

    // 权限
    const {
      CAN_VIEW_DOCUMENT_DATA,
    } = usePermissionConfig();

    return {
      profileFilesInfo,
      CAN_VIEW_DOCUMENT_DATA,
    };
  },
});
</script>

<style lang="scss" scoped>
.information-info {
  border: 1px solid #eee;
  margin-bottom: 10px;
  padding: 15px 10px;
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
}
</style>
