<template>
  <app-page>
    <template #fheader>
      <search-area
        v-model="params"
        :config="searchConfig"
        @handleSearch="handleSearch"
        @handleReset="handleReset"
      />
    </template>
    <template #header>
      <el-row justify="end">
        <router-link
          v-if="CAN_CREATE"
          :to="{
            name: 'CustomerManageCreateGroup'
          }"
        >
          <el-button type="primary">
            创建集团
          </el-button>
        </router-link>
      </el-row>
    </template>
    <template #main="{ height }">
      <custom-table
        border
        :key="height"
        :height="height"
        :data="tableData"
        :columns="renderColumns(
          CAN_VIEW,
          CAN_UPDATE,
        )"
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </template>
  </app-page>
</template>

<script lang="tsx">
import { defineComponent } from 'vue';
import { formatTime } from '@tiangong/utils';

import { useList } from '@/hooks/use-list';
import { getGroupList } from '@/modules/customer-manage/group-manage/api';
import { IParams, IListItem } from './types';
import { renderColumns } from './composables/tableData';
import { usePermissionConfig } from '../../use-permission-config';

export default defineComponent({
  name: 'CustomerManageGroupList',
  setup() {
    const {
      CAN_CREATE,
      CAN_VIEW,
      CAN_UPDATE,
    } = usePermissionConfig();
    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<IListItem, IParams>({
      request: {
        api: getGroupList,
        params: {
          groupName: '',
          createdTimeStart: '',
          createdTimeEnd: '',
          pageNum: 1,
          pageSize: 10,
        },
        handleParams(paramsObj) {
          // 处理时间
          if (paramsObj.createDate?.length === 2) {
            [paramsObj.createdTimeStart, paramsObj.createdTimeEnd] = paramsObj.createDate;
          }
          delete paramsObj.createDate;
          return {
            ...paramsObj,
          };
        },
      },
    });

    handleSearch();

    return {
      CAN_CREATE,
      CAN_VIEW,
      CAN_UPDATE,
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      renderColumns,
      searchConfig: [
        {
          name: '集团名称：',
          component: 'input',
          valueName: 'groupName',
          placeholder: '请输入集团名称',
          maxlength: '100',
        },
        {
          name: '创建时间：',
          component: 'datePicker',
          valueName: ['createdTimeStart', 'createdTimeEnd'],
          placeholder: ['开始日期', '结束日期'],
          disabledDate: (time: Date) => {
            return time.getTime() > new Date(formatTime(Date.now())).getTime();
          },
        },
      ],
    };
  },
});
</script>
