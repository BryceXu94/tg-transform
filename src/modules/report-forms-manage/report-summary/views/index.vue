<template>
  <div>
    <div class="card" @click="toReportForm">
      <p>客户可用余额</p>
      <span>变动明细</span>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import usePermissionConfig from '../use-permission-config';
import { has } from '@/core/plugins/filter';

export default defineComponent({
  name: 'index',
  setup() {
    const router = useRouter();
    const permissionConfig = usePermissionConfig();
    const canCheck = computed(() => has(permissionConfig.CKBB));
    const toReportForm = () => {
      if (!canCheck.value) {
        return;
      }
      router.push({
        name: 'ReportFormContainer',
        params: {
          reportFormUrl: 'ccs-update',
        },
      });
    };
    return {
      toReportForm,
    };
  },
});
</script>

<style scoped lang="scss">
.card{
  height: 128px;
  width: 365px;
  background: url(~@/assets/table-list-bg.png) right center no-repeat;
  background-size: 100%;
  padding: 38px 24px 0 24px;
  cursor: pointer;
  p{
    height: 26px;
    font-size: 18px;
    font-weight: 600;
    color: #18181A;
    line-height: 26px;
  }
  span{
    height: 22px;
    font-size: 14px;
    font-weight: 500;
    color: #4974F5;
    line-height: 22px;
    position: relative;
    margin-top: 4px;
    &:after{
      content: ' ';
      position: absolute;
      top: 0px;
      right: -16px;
      display: block;
      height: 16px;
      width: 16px;
      background: url(~@/assets/arrow-right.png) right center no-repeat;
      background-size: 100%;
    }
  }
}
</style>
