<template>
  <div>
    <el-form
      :model="form"
      ref="formRef"
    >
      <el-table
        border
        :data="form"
      >
        <el-table-column
          label="来源系统"
          width="250px"
        >
          <template #header>
            <span class="star">*</span>
            <span>来源系统</span>
          </template>
          <template #default="scope">
            <el-form-item
              :prop="`.${scope.$index}.sourceSystemCode`"
              :rules="rules.sourceSystemCode"
            >
              <el-select
                v-model="scope.row.sourceSystemCode"
                placeholder="请选系统来源"
                clearable
                :disabled="readOnly"
                @change="handleSystemCodeChange(scope.row)"
              >
                <el-option
                  v-for="item in (optionalArr.concat(getCurrentItem(scope.row.sourceSystemCode)))"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="客户编码"
        >
          <template #header>
            <span class="star">*</span>
            <span>客户编码</span>
          </template>
          <template #default="scope">
            <el-form-item
              :prop="`.${scope.$index}.sourceCustomerCode`"
              :rules="rules.sourceCustomerCode"
            >
              <el-input
                placeholder="请输入客户编码"
                maxlength="32"
                :disabled="readOnly"
                v-model="scope.row.sourceCustomerCode"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="客户全称"
        >
          <template #header>
            <span class="star">*</span>
            <span>客户全称</span>
          </template>
          <template #default="scope">
            <el-form-item
              :prop="`.${scope.$index}.sourceCustomerName`"
              :rules="rules.sourceCustomerName"
            >
              <el-input
                placeholder="请输入客户全称"
                maxlength="60"
                v-model="scope.row.sourceCustomerName"
                :disabled="readOnly"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="80px"
          v-if="!readOnly"
        >
          <template #default="scope">
            <div
              class="row-accessories"
            >
              <el-icon @click="remove(scope.row)">
                <remove></remove>
              </el-icon>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-accessories" v-if="!readOnly">
        <el-icon class="cursor" @click="add()">
          <circle-plus></circle-plus>
        </el-icon>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { getCustomerRelation, saveCustomerRelation } from '@/modules/customer/api';
import { ICustomerExtRelationListAPI } from '@/modules/customer/api/type';
import { useDictionary } from '@/hooks/use-dictionary';
import { IDictionaryItem } from '@/hooks/use-dictionary/types';
import { ElForm } from 'element-plus';
import { cloneDeep } from 'lodash-es';
import { Remove, CirclePlus } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'relation',
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
    const formRef = ref<InstanceType<typeof ElForm> | null>(null);
    const originForm = ref<ICustomerExtRelationListAPI.ListItem[]>([]);
    const form = ref<ICustomerExtRelationListAPI.ListItem[]>([]);
    const { getDictionaryOptions } = useDictionary();
    const selectedArr = ref<IDictionaryItem[]>([]);
    // 供应商类型数据字典
    const CCS_EXTERNAL_SYSTEM_SOURCE = computed(() => getDictionaryOptions('ccs_external_system_source'));

    const optionalArr = computed(() => {
      // return CCS_EXTERNAL_SYSTEM_SOURCE.value.concat(selectedArr.value).filter(
      //   v => CCS_EXTERNAL_SYSTEM_SOURCE.value.includes(v) && !selectedArr.value.includes(v),
      // );
      return CCS_EXTERNAL_SYSTEM_SOURCE.value.filter((item) => {
        const values = form.value.map(v => v.sourceSystemCode);
        return !values.includes(item.value);
      });
    });
    const getCurrentItem = (val: string) => {
      return CCS_EXTERNAL_SYSTEM_SOURCE.value.filter(v => v.value === val);
    };
    const handleSystemCodeChange = async (val: string) => {
      const arr = CCS_EXTERNAL_SYSTEM_SOURCE.value.filter(v => v.value === val);
      selectedArr.value = selectedArr.value.concat(arr);
    };

    const getDetails = async (id = props.customerId) => {
      if (id) {
        // 获取对外关系信息
        const { data } = await getCustomerRelation(id);
        form.value = data;
        originForm.value = cloneDeep(form.value);
      }
    };
    watch(() => props.customerId, async (val: string) => {
      if (val) {
        await getDetails(val);
      }
    });
    const add = () => {
      form.value.push({
        relationId: '',
        sourceCustomerCode: '',
        sourceCustomerName: '',
        sourceSystemName: '',
        sourceSystemCode: '',
      });
    };
    const handleSave = async () => {
      await formRef.value?.validate();
      await saveCustomerRelation({
        customerId: props.customerId,
        list: form.value,
      });
      await getDetails();
    };
    const remove = (row: ICustomerExtRelationListAPI.ListItem) => {
      const index = form.value.indexOf(row);
      form.value.splice(index, 1);
    };
    const isChange = () => {
      return !(JSON.stringify(form.value) === JSON.stringify(originForm.value));
    };
    onMounted(() => {
      const id = props.customerId;
      if (id) {
        getDetails(String(id));
      }
    });
    const rules = {
      sourceSystemCode: [
        { required: true, message: '系统来源不能为空', trigger: 'change' },
      ],
      sourceCustomerCode: [
        { required: true, message: '客户编码不能为空', trigger: 'blur' },
      ],
      sourceCustomerName: [
        { required: true, message: '客户全称不能为空', trigger: 'blur' },
      ],
    };
    return {
      form,
      CCS_EXTERNAL_SYSTEM_SOURCE,
      handleSystemCodeChange,
      add,
      handleSave,
      optionalArr,
      getCurrentItem,
      remove,
      isChange,
      formRef,
      rules,
    };
  },
});
</script>

<style scoped lang="scss">
.cursor{
  cursor: pointer;
}
.table-accessories{
  width: 100%;
  //background: #F2F6FF;
  //border-radius: 2px;
  //border: 1px dashed #ABBEF5;
  //padding: 9px 12px;
  margin-top: 8px;
  font-size: 24px;
  font-weight: 500;
  color: #4974F5;
  :deep{
    i{
      font-size: 24px;
    }
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
