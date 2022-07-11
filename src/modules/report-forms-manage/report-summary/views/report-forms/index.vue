<template>
  <app-page>
    <template #main="{ height }">
      <iframe
        ref="iframe"
        width="100%"
        :height="height - 10"
        :src="reportFormUrl"
      ></iframe>
    </template>
  </app-page>
</template>

<script lang="ts">

import { defineComponent, onMounted, ref, computed, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import usePermissionConfig from '../../use-permission-config';
import { has } from '@/core/plugins/filter';
import {
  RECEIVE_POST_MESSAGE_ENUM,
  SEND_POST_MESSAGE_ENUM,
} from '@/constant/global';
import { PERMISSION_ENUM } from '../../constant';
import http from '@/core/http';

export default defineComponent({
  name: 'index',
  setup() {
    const iframe = ref<HTMLIFrameElement>();
    const permissionConfig = usePermissionConfig();
    const canExportCSV = computed(() => has(permissionConfig.CSVDC));
    // 是否可以发送消息
    const isCanSendMsg = ref<boolean>(false);
    const reportFormUrl = ref<string>('');
    const route = useRoute();
    // 解决https中用不了http的问题
    const hasTargetMeta = (children: HTMLCollection) => {
      const len = children.length;
      for (let index = 0; index < len; index++) {
        const child = children[index] as HTMLMetaElement;
        if (
          child.httpEquiv === 'Content-Security-Policy'
          && child.content === 'upgrade-insecure-requests'
        ) {
          return true;
        }
      }
      return false;
    };
    const addHeaderInHtml = () => {
      const head = document.getElementsByTagName('head')[0];
      if (hasTargetMeta(head.children)) return;
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = 'upgrade-insecure-requests';
      head.appendChild(meta);
    };
    // 发送到superset消息
    const updateSSOPermission = () => {
      if (!isCanSendMsg.value || !iframe.value) {
        return;
      }
      const iframeWin = iframe.value?.contentWindow;
      if (!iframeWin) {
        return;
      }
      const data = {
        messageType: SEND_POST_MESSAGE_ENUM.SSO_PERMISSION,
        data: {
          [PERMISSION_ENUM.EXPORT_CSV]: canExportCSV.value,
        },
      };
      const host = http.systemDomainMap.pimsSuperset || '';
      iframeWin.postMessage(JSON.stringify(data), host);
    };
    // 接收到superset消息
    const listenerSSO = (e: any) => {
      try {
        // console.log('接收到superset消息');
        const { data } = e;
        const result: {
          messageType: string;
          data: any;
        } = JSON.parse(data);
        if (result.messageType === RECEIVE_POST_MESSAGE_ENUM.SSO_COMPONENT_DID_MOUNT) {
          isCanSendMsg.value = true;
          updateSSOPermission();
        }
      } catch (error) {
        // console.log(error);
      }
    };
    // 初始化
    const handleInit = () => {
      window.addEventListener('message', listenerSSO);
      addHeaderInHtml();
      const host = http.systemDomainMap.pimsSuperset;
      reportFormUrl.value = `${host}/superset/dashboard/${route.params.reportFormUrl}/`;
      // reportFormUrl.value = 'http://cf.mytest1.com:8088/superset/dashboard/finished-product-manage-inbound-details/';
    };
    watch(() => canExportCSV.value, () => {
      updateSSOPermission();
    });
    onMounted(() => {
      handleInit();
    });
    onUnmounted(() => {
      window.removeEventListener('message', listenerSSO);
    });
    return {
      iframe,
      reportFormUrl,
    };
  },
});
</script>

<style scoped lang="scss">
iframe{
  border: none;
}
</style>
