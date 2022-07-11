<template>
  <div class="detail-container container">
    <el-form
      ref="formEl"
      :model="formData"
      :rules="formRules"
      label-width="120px"
    >
      <detail-title title="选择客户">
        <template #default>
          <el-button @click="handleBack">取消</el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
          >提交</el-button>
        </template>
      </detail-title>
      <responsive-row :col="col12" class="margin-right-150">
        <el-form-item
          label="客户名称"
          prop="customerId"
        >
          <query-select
            placeholder="请选择"
            v-model="formData.customerName"
            :method="getCustomerOptions"
            :config="{
              valueKey: 'customerName',
              labelKey: 'customerName',
              keywordQueryKey: 'customerName',
              valueQueryKey: 'customerName',
              dataKey: 'data',
              showValue: true,
            }"
            :queryParams="{
              businessType: '',
              customerState: CUSTOMER_STATUS_ENUM.ENABLE,
              isBindBd: YES_OR_NO_NUMBER_ENUM.YES,
              allowedOrderType: '2'
            }"
            @change="handleChangeCustomer"
            :disabled="isUpdate"
          />
        </el-form-item>
        <el-form-item
          label="本单联系人"
          prop="contactId"
        >
          <el-row style="flex-wrap: nowrap; width: 100%" align="middle">
            <el-select
              v-model="formData.contactId"
              filterable
              placeholder="请选择"
              @change="handleChangeContact"
              class="flex-1"
            >
              <el-option
                v-for="item in contactOptions"
                :key="item.customerContactId"
                :label="item.contactName"
                :value="item.customerContactId"
              />
            </el-select>
            <el-button
              type="primary"
              circle
              class="contact-btn"
              @click="handleAddContact"
              :disabled="!existCustomerId"
              v-if="CAN_ADD_CONTACT"
            >+</el-button>
          </el-row>
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="contactPhone"
        >
          <el-input
            v-model.trim="formData.contactPhone"
            placeholder="请输入联系电话"
            :maxlength="100"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="联系邮箱"
          prop="contactEmail"
        >
          <el-input
            v-model.trim="formData.contactEmail"
            placeholder="请输入联系邮箱"
            :maxlength="100"
            disabled
          />
        </el-form-item>
      </responsive-row>
      <detail-title title="填写款号明细" />
      <responsive-row :col="col12" class="margin-right-150">
        <el-form-item
          label="需求类型"
          prop="styleType"
          :col="col24"
        >
          <el-radio-group
            v-model="formData.styleType"
            @change="handleChangeDemandType"
            :disabled="isUpdate"
          >
            <el-radio-button
              v-for="demandType in DEMAND_TYPE_LIST"
              :key="demandType.value"
              :label="demandType.value"
            >{{ demandType.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="款号SPU"
          prop="styleCode"
          :col="col24"
          style="width: 50%"
          v-if="isSelfOperatedBusiness"
        >
          <query-select
            placeholder="请选择"
            v-model="formData.styleCode"
            :method="fuzzySearchSpuInfo"
            :config="{
              valueKey: 'styleCode',
              labelKey: 'styleCode',
              keywordQueryKey: 'styleCodeLike',
              valueQueryKey: 'styleCodeLike',
              dataKey: 'data',
            }"
            @change="handleChangeSpu"
            ref="styleCodeSelectEl"
            :disabled="isUpdate"
          />
          <div class="style-category">
            <el-row v-if="spuInfo.styleCode">
              <el-image
                v-if="spuInfo.customerPictureList?.length"
                style="width: 80px; height: 80px"
                :src="spuInfo.customerPictureList[0]"
                :preview-src-list="spuInfo.customerPictureList"
                preview-teleported
                fit="cover"
                class="margin-right-20"
              ></el-image>
              <div class="style-category-info">
                <p>款式品类：{{ spuInfo.categoryName }}</p>
                <p>码数标准：{{ spuInfo.sizeTypeName }}</p>
              </div>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item
          label="客户款号"
          prop="customerStyleCode"
          v-if="!isSelfOperatedBusiness"
          :rules="[
            { required: true, message: '客户款号不能为空', trigger: ['blur'] },
          ]"
        >
          <el-input
            v-model.trim="formData.customerStyleCode"
            placeholder="请输入客户款号"
            :maxlength="50"
          />
        </el-form-item>
        <el-form-item
          label="码数标准"
          prop="sizeTypeCode"
          :col="col24"
          style="width: 50%"
        >
          <el-select
            v-model="formData.sizeTypeCode"
            filterable
            placeholder="请选择"
            @change="handleChangeCodeStandard"
            class="flex-1"
          >
            <el-option
              v-for="item in PLM_STANDARD_SIZE"
              :key="item.value"
              :label="`${item.label}`"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="款式类型"
          prop="categoryCode"
          key="categoryCode"
          :col="col24"
          style="width: 50%;"
          v-if="!isSelfOperatedBusiness"
        >
          <el-cascader
            ref="cascaderEl"
            v-model="formData.categoryCode"
            :options="PIMS_CATEGORY"
            style="width: 100%"
            placeholder="请选择款式类型"
            :props="{
              value: 'value',
              label: 'label',
              multiple: false,
            }"
            :separator="cascaderSeparator"
            @change="handleCategoryChange"
          />
        </el-form-item>
        <el-form-item
          label="客户款号"
          prop="customerStyleCode"
          :col="isSelfOperatedBusiness ? col24 : col12"
          :style="{width: isSelfOperatedBusiness ? '50%' : ''}"
          v-if="isSelfOperatedBusiness"
        >
          <el-input
            v-model.trim="formData.customerStyleCode"
            placeholder="请输入客户款号"
            :maxlength="50"
          />
        </el-form-item>
        <el-form-item
          label="客户品牌"
          prop="brandId"
        >
          <el-select
            v-model="formData.brandId"
            filterable
            placeholder="请选择"
            @change="handleChangeBrand"
            style="width: 100%"
          >
            <el-option
              v-for="item in brandOptions"
              :key="item.brandId"
              :label="item.brandName"
              :value="item.brandId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="品质要求"
          prop="qualityRequireCode"
        >
          <dictionary-select
            v-model="formData.qualityRequireCode"
            placeholder="请选择"
            :dictionary="CX_DICTIONARY_KEY.QUALITY_REQUIREMENT"
            @change="handleQualityRequireCodeChange"
          />
        </el-form-item>
        <el-form-item
          label="款式图片"
          prop="stylePicture"
          class="style-picture"
          v-if="!isSelfOperatedBusiness"
        >
          <upload
            :limit="9"
            v-model="formData.stylePicture"
            :sizeLimit="10"
            paste
            accept="image/png,image/jpg,image/jpeg"
            tip="最多可以上传 9 张图片, 支持png、jpg、jpeg图片格式"
          />
        </el-form-item>
      </responsive-row>
      <style-color-form
        v-model:skcList="formData.skcList"
        :sizeStandard="sizeStandard"
        :styleType="formData.styleType"
        ref="styleColorFormEl"
      />
      <detail-title title="填写收货信息" class="margin-top-10">
        <template #default>
          <el-button
            type="primary"
            style="margin-right: 150px;"
            :icon="EditPen"
            @click="handleAddDeliveryInfo"
            round
            :disabled="!existCustomerId"
            v-if="CAN_ADD_DELIVERY_INFO"
          >新增收货信息</el-button>
        </template>
      </detail-title>
      <responsive-row :col="col12" class="margin-right-150">
        <el-form-item
          label="期望交期"
          prop="expectDeliveryDate"
        >
          <el-row style="flex-wrap: nowrap; width: 100%" align="middle">
            <el-date-picker
              v-model="formData.expectDeliveryDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择日期"
              :disabledDate="(time) => time.getTime() < Date.now() - 8.64e7"
              class="flex-1"
            />
            <el-tooltip
              effect="dark"
              content="货期不一致请分开录入需求"
              placement="top"
            >
              <el-icon
                color="red"
                :size="20"
                class="margin-left-10"
              ><warning /></el-icon>
            </el-tooltip>
          </el-row>
        </el-form-item>
        <el-form-item
          label="收货人"
          prop="receiverId"
        >
          <el-select
            v-model="formData.receiverId"
            filterable
            placeholder="请选择"
            @change="handleChangeReceiver"
            style="width: 100%"
          >
            <el-option
              v-for="item in receiverOptions"
              :key="item.customerAddressId"
              :label="item.recipient"
              :value="item.customerAddressId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="收货人电话"
          prop="receiptPhone"
        >
          <el-input
            v-model.trim="formData.receiptPhone"
            placeholder="请输入收货人电话"
            :maxlength="100"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="所在地区"
          prop="provinceCityDistrict"
        >
          <!-- <address-picker
            :gutter="0"
            v-model:province="formData.receiptProvince"
            v-model:city="formData.receiptCity"
            v-model:area="formData.receiptRegion"
          /> -->
          <el-input
            v-model="formData.provinceCityDistrict"
            placeholder="请输入所在地区"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="详细地址"
          prop="receiptAddressDetail"
          :col="col24"
        >
          <el-input
            v-model="formData.receiptAddressDetail"
            placeholder="请输入详细地址"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="备注信息"
          prop="remark"
          :col="col24"
        >
          <el-input
            v-model="formData.remark"
            placeholder="请输入内容"
            type="textarea"
            show-word-limit
            maxlength="500"
            :rows="3"
          ></el-input>
        </el-form-item>
      </responsive-row>
    </el-form>
  </div>
</template>

<script lang="tsx">
import { defineComponent, ref, reactive, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Warning, EditPen } from '@element-plus/icons-vue';
import { ElForm, ElMessage, ElCascader } from 'element-plus';
import { filters } from '@/core/plugins/filter';
import StyleColorForm from './components/style-color-form/index.vue';
import DictionarySelect from '@/components/dictionary-select/index.vue';
import { IDictionaryItem } from '@/hooks/use-dictionary/types';
import { fuzzySearchSpuInfo } from '@/api/global';
import { IDemandStyleDemandSpuInfoResItem } from '@/api/global/type';
import {
  getCustomerOptions,
  getCustomerContact,
  getCustomerAddress,
  getBrandBaseInfo,
} from '@/api/query-options';
import {
  ICustomerInfoSearchResItem,
  ICustomerContactSearchResItem,
  ICustomerAddressSearchResItem,
  IBrandBaseInfoResItem,
} from '@/api/query-options/type.d';

import {
  createDemandApi,
  updateDemandApi,
  getDemandDetailApi,
} from '@/modules/demand-manage/platform-demand/api';
import {
  IDemandSaveReq,
} from '@/modules/demand-manage/platform-demand/api/types';
import {
  BUSINESS_MODE_ENUM,
  CUSTOMER_STATUS_ENUM,
  CUSTOMER_ADDRESS_TYPE_ENUM,
  YES_OR_NO_NUMBER_ENUM,
} from '@/constant/global';
import {
  DEMAND_TYPE_ENUM,
  DEMAND_TYPE_LIST,
  DEMAND_STATE_ENUM,
} from '@/modules/demand-manage/platform-demand/constant';
import { TABS_ENUM } from '@/modules/customer-manage/customer-manage/constant';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { useDictionary } from '@/hooks/use-dictionary';
import QuerySelect from '@/components/query-select';
import { usePermissionConfig } from '@/modules/demand-manage/platform-demand/use-permission-config';
import { ISizeStandard } from './components/style-color-form/components/color-size-modal/type';
import { formatTime } from '@tiangong/utils';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  name: 'DemandManagePlatformDemandCreate',
  components: {
    Warning,
    StyleColorForm,
    DictionarySelect,
  },

  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const routeName = $route.name;
    const isCreate = computed(() => routeName === 'DemandManagePlatformDemandCreate');
    const isUpdate = computed(() => routeName === 'DemandManagePlatformDemandUpdate');
    const isCreateAgain = computed(() => routeName === 'DemandManagePlatformDemandCreateAgain');

    const formEl = ref<InstanceType<typeof ElForm> | null>(null);
    const styleColorFormEl = ref<InstanceType<typeof StyleColorForm> | null>(null);
    const cascaderEl = ref<InstanceType<typeof ElCascader> | null>(null);
    const styleCodeSelectEl = ref<InstanceType<typeof QuerySelect> | null>(null);

    const formData = reactive<IDemandSaveReq>({
      customerId: '',
      customerName: '',
      contactId: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      styleType: DEMAND_TYPE_ENUM.SELF_OPERATED_BUSINESS,
      sizeTypeCode: '',
      sizeTypeName: '',
      categoryCode: [],
      stylePicture: [],
      styleCode: '',
      customerStyleCode: '',
      qualityRequireCode: '',
      expectDeliveryDate: '',
      receiver: '',
      receiptPhone: '',
      receiptProvince: '',
      receiptCity: '',
      receiptRegion: '',
      receiptAddressDetail: '',
      brandId: '',
      brandName: '',
      remark: '',
      skcList: [],
      customerStyle: {},

      receiverId: '',
      provinceCityDistrict: '',
    });
    const spuInfo = ref({} as IDemandStyleDemandSpuInfoResItem);
    const sizeStandard = ref<ISizeStandard[]>([]);
    const existCustomerId = computed(() => !!formData.customerId);
    const isSelfOperatedBusiness = computed(() => formData.styleType === DEMAND_TYPE_ENUM.SELF_OPERATED_BUSINESS);

    const { getDictionaryOptions } = useDictionary();
    const PLM_STANDARD_SIZE = computed(
      () => getDictionaryOptions(CX_DICTIONARY_KEY.PLM_STANDARD_SIZE) || [],
    );
    PLM_STANDARD_SIZE.value;

    const PIMS_CATEGORY = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.PIMS_CATEGORY, 3) || [];
    });

    // 返回列表
    const handleBack = () => {
      $router.push({
        name: 'DemandManagePlatformDemandList',
      });
    };

    const resetSizeStandard = (sizeTypeCode = '') => {
      sizeStandard.value = [];
      if (!sizeTypeCode) return;
      for (let index = 0; index < PLM_STANDARD_SIZE.value.length; index++) {
        const sizeInfo = PLM_STANDARD_SIZE.value[index];
        if (sizeInfo.value === sizeTypeCode) {
          sizeStandard.value = (sizeInfo.children
            ?.find(item => !item.disabled)?.label.split(',') ?? [])
            .map(item => ({
              checked: true,
              value: item,
            }));
        }
      }
    };

    const handleChangeCodeStandard = (val = '') => {
      resetSizeStandard(val);
      formData.skcList = [];
      formData.sizeTypeCode = val;
      formData.sizeTypeName = filters.getEnumLabel(PLM_STANDARD_SIZE.value, val);
    };

    const handleChangeSpu = (_val: string, row: IDemandStyleDemandSpuInfoResItem) => {
      spuInfo.value = row;
      formData.customerStyleCode = '';
      handleChangeCodeStandard(row.sizeTypeCode);
    };

    const handleChangeDemandType = () => {
      formData.customerStyleCode = '';
    };

    let qualityRequireName = '';
    const handleQualityRequireCodeChange = (val: string, item: IDictionaryItem) => {
      qualityRequireName = item.label;
    };

    const cascaderSeparator = '-';
    let categoryName = '';
    const handleCategoryChange = () => {
      categoryName = cascaderEl.value?.inputValue?.split(cascaderSeparator).join(cascaderSeparator) || '';
    };

    // 权限
    const {
      CAN_ADD_CONTACT,
      CAN_ADD_DELIVERY_INFO,
    } = usePermissionConfig();

    const handleAddContact = () => {
      const routeData = $router.resolve({
        name: 'CustomerManageUpdateCustomer',
        params: {
          id: formData.customerId,
        },
        query: {
          activeTab: TABS_ENUM.TAB_RELATIONSHIP,
        },
      });
      window.open(routeData.href, '_blank');
    };

    const handleAddDeliveryInfo = () => {
      const routeData = $router.resolve({
        name: 'CustomerManageUpdateCustomer',
        params: {
          id: formData.customerId,
        },
        query: {
          activeTab: TABS_ENUM.TAB_OPERATE,
        },
      });
      window.open(routeData.href, '_blank');
    };

    const contactOptions = ref<ICustomerContactSearchResItem[]>([]);
    const handleChangeContact = (value: string) => {
      const contactInfo = contactOptions.value.find(contact => contact.customerContactId === value);
      formData.contactName = contactInfo!.contactName;
      formData.contactPhone = contactInfo!.phone;
      formData.contactEmail = contactInfo!.email;
    };

    const receiverOptions = ref<ICustomerAddressSearchResItem[]>([]);
    const handleChangeReceiver = (value: string) => {
      const receiverInfo = receiverOptions.value.find(receiver => receiver.customerAddressId === value);
      formData.receiver = receiverInfo!.recipient;
      formData.receiptPhone = receiverInfo!.recipientPhone;
      formData.receiptProvince = receiverInfo!.province;
      formData.receiptCity = receiverInfo!.city;
      formData.receiptRegion = receiverInfo!.region;
      formData.receiptAddressDetail = receiverInfo!.addressDetail;

      formData.provinceCityDistrict = `${formData.receiptProvince}${formData.receiptCity}${formData.receiptRegion}`;
    };

    const brandOptions = ref<IBrandBaseInfoResItem[]>([]);
    const handleChangeBrand = (value: string) => {
      const brandInfo = brandOptions.value.find(brand => brand.brandId === value);
      formData.brandName = brandInfo!.brandName;
    };

    const handleChangeCustomer = async (_customerName: string, row: ICustomerInfoSearchResItem) => {
      const { customerId } = row;
      formData.customerId = customerId;

      contactOptions.value = [];
      receiverOptions.value = [];

      formData.contactId = '';
      formData.contactName = '';
      formData.contactPhone = '';
      formData.contactEmail = '';

      formData.receiverId = '';
      formData.receiver = '';
      formData.receiptPhone = '';
      formData.receiptProvince = '';
      formData.receiptCity = '';
      formData.receiptRegion = '';
      formData.provinceCityDistrict = '';
      formData.receiptAddressDetail = '';

      formData.brandId = '';
      formData.brandName = '';

      const customerContact = await getCustomerContact({
        customerId,
      });
      contactOptions.value = customerContact?.data || [];

      const customerAddress = await getCustomerAddress({
        customerId,
        type: CUSTOMER_ADDRESS_TYPE_ENUM.BULK_ADDRESS,
      });
      receiverOptions.value = customerAddress?.data || [];

      const brandBaseInfo = await getBrandBaseInfo(customerId);
      brandOptions.value = brandBaseInfo?.data || [];
      if (brandOptions.value.length === 1) {
        formData.brandId = brandOptions.value[0].brandId;
        formData.brandName = brandOptions.value[0].brandName;
      }
    };

    const formValidate = async () => {
      return formEl.value?.validate()?.finally(async () => {
        await styleColorFormEl.value?.validate();
      });
    };

    const createDemandData = () => {
      const demandData = {
        ...formData,
      };
      if (!isSelfOperatedBusiness.value) {
        demandData.customerStyle.customerId = demandData.customerId;
        demandData.customerStyle.customerStyleCode = demandData.customerStyleCode;
        demandData.customerStyle.sizeTypeCode = demandData.sizeTypeCode;
        demandData.customerStyle.sizeTypeName = demandData.sizeTypeName;
        demandData.customerStyle.categoryCode = demandData.categoryCode?.join(cascaderSeparator);
        demandData.customerStyle.categoryName = categoryName;
        demandData.customerStyle.customerPicture = demandData.stylePicture?.map(item => item.url);
        demandData.customerStyle.qualityRequireCode = demandData.qualityRequireCode;
        demandData.customerStyle.qualityRequireName = qualityRequireName;
      }

      delete demandData.receiverId;
      delete demandData.categoryCode;
      delete demandData.stylePicture;

      return demandData;
    };

    // 提交
    const handleSubmit = async () => {
      try {
        await formValidate();
        if (isUpdate.value) {
          await updateDemandApi(createDemandData());
        } else {
          await createDemandApi(createDemandData());
        }
        ElMessage.success('操作成功');
        useMenuStore().deleteKeepAlive('DemandManagePlatformDemandList');
        handleBack();
      } catch (error) {
        console.log(error);
      }
    };

    // 初始化
    const init = async () => {
      const id = $route.params.id as string;
      if (!isCreate.value && id) {
        const { data } = await getDemandDetailApi(id);
        const { demandState } = data;
        if (
          (isUpdate.value && demandState !== DEMAND_STATE_ENUM.DEMAND_TO_BE_CONFIRMED)
          || (isCreateAgain.value && demandState !== DEMAND_STATE_ENUM.COMPLETED)
        ) {
          $router.replace({
            name: 'DemandManagePlatformDemandList',
          });
        } else {
          if (isUpdate.value) formData.demandId = id;
          formData.customerId = data.customerId;
          await handleChangeCustomer(
            data.customerName,
            { customerId: formData.customerId } as ICustomerInfoSearchResItem,
          );
          formData.customerName = data.customerName;
          formData.contactId = data.contactId;
          formData.contactName = data.contactName;
          formData.contactPhone = data.contactPhone;
          formData.contactEmail = data.contactEmail;
          formData.styleType = data.styleType;
          formData.styleCode = data.styleCode;
          formData.sizeTypeCode = data.sizeTypeCode;
          formData.sizeTypeName = data.sizeTypeName;
          formData.customerStyleCode = data.customerStyleCode;
          formData.qualityRequireCode = data.qualityRequireCode;
          qualityRequireName = data.qualityRequireName;
          formData.expectDeliveryDate = formatTime(data.expectDeliveryDate, 'YYYY-MM-DD');
          formData.receiver = data.receiver;
          formData.receiptPhone = data.receiptPhone;
          formData.receiptProvince = data.receiptProvince;
          formData.receiptCity = data.receiptCity;
          formData.receiptRegion = data.receiptRegion;
          formData.receiptAddressDetail = data.receiptAddressDetail;
          formData.brandId = data.brandId;
          formData.brandName = data.brandName;
          formData.remark = data.remark;
          formData.skcList = data.skcList;
          formData.customerStyle = data.customerStyle || {};

          formData.receiverId = data.receiver;
          formData.provinceCityDistrict = `${formData.receiptProvince}${formData.receiptCity}${formData.receiptRegion}`;

          if (!isSelfOperatedBusiness.value) {
            formData.styleCode = '';
            formData.customerStyleCode = data.customerStyle.customerStyleCode!;
            formData.sizeTypeCode = data.customerStyle.sizeTypeCode!;
            formData.sizeTypeName = data.customerStyle.sizeTypeName!;
            formData.categoryCode = data.customerStyle.categoryCode!.split(cascaderSeparator);
            categoryName = data.customerStyle.categoryName!;
            formData.stylePicture = data.customerStyle.customerPicture!.map((url) => {
              return { url };
            }) as IDemandSaveReq['stylePicture'];
            formData.qualityRequireCode = data.customerStyle.qualityRequireCode!;
            qualityRequireName = data.customerStyle.qualityRequireName!;
            resetSizeStandard(formData.sizeTypeCode);
          } else {
            const stop = watch(
              () => styleCodeSelectEl.value?.options,
              () => {
                stop();
                styleCodeSelectEl.value?.onChange(formData.styleCode);
                nextTick(() => {
                  handleChangeCodeStandard(data.sizeTypeCode);
                  formData.skcList = data.skcList;
                  formData.customerStyleCode = data.customerStyleCode;
                });
              },
            );
          }
        }
      }
    };
    init();

    return {
      isUpdate,
      formData,
      spuInfo,
      sizeStandard,
      existCustomerId,
      isSelfOperatedBusiness,
      contactOptions,
      handleChangeContact,
      receiverOptions,
      handleChangeReceiver,
      brandOptions,
      handleChangeBrand,
      fuzzySearchSpuInfo,
      getCustomerOptions,
      handleChangeSpu,
      handleChangeCodeStandard,
      handleChangeDemandType,
      handleQualityRequireCodeChange,
      cascaderSeparator,
      handleCategoryChange,
      handleChangeCustomer,
      handleBack,
      handleSubmit,
      CAN_ADD_CONTACT,
      CAN_ADD_DELIVERY_INFO,
      handleAddContact,
      handleAddDeliveryInfo,
      CX_DICTIONARY_KEY,
      BUSINESS_MODE_ENUM,
      CUSTOMER_STATUS_ENUM,
      YES_OR_NO_NUMBER_ENUM,
      DEMAND_TYPE_LIST,
      PLM_STANDARD_SIZE,
      PIMS_CATEGORY,
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
      EditPen,
      formEl,
      cascaderEl,
      styleCodeSelectEl,
      styleColorFormEl,
      formRules: {
        customerId: [
          { required: true, message: '客户名称不能为空', trigger: ['change'] },
        ],
        contactId: [
          { required: true, message: '本单联系人不能为空', trigger: ['change'] },
        ],
        contactPhone: [
          { required: true, message: '联系电话不能为空', trigger: ['blur'] },
        ],
        styleType: [
          { required: true, message: '需求类型不能为空', trigger: ['change'] },
        ],
        styleCode: [
          { required: true, message: '款号SPU不能为空', trigger: ['change'] },
        ],
        sizeTypeCode: [
          { required: true, message: '尺码标准不能为空', trigger: ['change'] },
        ],
        categoryCode: [
          { required: true, message: '款式类型不能为空', trigger: ['change'] },
        ],
        qualityRequireCode: [
          { required: true, message: '品质要求不能为空', trigger: ['change'] },
        ],
        stylePicture: [
          { required: true, message: '款式图片不能为空', trigger: ['change'] },
        ],
        brandId: [
          { required: true, message: '客户品牌不能为空', trigger: ['change'] },
        ],
        expectDeliveryDate: [
          { required: true, message: '期望交期不能为空', trigger: ['change'] },
        ],
        receiverId: [
          { required: true, message: '收货人不能为空', trigger: ['change'] },
        ],
        receiptPhone: [
          { required: true, message: '收货人电话不能为空', trigger: ['blur'] },
        ],
        provinceCityDistrict: [
          { required: true, message: '所在地区不能为空', trigger: ['blur'] },
        ],
        receiptAddressDetail: [
          { required: true, message: '详细地址不能为空', trigger: ['blur'] },
        ],
      },
    };
  },
});
</script>

<style scoped lang="scss">
.container {
  padding: 20px 20px 0;
}
.contact-btn {
  width: 32px;
  height: 32px;
  margin-left: 10px;
  font-size: 24px;
}
.style-category {
  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(100%);
  width: 600px;
  padding-left: 60px;
  &-info {
    flex: 1;
    overflow: hidden;
    padding-right: 35px;
    p {
      @include ellipsis();
    }
  }
}
.style-picture {
  position: absolute;
  top: 25px;
  left: 50%;
  width: 500px;
  :deep(.upload-container .image-list-layout .ul .li),
  :deep(.upload-container .image-list-layout .upload),
  :deep(.upload-container .image_item),
  :deep(.upload-wrap) {
    width: 65px;
    height: 65px;
  }
  :deep(.upload-wrap) {
    line-height: 65px;
    font-size: 12px;
  }
}
.margin-right-150 {
  margin-right: 150px;
}
</style>
