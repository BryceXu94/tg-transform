<template>
  <app-page :fheader="{ showCollapse: false, col: { xs: 24, sm: 12, md: 12, lg: 6, xl: 6 } }">
    <template #fheader>
      <el-form
        :model="params"
        label-width="148px"
        @keydown.enter="handleSearch()"
      >
        <el-form-item
          label="客户编码："
          prop="supplierCode"
        >
          <el-input
            clearable
            v-model.trim="params.customerCode"
            placeholder="请输入客户编码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="客户名称（全称）："
          prop="supplierCode"
        >
          <el-input
            clearable
            v-model.trim="params.customerName"
            placeholder="请输入客户名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="客户名称（简称）："
          prop="supplierCode"
        >
          <el-input
            clearable
            v-model.trim="params.customerSimple"
            placeholder="请输入客户名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          class="margin-left-20"
          label-width="0"
        >
          <el-button
            type="primary"
            @click="handleSearch()"
          >查询</el-button>
          <el-button
            @click="handleReset"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #header v-if="$has(permission.CJ)">
      <div>
        <el-button type="primary" @click="toCreate">创建</el-button>
      </div>
    </template>
    <!-- 主体内容 -->
    <template #main="{ height }">
      <el-table
        :data="tableData"
        border
        :height="height - 1"
        style="width: 100%"
      >
        <el-table-column
          prop="customerCode"
          label="客户编码"
          min-width="158px"
        >
          <template #default="scope">
            <p class="text-color-blue cursor" @click="toDetails(scope.row)">
              {{scope.row.customerCode}}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="客户名称（全称）"
          min-width="168px"
        >
        </el-table-column>
        <el-table-column
          prop="customerSimple"
          label="客户简称"
          min-width="128px"
        >
        </el-table-column>
        <el-table-column
          prop="customerStatus"
          label="客户状态"
          min-width="128px"
        >
          <template #default="scope">
            {{$filters.getEnumLabel(CUSTOMER_STATUS_ENUM_LIST, scope.row.customerStatus)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="amountStatus"
          label="额度管理状态"
          min-width="168px"
        >
          <template #default="scope">
            {{$filters.getEnumLabel(AMOUNT_STATUS_ENUM_LIST, scope.row.amountStatus)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="initAmount"
          label="期初额度"
          min-width="128px"
        >
          <template #default="scope">
            {{formatAmount(scope.row.initAmount)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="availableAmount"
          label="可用额度"
          min-width="128px"
        >
          <template #default="scope">
            {{formatAmount(scope.row.availableAmount)}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200px"
        >
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              plain
              @click="toEdit(scope.row)"
              v-if="$has(permission.BJ)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
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
  </app-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { getCustomerList } from '../api';
import { ICustomerPageAPI } from '../api/type';
import { useList } from '../../../hooks/use-list';
import { useRouter } from 'vue-router';
import {
  AMOUNT_STATUS_ENUM_LIST,
  CUSTOMER_STATUS_ENUM_LIST,
} from '@/modules/customer/constant/baseInfo';
import usePermissionConfig from '@/modules/customer/use-permission-config';
import { has } from '@/core/plugins/filter';

export default defineComponent({
  name: 'list',
  setup() {
    const permission = usePermissionConfig();
    const router = useRouter();
    const {
      params,
      tableTotal,
      tableData,
      tableLoading,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
    } = useList<ICustomerPageAPI.ListItem, ICustomerPageAPI.IRequest>({
      request: {
        api: getCustomerList,
        params: {
          pageNum: 1,
          pageSize: 10,
        },
      },
    });
    const toEdit = (row: ICustomerPageAPI.ListItem) => {
      router.push({
        name: 'CustomerEdit',
        params: {
          id: row.customerId,
        },
      });
    };
    const toDetails = (row: ICustomerPageAPI.ListItem) => {
      if (!has(permission.CK)) {
        return;
      }
      router.push({
        name: 'CustomerDetails',
        params: {
          id: row.customerId,
        },
      });
    };
    const formatAmount = (val: string) => {
      if (Number.isNaN(Number(val))) {
        return val;
      }
      try {
        const str = Number(val).toLocaleString();
        return str;
      } catch (e) {
        return val;
      }
    };
    const toCreate = () => {
      router.push({
        name: 'CustomerCreate',
      });
    };
    onMounted(() => {
      handleSearch();
    });
    return {
      params,
      tableTotal,
      tableData,
      tableLoading,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      toDetails,
      toEdit,
      toCreate,
      CUSTOMER_STATUS_ENUM_LIST,
      AMOUNT_STATUS_ENUM_LIST,
      permission,
      formatAmount,
    };
  },
});
</script>

<style scoped>
.cursor{
  cursor: pointer;
}
</style>
