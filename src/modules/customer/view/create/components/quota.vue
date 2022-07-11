<template>
  <div>
    <el-form
      :model="amountForm"
      ref="amountFormRef"
      :rules="amountRules"
    >
      <p class="title">
        额度信息
      </p>
      <el-form-item
        label="额度管理状态"
        prop="amountStatus"
      >
        <el-switch
          :disabled="readOnly"
          v-model="amountForm.amountStatus"
          :active-value="AMOUNT_STATUS_ENUM.OPEN"
          :inactive-value="AMOUNT_STATUS_ENUM.CLOSE"
          active-color="#13ce66"
          inactive-color="#bbb"
        ></el-switch>
      </el-form-item>
      <div class="card-group">
        <div class="card">
          <i>期初额度（元）</i>
          <p v-text="formatAmount(amountForm.initAmount)"></p>
        </div>
        <div class="card">
          <i>可用额度（元）</i>
          <p v-text="formatAmount(amountForm.availableAmount)"></p>
        </div>
      </div>
    </el-form>

    <el-form
      :model="amountForm"
      ref="initAmountsRef"
    >
      <p class="title">
        调整期初额度记录明细
      </p>
      <el-table
        :data="amountForm.initAmounts"
        border
      >
        <el-table-column
          label="来源系统"
          width="108px"
        >
          <template #default>
            客户授信CCS
          </template>
        </el-table-column>
        <el-table-column
          label="单据号"
          width="152px"
          prop="billCode"
        >
        </el-table-column>
        <el-table-column
          label="功能模块"
          width="102px"
          prop="billName"
        >
        </el-table-column>
        <el-table-column
          label="调整类型"
          width="138px"
          prop="adjustType"
        >
          <template #default="scope">
            {{$filters.getEnumLabel(ADJUST_TYPE_ENUM_LIST, scope.row.adjustType)}}
          </template>
        </el-table-column>
        <el-table-column
          label="金额"
          width="168px"
        >
          <template #header>
            <span class="star">*</span>
            <span>金额</span>
          </template>
          <template #default="scope">
            <span v-if="!initAmountsItem">{{formatAmount(scope.row.amount)}}</span>
            <el-form-item
              :prop="`initAmounts.${scope.$index}.amount`"
              :rules="initAmountsRules.amount"
              v-else
            >
              <el-input
                placeholder="请输入金额"
                maxlength="15"
                v-model="scope.row.amount"
                @change="initAmounNumber(scope.row)"
              >
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="允超金额（元）"
          width="168px"
        >
          <template #header>
            <span class="star">*</span>
            <span>允超金额（元）</span>
          </template>
          <template #default="scope">
            <span v-if="!initAmountsItem">{{formatAmount(scope.row.allowOverAmount)}}</span>
            <el-form-item
              v-else
              :prop="`initAmounts.${scope.$index}.allowOverAmount`"
              :rules="initAmountsRules.allowOverAmount"
            >
              <el-input
                placeholder="请输入允超金额"
                maxlength="15"
                v-model="scope.row.allowOverAmount"
                @change="allowOverAmountNumber(scope.row)"
              >
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="允超比例（%）"
          width="139px"
        >
          <template #header>
            <span class="star">*</span>
            <span>允超比例（%）</span>
          </template>
          <template #default="scope">
            <span v-if="!initAmountsItem">{{scope.row.allowOverScale}}</span>
            <el-form-item
              v-else
              :prop="`initAmounts.${scope.$index}.allowOverScale`"
              :rules="initAmountsRules.allowOverScale"
            >
              <el-input
                v-model="scope.row.allowOverScale"
                maxlength="7"
                placeholder="请输入允许超比例"
              >
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="调整原因"
          width="250px"
        >
          <template #header>
            <span class="star">*</span>
            <span>调整原因</span>
          </template>
          <template #default="scope">
            <span v-if="!initAmountsItem">{{scope.row.adjustReason}}</span>
            <el-form-item
              v-else
            >
              <el-input
                placeholder="请输入调整原因"
                v-model="scope.row.adjustReason"
              >
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="时间"
          width="168px"
        >
          <template #default="scope">
            {{$filters.formatTime(scope.row.createdTime, "YYYY-MM-DD HH:mm:ss")}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作人"
          prop="creatorName"
        >
        </el-table-column>
        <el-table-column
          label="备注"
          width="250px"
        >
          <template #default="scope">
            <span v-if="!initAmountsItem">{{scope.row.remark}}</span>
            <el-form-item
              v-else
            >
              <el-input
                v-model="scope.row.remark"
                placeholder="请输入备注"
              >
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template #default>
            <div
              v-if="initAmountsItem !== null"
              class="row-accessories"
            >
              <el-icon
                class="cursor"
                @click="removeInitAmount()"
              >
                <remove></remove>
              </el-icon>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div
        class="table-accessories"
        @click="addInitAmounts()"
        v-if="amountForm.initAmounts.length === 0 && !readOnly"
      >
        <el-icon>
          <circle-plus></circle-plus>
        </el-icon>
        新增客户期初额度单
      </div>
    </el-form>

    <el-form
      :model="amountItem"
      ref="amountFormRef"
      :rules="amountsRules"
    >
      <p class="title">
        调整额度记录明细
      </p>
      <el-table
        :model="amountForm"
        border
        :data="tableData"
      >
        <el-table-column
          label="来源系统"
          width="108px"
        >
          <template #default>
            客户授信CCS
          </template>
        </el-table-column>
        <el-table-column
          label="单据号"
          prop="billCode"
          width="152px"
        >
        </el-table-column>
        <el-table-column
          label="功能模块"
          width="102px"
          prop="billName"
        >
        </el-table-column>
        <el-table-column
          label="调整类型"
          width="138px"
        >
          <template #default="scope">
            {{$filters.getEnumLabel(ADJUST_TYPE_ENUM_LIST, scope.row.adjustType)}}
          </template>
        </el-table-column>
        <el-table-column
          label="金额"
          width="168px"
        >
          <template #header>
            <span class="star">*</span>
            <span>金额</span>
          </template>
          <template #default="scope">
            <el-form-item
              v-if="scope.$index === (tableData.length - 1) && amountItem"
              prop="adjustAmount"
            >
              <el-input
                v-model="scope.row.adjustAmount"
                maxlength="15"
                placeholder="请输入金额"
                @change="amounAdjustAmountItemNumber(amountItem)"
              >
              </el-input>
            </el-form-item>
            <span v-else>{{formatAmount(scope.row.adjustAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="调整原因"
          width="250px"
        >
          <template #header>
            <span class="star">*</span>
            <span>调整原因</span>
          </template>
          <template #default="scope">
            <el-form-item
              prop="adjustReason"
              v-if="scope.$index === (tableData.length - 1) && amountItem"
            >
              <el-input
                placeholder="请输入调整原因"
                v-model="scope.row.adjustReason"
              >
              </el-input>
            </el-form-item>
            <span v-else>{{scope.row.adjustReason}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="时间"
          width="168px"
        >
          <template #default="scope">
            {{$filters.formatTime(scope.row.createdTime, "YYYY-MM-DD HH:mm:ss")}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作人"
          prop="creatorName"
        >
        </el-table-column>
        <el-table-column
          label="备注"
          width="250px"
        >
          <template #default="scope">
            <el-form-item
              v-if="scope.$index === (tableData.length - 1) && amountItem"
            >
              <el-input
                v-model="scope.row.remark"
                placeholder="请输入备注"
              >
              </el-input>
            </el-form-item>
            <span v-else>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="80px"
        >
          <template #default="scope">
            <div
              v-if="scope.$index === (tableData.length - 1) && amountItem"
              class="row-accessories"
            >
              <el-icon @click="removeAmount()">
                <remove></remove>
              </el-icon>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div
        class="table-accessories"
        @click="addAmount()"
        v-if="!readOnly"
      >
        <el-icon>
          <circle-plus></circle-plus>
        </el-icon>
        新增客户调整额度单
      </div>
      <el-row
        style="width: 100%"
        type="flex"
        justify="end"
        v-if="!amountItem"
      >
        <pagination
          :total="tableTotal"
          :current-page="params.pageNum"
          :page-size="params.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-form>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import {
  addRecord,
  getCustomerAdjustAmountDetails,
  getCustomerAmountDetails, getToken, saveInitAmount,
  updateAmount,
} from '@/modules/customer/api';
import { useRoute } from 'vue-router';
import {
  ICustomerAdjustAmountDetailPageAPI,
  ICustomerAmountDetailAPI,
} from '@/modules/customer/api/type';
import { useList } from '@/hooks/use-list';
import {
  ADJUST_TYPE_ENUM,
  ADJUST_TYPE_ENUM_LIST,
  AMOUNT_STATUS_ENUM,
} from '@/modules/customer/constant/baseInfo';
import { ElForm, ElMessageBox } from 'element-plus';
import { cloneDeep } from 'lodash-es';
import { Remove, CirclePlus } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'quota',
  components: {
    Remove,
    CirclePlus,
  },
  props: {
    customerId: {
      type: String,
      default: '',
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  setup(props) {
    const amountFormRef = ref<InstanceType<typeof ElForm> | null>(null);
    const initAmountsRef = ref<InstanceType<typeof ElForm> | null>(null);
    const amountsRef = ref<InstanceType<typeof ElForm> | null>(null);
    const customerId = ref<string>('');
    // 期初明细Bean
    const initAmountsItem = ref<ICustomerAmountDetailAPI.InitAmountsItem | null>(null);
    // 额度明细Bean
    const amountItem = ref<ICustomerAdjustAmountDetailPageAPI.ListItem | null>(null);
    // 额度信息
    const amountForm = ref<ICustomerAmountDetailAPI.IResponse>({
      amountStatus: AMOUNT_STATUS_ENUM.CLOSE,
      initAmount: '',
      availableAmount: '',
      initAmounts: [],
    });
    const originForm = ref<any>({
      initAmountsItem: cloneDeep(initAmountsItem),
      amountItem: cloneDeep(amountItem),
      amountForm: cloneDeep(amountForm),
    });
    const resetOriginForm = (attr: string, data: any) => {
      originForm.value[attr] = cloneDeep(data);
    };
    // const adjustAmount = ref<ICustomerAdjustAmountAddRecordAPI.IRequest>([])
    // 额度明细详情
    const {
      params,
      tableData,
      handleSearch,
      handleReset,
      tableTotal,
      handleSizeChange,
      handleCurrentChange,
    } = useList<
      ICustomerAdjustAmountDetailPageAPI.ListItem,
      ICustomerAdjustAmountDetailPageAPI.IRequest
      >({
        request: {
          api: getCustomerAdjustAmountDetails,
          params: {
            customerId: customerId.value,
            pageNum: 1,
            pageSize: 10,
          },
        },
      });
    // 获取详细
    const getDetails = async (id = customerId.value) => {
      if (id) {
        // 获取授信额度记录信息
        params.value.customerId = id;
        await handleSearch();
        // 获取授信额度信息
        const { data } = await getCustomerAmountDetails(id);
        amountForm.value = data;
        initAmountsItem.value = null;
        amountItem.value = null;
        resetOriginForm('amountForm', cloneDeep(amountForm.value));
        resetOriginForm('initAmountsItem', null);
        resetOriginForm('amountItem', null);
      }
    };
    watch(() => props.customerId, async (val: string) => {
      customerId.value = val;
      if (val) {
        await getDetails(val);
      }
    });
    const handleSave = async () => {
      await amountFormRef.value?.validate();
      await initAmountsRef.value?.validate();
      // 更新额度状态
      await updateAmount({
        customerId: props.customerId,
        amountStatus: amountForm.value.amountStatus,
      });
      // 新增期初额度 （数据有更改才保存）
      if (initAmountsItem.value) {
        await saveInitAmount({
          customerId: props.customerId,
          adjustType: ADJUST_TYPE_ENUM.MODIFY_INITAMOUNT,
          amount: initAmountsItem.value.amount.replaceAll(',', ''),
          allowOverAmount: initAmountsItem.value.allowOverAmount.replaceAll(',', ''),
          allowOverScale: initAmountsItem.value.allowOverScale,
          remark: initAmountsItem.value.remark,
          adjustReason: initAmountsItem.value.adjustReason,
        });
      }
      // 新增额度调整 （数据有更改才保存）
      if (amountItem.value) {
        const { data } = await getToken();
        await addRecord({
          customerId: props.customerId,
          adjustAmount: amountItem.value.adjustAmount.replaceAll(',', ''),
          adjustReason: amountItem.value.adjustReason,
          remark: amountItem.value.remark,
        }, data);
      }
      getDetails();
    };
    // 添加期初额度
    const addInitAmounts = () => {
      if (amountForm.value.initAmounts.length > 0) {
        ElMessageBox.alert('已经存在期初，不能再添加');
        return;
      }
      initAmountsItem.value = {
        billCode: '',
        sourceSystemCode: '', // 接口自动补全
        sourceSystemName: '', // 接口自动补全
        billName: '期初额度单',
        adjustType: ADJUST_TYPE_ENUM.MODIFY_INITAMOUNT,
        amount: '0',
        allowOverAmount: '100000',
        allowOverScale: '5',
        remark: '',
        adjustReason: '',
        creatorName: '',
        createdTime: '',
      };
      amountForm.value.initAmounts.push(initAmountsItem.value);
    };
    const removeInitAmount = () => {
      amountForm.value.initAmounts = [];
      initAmountsItem.value = null;
    };
    const isChange = () => {
      const currentForm = {
        initAmountsItem: cloneDeep(initAmountsItem.value),
        amountItem: cloneDeep(amountItem.value),
        amountForm: cloneDeep(amountForm.value),
      };
      console.log(JSON.stringify(originForm.value));
      console.log(JSON.stringify(currentForm));
      return !(JSON.stringify(originForm.value) === JSON.stringify(currentForm));
    };
    // 添加额度
    const addAmount = () => {
      if (amountItem.value) {
        ElMessageBox.alert('已经存在未保存的额度调整，请先保存后再试');
        return;
      }
      amountItem.value = {
        sourceSystemName: '',
        billCode: '',
        billName: '调整额度单',
        adjustType: ADJUST_TYPE_ENUM.MODIFY_AVAILABLE_AMOUNT,
        adjustAmount: '0',
        adjustReason: '',
        remark: '',
        creatorName: '',
        createdTime: '',
      };
      tableData.value.push(amountItem.value);
    };
    // 删除额度
    const removeAmount = () => {
      tableData.value.pop();
      amountItem.value = null;
    };
    const amountEditAble = computed((index: number) => {
      // amountItem 不为空时 最后一条数据为新增的可编辑数据
      if (index === (tableData.value.length - 1) && amountItem) {
        return true;
      }
      return false;
    });
    const amountRules = {
      amountStatus: [
        { required: true, message: '额度管理状态不能为空', trigger: 'change' },
      ],
    };
    onMounted(async () => {
      const id = useRoute().params.customerId || props.customerId;
      if (id) {
        customerId.value = String(id);
        getDetails(String(id));
      }
    });
    const initAmountsRules = {
      amount: [
        { required: true, message: '金额不能为空', trigger: 'change' },
      ],
      allowOverAmount: [
        { required: true, message: '允超金额不能为空', trigger: 'change' },
      ],
      allowOverScale: [
        { required: true, message: '允许超比例不能为空', trigger: 'change' },
      ],
      adjustReason: [
        { required: true, message: '调整原因为空', trigger: 'change' },
      ],
    };
    const amountsRules = {
      adjustAmount: [
        { required: true, message: '金额不能为空', trigger: 'change' },
      ],
      adjustReason: [
        { required: true, message: '调整原因为空', trigger: 'change' },
      ],
    };
    const amounAdjustAmountItemNumber = (row: ICustomerAdjustAmountDetailPageAPI.ListItem) => {
      const str = row.adjustAmount.replaceAll(',', '');
      try {
        row.adjustAmount = Number(str).toLocaleString();
        if (Number.isNaN(Number(str))) {
          row.adjustAmount = str;
        }
      } catch (e) {
        row.adjustAmount = str;
      }
    };
    const initAmounNumber = (row: ICustomerAmountDetailAPI.InitAmountsItem) => {
      const str = row.amount.replaceAll(',', '');
      try {
        row.amount = Number(str).toLocaleString();
        if (Number.isNaN(Number(str))) {
          row.amount = str;
        }
      } catch (e) {
        row.amount = str;
      }
    };
    const allowOverAmountNumber = (row: ICustomerAmountDetailAPI.InitAmountsItem) => {
      const str = row.allowOverAmount.replaceAll(',', '');
      try {
        row.allowOverAmount = Number(str).toLocaleString();
        if (Number.isNaN(Number(str))) {
          row.allowOverAmount = str;
        }
      } catch (e) {
        row.allowOverAmount = str;
      }
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
    return {
      params,
      tableData,
      handleSearch,
      handleReset,
      tableTotal,
      handleSizeChange,
      handleCurrentChange,
      amounAdjustAmountItemNumber,
      initAmounNumber,
      allowOverAmountNumber,
      amountRules,
      formatAmount,
      handleSave,
      addAmount,
      removeAmount,
      removeInitAmount,
      amountItem,
      amountForm,
      AMOUNT_STATUS_ENUM,
      ADJUST_TYPE_ENUM,
      addInitAmounts,
      ADJUST_TYPE_ENUM_LIST,
      initAmountsItem,
      amountEditAble,
      isChange,
      amountFormRef,
      initAmountsRef,
      initAmountsRules,
      amountsRef,
      amountsRules,
    };
  },
});
</script>

<style scoped lang="scss">
.title{
  border-left: 4px solid #4D88FF;
  padding-left: 8px;
  font-size: 16px;
  height: 16px;
  line-height: 16px;
  margin-bottom: 24px;
  margin-top: 24px;
}
.card-group{
  .card{
    position: relative;
    width: 320px;
    height: 106px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #E1E4ED;
    margin-right: 24px;
    display: inline-block;
    padding: 16px;
    margin-bottom: 24px;
    i{
      display: inline-block;
      font-style: normal;
      position: relative;
      height: 22px;
      line-height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: #909299;
      margin-left: 16px;
      &::before{
        content: " ";
        position: absolute;
        left: -16px;
        top: 7px;
        display: block;
        border-radius: 4px;
        width: 8px;
        height: 8px;
        background: #FAA732;
      }
    }
    p{
      margin-left: 16px;
      height: 40px;
      font-size: 32px;
      font-weight: 500;
      color: #303133;
      line-height: 40px;
      font-weight: bold;
      margin-top: 8px;
    }
  }
}
.table-accessories{
  width: 100%;
  background: #F2F6FF;
  border-radius: 2px;
  border: 1px dashed #ABBEF5;
  padding: 9px 12px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #4974F5;
  cursor: pointer;
  transition: all 0.2s ease-in;
  &:hover{
    background: #e6edfd;
  }
}
.row-accessories{
  //width: 100%;
  //margin-top: 8px;
  //font-size: 24px;
  //font-weight: 500;
  //color: #4974F5;
  text-align: center;
  :deep{
    i{
      font-size: 24px;
      color: #4974F5;
      cursor: pointer;
    }
  }
}
.star{
  color:#F56C6C
}
</style>
