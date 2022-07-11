<template>
  <el-dialog
    :modelValue="visible"
    @close="handleClose"
    :close-on-click-modal="false"
    title="审核记录"
    custom-class="el-dialog-inner-scroll"
    width="400px"
  >
    <ul class="audit-record" v-if="columnCustomerRecord.length">
      <li v-for="auditRecord in columnCustomerRecord" :key="auditRecord.columnAuditId">
        <p>审核结果：{{ $filters.getEnumLabel(AUDIT_STATE_LIST, auditRecord.auditState) }}</p>
        <p>审核备注：{{ auditRecord.remark }}</p>
        <p>审核时间：{{ $filters.formatTime(auditRecord.createdTime) }}</p>
        <p>审核人员：{{ auditRecord.creatorName }}[{{ auditRecord.auditorCode }}]</p>
      </li>
    </ul>
    <empty v-else />
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  ref,
  defineEmits,
  defineProps,
  withDefaults,
} from 'vue';
import {
  AUDIT_STATE_LIST,
} from '@/modules/customer-manage/develop-plan/constant';
import { IColumnCustomerInfoListResItem } from '@/modules/customer-manage/develop-plan/api/types';

interface IConfig {
  columnCustomerRecord: IColumnCustomerInfoListResItem[];
}

const emits = defineEmits(['destroy']);
withDefaults(defineProps<IConfig>(), {});

const visible = ref(true);

const handleClose = () => {
  visible.value = false;
  setTimeout(() => {
    emits('destroy');
  }, 500);
};

</script>

<style lang="scss" scoped>
.audit-record {
  > li {
    margin-bottom: 20px;
  }
  > li:last-child {
    margin-bottom: 0;
  }
}
</style>
