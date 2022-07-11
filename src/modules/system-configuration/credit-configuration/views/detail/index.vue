<template>
  <app-page>
    <template #main>
      <div class="detail-container">
        <el-form
          :model="form"
          ref="formEl"
        >
          <detail-title title="客户授信限制" />
          <div class="wrap">
            <div class="item">
              客户账单逾期
              <el-form-item
                prop="customer_credit_limit.configContent.overdueDays"
                style="width: 150px; margin: 0 5px;"
                :rules="{
                  required: form.customer_credit_limit.configState === YES_OR_NO_NUMBER_ENUM.YES,
                  message: '逾期天数不能为空'
                }"
              >
                <input-number
                  v-model="form.customer_credit_limit.configContent.overdueDays"
                  :min="1"
                  :max="99"
                  :precision="0"
                />
              </el-form-item>
              天时，自动停用授信
            </div>
            <div class="tip">（仅在停用一次，可手动调整授信状态）</div>
            <el-form-item
              prop="customer_credit_limit.configState"
              class="switch"
            >
              <el-switch
                v-model="form.customer_credit_limit.configState"
                :active-value="YES_OR_NO_NUMBER_ENUM.YES"
                :inactive-value="YES_OR_NO_NUMBER_ENUM.NO"
              />
            </el-form-item>
          </div>
          <detail-title title="BD授信限制" />
          <div class="wrap">
            <div class="item">
              同一BD存在
              <el-form-item
                prop="bd_add_credit_limit.configContent.overdueNumber"
                style="width: 150px; margin: 0 5px;"
                :rules="{
                  required: [form.bd_add_credit_limit.configState, form.bd_customer_credit_limit.configState]
                    .includes(YES_OR_NO_NUMBER_ENUM.YES),
                  message: '客户个数不能为空'
                }"
              >
                <input-number
                  v-model="form.bd_add_credit_limit.configContent.overdueNumber"
                  :min="1"
                  :max="99"
                  :precision="0"
                />
              </el-form-item>
              个及以上逾期
              <el-form-item
                prop="bd_add_credit_limit.configContent.overdueDays"
                style="width: 150px; margin: 0 5px;"
                :rules="{
                  required: [form.bd_add_credit_limit.configState, form.bd_customer_credit_limit.configState]
                    .includes(YES_OR_NO_NUMBER_ENUM.YES),
                  message: '逾期天数不能为空'
                }"
              >
                <input-number
                  v-model="form.bd_add_credit_limit.configContent.overdueDays"
                  :min="1"
                  :max="99"
                  :precision="0"
                />
              </el-form-item>
              天客户时，禁止BD新增授信申请
              <el-form-item
                prop="bd_add_credit_limit.configState"
                class="switch inner"
              >
                <el-switch
                  v-model="form.bd_add_credit_limit.configState"
                  :active-value="YES_OR_NO_NUMBER_ENUM.YES"
                  :inactive-value="YES_OR_NO_NUMBER_ENUM.NO"
                />
              </el-form-item>
            </div>
            <div class="item relate">
              同时禁止关联客户新增初始授信
              <el-form-item
                prop="bd_customer_credit_limit.configState"
                class="switch inner"
              >
                <el-switch
                  v-model="form.bd_customer_credit_limit.configState"
                  :active-value="YES_OR_NO_NUMBER_ENUM.YES"
                  :inactive-value="YES_OR_NO_NUMBER_ENUM.NO"
                />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </template>
    <template #ffooter>
      <el-row
        style="width: 100%"
        justify="end"
        align="middle"
      >
        <div class="warn">所有的调整在提交后生效</div>
        <el-button type="primary" @click="handleSubmit">
          提交
        </el-button>
      </el-row>
    </template>
  </app-page>
</template>

<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { isEmpty } from 'lodash-es';

import { ElForm, ElMessage } from 'element-plus';

import { YES_OR_NO_NUMBER_ENUM } from '@/constant';
import { submitCreditConfiguration, getCreditConfiguration } from '../../api';
import { IGetCreditConfigurationRes, ICreditConfigurationItem } from '../../api/types';
import { CREDIT_CONFIGURATION_TYPE_ENUM } from '../../constant';

export default defineComponent({
  setup() {
    const formEl = ref<InstanceType<typeof ElForm> | null>(null);
    const form = ref<IGetCreditConfigurationRes>({
      customer_credit_limit: {
        configId: '',
        configType: CREDIT_CONFIGURATION_TYPE_ENUM.CUSTOMER_CREDIT_LIMIT,
        configState: YES_OR_NO_NUMBER_ENUM.NO,
        configContent: {
          overdueDays: '',
        },
      },
      bd_add_credit_limit: {
        configId: '',
        configType: CREDIT_CONFIGURATION_TYPE_ENUM.BD_ADD_CREDIT_LIMIT,
        configState: YES_OR_NO_NUMBER_ENUM.NO,
        configContent: {
          overdueNumber: '',
          overdueDays: '',
        },
      },
      bd_customer_credit_limit: {
        configId: '',
        configType: CREDIT_CONFIGURATION_TYPE_ENUM.BD_CUSTOMER_CREDIT_LIMIT,
        configState: YES_OR_NO_NUMBER_ENUM.NO,
        configContent: {},
      },
    });

    // 请求配置
    const fetchConfiguration = async () => {
      try {
        const { data } = await getCreditConfiguration();
        if (!isEmpty(data)) {
          form.value = data;
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchConfiguration();

    // 提交
    const handleSubmit = async () => {
      await formEl.value?.validate();
      try {
        form.value.bd_customer_credit_limit.configContent = form.value.bd_add_credit_limit.configContent;
        const configReqs: ICreditConfigurationItem[] = [];
        Object.keys(form.value).forEach((key) => {
          configReqs.push(form.value[key as CREDIT_CONFIGURATION_TYPE_ENUM]);
        });
        await submitCreditConfiguration({
          configReqs,
        });
        ElMessage.success('操作成功');
      } catch (error) {
        console.log(error);
      }
    };

    return {
      YES_OR_NO_NUMBER_ENUM,
      formEl,
      form,
      handleSubmit,
    };
  },

});
</script>

<style lang="scss" scoped>
.wrap {
  min-width: 780px;
  position: relative;
  padding: 20px 70px 5px 20px;
  border: 1px solid #eee;
  margin-bottom: 30px;
}
.item {
  white-space: nowrap;
  position: relative;
  display: flex;
  align-items: center;
  height: 32px;
  margin-bottom: 15px;
  white-space: nowrap;
  &.relate {
    padding-left: 480px;
  }
}
.tip {
  color: #999;
  margin-bottom: 15px;
}
.switch {
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  &.inner {
    right: -40px;
  }
}
.warn {
  font-weight: 600;
  color: var(--el-color-warning);
  margin-right: 20px;
}
</style>
