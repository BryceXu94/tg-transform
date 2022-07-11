// 自定义处理字典key
export enum CX_CUSTOM_DICTIONARY_KEY {
}
// 创新字典key
export enum CX_DICTIONARY_KEY {
  /** 外部系统来源 */
  CSS_EXTERNAL_SYSTEM_SOURCE = 'ccs_external_system_source',
  /** 职位名称 */
  POST_NAME = 'post_name',
  /** 品质要求 */
  QUALITY_REQUIREMENT = 'plm_quality_level',
  /** 销售渠道 */
  SALE_CHANNEL = 'sale_channel',
  /** 出账日类型 */
  BILLING_DATE_TYPE= 'billing_date_type',
  /** 银行名称 */
  BANK_CODE = 'bank_code',
  /** 产品风格 */
  PRODUCT_STYLE = 'product_style',
  /** 消费年龄 */
  CONSUMER_AGE = 'consumer_age',
  /** 品类 */
  PIMS_CATEGORY = 'pims_category',
  /** 品牌类型 */
  BRAND_TYPE = 'crm_brand_type',
  /** 地址类型 */
  OPERATION_ADDRESS = 'crm_operation_address',
  /** 合作模式 */
  COOPERATION_MODE = 'cooperation_mode',
  /** 纳税人类型 */
  TAXPAYER_TYPE = 'taxpayer_type',
  /** 尺码标准 */
  PLM_STANDARD_SIZE = 'plm_standard_size',
  /** 金额单位 */
  CRM_AMOUNT_UNIT = 'crm_amount_unit',
  /** 数量单位 */
  CRM_QUANTITY_UNIT = 'crm_quantity_unit',
  /** 删除原因 */
  CRM_DELETE_CUSTOMER_REASON = 'crm_delete_customer_reason',
  /** 面料级别 */
  CRM_FABRIC_LEVEL = 'crm_fabric_level',
  /** 工艺级别 */
  CRM_CRAFT_LEVEL = 'crm_craft_level',
  /** 供应链服务级别 */
  CRM_SUPPLY_CHAIN_LEVEL= 'crm_supply_chain_level',
  /** 客户验货标准 */
  CRM_CUSTOMER_INSPECTION_LEVEL = 'crm_customer_inspection_level',
  /** 回款周期 */
  SETTLEMENT_PERIOD_DAYS = 'settlement_period_days',
  /** 自然月出账日 */
  NATURAL_MONTH_DATE = 'natural_month_date',
  /** 线索电商平台 */
  CRM_CLUE_PLATFORM = 'crm_clue_platform',
  /** 线索开发情况 */
  CRM_CLUE_DEVELOPMENT = 'crm_clue_development',
  /** 线索无效原因 */
  CRM_CLUE_INVALID = 'crm_clue_invalid',
  /** 目标设置-单位 */
  CRM_SALESMAN_AMOUNT_UNIT = 'crm_salesman_amount_unit',
  /** 包装要求 */
  CRM_PACKAGING_REQUIREMENTS = 'crm_packaging_requirements',
  /** 面辅料检测要求 */
  CRM_MATERIAL_TESTING_REQUIREMENTS = 'crm_material_testing_requirements',
  /** 成衣检测要求 */
  CRM_GARMENT_TESTING_REQUIREMENTS = 'crm_garment_testing_requirements',
  /** 运输方式 */
  CRM_TYPE_OF_SHIPPING = 'crm_type_of_shipping',
  /** 客户档案-停用原因 */
  CRM_DEACTIVATION_REASON = 'crm_deactivation_reason'
}

/** 外部系统 */
export enum PIMS_EXTERNAL_SYSTEM_SOURCE_ENUM {
  /** 云工厂 */
  YUN_GONG_CHANG = '01',
  /** 履约 */
  LV_YUE = '02',
  /** 云板房 */
  YUN_BAN_FANG = '03'
}

// 字典启用禁用
export enum DICTIONARY_STATUS_ENUM{
  /** 启用 */
  ENABLE = '1',
  /** 禁用 */
  DISABLE = '0',
}
