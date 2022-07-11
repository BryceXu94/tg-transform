<template>
  <el-button
    type="text"
    style="padding-right: 14px"
    @click="handleExport"
  >
    模板下载
  </el-button>
</template>

<script lang="tsx">
import { defineComponent, PropType } from 'vue';

import { ElMessage } from 'element-plus';

import { exportByBlob } from '@/core/utils/file-download';
import { TEMPLATE_TYPE_ENUM } from '@/modules/approval-manage/credit-application/constant';

export default defineComponent({
  props: {
    customerId: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<TEMPLATE_TYPE_ENUM>,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const handleExport = async () => {
      if (!props.customerId) {
        ElMessage.warning('请先选择需要导出的客户！');
        return;
      }
      try {
        await exportByBlob({
          method: 'post',
          url: '/crm-credit/inner/v1/credit/download-template',
          filename: `${props.name}.xlsx`,
          loading: true,
          data: {
            id: props.customerId,
            templateType: props.type,
          },
        });
      } catch (error) {
        console.log(error);
      }
    };

    return {
      handleExport,
    };
  },
});
</script>
