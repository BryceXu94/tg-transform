<!--
 * @Descripttion:
 * @Author: weitongxue
-->
<template>
  <div class="operate-info">
    <div class="operate-info__title flex-justify-between flex-align-center">
      <span>产品信息</span>
      <el-button
        v-if="isCreate && CAN_CREATE_PRODUCT_DATA"
        type="success"
        @click="handleSave"
      >暂存</el-button>
      <div v-else>
        <el-button
          type="primary"
          v-show="!isEdit && !edit && CAN_UPDATE_PRODUCT_DATA"
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
    <div class="operate-info__content">
      <div
        class="content-title flex flex-align-center"
      >
        <div class="brand-content">
          <el-tag
            v-for="(item, index) in brandNameList"
            :key="index"
            class="margin-right-10 tag"
            @click="handleScroll(item)"
          >
            {{item}}
          </el-tag>
        </div>
        <el-button
          type="text"
          v-if="edit || isCreate"
          @click="handleAddBrand"
        >添加品牌</el-button>
      </div>
      <div
        class="content"
        v-for="(item, index) in brandList"
        :key="index"
        :id="item.brandName"
      >
        <div
          class="flex flex-justify-end del-brand"
          v-show="brandList.length > 1 && isEdit"
          @click="handleDelBrand(index)"
        >删除品牌</div>
        <el-form
          :model="item"
          label-width="140px"
          :ref="el => setRefs(el, index)"
        >
          <responsive-row :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }">
            <el-form-item
              label="公司品牌："
              prop="brandName"
              :rules="[
                {
                  required: true,
                  validator: validateBrantName,
                },
              ]"
            >
              <el-input
                v-model="item.brandName"
                maxlength="100"
                placeholder="请输入公司品牌"
                v-if="isEdit"
              ></el-input>
              <div v-else>{{item?.brandName}}</div>
            </el-form-item>
            <el-form-item
              label="品牌类型："
              prop="brandType"
              :rules="[
                {
                  required: true,
                  message: '请选择品牌类型',
                  trigger: ['blur', 'change'],
                },
              ]"
            >
              <dictionary-select
                v-model="item.brandType"
                placeholder="请选择品牌类型"
                multiple
                :dictionary="CX_DICTIONARY_KEY.BRAND_TYPE"
                v-if="isEdit"
              />
              <div v-else>
                {{$filters.getEnumLabels(brandType, item?.brandType)}}
              </div>
            </el-form-item>
            <el-form-item
              label="对标品牌："
            >
              <el-input
                maxlength="100"
                v-model="item.benchmarkingBrand"
                placeholder="请输入对标品牌"
                v-if="isEdit"
              ></el-input>
              <div v-else>{{item?.benchmarkingBrand}}</div>
            </el-form-item>
            <el-form-item
              label="消费年龄："
              prop="consumerAgeList"
              :rules="[
                {
                  required: true,
                  message: '请选择消费年龄',
                  trigger: ['blur', 'change'],
                },
              ]"
            >
              <dictionary-select
                v-model="item.consumerAgeList"
                :multiple="true"
                placeholder="请选择消费年龄"
                :dictionary="CX_DICTIONARY_KEY.CONSUMER_AGE"
                v-if="isEdit"
              />
              <div v-else>
                {{$filters.getEnumLabels(consumerAgeList, item.consumerAgeList)}}
              </div>
            </el-form-item>
            <el-form-item
              label="产品风格："
              prop="productStyle"
              :rules="[
                {
                  required: true,
                  message: '请选择产品风格',
                  trigger: ['blur', 'change'],
                },
              ]"
            >
              <dictionary-select
                v-model="item.productStyle"
                placeholder="请选择产品风格"
                :multiple="true"
                :dictionary="CX_DICTIONARY_KEY.PRODUCT_STYLE"
                v-if="isEdit"
              />
              <!-- productStyle -->
              <div v-else>
                {{$filters.getEnumLabels(productStyle, item.productStyle)}}
              </div>
            </el-form-item>
            <el-form-item
              label="品质要求："
              prop="qualityRequirement"
              :rules="[
                {
                  required: true,
                  message: '请选择品质要求',
                  trigger: ['blur', 'change'],
                },
              ]"
            >
              <dictionary-select
                v-model="item.qualityRequirement"
                placeholder="请选择品质要求"
                :dictionary="CX_DICTIONARY_KEY.QUALITY_REQUIREMENT"
                v-if="isEdit"
              />
              <div v-else>{{$filters.getEnumLabel(quality, item?.qualityRequirement)}}</div>
            </el-form-item>
            <el-form-item
              label="面料级别："
              prop="fabricLevel"
            >
              <dictionary-select
                v-model="item.fabricLevel"
                placeholder="请选择面料级别"
                :dictionary="CX_DICTIONARY_KEY.CRM_FABRIC_LEVEL"
                v-if="isEdit"
                clearable
              />
              <div v-else>{{$filters.getEnumLabel(fabricLevel, item?.fabricLevel!)}}</div>
            </el-form-item>
            <el-form-item
              label="工艺级别："
              prop="craftLevel"
            >
              <dictionary-select
                v-model="item.craftLevel"
                placeholder="请选择工艺级别"
                :dictionary="CX_DICTIONARY_KEY.CRM_CRAFT_LEVEL"
                v-if="isEdit"
                clearable
              />
              <div v-else>{{$filters.getEnumLabel(craftLevel, item?.craftLevel!)}}</div>
            </el-form-item>
            <el-form-item
              label="供应链服务级别："
              prop="supplyChainLevel"
            >
              <dictionary-select
                v-model="item.supplyChainLevel"
                placeholder="请选择供应链服务级别"
                :dictionary="CX_DICTIONARY_KEY.CRM_SUPPLY_CHAIN_LEVEL"
                v-if="isEdit"
                clearable
              />
              <div v-else>{{$filters.getEnumLabel(supplyChainLevel, item?.supplyChainLevel!)}}</div>
            </el-form-item>

          </responsive-row>
        </el-form>
        <!-- 销售渠道 -->
        <div class="channel">
          <div class="channel-content">
            <custom-table
              :ref="el => setRefs(el, index)"
              border
              :key="brandList[index].saleChannelList.length"
              :is-form="true"
              :data="item.saleChannelList"
              :columns="channelRenderColumns(
                item.saleChannelList.length,
                handleChannelDelete,
                handleChannelAdd,
                index,
                isEdit,
                handleSelectChannel,
                channelRepeat,
                saleChannel
              )"
            />
          </div>
        </div>
        <!-- 合作模式 -->
        <div class="cooperation">
          <div class="cooperation-content">
            <custom-table
              :ref="el => setRefs(el, index)"
              border
              :key="brandList[index].cooperationModeList.length"
              :is-form="true"
              :data="item.cooperationModeList"
              :columns="cooperationRenderColumns(
                item.cooperationModeList.length,
                handleCooperationDelete,
                handleCooperationAdd,
                index,
                isEdit,
                handleSelectType,
                cooperationRepeat,
                cooperation
              )"
            />
          </div>
        </div>
        <!-- 核心品类 -->
        <div class="category">
          <div class="category-content">
            <custom-table
              :ref="el => setRefs(el, index)"
              border
              :key="brandList[index].coreCategoryList.length"
              :is-form="true"
              :data="item.coreCategoryList"
              :columns="categoryRenderColumns(
                item.coreCategoryList.length,
                handleCategoryDelete,
                handleCategoryAdd,
                index,
                isEdit,
                category,
                handleSelectCategory
              )"
            />
          </div>
        </div>
        <!-- 面料检测内容 -->
        <div class="margin-top-20">
          <div class="font-bold">面料检测内容</div>
          <el-form
            label-width="140px"
            :model="brandList[index].checkRequirementModel"
            :ref="el => setRefs(el, index)"
          >
            <el-form-item
              label="检测方式："
              prop="checkWay"
              class="margin-top-20"
            >
              <el-radio-group
                v-model="brandList[index].checkRequirementModel.checkWay"
                v-if="isEdit"
                @change="(val) => handleChangeCheckWay(val, index)"
              >
                <el-radio
                  v-for="item in CHECK_WAY_LIST"
                  :key="item.value"
                  :label="item.value"
                >{{item.label}}</el-radio>
              </el-radio-group>
              <div v-else>
                <span>
                  {{$filters.getEnumLabel(
                    CHECK_WAY_LIST,
                    brandList?.[index]?.checkRequirementModel?.checkWay!
                  )}}
                </span>
              </div>
            </el-form-item>
            <responsive-row
              :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
              v-if="brandList?.[index]?.checkRequirementModel?.checkWay !== CHECK_WAY_ENUM.NOT_REQUIRED_CHECK
                && brandList[index].checkRequirementModel.checkWay"
            >
              <el-form-item
                label="面辅料检测要求："
                prop="fabricRequirement"
                :rules="[
                  {
                    required: true,
                    message: '请选择面辅料检测要求',
                    trigger: ['blur', 'change'],
                  },
                ]"
              >
                <dictionary-select
                  v-model="brandList[index].checkRequirementModel.fabricRequirement"
                  multiple
                  placeholder="请选择面辅料检测要求"
                  :dictionary="CX_DICTIONARY_KEY.CRM_MATERIAL_TESTING_REQUIREMENTS"
                  v-if="isEdit"
                  clearable
                />
                <div v-else>
                  <span>
                    {{$filters.getEnumLabels(
                      materialTestingRequirements, brandList[index].checkRequirementModel.fabricRequirement!
                    )}}</span>
                </div>
              </el-form-item>
              <el-form-item
                label="面辅料检测支付："
                prop="fabricPaymentWay"
                :rules="[
                  {
                    required: true,
                    message: '请选择面辅料检测支付',
                    trigger: ['blur', 'change'],
                  },
                ]"
                v-if="brandList?.[index]?.checkRequirementModel?.checkWay !== CHECK_WAY_ENUM.TIANGONG_CHECK"
              >
                <el-radio-group
                  v-model="brandList[index].checkRequirementModel.fabricPaymentWay"
                  v-if="isEdit"
                >
                  <el-radio
                    v-for="info in PAYMENT_WAY_LIST"
                    :key="info.value"
                    :label="info.value"
                  >{{info.label}}</el-radio>
                </el-radio-group>
                <div v-else>
                  <span>{{$filters.getEnumLabel(
                    PAYMENT_WAY_LIST,
                    brandList?.[index]?.checkRequirementModel?.fabricPaymentWay!
                  )}}</span>
                </div>
              </el-form-item>
              <el-form-item
                label="成衣检测要求："
                prop="productRequirement"
                :rules="[
                  {
                    required: true,
                    message: '请选择成衣检测要求',
                    trigger: ['blur', 'change'],
                  },
                ]"
              >

                <dictionary-select
                  v-model="brandList[index].checkRequirementModel.productRequirement"
                  multiple
                  placeholder="请选择成衣检测要求"
                  :dictionary="CX_DICTIONARY_KEY.CRM_GARMENT_TESTING_REQUIREMENTS"
                  v-if="isEdit"
                  clearable
                />
                <div v-else>
                  <span>
                    {{$filters.getEnumLabels(
                      garmentTestingRequirements, brandList[index].checkRequirementModel.productRequirement!
                    )}}</span>
                </div>
              </el-form-item>
              <el-form-item
                label="成衣检测支付："
                prop="productPaymentWay"
                :rules="[
                  {
                    required: true,
                    message: '请选择成衣检测支付',
                    trigger: ['blur', 'change'],
                  },
                ]"
                v-if="brandList?.[index]?.checkRequirementModel?.checkWay !== CHECK_WAY_ENUM.TIANGONG_CHECK"
              >
                <el-radio-group
                  v-model="brandList[index].checkRequirementModel.productPaymentWay"
                  v-if="isEdit"
                >
                  <el-radio
                    v-for="info in PAYMENT_WAY_LIST"
                    :key="info.value"
                    :label="info.value"
                  >{{info.label}}</el-radio>
                </el-radio-group>
                <div v-else>
                  <span>{{$filters.getEnumLabel(
                    PAYMENT_WAY_LIST,
                    brandList?.[index]?.checkRequirementModel?.productPaymentWay!
                  )}}</span>
                </div>
              </el-form-item>
            </responsive-row>
          </el-form>
        </div>

        <!-- 包装内容 -->
        <div class="margin-top-20">
          <div class="margin-bottom-20 font-bold">包装内容</div>
          <el-form
            label-width="140px"
            :model="brandList[index].checkRequirementModel"
            :ref="el => setRefs(el, index)"
          >
            <responsive-row
              :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
              v-for="(item, key) in brandList?.[index]?.checkRequirementModel?.packageRequirement"
              :key="item"
            >
              <el-form-item
                label="包装要求："
                prop="packageRequireList"
              >
                <dictionary-select
                  v-model="item.packageRequireList"
                  multiple
                  placeholder="请选择包装要求"
                  :dictionary="CX_DICTIONARY_KEY.CRM_PACKAGING_REQUIREMENTS"
                  v-if="isEdit"
                  clearable
                />
                <div v-else>
                  <span>
                    {{$filters.getEnumLabels(
                      packagingRequirements, item.packageRequireList!
                    )}}
                  </span>
                </div>
              </el-form-item>
              <el-form-item
                label="包装供给方："
                prop="packageProvider"
              >
                <el-radio-group
                  v-model="item.packageProvider"
                  v-if="isEdit"
                >
                  <el-radio
                    v-for="info in PACKAGE_PROVIDER_LIST"
                    :key="info.value"
                    :label="info.value"
                    :disabled="brandList?.[index]?.checkRequirementModel?.packageRequirement?.map(
                      info => info.packageProvider!).includes(info.value)"
                  >{{info.label}}</el-radio>
                </el-radio-group>
                <div v-else>
                  <span>{{$filters.getEnumLabel(PACKAGE_PROVIDER_LIST, item?.packageProvider!)}}</span>
                </div>
                <el-button
                  type="text"
                  class="margin-left-10"
                  @click="handleAddPacking(index)"
                  v-show="index === brandList[index].checkRequirementModel.packageRequirement!.length - 1"
                  v-if="isEdit"
                >添加</el-button>
                <el-button
                  type="text"
                  class="margin-left-10"
                  @click="handleDelPacking(index, key)"
                  v-show="brandList[index].checkRequirementModel.packageRequirement!.length > 1"
                  v-if="isEdit"
                >删除</el-button>
              </el-form-item>
            </responsive-row>
            <el-form-item
              label="包装支付："
              prop="packagePayment"
              :rules="[
                {
                  required: true,
                  message: '请选择包装支付',
                  trigger: ['blur', 'change'],
                },
              ]"
              v-if="brandList?.[index]?.checkRequirementModel?.packageRequirement?.map(
                info => info.packageProvider!).includes(PAYMENT_WAY_ENUM.TIANGONG_PAY)"
            >
              <el-radio-group
                v-model="brandList[index].checkRequirementModel.packagePayment"
                v-if="isEdit"
              >
                <el-radio
                  v-for="info in PAYMENT_WAY_LIST"
                  :key="info.value"
                  :label="info.value"
                >{{info.label}}</el-radio>
              </el-radio-group>
              <div v-else>
                <span>{{$filters.getEnumLabel(
                  PAYMENT_WAY_LIST,
                  brandList?.[index]?.checkRequirementModel?.packagePayment!
                )}}</span>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <!-- 运输内容 -->
        <div class="margin-top-20">
          <div class="margin-bottom-20 font-bold">运输内容</div>
          <el-form
            label-width="140px"
            :model="brandList?.[index]?.checkRequirementModel"
          >
            <responsive-row
              :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
            >
              <el-form-item
                label="运输方式："
                prop="deliveryWay"
              >
                <dictionary-select
                  v-model="brandList[index].checkRequirementModel.deliveryWay"
                  placeholder="请选择运输方式"
                  :dictionary="CX_DICTIONARY_KEY.CRM_TYPE_OF_SHIPPING"
                  v-if="isEdit"
                  multiple
                  clearable
                />
                <div v-else>
                  <span>{{$filters.getEnumLabels(
                    typeOfShipping,
                    brandList?.[index]?.checkRequirementModel?.deliveryWay!)}}</span>
                </div>
              </el-form-item>
              <el-form-item
                label="运费支付："
                prop="shippingFeePayment"
              >
                <el-radio-group
                  v-model="brandList[index].checkRequirementModel.shippingFeePayment"
                  v-if="isEdit"
                >
                  <el-radio
                    v-for="info in PAYMENT_WAY_LIST"
                    :key="info.value"
                    :label="info.value"
                  >{{info.label}}</el-radio>
                </el-radio-group>
                <div v-else>
                  <span>{{$filters.getEnumLabel(
                    PAYMENT_WAY_LIST,
                    brandList?.[index]?.checkRequirementModel?.shippingFeePayment!
                  )}}</span>
                </div>
              </el-form-item>
            </responsive-row>
          </el-form>
        </div>

        <!-- 下单内容 -->
        <div class="margin-top-20">
          <div class="margin-bottom-20 font-bold">下单内容</div>
          <div class="margin-top-10">
            <el-form
              :model="item.productPeriod"
              label-width="140px"
              :ref="el => setRefs(el, index)"
            >
              <responsive-row :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }">
                <el-form-item
                  label="开发选版规律："
                  prop="prototypePeriod"
                >
                  <div
                    class="flex row-width"
                    v-if="isEdit"
                  >
                    <input-number
                      v-model="item.productPeriod.prototypePeriod"
                      :max="999"
                      :precision="0"
                      :min="0"
                      placeholder="请输入开发选版周期"
                    >
                      <template #append>
                        <el-select style="width: 70px" v-model="item.productPeriod.prototypePeriodUnit">
                          <el-option value="天">天</el-option>
                          <el-option value="周">周</el-option>
                          <el-option value="月">月</el-option>
                        </el-select>
                      </template>
                    </input-number>
                    <input-number
                      v-model="item.productPeriod.prototypePeriodTimes"
                      :max="999"
                      :min="0"
                      :precision="0"
                      placeholder="请输入开发选版次数"
                    >
                      <template #append>
                        <div>次</div>
                      </template>
                    </input-number>
                  </div>
                  <div v-else>
                    <span
                      v-if="item?.productPeriod?.prototypePeriod"
                    >{{item?.productPeriod?.prototypePeriod}}{{item?.productPeriod?.prototypePeriodUnit}}</span>
                    <span
                      v-if="item?.productPeriod?.prototypePeriodTimes"
                    >/{{item?.productPeriod?.prototypePeriodTimes}}次</span>
                  </div>
                </el-form-item>
                <el-form-item
                  label="生产下单规律："
                  prop="producePeriod"
                >
                  <div class="flex row-width" v-if="isEdit">
                    <input-number
                      v-model="item.productPeriod.producePeriod"
                      :max="999"
                      :min="0"
                      :precision="0"
                      placeholder="请输入生产下单周期"
                    >
                      <template #append>
                        <el-select
                          style="width: 70px"
                          v-model="item.productPeriod.producePeriodUnit"
                        >
                          <el-option value="天">天</el-option>
                          <el-option value="周">周</el-option>
                          <el-option value="月">月</el-option>
                        </el-select>
                      </template>
                    </input-number>
                    <input-number
                      v-model="item.productPeriod.producePeriodTimes"
                      :max="999"
                      :min="0"
                      :precision="0"
                      placeholder="请输入生产下单次数"
                    >
                      <template #append>
                        <div>次</div>
                      </template>
                    </input-number>
                  </div>
                  <div v-else>
                    <span
                      v-if="item?.productPeriod?.producePeriod"
                    >{{item?.productPeriod?.producePeriod}}{{item?.productPeriod?.producePeriodUnit}}</span>
                    <span
                      v-if="item?.productPeriod?.producePeriodTimes"
                    >/{{item?.productPeriod?.producePeriodTimes}}次</span>
                  </div>
                </el-form-item>
                <el-form-item
                  label="常规首单件数："
                  prop="firstOrderPiece"
                  :rules="[
                    {
                      required: true,
                      message: '请输入常规首单件数',
                      trigger: ['blur', 'change'],
                    },
                  ]"
                >
                  <input-number
                    :max="9999999"
                    :min="0"
                    :precision="0"
                    v-model="item.productPeriod.firstOrderPiece"
                    placeholder="请输入常规首单件数"
                    v-if="isEdit"
                  >
                    <template #append>
                      <div>件</div>
                    </template>
                  </input-number>
                  <div v-if="!isEdit">
                    <span v-if="item?.productPeriod?.firstOrderPiece">{{item?.productPeriod?.firstOrderPiece}}件</span>
                  </div>
                </el-form-item>
                <el-form-item
                  label="常规返单件数："
                  prop="reworkOrderPiece"
                  :rules="[
                    {
                      required: true,
                      message: '请输入常规返单件数',
                      trigger: ['blur', 'change'],
                    },
                  ]"
                >
                  <input-number
                    :max="9999999"
                    :precision="0"
                    :min="0"
                    v-model="item.productPeriod.reworkOrderPiece"
                    placeholder="请输入常规返单件数"
                    v-if="isEdit"
                  >
                    <template #append>
                      <div>件</div>
                    </template>
                  </input-number>
                  <div v-if="!isEdit">
                    <span v-if="item?.productPeriod?.reworkOrderPiece">{{item?.productPeriod?.reworkOrderPiece}}件</span>
                  </div>
                </el-form-item>
                <el-form-item
                  label="首单生产周期："
                  prop="firstOrderProducePeriodMax"
                  :rules="[
                    {
                      required: true,
                      validator: (r, v, c) => validateProduce(r, v, c, item),
                      trigger: ['blur', 'change'],
                    },
                  ]"
                >
                  <div class="flex row-width" v-if="isEdit">
                    <input-number
                      :max="999"
                      :min="0"
                      :precision="0"
                      v-model="item.productPeriod.firstOrderProducePeriodMin"
                      placeholder="请输入首单生产周期"
                    >
                      <template #append>
                        <div>天</div>
                      </template>
                    </input-number>
                    <span class="padding-left-5 padding-right-5">至</span>
                    <input-number
                      :max="999"
                      :min="0"
                      :precision="0"
                      v-model="item.productPeriod.firstOrderProducePeriodMax"
                      placeholder="请输入首单生产周期"
                    >
                      <template #append>
                        <div>天</div>
                      </template>
                    </input-number>
                  </div>
                  <div v-else>
                    <span
                      v-if="item?.productPeriod?.firstOrderProducePeriodMin"
                    >{{item?.productPeriod?.firstOrderProducePeriodMin}}-</span>
                    <span
                      v-if="item?.productPeriod?.firstOrderProducePeriodMax"
                    >{{item?.productPeriod?.firstOrderProducePeriodMax}}天</span>
                  </div>
                </el-form-item>
                <el-form-item
                  label="返单生产周期："
                  prop="reworkOrderProducePeriodMax"
                  :rules="[
                    {
                      required: true,
                      validator: (r, v, c) => validateReworkOrder(r, v, c, item),
                      trigger: ['blur', 'change'],
                    },
                  ]"
                >
                  <div class="flex row-width" v-if="isEdit">
                    <input-number
                      :max="999"
                      :min="0"
                      :precision="0"
                      v-model="item.productPeriod.reworkOrderProducePeriodMin"
                      placeholder="请输入返单生产周期"
                    >
                      <template #append>
                        <div>天</div>
                      </template>
                    </input-number>
                    <span class="padding-left-5 padding-right-5">至</span>
                    <input-number
                      :max="999"
                      :min="0"
                      :precision="0"
                      v-model="item.productPeriod.reworkOrderProducePeriodMax"
                      placeholder="请输入返单生产周期"
                    >
                      <template #append>
                        <div>天</div>
                      </template>
                    </input-number>
                  </div>
                  <div v-else>
                    <span
                      v-if="item?.productPeriod?.reworkOrderProducePeriodMin"
                    >{{item?.productPeriod?.reworkOrderProducePeriodMin}}-</span>
                    <span
                      v-if="item?.productPeriod?.reworkOrderProducePeriodMax"
                    >{{item?.productPeriod?.reworkOrderProducePeriodMax}}天</span>
                  </div>
                </el-form-item>
                <el-form-item
                  label="样版开发周期："
                  prop="prototypeDevelopmentPeriodMax"
                  :rules="item.productPeriod.prototypeDevelopmentPeriodMax ? {
                    validator: (r, v, c) => validateDevelopment(r, v, c, item),
                    trigger: ['blur', 'change'],
                  } : {}"
                >
                  <div class="flex row-width" v-if="isEdit">
                    <input-number
                      :max="999"
                      :min="0"
                      :precision="0"
                      v-model="item.productPeriod.prototypeDevelopmentPeriodMin"
                      placeholder="请输入样版开发周期"
                    >
                      <template #append>
                        <div>天</div>
                      </template>
                    </input-number>
                    <span class="padding-left-5 padding-right-5">至</span>
                    <input-number
                      :max="999"
                      :min="0"
                      :precision="0"
                      v-model="item.productPeriod.prototypeDevelopmentPeriodMax"
                      placeholder="请输入样版开发周期"
                    >
                      <template #append>
                        <div>天</div>
                      </template>
                    </input-number>
                  </div>
                  <div v-else>
                    <span
                      v-if="item?.productPeriod?.prototypeDevelopmentPeriodMin"
                    >{{item?.productPeriod?.prototypeDevelopmentPeriodMin}}-</span>
                    <span
                      v-if="item?.productPeriod?.prototypeDevelopmentPeriodMax"
                    >{{item?.productPeriod?.prototypeDevelopmentPeriodMax}}天</span>
                  </div>
                </el-form-item>
                <el-form-item
                  label="客户验货标准："
                  prop="customerInspectionLevel"
                >
                  <dictionary-select
                    v-model="item.productPeriod.customerInspectionLevel"
                    placeholder="请选择客户验货标准"
                    :dictionary="CX_DICTIONARY_KEY.CRM_CUSTOMER_INSPECTION_LEVEL"
                    v-if="isEdit"
                    clearable
                  />
                  <div v-else>
                    {{$filters.getEnumLabel(customerInspectionLevel, item?.productPeriod?.customerInspectionLevel!)}}
                  </div>
                </el-form-item>
                <el-form-item
                  label="产前样要求："
                >
                  <el-input
                    v-if="isEdit"
                    placeholder="请属于产前样要求"
                    type="textarea"
                    maxLength="500"
                    v-model="item.productPeriod.sampleRequirement"
                  />
                  <div v-else>
                    {{item?.productPeriod?.sampleRequirement}}
                  </div>
                </el-form-item>
              </responsive-row>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  PropType,
  watch,
  onBeforeUpdate,
  inject,
} from 'vue';
import { useRoute } from 'vue-router';
import {
  channelRenderColumns,
  cooperationRenderColumns,
  categoryRenderColumns,
} from './composables/tableData';

import { useToRepeat, repeat } from './composables/use-brand-hooks';

import DictionarySelect from '@/components/dictionary-select/index.vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import { updateCustomerBusinessInfoApi, platformBusinessSaveApi } from '@/modules/customer-manage/customer-manage/api';
import { useDictionary } from '@/hooks/use-dictionary';
import { uniq, cloneDeep } from 'lodash-es';

import {
  IBusinessInfoSaveReq,
  IDetailBusinessInfoResBrandListItem,
  IBusinessInfoSaveReqBrandListItem,
} from '@/modules/customer-manage/customer-manage/api/types';
import {
  MODULE_BLOCK_ENUM,
  CHECK_WAY_LIST,
  CHECK_WAY_ENUM,
  TABS_ENUM,
  PAYMENT_WAY_ENUM,
  PAYMENT_WAY_LIST,
  PACKAGE_PROVIDER_LIST,
} from '@/modules/customer-manage/customer-manage/constant';
import { BUSINESS_MODE_ENUM } from '@/constant/global';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { usePermissionConfig } from '@/modules/customer-manage/customer-manage/use-permission-config';
// import CustomTable from '@/components/custom-table';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<IDetailBusinessInfoResBrandListItem[]>,
      default: () => [],
    },
    businessType: {
      type: String,
      default: '',
    },
  },
  components: {
    DictionarySelect,
  },
  setup(props) {
    const $route = useRoute();
    const customerId = $route.params.id! as string;
    const routeName = $route.name;
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
      CAN_CREATE_PRODUCT_DATA,
      CAN_UPDATE_PRODUCT_DATA,
    } = usePermissionConfig();

    const { getDictionaryOptions } = useDictionary();
    // 查询品类
    const category = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.PIMS_CATEGORY, 3) || [];
    });
    // 查询品质要求
    const quality = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.QUALITY_REQUIREMENT) || [];
    });
    // 查询产品风格
    const productStyle = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.PRODUCT_STYLE) || [];
    });
    // 查询消费年龄
    const consumerAgeList = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CONSUMER_AGE) || [];
    });
    // 销售渠道
    const saleChannel = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.SALE_CHANNEL) || [];
    });
    // 品牌类型
    const brandType = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.BRAND_TYPE) || [];
    });
    // 合作模式
    const cooperation = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.COOPERATION_MODE) || [];
    });
    // 面料级别
    const fabricLevel = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_FABRIC_LEVEL) || [];
    });
    // 工艺级别
    const craftLevel = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_CRAFT_LEVEL) || [];
    });
    // 供应链服务级别
    const supplyChainLevel = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_SUPPLY_CHAIN_LEVEL) || [];
    });
    // 客户验货标准
    const customerInspectionLevel = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_CUSTOMER_INSPECTION_LEVEL) || [];
    });
    // 包装要求
    const packagingRequirements = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_PACKAGING_REQUIREMENTS) || [];
    });
    // 面辅料检测要求
    const materialTestingRequirements = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_MATERIAL_TESTING_REQUIREMENTS) || [];
    });
    // 成衣检测要求
    const garmentTestingRequirements = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_GARMENT_TESTING_REQUIREMENTS) || [];
    });
    // 运输方式
    const typeOfShipping = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_TYPE_OF_SHIPPING) || [];
    });

    const brandList = ref<IBusinessInfoSaveReqBrandListItem[]>([
      {
        brandName: '', // 品牌名称
        brandType: [], // 品牌类型
        benchmarkingBrand: '', // 对标品牌
        qualityRequirement: '', // 品质要求
        fabricLevel: '', // 面料级别
        craftLevel: '', // 工艺级别
        supplyChainLevel: '', // 供应链服务级别
        productStyle: [], // 产品风格
        consumerAgeList: [], // 消费年龄
        productPeriod: {
          prototypePeriodUnit: '天', // 选版周期-单位
          prototypePeriod: '', // 选版周期-单位数量
          prototypePeriodTimes: '', // 选版周期-周期内选版次数
          producePeriodUnit: '天', // 生产周期-单位
          producePeriod: '', // 生产周期-单位数量
          producePeriodTimes: '', // 生产周期-周期内选版次数
          firstOrderPiece: '', // 常规首单件数
          reworkOrderPiece: '', // 常规返单件数
          firstOrderProducePeriodMin: '', // 首单生产周期最小天数
          firstOrderProducePeriodMax: '', // 首单生产周期
          reworkOrderProducePeriodMin: '', // 返单生产周期
          reworkOrderProducePeriodMax: '', // 返单生产周期
          prototypeDevelopmentPeriodMin: '', // 样版开发周期
          prototypeDevelopmentPeriodMax: '', // 样版开发周期
          customerInspectionLevel: '', // 客户验货标准
        },
        checkRequirementModel: {
          checkWay: '', // 检测方式
          fabricRequirement: [], // 面辅料检测要求
          productRequirement: [], // 成衣检测要求
          fabricPaymentWay: '', // 面辅料检测支付
          productPaymentWay: '', // 成衣检测支付
          packagePayment: '', // 包装支付
          deliveryWay: [], // 运输方式
          shippingFeePayment: '', // 运费支付方式
          packageRequirement: [{
            packageRequireList: [], // 包装要求
            packageProvider: '', // 包装供给方
          }],
        },
        saleChannelList: [
          {
            channelCode: '',
            salesRatio: '',
          },
        ],
        cooperationModeList: [
          {
            cooperationType: '',
            cooperationRatio: '',
          },
        ],
        coreCategoryList: [
          {
            category: [],
            ratio: '',
            machiningAveragePrice: '',
            perTicketSales: '',
          },
        ],
      },
    ]);

    const refs = ref<any[]>([]);
    const setRefs = (el: any, index: number) => {
      console.log(el, index);
      refs.value.push(el);
    };

    onBeforeUpdate(() => {
      refs.value = [];
    });

    // 获取品牌名称
    const brandNameList = computed(() => {
      return brandList.value.map(item => item.brandName).filter(info => info);
    });

    // 添加品牌
    const copyBrantNameList = ref<{key: number; value: string;}[]>([]);
    const handleAddBrand = () => {
      refs.value = [];
      brandList.value.forEach((item, index) => {
        copyBrantNameList.value.push({
          key: index,
          value: item.brandName,
        });
      });
      brandList.value.push(
        {
          brandName: '', // 品牌名称
          brandType: [], // 品牌类型
          benchmarkingBrand: '', // 对标品牌
          qualityRequirement: '', // 品质要求
          fabricLevel: '', // 面料级别
          craftLevel: '', // 工艺级别
          supplyChainLevel: '', // 供应链服务级别
          productStyle: [], // 产品风格
          consumerAgeList: [], // 消费年龄
          productPeriod: {
            prototypePeriodUnit: '天', // 选版周期-单位
            prototypePeriod: '', // 选版周期-单位数量
            prototypePeriodTimes: '', // 选版周期-周期内选版次数
            producePeriodUnit: '天', // 生产周期-单位
            producePeriod: '', // 生产周期-单位数量
            producePeriodTimes: '', // 生产周期-周期内选版次数
            firstOrderPiece: '', // 常规首单件数
            reworkOrderPiece: '', // 常规返单件数
            firstOrderProducePeriodMin: '', // 首单生产周期最小天数
            firstOrderProducePeriodMax: '', // 首单生产周期
            reworkOrderProducePeriodMin: '', // 返单生产周期
            reworkOrderProducePeriodMax: '', // 返单生产周期
            prototypeDevelopmentPeriodMin: '', // 样版开发周期
            prototypeDevelopmentPeriodMax: '', // 样版开发周期
            customerInspectionLevel: '', // 客户验货标准
          },
          checkRequirementModel: {
            checkWay: '', // 检测方式
            fabricRequirement: [], // 面辅料检测要求
            productRequirement: [], // 成衣检测要求
            fabricPaymentWay: '', // 面辅料检测支付
            productPaymentWay: '', // 成衣检测支付
            packagePayment: '', // 包装支付
            deliveryWay: [], // 运输方式
            shippingFeePayment: '', // 运费支付方式
            packageRequirement: [{
              packageRequireList: [], // 包装要求
              packageProvider: '', // 包装供给方
            }],
          },
          saleChannelList: [
            {
              channelCode: '',
              salesRatio: '',
            },
          ],
          cooperationModeList: [
            {
              cooperationType: '',
              cooperationRatio: '',
            },
          ],
          coreCategoryList: [
            {
              category: [],
              ratio: '',
              machiningAveragePrice: '',
              perTicketSales: '',
            },
          ],
        },
      );
    };

    const handleAddPacking = (index: number) => {
      brandList.value[index].checkRequirementModel.packageRequirement?.push({
        packageRequireList: [], // 包装要求
        packageProvider: '', // 包装供给方
      });
    };

    const handleDelPacking = (index: number, key: number) => {
      brandList.value[index].checkRequirementModel.packageRequirement?.splice(key, 1);
    };

    // 选择检测方式
    const handleChangeCheckWay = (val: CHECK_WAY_ENUM, index: number) => {
      // eslint-disable-next-line default-case
      switch (val) {
        case CHECK_WAY_ENUM.NOT_REQUIRED_CHECK:
          // 无需检测
          brandList.value[index].checkRequirementModel.fabricRequirement = [];
          brandList.value[index].checkRequirementModel.fabricPaymentWay = '';
          brandList.value[index].checkRequirementModel.productRequirement = [];
          brandList.value[index].checkRequirementModel.productPaymentWay = '';
          break;
        case CHECK_WAY_ENUM.TIANGONG_CHECK:
          // 天工检测
          brandList.value[index].checkRequirementModel.fabricPaymentWay = '';
          brandList.value[index].checkRequirementModel.productPaymentWay = '';
          break;
        default:
          break;
      }
    };

    // 销售渠道
    const handleChannelAdd = (index: number) => {
      brandList.value[index].saleChannelList.push(
        {
          channelCode: '',
          salesRatio: '',
        },
      );
    };
    // 选择销售渠道（去重复）
    const channelRepeat = ref<Record<number, string[]>>({});
    /**
     * index: 当前index; $index: 当前品牌index
     * 同一个品牌销售渠道不能重复，不同品牌可以重复
    */
    const handleSelectChannel = (type: string, index: number, parentIndex: number) => {
      const { repeatObj } = useToRepeat(type, index, parentIndex, 'channel');
      channelRepeat.value = repeatObj;
    };

    const handleChannelDelete = (parentIndex:number, index: number) => {
      // 要删除的对象
      const saleChannelItem = brandList.value[parentIndex].saleChannelList[index];
      brandList.value[parentIndex].saleChannelList.splice(index, 1);
      const key = channelRepeat.value[parentIndex].findIndex(item => item === saleChannelItem.channelCode);
      if (key !== -1) {
        channelRepeat.value[parentIndex]?.splice(key, 1);
        // 删除存储
        const _index = repeat.value.channel.selectList.findIndex(info => info.parentIndex === parentIndex);
        if (_index !== -1) {
          repeat.value.channel.selectList.splice(_index, 1);
        }
      }
    };

    // 合作模式
    const handleCooperationAdd = (index: number) => {
      brandList.value[index].cooperationModeList.push(
        {
          cooperationType: '',
          cooperationRatio: '',
        },
      );
    };
    // 选择合作模式(去重复)
    const cooperationRepeat = ref<Record<number, string[]>>({});
    const handleSelectType = (type: string, index: number, parentIndex: number) => {
      const { repeatObj } = useToRepeat(type, index, parentIndex, 'cooperation');
      cooperationRepeat.value = repeatObj;
    };

    const handleCooperationDelete = (parentIndex:number, index: number) => {
      const cooperationItem = brandList.value[parentIndex].cooperationModeList[index];
      brandList.value[parentIndex].cooperationModeList.splice(index, 1);
      const key = cooperationRepeat.value[parentIndex]?.findIndex(item => item === cooperationItem.cooperationType);
      if (key !== -1) {
        cooperationRepeat.value[parentIndex]?.splice(key, 1);
        // 删除存储
        const _index = repeat.value.cooperation.selectList.findIndex(info => info.parentIndex === parentIndex);
        if (_index !== -1) {
          repeat.value.cooperation.selectList.splice(_index, 1);
        }
      }
    };

    // 核心品类
    const handleCategoryAdd = (index: number) => {
      brandList.value[index].coreCategoryList.push(
        {
          category: [],
          ratio: '',
          machiningAveragePrice: '',
        },
      );
    };
    // 选择品类（去重复）
    const categoryRepeat = ref<Record<number, any>>({});
    const handleSelectCategory = (type: string[], index: number, parentIndex: number) => {
      if (categoryRepeat.value?.[parentIndex]) {
        categoryRepeat.value[parentIndex][index] = type.join(',');
      } else {
        categoryRepeat.value[parentIndex] = {};
        categoryRepeat.value[parentIndex][index] = type.join(',');
      }
    };
    const handleCategoryDelete = (parentIndex: number, index: number) => {
      const categoryItem = brandList.value[parentIndex]?.coreCategoryList[index];
      brandList.value[parentIndex].coreCategoryList.splice(index, 1);
      if (categoryRepeat.value[parentIndex][index] === categoryItem.category.join(',')) {
        categoryRepeat.value[parentIndex][index] = null;
        delete categoryRepeat.value[parentIndex][index];
        // 删除存储
        const _index = repeat.value.category.selectList.findIndex(info => info.parentIndex === parentIndex);
        if (_index !== -1) {
          repeat.value.category.selectList.splice(_index, 1);
        }
      }
    };

    // 重新计算重复
    const handleRepeat = () => {
      // 重置
      repeat.value.category.repeatObj = {};
      repeat.value.category.selectList = [];
      repeat.value.cooperation.repeatObj = {};
      repeat.value.cooperation.selectList = [];
      repeat.value.channel.repeatObj = {};
      repeat.value.channel.selectList = [];
      cooperationRepeat.value = [];
      channelRepeat.value = [];
      categoryRepeat.value = [];

      if (brandList.value.length) {
        brandList.value.forEach((item, index) => {
          item?.saleChannelList.forEach((info, key) => {
          // 销售渠道
            const { repeatObj } = useToRepeat(info?.channelCode, key, index, 'channel');
            channelRepeat.value = repeatObj;
          });
          item?.cooperationModeList.forEach((info, key) => {
          // 合作模式
            const { repeatObj } = useToRepeat(info?.cooperationType, key, index, 'cooperation');
            cooperationRepeat.value = repeatObj;
          });
          item?.coreCategoryList.forEach((info, key) => {
            if (categoryRepeat.value[index]) {
              categoryRepeat.value[index][key] = info?.category?.join(',');
            } else {
              categoryRepeat.value[index] = {};
              categoryRepeat.value[index][key] = info?.category?.join(',');
            }
          });
        });
      }
    };

    // 删除品牌
    const handleDelBrand = (index: number) => {
      ElMessageBox.confirm(
        '确定删除该品牌?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
        },
      )
        .then(() => {
          brandList.value.splice(index, 1);
          handleRepeat();
        })
        .catch(() => {
        });
    };

    const brandListInfoStr = ref('');
    watch(() => props.data, () => {
      if (props.data.length) {
        brandList.value = props.data as IBusinessInfoSaveReqBrandListItem[];
        brandList.value = brandList.value.map((item) => {
          // 处理checkRequirementModel返回null的数据
          if (!item.checkRequirementModel) {
            item.checkRequirementModel = {
              checkWay: '', // 检测方式
              fabricRequirement: [], // 面辅料检测要求
              productRequirement: [], // 成衣检测要求
              fabricPaymentWay: '', // 面辅料检测支付
              productPaymentWay: '', // 成衣检测支付
              packagePayment: '', // 包装支付
              deliveryWay: [], // 运输方式
              shippingFeePayment: '', // 运费支付方式
              packageRequirement: [{
                packageRequireList: [], // 包装要求
                packageProvider: '', // 包装供给方
              }],
            };
          }
          return item;
        });
        handleRepeat();
      }
      brandListInfoStr.value = JSON.stringify(cloneDeep(brandList.value));
    }, { immediate: true });

    const handleSave = async () => {
      const reqArr: Promise<any>[] = [];
      refs.value.forEach((item) => {
        if (item?.validate && typeof item?.validate === 'function') {
          reqArr.push(item?.validate());
        }

        if (item?.handleValidate && typeof item?.handleValidate === 'function') {
          reqArr.push(item?.handleValidate());
        }
      });
      await Promise.all(reqArr);

      // 品类判断重复
      const isRepeat = ref(false);
      const categoryKeys = Object.keys(categoryRepeat.value);
      categoryKeys.forEach((item) => {
        if (categoryRepeat.value[Number(item)]) {
          if (Object.values(categoryRepeat.value[Number(item)]).length) {
            console.log(Object.values(categoryRepeat.value[Number(item)]));
            if (uniq(Object.values(categoryRepeat.value[Number(item)])).length
            !== Object.values(categoryRepeat.value[Number(item)]).length) {
              isRepeat.value = true;
            }
          }
        }
      });
      if (isRepeat.value) {
        ElMessage.error('同一个品牌下，核心品类不能重复');
        return;
      }

      const params: IBusinessInfoSaveReq = {
        brandList: brandList.value,
        customerId,
        editModuleList: [MODULE_BLOCK_ENUM.BRAND],
      };
      if (props.businessType === BUSINESS_MODE_ENUM.SELF_OPERATED_BUSINESS) {
        await updateCustomerBusinessInfoApi(params);
      } else {
        await platformBusinessSaveApi(params);
      }
      edit.value = false;
      if (!isCreate.value) {
        handleRefresh?.(TABS_ENUM.TAB_OPERATE);
      }
      brandListInfoStr.value = JSON.stringify(cloneDeep(brandList.value));
      useMenuStore().deleteKeepAlive('CustomerManageCustomerList');
    };

    // 滚动
    const handleScroll = (item: string) => {
      const boxDOM = document.getElementById(item);
      const scrollTo = boxDOM?.getBoundingClientRect().top;
      document.documentElement.scrollTo(0, scrollTo! - 50);
    };

    // 是否提示保存
    const handleIsSave = () => {
      return brandListInfoStr.value === JSON.stringify(brandList.value);
    };

    // 取消
    const cancelArr = ref<any[]>([]);
    const handleCancel = () => {
      edit.value = false;
      refs.value.forEach((item) => {
        if (item?.validate && typeof item?.validate === 'function') {
          cancelArr.value.push(item?.clearValidate);
        }

        if (item?.handleValidate && typeof item?.handleValidate === 'function') {
          cancelArr.value.push(item?.handleResetFields);
        }
      });
      cancelArr.value.forEach((item) => {
        if (item && typeof item === 'function') {
          item();
        }
      });
      brandList.value = cloneDeep(JSON.parse(brandListInfoStr.value));
    };

    // 编辑
    const handleEdit = () => {
      edit.value = true;
      brandListInfoStr.value = JSON.stringify(cloneDeep(brandList.value));
      handleRepeat();
    };

    return {
      brandList,
      isCreate,
      edit,
      isEdit,
      channelRepeat,
      cooperationRepeat,
      categoryRepeat,
      CX_DICTIONARY_KEY,
      category,
      quality,
      productStyle,
      brandType,
      consumerAgeList,
      saleChannel,
      brandNameList,
      cooperation,
      fabricLevel,
      craftLevel,
      customerInspectionLevel,
      supplyChainLevel,
      packagingRequirements,
      materialTestingRequirements,
      garmentTestingRequirements,
      typeOfShipping,
      CAN_CREATE_PRODUCT_DATA,
      CAN_UPDATE_PRODUCT_DATA,
      CHECK_WAY_LIST,
      CHECK_WAY_ENUM,
      PAYMENT_WAY_ENUM,
      PAYMENT_WAY_LIST,
      PACKAGE_PROVIDER_LIST,
      // 生产周期校验
      validateProduce: (rule: any, value: string,
        callback: (err?: Error) => void, item: IDetailBusinessInfoResBrandListItem) => {
        if (value === '') {
          callback(new Error('请输入首单生产周期'));
        } else if (Number(item?.productPeriod?.firstOrderProducePeriodMax)
        < Number(item?.productPeriod?.firstOrderProducePeriodMin)) {
          callback(new Error('结束周期不能小于开始周期'));
        } else {
          callback();
        }
      },
      // 返单生产周期检验
      validateReworkOrder: (rule: any, value: string,
        callback: (err?: Error) => void, item: IDetailBusinessInfoResBrandListItem) => {
        if (value === '') {
          callback(new Error('请输入返单生产周期'));
        } else if (Number(item?.productPeriod?.reworkOrderProducePeriodMax)
        < Number(item?.productPeriod?.reworkOrderProducePeriodMin)) {
          callback(new Error('结束周期不能小于开始周期'));
        } else {
          callback();
        }
      },

      // 开发周期检验
      validateDevelopment: (rule: any, value: string,
        callback: (err?: Error) => void, item: IDetailBusinessInfoResBrandListItem) => {
        if (Number(item?.productPeriod?.prototypeDevelopmentPeriodMax)
        < Number(item?.productPeriod?.prototypeDevelopmentPeriodMin)) {
          callback(new Error('结束周期不能小于开始周期'));
        } else {
          callback();
        }
      },

      // 品牌重名校验
      validateBrantName: (rule: any, value: string,
        callback: (err?: Error) => void) => {
        if (!value) {
          callback(new Error('请输入品牌名称'));
        } else if (brandList.value.filter(item => item.brandName === value).length > 1) {
          callback(new Error('品牌名称不能重复'));
        } else {
          callback();
        }
      },

      setRefs,
      channelRenderColumns,
      cooperationRenderColumns,
      handleChannelAdd,
      handleChannelDelete,
      handleCooperationAdd,
      handleCooperationDelete,
      handleCategoryAdd,
      categoryRenderColumns,
      handleCategoryDelete,
      handleAddBrand,
      handleDelBrand,
      handleSelectType,
      handleSelectChannel,
      handleSelectCategory,
      handleScroll,
      handleCancel,
      handleEdit,
      handleIsSave,
      handleSave,
      handleAddPacking,
      handleDelPacking,
      handleChangeCheckWay,
    };
  },
});
</script>

<style lang="scss" scoped>
.operate-info {
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
    padding: 10px 0px 0px;
    .content-title {
      background-color: rgba(77, 116, 232, 0.1);
      padding: 5px 10px;
      min-height: 42px;
    }
    .brand-content {
      flex: 1 1 auto;
    }
    .content {
      border: 1px solid #ccc;
      padding: 15px 10px 0px;
      margin-bottom: 15px;
      .channel, .cooperation, .category {
        margin-bottom: 10px;
        .channel-content, .cooperation-content, .category-content {
          &__title  {
            padding: 10px;
            background-color: rgba(77, 116, 232, 0.1);
          }
        }
      }
      .del-brand {
        margin-bottom: 10px;
        padding: 5px 2px;
        color: red;
        cursor: pointer;
      }
    }
  }
  .row-width {
    width: 100%;
  }
  .tag {
    cursor: pointer;
  }
}
</style>
