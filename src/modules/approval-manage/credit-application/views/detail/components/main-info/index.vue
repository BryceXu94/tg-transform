<template>
  <div>
    <el-form
      ref="formEl"
      :model="formData"
      :rules="formRules"
      label-width="146px"
    >
      <responsive-row :col="col12">
        <el-form-item
          v-if="!readOnly"
          label="授信主体："
          prop="subjectType"
          :col="col24"
        >
          <el-radio-group
            v-model="formData.subjectType"
            @change="handleChangeSubjectType"
          >
            <el-radio
              v-for="item in CREDIT_SUBJECT_LIST"
              :key="item.value"
              :label="item.value"
            >
              {{item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="readOnly"
          label="飞书审批编码："
          prop="approvalFeiShuCode"
        >
          {{formData.approvalFeiShuCode}}
        </el-form-item>
        <el-form-item
          v-if="readOnly"
          label="审批编码："
          prop="applyCode"
        >
          {{formData.applyCode}}
        </el-form-item>
        <el-form-item
          v-if="formData.subjectType === CREDIT_SUBJECT_ENUM.CUSTOMER"
          label="客户名称："
          prop="customerName"
          :rules="{ required: true, message: '客户名称不能为空' }"
        >
          <div v-if="readOnly">{{ formData.crmCreditCustomer?.customerName }}</div>
          <query-select
            v-else
            :need-init-options="true"
            placeholder="请选择客户"
            v-model="formData.customerName"
            :method="getCustomerOptions"
            :config="{
              valueKey: 'customerId',
              labelKey: 'customerName',
              keywordQueryKey: 'customerName',
              valueQueryKey: 'customerName',
              dataKey: 'data',
            }"
            :queryParams="{
              customerState: CUSTOMER_STATUS_ENUM.ENABLE,
            }"
            :initQueryParams="formData.customerName"
            @change="handleChangeCustomer"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.subjectType === CREDIT_SUBJECT_ENUM.GROUP"
          label="集团名称："
          prop="groupName"
          :rules="{ required: true, message: '集团名称不能为空' }"
        >
          <div v-if="readOnly">{{ formData.crmGroupCreditVo?.groupName }}</div>
          <query-select
            v-else
            :need-init-options="true"
            placeholder="请选择集团"
            v-model="formData.groupName"
            :method="getGroupOptions"
            :config="{
              valueKey: 'groupId',
              labelKey: 'groupName',
              keywordQueryKey: 'groupName',
              valueQueryKey: 'groupName',
              dataKey: 'data',
            }"
            :initQueryParams="formData.groupName"
            @change="handleChangeGroup"
          />
        </el-form-item>
        <el-form-item
          label="所属BD："
          prop="bdName"
        >
          <div v-if="readOnly">{{ formData.bdName }}{{formData.bdCode ?? ''}}</div>
          <el-input
            v-else
            v-model="formData.bdName"
            disabled
            placeholder="自动带出，不可编辑"
          />
        </el-form-item>
        <el-form-item
          label="所属部门："
          prop="departmentId"
        >
          <div v-if="readOnly">{{ formData.departmentName }}</div>
          <el-select
            v-else
            v-model="formData.departmentId"
            placeholder="请选择所属部门"
            style="width: 100%"
            @change="handleChangeDepartment"
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属区域："
          prop="regionName"
        >
          <div v-if="readOnly">{{ formData?.regionName }}</div>
          <el-input
            v-else
            disabled
            v-model="formData.regionName"
            placeholder="自动带出，不可编辑"
          />
        </el-form-item>
      </responsive-row>
      <responsive-row :col="col12">
        <el-form-item
          label="审批类型："
          prop="applyType"
        >
          <div v-if="readOnly">{{ $filters.getEnumLabel(CREDIT_APPROVE_TYPE_LIST, formData.applyType ?? '') }}</div>
          <el-select
            v-else
            v-model="formData.applyType"
            placeholder="请选择审批类型"
            style="width: 100%"
          >
            <el-option
              v-for="item in CREDIT_APPROVE_TYPE_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="授信类型："
          prop="creditType"
          :col="col24"
        >
          <el-icon
            :size="18"
            class="margin-right-15"
            style="cursor: pointer"
            @click="handleToggleExplain(true)"
          >
            <Warning />
          </el-icon>
          <div v-if="readOnly">{{$filters.getEnumLabel(CREDIT_APPLY_TYPE_LIST, formData.creditType ?? '') }}</div>
          <el-radio-group
            v-else
            v-model="formData.creditType"
          >
            <el-radio
              v-for="item in creditTypeOptions"
              :key="item.value"
              :label="item.value"
            >
              {{item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="申请额度："
          prop="applyAmount"
          :col="col12"
        >
          <encryption
            :data="{
              businessId: creditApplyId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.FULLY_DESENSITIZE,
              content: formData.applyAmount ?? '0',
              unit: '元',
              dateColumn: 'applyAmount',
              format: toThousands,
            }"
            v-if="readOnly"
          />
          <input-number
            v-else
            v-model="formData.applyAmount"
            placeholder="请输入申请额度"
            :min="0"
            :max="999.99"
            :precision="2"
          >
            <template #append>万元</template>
          </input-number>
        </el-form-item>
        <el-form-item
          label="申请说明："
          prop="applyDesc"
          :col="col24"
        >
          <encryption
            :data="{
              businessId: creditApplyId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
              content: formData.applyDesc,
              dateColumn: 'applyDesc',
            }"
            v-if="readOnly"
          />
          <el-input
            v-else
            v-model.trim="formData.applyDesc"
            placeholder="请输入申请说明"
            type="textarea"
            :rows="3"
            :maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          v-if="formData.subjectType === CREDIT_SUBJECT_ENUM.CUSTOMER"
          label="营业执照附件："
          prop="licenseList"
          :col="col24"
        >
          <upload
            :limit="1"
            v-model="formData.licenseList"
            :disabled="readOnly"
            :sizeLimit="10"
            type="fileList"
            accept="image/png,image/jpg,image/jpeg"
            tip="支持格式：*.png、*.jpg、*.jpeg，单个文件不能超过10MB"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.subjectType === CREDIT_SUBJECT_ENUM.CUSTOMER"
          prop="customerProfilesList"
          :col="col24"
        >
          <template #label>
            <span>客户信息档案表：</span>
            <export-btn
              v-if="!readOnly"
              name="客户信息档案表"
              :type="TEMPLATE_TYPE_ENUM.CUSTOMER_PROFILE"
              :customerId="formData.customerId ?? ''"
            />
          </template>
          <upload
            :limit="9"
            v-model="formData.customerProfilesList"
            :disabled="readOnly"
            :sizeLimit="10"
            type="fileList"
            accept="image/png,image/jpg,image/jpeg,.xlsx,.xls,.doc,.docx,.pdf"
            tip="支持格式：*.png、*.jpg、*.jpeg、*.xlsx、*.xls、*.doc、*.docx、*.pdf，单个文件不能超过10MB"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.subjectType === CREDIT_SUBJECT_ENUM.CUSTOMER"
          prop="scoringTableList"
          :col="col24"
        >
          <template #label>
            <span>客户信用评分表：</span>
            <export-btn
              v-if="!readOnly"
              name="客户信用评分表"
              :type="TEMPLATE_TYPE_ENUM.CUSTOMER_SCORE"
              :customerId="formData.customerId ?? ''"
            />
          </template>
          <upload
            :limit="9"
            v-model="formData.scoringTableList"
            :disabled="readOnly"
            :sizeLimit="10"
            type="fileList"
            accept="image/png,image/jpg,image/jpeg,.xlsx,.xls,.doc,.docx,.pdf"
            tip="支持格式：*.png、*.jpg、*.jpeg、*.xlsx、*.xls、*.doc、*.docx、*.pdf，单个文件不能超过10MB"
          />
        </el-form-item>
        <detail-title v-if="formData.subjectType === CREDIT_SUBJECT_ENUM.GROUP" title="其他附件" />
        <el-form-item
          :label="formData.subjectType === CREDIT_SUBJECT_ENUM.GROUP ? '集团资料：' : '其他附件：'"
          :col="col24"
        >
          <upload
            :limit="9"
            v-model="formData.otherAttachmentList"
            :disabled="readOnly"
            :sizeLimit="10"
            type="fileList"
            accept="image/png,image/jpg,image/jpeg,.xlsx,.xls,.doc,.docx,.pdf"
            tip="支持格式：*.png、*.jpg、*.jpeg、*.xlsx、*.xls、*.doc、*.docx、*.pdf，单个文件不能超过10MB"
          />
        </el-form-item>
      </responsive-row>
      <detail-title
        v-show="formData.subjectType === CREDIT_SUBJECT_ENUM.GROUP && formData.subjectInfoDtoList?.length"
        title="主体信息"
      />
      <el-tabs
        v-show="formData.subjectType === CREDIT_SUBJECT_ENUM.GROUP"
        tab-position="left"
        v-model="currentTab"
      >
        <el-tab-pane
          v-for="(item, index) in formData.subjectInfoDtoList"
          :name="index"
          :key="item.customerId"
          :label="item.customerName"
        >
          <el-form-item
            label="营业执照附件："
            :prop="`subjectInfoDtoList[${index}].licenseList`"
            :rules="{ required: true, message: '营业执照附件不能为空', }"
          >
            <upload
              :limit="1"
              v-model="item.licenseList"
              :disabled="readOnly"
              :sizeLimit="10"
              type="fileList"
              accept="image/png,image/jpg,image/jpeg"
              tip="支持格式：*.png、*.jpg、*.jpeg，单个文件不能超过10MB"
            />
          </el-form-item>
          <el-form-item
            :prop="`subjectInfoDtoList[${index}].customerProfilesList`"
            :rules="{ required: true, message: '客户信息档案表不能为空', }"
          >
            <template #label>
              <span>客户信息档案表：</span>
              <export-btn
                v-if="!readOnly"
                name="客户信息档案表"
                :type="TEMPLATE_TYPE_ENUM.CUSTOMER_PROFILE"
                :customerId="item.customerId ?? ''"
              />
            </template>
            <upload
              :limit="9"
              v-model="item.customerProfilesList"
              :disabled="readOnly"
              :sizeLimit="10"
              type="fileList"
              accept="image/png,image/jpg,image/jpeg,.xlsx,.xls,.doc,.docx,.pdf"
              tip="支持格式：*.png、*.jpg、*.jpeg、*.xlsx、*.xls、*.doc、*.docx、*.pdf，单个文件不能超过10MB"
            />
          </el-form-item>
          <el-form-item
            :prop="`subjectInfoDtoList[${index}].scoringTableList`"
            :rules="{ required: true, message: '客户信用评分表不能为空', }"
          >
            <template #label>
              <span>客户信用评分表：</span>
              <export-btn
                v-if="!readOnly"
                name="客户信用评分表"
                :type="TEMPLATE_TYPE_ENUM.CUSTOMER_SCORE"
                :customerId="item.customerId ?? ''"
              />
            </template>
            <upload
              :limit="9"
              v-model="item.scoringTableList"
              :disabled="readOnly"
              :sizeLimit="10"
              type="fileList"
              accept="image/png,image/jpg,image/jpeg,.xlsx,.xls,.doc,.docx,.pdf"
              tip="支持格式：*.png、*.jpg、*.jpeg、*.xlsx、*.xls、*.doc、*.docx、*.pdf，单个文件不能超过10MB"
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <submit-tips-dialog
      title="温馨提示"
      v-model:visible="visibleExplain"
      confirmBtnText="已知晓"
      :hideCancel="true"
      @success="handleToggleExplain(false)"
    >
      <div
        v-for="(item, key) in tips"
        :key="key"
        class="margin-bottom-20"
      >
        <p>{{item.type}}</p>
        <p>{{item.content}}</p>
      </div>
    </submit-tips-dialog>
  </div>
</template>

<script lang="tsx">
import { defineComponent, PropType, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { toThousands } from '@tiangong/utils';
import { isEmpty } from 'lodash-es';

import { ElForm, ElMessage } from 'element-plus';
import { Warning } from '@element-plus/icons-vue';
import ExportBtn from '../export-btn/index.vue';

import { getCustomerOptions, getUserOptionsByUserName, getGroupOptions } from '@/api/query-options';
import { ICustomerInfoSearchResItem, IGetGroupOptionsRes } from '@/api/query-options/type.d';
import { getGroupDetail } from '@/modules/customer-manage/group-manage/api';
import { IGetGroupDetailRes } from '@/modules/customer-manage/group-manage/api/types';
import { getCustomerDataWithBdByCustomerId } from '@/modules/approval-manage/credit-application/api';
import {
  IGetCustomerDataWithBdByCustomerIdRes,
} from '@/modules/approval-manage/credit-application/api/types';
import {
  CUSTOMER_STATUS_ENUM,
  CUSTOMER_STATUS_NUMBER_ENUM,
  YES_NO_ENUM,
  DESENSITIZE_DECRYPT_TYPE_ENUM,
  CUSTOMER_CREDIT_APPROVE_STATUS_ENUM,
  CREDIT_SUBJECT_ENUM,
  CREDIT_SUBJECT_LIST,
} from '@/constant';
import {
  CREDIT_APPLY_TYPE_LIST,
  CREDIT_APPROVE_TYPE_LIST,
  CREDIT_APPLY_TYPE_FIRST_LIST,
  CREDIT_APPLY_TYPE_AGAIN_LIST,
  TEMPLATE_TYPE_ENUM,
} from '@/modules/approval-manage/credit-application/constant';
import { IFormData, ICurrentBdData } from '../../types';

export default defineComponent({
  emits: ['update:modelValue'],
  components: {
    Warning,
    ExportBtn,
  },
  props: {
    modelValue: {
      type: Object as PropType<IFormData>,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: true,
    },
    baseData: {
      type: Object as PropType<IFormData>,
      required: true,
    },
    currentBdData: {
      type: Object as PropType<ICurrentBdData>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const $route = useRoute();
    const creditApplyId = $route.params.id ?? '';
    const formEl = ref<InstanceType<typeof ElForm> | null>(null);
    const creditTypeOptions = ref(CREDIT_APPLY_TYPE_LIST); // 授信类型选项
    const departmentOptions = ref<IGetCustomerDataWithBdByCustomerIdRes['bdOrgList']>([]); // 所属部门下拉选项
    const currentTab = ref(0);

    const formData = computed(() => {
      return props.modelValue;
    });

    const updateVal = (param = {} as IFormData) => {
      emit('update:modelValue', {
        ...props.baseData,
        ...param,
      });
    };

    // 设置授信类型选项
    const setCreditTypeOptions = (
      state: CUSTOMER_CREDIT_APPROVE_STATUS_ENUM | undefined,
    ) => {
      if (isEmpty(state)) {
        creditTypeOptions.value = CREDIT_APPLY_TYPE_FIRST_LIST;
      } else {
        creditTypeOptions.value = CREDIT_APPLY_TYPE_AGAIN_LIST;
      }
    };
    const setGroupCreditTypeOptions = (flag = false) => {
      creditTypeOptions.value = flag ? CREDIT_APPLY_TYPE_AGAIN_LIST : CREDIT_APPLY_TYPE_FIRST_LIST;
    };

    // 检查客户是否可选
    const canSelectCustomer = (data: IGetCustomerDataWithBdByCustomerIdRes) => {
      if (!isEmpty(data?.creditGrantingState)
        && data?.creditMark === CREDIT_SUBJECT_ENUM.GROUP
      ) {
        ElMessage.error('客户所属集团已有授信申请记录，不允许发起申请');
        return false;
      }
      if (data?.unDoneCreditApplication === YES_NO_ENUM.YES) {
        ElMessage.error('已存在未完结的审批单，请完结再进行发起');
        return false;
      }
      if (!data?.bdId) {
        ElMessage.error('该客户暂无绑定bd信息，请前往绑定');
        return false;
      }
      if (!data?.bdRegionCode) {
        ElMessage.error('该客户所属BD暂无区域信息，请前往绑定');
        return false;
      }
      return true;
    };

    // 选择所属部门
    const handleChangeDepartment = (val: string) => {
      const item = departmentOptions.value.find(v => v.departmentId === val);
      formData.value.departmentName = item?.departmentName;
    };

    // 选择客户
    const handleChangeCustomer = async (val: string, row: ICustomerInfoSearchResItem) => {
      if (formData.value.customerId === val) return;
      const remainData = {
        applyAmount: formData.value.applyAmount,
        applyDesc: formData.value.applyDesc,
      };
      try {
        const { data } = await getCustomerDataWithBdByCustomerId({
          id: row.customerId,
        });
        if (!canSelectCustomer(data)) {
          updateVal({
            ...remainData,
            customerName: '',
          });
          return;
        }

        setCreditTypeOptions(data.creditGrantingState);
        departmentOptions.value = data.bdOrgList;
        updateVal({
          ...remainData,
          creditType: creditTypeOptions.value[0].value,
          customerName: data.customerName ?? '',
          customerId: data.customerId ?? '',
          licenseList: data.businessLicense,
          bdId: data.bdId,
          bdName: data.bdName,
          departmentName: data.bdOrgList[0]?.departmentName ?? '',
          departmentId: data.bdOrgList[0]?.departmentId ?? '',
          regionCode: data?.bdRegionCode,
          regionName: data?.bdRegionName,
        });
      } catch (error) {
        console.log(error);
        updateVal();
      }
    };

    // 格式化关联主体
    const formatSubjects = (data: IGetGroupDetailRes['customerVoList']) => {
      if (data?.length) {
        return data.filter(item => item.customerState === CUSTOMER_STATUS_NUMBER_ENUM.ENABLE).map(item => ({
          customerId: item.customerId,
          customerName: item.customerName,
          licenseList: item.businessLicenseList ?? [],
          customerProfilesList: [],
          scoringTableList: [],
        }));
      }
      return [];
    };

    // 选择集团
    const handleChangeGroup = async (val: string, row: IGetGroupOptionsRes) => {
      if (formData.value.groupId === val) return;
      const remainData = {
        ...formData.value,
        groupId: '',
        otherAttachmentList: [],
        subjectInfoDtoList: [],
      };
      if (row.isHavingUnderApproval) {
        ElMessage.error('已存在未完结的审批单，请完结再进行发起');
        updateVal({
          ...remainData,
          groupName: '',
        });
        return;
      }
      try {
        const { data } = await getGroupDetail({ id: row.groupId! });
        if (data.ifExistCustomerCredit) {
          ElMessage.error('当前集团关联客户已有授信记录，不支持进行集团申请');
          updateVal({
            ...remainData,
            groupName: '',
          });
          return;
        }
        const subjectInfoDtoList = formatSubjects(data.customerVoList);
        if (!subjectInfoDtoList.length) {
          ElMessage.error('当前集团未关联已启用客户，无法发起申请');
          updateVal({
            ...remainData,
            groupName: '',
          });
          return;
        }
        setGroupCreditTypeOptions(data.groupIfInitAmount);
        updateVal({
          ...remainData,
          groupId: row.groupId,
          groupName: row.groupName,
          subjectInfoDtoList,
          creditType: creditTypeOptions.value[0].value,
        });
      } catch (error) {
        console.log(error);
      }
    };

    // 重新提交-客户/集团
    const resetCreditData = async (
      data: IGetCustomerDataWithBdByCustomerIdRes|IGetGroupDetailRes, type: CREDIT_SUBJECT_ENUM,
    ) => {
      try {
        if (type === CREDIT_SUBJECT_ENUM.GROUP) {
          departmentOptions.value = props.currentBdData?.bdOrgList ?? [];
          setGroupCreditTypeOptions((data as IGetGroupDetailRes).groupIfInitAmount);
        } else {
          departmentOptions.value = (data as IGetCustomerDataWithBdByCustomerIdRes).bdOrgList;
          setCreditTypeOptions((data as IGetCustomerDataWithBdByCustomerIdRes).creditGrantingState);
        }
        if (!creditTypeOptions.value.find(item => item.value === formData.value.creditType)) {
          formData.value.creditType = creditTypeOptions.value[0].value;
        }
      } catch (error) {
        console.log(error);
      }
    };

    // 触发表单校验
    const validate = async () => {
      if (formData.value.subjectType === CREDIT_SUBJECT_ENUM.GROUP) {
        const idx = formData.value.subjectInfoDtoList?.findIndex(
          item => item.licenseList.length === 0
            || item.customerProfilesList.length === 0
            || item.scoringTableList.length === 0,
        ) ?? -1;
        if (idx > -1) {
          currentTab.value = idx;
        }
      }
      await formEl.value?.validate();
    };

    // 授信类型弹窗-显隐
    const visibleExplain = ref(false);
    const handleToggleExplain = (visible: boolean) => {
      visibleExplain.value = visible;
    };

    // 更改授信主体
    const handleChangeSubjectType = (val: CREDIT_SUBJECT_ENUM) => {
      if (val === CREDIT_SUBJECT_ENUM.GROUP) {
        if (!props.currentBdData?.regionCode) {
          ElMessage.error('当前操作人暂无区域信息，请前往绑定');
          updateVal({ subjectType: CREDIT_SUBJECT_ENUM.CUSTOMER });
          return;
        }
        departmentOptions.value = props.currentBdData?.bdOrgList ?? [];
        updateVal({
          subjectType: val,
          ...props.currentBdData,
        });
      } else {
        updateVal({ subjectType: val });
      }
    };

    return {
      creditApplyId,
      CREDIT_APPROVE_TYPE_LIST,
      CREDIT_APPLY_TYPE_LIST,
      CUSTOMER_STATUS_ENUM,
      DESENSITIZE_DECRYPT_TYPE_ENUM,
      TEMPLATE_TYPE_ENUM,
      CREDIT_SUBJECT_ENUM,
      CREDIT_SUBJECT_LIST,
      creditTypeOptions,
      formEl,
      formData,
      departmentOptions,
      visibleExplain,
      currentTab,
      validate,
      handleChangeCustomer,
      handleChangeGroup,
      handleChangeDepartment,
      handleToggleExplain,
      handleChangeSubjectType,
      resetCreditData,
      toThousands,
      getCustomerOptions,
      getGroupOptions,
      getUserOptionsByUserName,
      canSelectCustomer,
      formatSubjects,
      tips: [
        { type: '初次授信', content: '该客户主体第一次进行授信申请' },
        { type: '提额申请', content: '该客户已存在授信额度，需要将额度进行提额申请' },
        { type: '临时调整', content: '该客户现可用额度不足于下单，需要临时申请调额已满足下单，该额度一般不能大于总金额的5%以及不能大于10w' },
      ],
      formRules: {
        subjectType: [
          { required: true, message: '授信主体不能为空' },
        ],
        bdName: [
          { required: true, message: '所属BD不能为空' },
        ],
        regionName: [
          { required: true, message: '所属区域不能为空' },
        ],
        applyType: [
          { required: true, message: '审批类型不能为空' },
        ],
        creditType: [
          { required: true, message: '授信类型不能为空' },
        ],
        applyAmount: [
          {
            required: true,
            validator: (rule: any, value: string, callback: any) => {
              if (value === '' || value === null) {
                callback('申请额度不能为空');
                return;
              }
              if (+value === 0) {
                callback('申请额度不能为0');
                return;
              }
              callback();
            },
          },
        ],
        applyDesc: [
          { required: true, message: '申请说明不能为空' },
        ],
        licenseList: [
          { required: true, message: '营业执照附件不能为空' },
        ],
        customerProfilesList: [
          { required: true, message: '客户信息档案表不能为空' },
        ],
        scoringTableList: [
          { required: true, message: '客户信用评分表不能为空' },
        ],
      },
      col12: {
        sm: 24,
        md: 12,
        lg: 12,
        xl: 12,
      },
      col24: {
        sm: 24,
        md: 24,
        lg: 24,
        xl: 24,
      },
    };
  },

});
</script>
