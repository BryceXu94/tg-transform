<template>
  <div>
    <app-page class="configuration-list">
      <template #fheader>
        <el-form
          label-width="120px"
          :model="params"
          @keyup.enter="handleSearch()"
        >
          <el-form-item prop="userId" label="人员名称:">
            <query-select
              v-model="params.userId"
              placeholder="请输入人员名称"
              :method="getUserInfo"
              :config="{
                labelKey: 'username',
                valueKey: 'userId',
                keywordQueryKey: 'username',
                valueQueryKey: 'username',
                dataKey: 'data',
                showCode: true,
                codeKey: 'userCode',
              }"
            />
          </el-form-item>
          <el-form-item label-width="0" class="margin-left-20">
            <el-button
              type="primary"
              @click="handleSearch()"
              @keyup.enter="handleSearch()"
            >
              查询
            </el-button>
            <el-button @click="handleReset()">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #header>
        <header-area>
          <template #button>
            <el-button
              type="primary"
              v-if="CAN_CREATE"
              @click="
                () => {
                  handleOpenDialog(CreateDataDialog, {
                    params: {
                      onSuccess: () => handleSearch(),
                      type: CREATE_EDIT_ENUM.CREATE,
                    },
                  });
                }
              "
            >
              创建
            </el-button>
          </template>
        </header-area>
      </template>
      <template #main="{ height }">
        <custom-table
          border
          :height="height"
          :key="height"
          :data="tableData"
          :columns="
            dataRenderColumns(
              handleCreateData,
              handleDeleteData,
              handleOperation,
              CAN_EDIT,
              CAN_DELETE,
              CAN_VIEW_LOG
            )
          "
        />
      </template>
      <template #ffooter>
        <el-row
          style="width: 100%"
          type="flex"
          justify="end"
        >
          <pagination
            :total="tableTotal"
            :current-page="params.pageNum"
            :page-size="params.pageSize"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </template>
      <!-- 操作日志 -->
      <operation-drawer
        v-model="operation.visible"
        :request="getSalesLogsApi"
        :requestParams="{
          buzId: operation.configId,
        }"
        :config="logConfig"
      />
    </app-page>
  </div>
</template>
<script lang="tsx">
import { defineComponent, reactive } from 'vue';
import { useList } from '@/hooks/use-list';
import CustomTable from '@/components/custom-table';
import {
  IDataPermissionConfigPageReq,
  IDataPermissionConfigPageRes,
} from '@/modules/configuration-manage/data-permissions/api/type';
import { LOG_OPERATE_TYPE_LIST } from '@/modules/configuration-manage/data-permissions/constant';
import { dataRenderColumns } from './hooks/use-table-columns';
import {
  getDataPermissionConfigList,
  getDataPermissionConfigDetail,
  getSalesLogsApi,
} from '@/modules/configuration-manage/data-permissions/api';
import { getUserInfo } from '@/api/query-options';
import CreateDataDialog from './components/create-data-dialog.vue';
import OperationDrawer from '@/components/operation-drawer/index.vue';
import DeleteDialog from './components/delete-dialog.vue';
import { handleOpenDialog } from '@/hooks/use-dialog';
import { CREATE_EDIT_ENUM } from './type';
import { usePermissionConfig } from '@/modules/configuration-manage/data-permissions/use-permission-config';

export default defineComponent({
  name: 'ConfigurationManageList',
  components: {
    CustomTable,
    OperationDrawer,
  },
  setup() {
    const {
      params,
      tableTotal,
      tableData,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<IDataPermissionConfigPageRes, IDataPermissionConfigPageReq>({
      request: {
        api: getDataPermissionConfigList,
        params: {
          pageNum: 1,
          pageSize: 10,
          userId: '',
        },
      },
    });

    handleSearch();
    // 权限
    const { CAN_CREATE, CAN_EDIT, CAN_DELETE, CAN_VIEW_LOG } = usePermissionConfig();

    // 编辑数据
    const handleCreateData = async (configId: string, type: string) => {
      try {
        const { data } = await getDataPermissionConfigDetail({ configId });
        const { configType, dataObjectType, dataObjectId, dataObjectName, detailVos } = data;
        handleOpenDialog(CreateDataDialog, {
          params: {
            onSuccess: () => handleSearch(params.value.pageNum),
            configId,
            configType,
            dataObjectType,
            dataObjectId,
            dataObjectName,
            detailVos,
            type,
          },
        });
      } catch (e) {
        console.error(e);
      }
    };

    // 删除数据
    const handleDeleteData = (configId: string) => {
      handleOpenDialog(DeleteDialog, {
        configId,
        pageNum: params.value.pageNum,
        success: handleSearch,
      });
    };

    // 操作日志
    const operation = reactive({
      visible: false,
      configId: '',
    });
    const handleOperation = async (id: string) => {
      operation.configId = id;
      operation.visible = true;
    };

    return {
      params,
      tableTotal,
      tableData,
      operation,
      CREATE_EDIT_ENUM,

      // 权限
      CAN_CREATE,
      CAN_EDIT,
      CAN_DELETE,
      CAN_VIEW_LOG,
      dataRenderColumns,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      handleCreateData,
      handleDeleteData,
      CreateDataDialog,
      handleOpenDialog,
      handleOperation,
      getSalesLogsApi,
      getUserInfo,
      logConfig: {
        timeKey: 'createdTime',
        userKey: 'creatorName',
        remarkKey: '',
        contentKey: 'logType',
        operateList: LOG_OPERATE_TYPE_LIST,
      },
    };
  },
});
</script>

<style scoped lang="scss">
.configuration-list {
  :deep(.personnel-list) {
    display: inline-block;
  }
}
</style>
