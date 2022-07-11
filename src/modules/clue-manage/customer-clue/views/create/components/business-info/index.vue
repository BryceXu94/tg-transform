<template>
  <el-form
    :rules="rules"
    :model="formData"
    label-width="140px"
    ref="formEl"
  >
    <custom-card title="工商信息">
      <responsive-row
        :col="{
          xs: 12, sm: 12, md: 12, lg: 12, xl: 12
        }"
      >
        <el-form-item label="统一社会信用代码" prop="socialCreditCode">
          <el-input
            class="search_btn"
            v-model.trim="formData.socialCreditCode"
            :disabled="!!formData.customerName"
            :maxlength="18"
            placeholder="请输入统一社会信用代码"
          >
            <template #suffix>
              <el-button
                type="primary"
                style="right: 0px;"
                @click="handleSearchBusinessInfo"
                :disabled="!!formData.customerName"
                :icon="Search"
              >天眼查</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input
            v-model.trim="formData.customerName"
            placeholder="请输入客户名称"
            disabled
          />
        </el-form-item>
        <el-form-item label="注册地址" prop="addressSelect">
          <address-picker
            v-model:province="formData.registrationProvince"
            v-model:city="formData.registrationCity"
            v-model:area="formData.registrationRegion"
          />
        </el-form-item>
        <el-form-item
          label=""
          label-width="10px"
          prop="address"
        >
          <el-input
            v-model="formData.registrationAddress"
            placeholder="详细地址（如街道、门牌）"
            :maxlength="100"
          />
        </el-form-item>
        <el-form-item label="营业状态" prop="openState">
          <el-input
            v-model.trim="formData.openState"
            :maxlength="20"
            placeholder="请输入营业状态"
          />
        </el-form-item>
        <el-form-item label="公司类型" prop="companyType">
          <el-input
            v-model.trim="formData.companyType"
            :maxlength="100"
            placeholder="请输入公司类型"
          />
        </el-form-item>
        <el-form-item label="成立日期" prop="establishmentDate">
          <el-date-picker
            class="select-full"
            v-model="formData.establishmentDate"
            placeholder="请选择成立日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="法人代表" prop="artificialPerson">
          <el-input
            v-model.trim="formData.artificialPerson"
            placeholder="请输入法人代表姓名"
            :maxlength="20"
          />
        </el-form-item>
        <el-form-item label="实缴资本" prop="actualPayCapital">
          <input-number
            v-model="formData.actualPayCapital"
            placeholder="请输入实缴资本"
            :max="9999.99"
            :precision="2"
            :min="0"
          >
            <template #append>万元人民币</template>
          </input-number>
        </el-form-item>
        <el-form-item label="注册资本" prop="regCapital">
          <input-number
            v-model="formData.regCapital"
            placeholder="请输入注册资本"
            :max="9999.99"
            :precision="2"
            :min="0"
          >
            <template #append>万元人民币</template>
          </input-number>
        </el-form-item>
      </responsive-row>
    </custom-card>
  </el-form>
</template>
<script lang="ts">
import { defineComponent, ref, computed, PropType, nextTick } from 'vue';
import { IBusinessInfo } from '../../type';
import { FormRules, ElForm, ElMessage } from 'element-plus';
import { isEmpty } from '@tiangong/utils';
import CustomCard from '@/modules/clue-manage/components/custom-card/index.vue';
import { getCompanyBusinessInfo } from '@/api/global';
import dayjs from 'dayjs';
import { Search } from '@element-plus/icons-vue';

export default defineComponent({
  components: {
    CustomCard,
  },
  emits: ['update:data'],
  props: {
    data: {
      type: Object as PropType<IBusinessInfo>,
      required: true,
    },
  },
  setup(props) {
    const formEl = ref<InstanceType<typeof ElForm>>();
    const formData = computed(() => props.data);
    const needValidateAll = ref(false);
    // 天眼查查询
    const handleSearchBusinessInfo = async () => {
      if (formData.value!.socialCreditCode) {
        const { data } = await getCompanyBusinessInfo({
          socialCreditCode: formData.value!.socialCreditCode!,
        });
        formData.value!.socialCreditCode = data.socialCreditCode;
        formData.value!.customerName = data.customerName;
        formData.value!.registrationProvince = data.registrationProvince;
        formData.value!.registrationCity = data.registrationCity;
        formData.value!.registrationRegion = data.registrationRegion;
        formData.value!.registrationAddress = data.registrationAddress;
        formData.value!.openState = data.openState;
        formData.value!.companyType = data.companyType;
        formData.value!.establishmentDate = data.establishmentDate
          ? dayjs(data.establishmentDate).format('YYYY-MM-DD')
          : '';
        formData.value!.artificialPerson = data.artificialPerson;
        formData.value!.actualPayCapital = data.actualPayCapital;
        formData.value!.actualCapitalCurrency = data.actualCapitalCurrency;
        formData.value!.regCapital = data.regCapital;
        formData.value!.regCapitalCurrency = data.regCapitalCurrency;
      } else {
        ElMessage.warning('请输入社会统一征信代码');
      }
    };
    const rules = computed<FormRules>(() => {
      return {
        socialCreditCode: [
          {
            required: true,
            message: '信用代码不能为空',
          },
        ],
        customerName: [
          {
            required: true,
            message: '客户名称不能为空',
          },
        ],
        addressSelect: [
          {
            required: true,
            validator: (_rules, _value, cb) => {
              if (!needValidateAll.value) {
                cb();
                return;
              }
              if (
                isEmpty(formData.value?.registrationProvince)
                || isEmpty(formData.value?.registrationCity)
                || isEmpty(formData.value?.registrationRegion)
              ) {
                cb('请完善注册地址');
              } else {
                cb();
              }
            },
          },
        ],
        address: [
          {
            validator: (_rules, value, cb) => {
              if (!needValidateAll.value) {
                cb();
                return;
              }
              if (isEmpty(formData.value.registrationAddress)) {
                cb('详细地址不能为空');
              } else {
                cb();
              }
            },
          },
        ],
        openState: [
          {
            required: true,
            validator: (_rules, value, cb) => {
              if (!needValidateAll.value) {
                cb();
                return;
              }
              if (isEmpty(value)) {
                cb('营业状态不能为空');
              } else {
                cb();
              }
            },
          },
        ],
        companyType: [
          {
            required: true,
            validator: (_rules, value, cb) => {
              if (!needValidateAll.value) {
                cb();
                return;
              }
              if (isEmpty(value)) {
                cb('公司类型不能为空');
              } else {
                cb();
              }
            },
          },
        ],
        establishmentDate: [
          {
            required: true,
            validator: (_rules, value, cb) => {
              if (!needValidateAll.value) {
                cb();
                return;
              }
              if (isEmpty(value)) {
                cb('成立日期不能为空');
              } else {
                cb();
              }
            },
          },
        ],
        artificialPerson: [
          {
            required: true,
            validator: (_rules, value, cb) => {
              if (!needValidateAll.value) {
                cb();
                return;
              }
              if (isEmpty(value)) {
                cb('法人代表不能为空');
              } else {
                cb();
              }
            },
          },
        ],
        actualPayCapital: [
          // {
          //   required: true,
          //   validator: (_rules, value, cb) => {
          //     if (!needValidateAll.value) {
          //       cb();
          //       return;
          //     }
          //     if (isEmpty(value)) {
          //       cb('实缴资本不能为空');
          //     } else {
          //       cb();
          //     }
          //   },
          // },
        ],
        regCapital: [
          {
            required: true,
            validator: (_rules, value, cb) => {
              if (!needValidateAll.value) {
                cb();
                return;
              }
              if (isEmpty(value)) {
                cb('注册资本不能为空');
              } else {
                cb();
              }
            },
          },
        ],
      };
    });
    // 校验全部
    const validateAll = async () => {
      try {
        needValidateAll.value = true;
        await nextTick();
        await formEl.value?.validate();
      } catch (error: any) {
        throw new Error(error);
      } finally {
        setTimeout(() => {
          needValidateAll.value = false;
        }, 100);
      }
    };
    // 校验部分
    const validateCode = async () => {
      needValidateAll.value = false;
      await nextTick();
      await formEl.value?.validate();
    };
    return {
      formEl,
      formData,
      handleSearchBusinessInfo,
      rules,
      validateCode,
      validateAll,
      Search,
    };
  },
});
</script>
<style lang="scss" scoped>
.search_btn{
  :deep(.el-input__suffix){
    right: 0;
  }
}
</style>
