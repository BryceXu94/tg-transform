<!--
 * @Descripttion:工商信息（平台业务）
 * @Author: weitongxue
-->
<template>
  <div class="business-info">
    <div class="business-info__title flex-justify-between flex-align-center">
      <span>工商信息</span>
      <el-button
        v-if="isCreate && CAN_CREATE_BUSINESS_DATA"
        type="success"
        @click="handleSave"
      >暂存</el-button>
      <div v-else>
        <el-button
          type="primary"
          v-show="!isCreate && !edit && CAN_UPDATE_BUSINESS_DATA"
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
    <div class="business-info__content">
      <el-form
        :model="companyInfo"
        label-width="150px"
        ref="formRef"
      >
        <el-form-item
          label="营业执照："
          prop="businessLicenseList"
          :rules="[
            {
              required: true,
              message: '请上传营业执照',
              trigger: ['blur', 'change'],
            },
          ]"
        >
          <upload
            v-if="isEdit"
            :limit="1"
            v-model="companyInfo.businessLicenseList"
            :sizeLimit="3"
            accept="image/png,image/jpeg,image/jpg"
            tip="支持jpg/jpeg/png格式，大小不超3mb"
            :compress="{
              isCompress: true,
              compressWidth: 1000,
            }"
            @upload="handleBusinessImgChange"
          />
          <el-image
            v-if="companyInfo?.businessLicenseList?.length && !isEdit"
            style="width: 100px; height: 100px"
            :src="companyInfo?.businessLicenseList?.[0].url"
            :preview-src-list="[companyInfo?.businessLicenseList?.[0].url]"
          >
          </el-image>
        </el-form-item>
        <responsive-row
          :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
        >
          <el-form-item
            label="客户名称："
            prop="customerName"
            :rules="[
              {
                required: true,
                validator: validatorName,
              },
            ]"
          >
            <el-input
              v-if="isEdit"
              disabled
              v-model="companyInfo.customerName"
              placeholder="请输入客户名称（与营业执照保持一致）"
            ></el-input>
            <div v-else>{{companyInfo?.customerName}}</div>
          </el-form-item>
          <el-form-item
            label="业务模式："
            prop="businessType"
          >
            <el-input
              v-if="isEdit"
              disabled
              v-model="companyInfo.businessType"
            ></el-input>
            <div v-else>{{companyInfo?.businessType}}</div>
          </el-form-item>
          <el-form-item
            label="统一社会信用代码："
            prop="socialCreditCode"
            :rules="[
              {
                required: true,
                message: '请输入统一社会信用代码',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="companyInfo.socialCreditCode"
              placeholder="请输入统一社会信用代码"
              v-if="isEdit"
              disabled
            ></el-input>
            <div v-else>{{companyInfo?.socialCreditCode}}</div>
          </el-form-item>
          <el-form-item
            label="曾用名："
            prop="beforeName"
          >
            <el-input
              v-model="companyInfo.beforeName"
              placeholder="请输入曾用名"
              v-if="isEdit"
              maxLength="100"
              :disabled="isEdit && !isCreate && state !== PROFILE_STATE_ENUM.WAIT_COMMIT"
            ></el-input>
            <div v-if="!isEdit">{{companyInfo?.beforeName}}</div>
          </el-form-item>
          <el-form-item
            label="公司类型："
            prop="companyType"
            :rules="[
              {
                required: true,
                message: '请输入公司类型',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="companyInfo.companyType"
              placeholder="请输入公司类型"
              v-if="isEdit"
            ></el-input>
            <div v-else>{{companyInfo?.companyType}}</div>
          </el-form-item>
          <el-form-item
            label="法人代表："
            prop="artificialPerson"
            :rules="[
              {
                required: true,
                message: '请输入法人代表',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="companyInfo.artificialPerson"
              placeholder="请输入法人代表"
              v-if="isEdit"
            ></el-input>
            <div v-else>{{companyInfo?.artificialPerson}}</div>
          </el-form-item>
          <el-form-item
            label="成立日期："
            prop="establishmentDate"
            :rules="[
              {
                required: true,
                message: '请选择成立日期',
                trigger: 'blur',
              },
            ]"
          >
            <el-date-picker
              v-if="isEdit"
              style="width:100%"
              v-model="companyInfo.establishmentDate"
              type="date"
              placeholder="请选择成立日期"
              value-format="YYYY-MM-DD"
            >
            </el-date-picker>
            <div v-else>{{$filters.formatTime(companyInfo.establishmentDate || '', 'YYYY-MM-DD')}}</div>
          </el-form-item>
        </responsive-row>
        <el-form-item
          label="注册地址："
          prop="registrationAddress"
          :rules="[
            {
              required: true,
              message: '',
              trigger: 'blur',
            },
          ]"
        >
          <div class="flex" v-if="isEdit">
            <address-picker
              @change="handleChangeAddress"
              class="flex-1"
              :province="companyInfo?.registrationProvince"
              :city="companyInfo?.registrationCity"
              :area="companyInfo?.registrationRegion"
              :propList="['registrationProvince', 'registrationCity', 'registrationRegion']"
              :gutter="0"
            />
            <el-input
              class="flex-1"
              v-model="companyInfo.registrationAddress"
              placeholder="详细地址（如街道、门牌）"
            ></el-input>
          </div>
          <div v-else>
            {{companyInfo.registrationProvince}}
            {{companyInfo.registrationCity}}
            {{companyInfo.registrationRegion}}
            {{companyInfo.registrationAddress}}
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType, watch, inject } from 'vue';
import { useRoute } from 'vue-router';

import { ElForm, ElMessageBox } from 'element-plus';

import {
  platformBaseInfoSaveApi,
} from '@/modules/customer-manage/customer-manage/api';
import {
  IBaseInfoUpdateCompanyInfo,
} from '@/modules/customer-manage/customer-manage/api/types';
import { MODULE_BLOCK_ENUM, PROFILE_STATE_ENUM, TABS_ENUM } from '@/modules/customer-manage/customer-manage/constant';
import { BUSINESS_MODE_LIST } from '@/constant';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
import { licenseOcrApi } from '@/api/global/index';
import { ICustomerInfoBusinessLicenseOcrReq } from '@/api/global/type';
import { cloneDeep } from 'lodash-es';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  components: {
  },
  props: {
    data: {
      type: Object as PropType<IBaseInfoUpdateCompanyInfo>,
      default: () => {},
    },
    state: {
      type: String,
      default: '',
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
      CAN_CREATE_BUSINESS_DATA,
      CAN_UPDATE_BUSINESS_DATA,
    } = usePermissionConfig();

    const companyInfo = ref<any>({
      businessLicenseList: [],
      customerName: '', // 客户名称
      beforeName: '', // 曾用名
      socialCreditCode: '', // 社会编码
      companyType: '', // 公司类型
      establishmentDate: '', // 成立日期
      artificialPerson: '', // 法人
      registrationProvince: '', // 省
      registrationCity: '', // 市
      registrationRegion: '', // 区
      registrationAddress: '', // 详细地址
      regCapitalCurrency: '',
      actualCapitalCurrency: '',
    });

    // 选择地址
    const handleChangeAddress = (list: string[] = ['', '', '']) => {
      [companyInfo.value.registrationProvince,
        companyInfo.value.registrationCity, companyInfo.value.registrationRegion] = list;
    };

    const companyInfoStr = ref('');
    watch(() => props.data, () => {
      companyInfo.value = props.data;
      companyInfoStr.value = JSON.stringify(cloneDeep(companyInfo.value));
    }, { immediate: true });

    // 暂存 or 保存
    const handleSave = async () => {
      await formRef.value?.validate();
      [companyInfo.value.businessTermSince,
        companyInfo.value.businessTermEnd] = companyInfo.value.businessTerm || ['', ''];
      const params = {
        companyInfo: companyInfo.value,
        customerId,
        editModuleList: [MODULE_BLOCK_ENUM.COMPANY_INFO],
      };
      const res = await platformBaseInfoSaveApi(params);
      edit.value = false;
      if (!isCreate.value) {
        handleRefresh?.(TABS_ENUM.TAB_BASIC);
      }
      companyInfoStr.value = JSON.stringify(cloneDeep(companyInfo.value));
      useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
      console.log(res.data?.isAllCompleted, '是否全部填写');
    };

    const handleBusinessImgChange = async (item: ICustomerInfoBusinessLicenseOcrReq[]) => {
      try {
        const data = {
          name: item[0]?.name,
          url: item[0]?.url,
        };
        const res = await licenseOcrApi(data);
        const { name, registerNumber } = res?.data;
        if (registerNumber) {
          if (name !== companyInfo.value.customerName
            && registerNumber !== companyInfo.value.socialCreditCode) {
            ElMessageBox.confirm(
              '营业执照识别的客户名称与信用代码与现有资料录入不匹配，请核实',
              'Warning',
              {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
              },
            )
              .then(() => {
              })
              .catch(() => {
                companyInfo.value.businessLicenseList = [];
              });
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    // 取消
    const handleCancel = () => {
      formRef.value?.clearValidate();
      edit.value = false;
      companyInfo.value = cloneDeep(JSON.parse(companyInfoStr.value));
    };

    // 编辑
    const handleEdit = () => {
      edit.value = true;
      companyInfoStr.value = JSON.stringify(cloneDeep(companyInfo.value));
    };

    // 是否提示保存
    const handleIsSave = () => {
      return companyInfoStr.value === JSON.stringify(companyInfo.value);
    };

    // 检验中英文，包括中英文括号
    // eslint-disable-next-line max-len
    const reg = /^[A-Za-z\u4E00-\u9FFF]+((（[A-Za-z\u4E00-\u9FFF]+）)|(\([A-Za-z\u4E00-\u9FFF]+\))|([A-Za-z\u4E00-\u9FFF]*))?[A-Za-z\u4E00-\u9FFF]*$/;

    return {
      formRef,
      companyInfo,
      isCreate,
      edit,
      isEdit,
      CAN_CREATE_BUSINESS_DATA,
      CAN_UPDATE_BUSINESS_DATA,
      PROFILE_STATE_ENUM,
      BUSINESS_MODE_LIST,
      validatorName: (rule: any, value: any, callback: (err?: Error) => void) => {
        if (value === '') {
          callback(new Error('请输入客户名称（与营业执照保持一致）'));
        } else if (
          !(reg.test(value))) {
          callback(new Error('请输入中英文字符（允许括号）'));
        } else {
          callback();
        }
      },

      handleChangeAddress,
      handleBusinessImgChange,
      handleIsSave,
      handleCancel,
      handleEdit,
      handleSave,
    };
  },
});
</script>

<style lang="scss" scoped>
.business-info {
  border: 1px solid #eee;
  margin-bottom: 10px;
  padding: 15px 10px 0px;
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
    padding: 20px;
  }
}
</style>
