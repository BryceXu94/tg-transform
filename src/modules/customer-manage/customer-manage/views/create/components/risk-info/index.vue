<!--
 * @Descripttion: 风险信息
 * @Author: weitongxue
-->
<template>
  <div class="risk-info">
    <div class="risk-info__title flex flex-justify-between flex-align-center">
      <span>风险信息</span>
      <el-button
        v-if="isCreate && CAN_CREATE_RISK_DATA"
        type="success"
        @click="handleSave"
      >暂存</el-button>
      <div v-else>
        <el-button
          type="primary"
          v-show="!isEdit && !edit && CAN_UPDATE_RISK_DATA"
          @click="handleEdit"
        >编辑</el-button>
        <div v-show="edit">
          <el-button
            @click="handleCancel"
          >取消</el-button>
          <el-button
            type="primary"
            @click="handleSave"
          >保存</el-button>
        </div>
      </div>
    </div>
    <div class="risk-info__content">
      <ul class="content-row">
        <li>
          <span class="label">自身风险总量</span>
          <span class="tag">{{form?.selfRiskCount || 0}}条</span>
        </li>
        <li>
          <span class="label">周边风险总量</span>
          <span class="tag">{{form?.aroundRiskCount || 0}}条</span>
        </li>
        <li>
          <span class="label">历史风险总量</span>
          <span class="tag">{{form?.historyRiskCount || 0}}条</span>
        </li>
        <li>
          <span class="label">预警提醒总量</span>
          <span class="tag">{{form?.earlyWarningRiskCount || 0}}条</span>
        </li>
      </ul>
      <ul class="content-row">
        <li>
          <span class="label">法律诉讼总量</span>
          <span class="tag">{{form?.lawsuitCount || 0}}条</span>
        </li>
        <li>
          <span class="label">失信被执行总量</span>
          <span class="tag">{{form?.zhixingCount || 0}}条</span>
        </li>
        <li>
          <span class="label">限制消费令总量</span>
          <span class="tag">{{form?.consumptionRestrictionCount || 0}}条</span>
        </li>
      </ul>
    </div>
    <div class="margin-top-20 padding-10">
      <el-form
        :model="form"
        ref="formRef"
      >
        <el-form-item label="风险截图：">
          <upload
            v-if="edit || isCreate || form.fileReqList?.length"
            :limit="9"
            v-model="form.fileReqList"
            :sizeLimit="10"
            paste
            :disabled="!edit && !isCreate"
            accept="image/png,image/jpeg,image/jpg"
            tip="支持jpg/jpeg/png格式，限9张，每张大小不超10mb"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, watch, PropType, inject } from 'vue';
import { useRoute } from 'vue-router';

import { ElForm } from 'element-plus';

import { updateCustomerRiskSaveInfoApi } from '@/modules/customer-manage/customer-manage/api';
import { IRiskSaveReq, IRiskSave } from '@/modules/customer-manage/customer-manage/api/types';
import { MODULE_BLOCK_ENUM, TABS_ENUM } from '@/modules/customer-manage/customer-manage/constant';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
import { cloneDeep } from 'lodash-es';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<IRiskSave>,
      default: () => {},
    },
  },
  setup(props) {
    const $route = useRoute();
    const customerId = $route.params.id! as string;
    const routeName = $route.name;
    const formRef = ref<InstanceType<typeof ElForm> | null>(null);
    const handleRefresh = inject<(item: TABS_ENUM) => void>('handleRefresh');

    // 是否编辑
    const edit = ref(false);
    const isEdit = computed(() => {
      return routeName === 'CustomerManageCreateCustomer' || edit.value;
    });
    // 区分新增还是编辑
    const isCreate = computed(() => {
      // customerCode存在就是创建
      return routeName === 'CustomerManageCreateCustomer';
    });

    // 权限
    const {
      CAN_CREATE_RISK_DATA,
      CAN_UPDATE_RISK_DATA,
    } = usePermissionConfig();

    // 风险截图
    const form = ref<IRiskSave>({
      selfRiskCount: '', // 自身风险数
      aroundRiskCount: '', // 周边风险数
      historyRiskCount: '', // 历史风险数
      earlyWarningRiskCount: '', // 预警提醒数
      lawsuitCount: '', // 法律诉讼数
      zhixingCount: '', // 失信执行数
      consumptionRestrictionCount: '', // 限制消费数
      fileReqList: [],
    });

    const formStr = ref('');
    watch(() => props.data, () => {
      if (props.data) {
        form.value = props.data;
      }
      formStr.value = JSON.stringify(cloneDeep(form.value));
    }, { immediate: true });

    const handleSave = async () => {
      try {
        const params: IRiskSaveReq = {
          ...form.value,
          customerId,
          editModuleList: [MODULE_BLOCK_ENUM.RISK_INFO],
        };
        await updateCustomerRiskSaveInfoApi(params);
        edit.value = false;
        if (!isCreate.value) {
          handleRefresh?.(TABS_ENUM.TAB_RISK);
        }
        formStr.value = JSON.stringify(cloneDeep(form.value));
        useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
      } catch (e) {
        console.log(e);
      }
    };

    const handleEdit = () => {
      edit.value = true;
      formStr.value = JSON.stringify(cloneDeep(form.value));
    };

    // 取消
    const handleCancel = () => {
      edit.value = false;
      form.value = cloneDeep(JSON.parse(formStr.value));
    };

    // 是否提示保存
    const validateData = () => {
      return formStr.value === JSON.stringify(form.value);
    };

    return {
      form,
      isCreate,
      edit,
      isEdit,
      formRef,
      CAN_CREATE_RISK_DATA,
      CAN_UPDATE_RISK_DATA,

      handleSave,
      handleEdit,
      handleCancel,
      validateData,
    };
  },
});
</script>

<style lang="scss" scoped>
.risk-info {
  border: 1px solid #eee;
  margin-bottom: 10px;
  padding: 15px 10px;
  &__title {
    display: flex;
    align-items: center;
    position: relative;
    font-weight: bold;
    padding-left: 10px;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 3px;
      height: 16px;
      background-color: var(--el-color-primary);
      transform: translateY(-50%);
    }
  }
  &__content {
    border: 1px solid #eee;
    margin-top: 20px;
    .content-title {
      padding: 8px 10px;
      background-color: rgba(77, 116, 232, 0.1);
    }
    .content-row {
      padding: 15px 10px;
      border-bottom: 1px solid #eee;
      li {
        display: inline-block;
        margin-right: 30px;
        margin: 10px 0px;
        .label {
          display: inline-block;
          width: 140px;
          text-align: right;
        }
        .tag {
          display: inline-block;
          padding: 10px 30px;
          margin-left: 15px;
          border: 1px solid rgba(245, 86, 86, 1);
          color: #F55656;
          background-color: rgba(253, 238, 237, 1);
          border-radius: 3px;
        }
      }
    }
    .content-row:last-of-type {
      border-bottom: none;
    }
  }
}
</style>
