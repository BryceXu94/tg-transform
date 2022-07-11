<template>
  <app-page>
    <template #fheader>
      <search-area
        v-model="params"
        :config="searchConfig"
        @handleSearch="handleAuth(handleSearch)"
        @handleReset="handleAuth(handleReset)"
      />
    </template>
    <template #main="{ height }">
      <custom-table
        border
        :key="height"
        :height="height"
        :data="tableData"
        :columns="renderColumns()"
      />
    </template>
    <template #ffooter>
      <el-row
        style="width: 100%"
        justify="end"
      >
        <pagination
          :total="tableTotal"
          :current-page="params.pageNum"
          :size="params.pageSize"
          @size-change="(...p: unknown[]) => handleAuth(handleSizeChange, p)"
          @current-change="(...p: unknown[]) => handleAuth(handleCurrentChange, p)"
        />
      </el-row>
    </template>
  </app-page>
</template>

<script lang="tsx">
import { defineComponent, computed, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { getRegionList } from '@/api/global';
import { useList } from '@/hooks/use-list';
import {
  useConditionPermissionList,
  IConditionPermissionItem,
} from '@/hooks/use-condition-permission-list';
import { getTgoBullionList } from '../../api';
import { IGetTgoBullionListReq } from '../../api/types';
import { renderColumns } from './composables/tableData';
import { IListItem } from './types';

export default defineComponent({
  setup() {
    const regionPermissionList = ref<IConditionPermissionItem[]>([]);
    const regionDefaultCondition = ref('');
    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<IListItem, IGetTgoBullionListReq>({
      request: {
        api: getTgoBullionList,
        params: {
          customerName: '',
          regionCode: regionDefaultCondition.value,
          pageNum: 1,
          pageSize: 10,
        },
      },
    });

    const getRegionAreaList = async () => {
      const res = await getRegionList();
      const data = res?.data ?? [];
      const list = data.map((item) => {
        return {
          label: item.regionName!,
          value: item.regionCode!,
          permissionCode: `CCS-CWGL-TGJT-${item.regionCode}`,
        };
      });
      const {
        permissionList,
        defaultCondition,
      } = useConditionPermissionList(
        list,
        true,
      );
      regionPermissionList.value = permissionList;
      regionDefaultCondition.value = defaultCondition!;
    };

    const handleAuth = <T extends (...args: unknown[]) => ReturnType<T>>(cb: any, param?: unknown[]) => {
      if (!regionPermissionList.value.length) {
        ElMessage.error('当前账号暂无客户区域的权限！');
        return;
      }
      if (param) {
        cb.call(this, ...param);
      } else {
        cb.call(this);
      }
    };

    const searchConfig = computed(() => {
      return [
        {
          name: '客户名称：',
          component: 'input',
          valueName: 'customerName',
          placeholder: '请输入客户名称',
          maxlength: '100',
        },
        {
          name: '客户区域：',
          component: 'select',
          valueName: 'regionCode',
          placeholder: '请选择客户区域',
          options: regionPermissionList.value,
          clearable: false,
        },
      ];
    });

    const init = async () => {
      try {
        await getRegionAreaList();
        // 默认值
        params.value.regionCode = regionDefaultCondition.value;
        handleAuth(handleSearch);
      } catch (e) {
        console.log(e);
      }
    };
    init();

    return {
      params,
      tableTotal,
      tableData,
      handleAuth,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      renderColumns,
      searchConfig,
    };
  },
});
</script>
