import { computed } from 'vue';
import { has } from '@/core/plugins/filter';

export const usePermissionConfig = () => {
  const codeMap = {
    'CCS-KHGL-KHGL-KHBM': 'CCS-KHGL-KHGL-KHBM',
    'CCS-KHGL-KHGL-CJKH': 'CCS-KHGL-KHGL-CJKH',
    'CCS-KHGL-KHGL-BL': 'CCS-KHGL-KHGL-BL',
    'CCS-KHGL-KHGL-BJ': 'CCS-KHGL-KHGL-BJ',
    'CCS-KHGL-KHGL-SH': 'CCS-KHGL-KHGL-SH',
    'CCS-KHGL-KHGL-QYTY': 'CCS-KHGL-KHGL-QYTY',
    'CCS-KHGL-KHGL-CZRZ': 'CCS-KHGL-KHGL-CZRZ',
    'CCS-KHGL-KHGL-JBXX-CJGSXX': 'CCS-KHGL-KHGL-JBXX-CJGSXX',
    'CCS-KHGL-KHGL-JBXX-CKGSXX': 'CCS-KHGL-KHGL-JBXX-CKGSXX',
    'CCS-KHGL-KHGL-JBXX-BJGSXX': 'CCS-KHGL-KHGL-JBXX-BJGSXX',
    'CSS-KHGL-KHGL-JBXX-CJGSXX': 'CSS-KHGL-KHGL-JBXX-CJGSXX', // 创建工商信息
    'CCS-KHGL-KHGL-JBXX-CKGMXX': 'CCS-KHGL-KHGL-JBXX-CKGMXX',
    'CCS-KHGL-KHGL-JBXX-BJGMXX': 'CCS-KHGL-KHGL-JBXX-BJGMXX',
    'CCS-KHGL-KHGL-JBXX-CJGMXX': 'CCS-KHGL-KHGL-JBXX-CJGMXX', // 创建规模信息
    'CCS-KHGL-KHGL-JBXX-CKQT': 'CCS-KHGL-KHGL-JBXX-CKQT',
    'CCS-KHGL-KHGL-JBXX-BJQT': 'CCS-KHGL-KHGL-JBXX-BJQT',
    'CCS-KHGL-KHGL-JBXX-CJQT': 'CCS-KHGL-KHGL-JBXX-CJQT', // 创建其他信息
    'CCS-KHGL-KHGL-YYXX-CKCPXX': 'CCS-KHGL-KHGL-YYXX-CKCPXX',
    'CCS-KHGL-KHGL-YYXX-BJCPXX': 'CCS-KHGL-KHGL-YYXX-BJCPXX',
    'CCS-KHGL-KHGL-YYXX-CJCPXX': 'CCS-KHGL-KHGL-YYXX-CJCPXX', // 创建品牌信息
    'CCS-KHGL-KHGL-YYXX-CKSHDZ': 'CCS-KHGL-KHGL-YYXX-CKSHDZ',
    'CCS-KHGL-KHGL-YYXX-BJSHDZ': 'CCS-KHGL-KHGL-YYXX-BJSHDZ',
    'CCS-KHGL-KHGL-YYXX-CJSHDZ': 'CCS-KHGL-KHGL-YYXX-CJSHDZ', // 创建地址信息
    'CCS-KHGL-KHGL-LXGL-CKLXRXX': 'CCS-KHGL-KHGL-LXGL-CKLXRXX',
    'CCS-KHGL-KHGL-LXGL-BJLXRXX': 'CCS-KHGL-KHGL-LXGL-BJLXRXX',
    'CCS-KHGL-KHGL-LXGL-CJLXRXX': 'CCS-KHGL-KHGL-LXGL-CJLXRXX', // 创建联系人信息
    'CCS-KHGL-KHGL-HKZQ-CKHKZQ': 'CCS-KHGL-KHGL-HKZQ-CKHKZQ',
    'CCS-KHGL-KHGL-HKZQ-BJHKZQ': 'CCS-KHGL-KHGL-HKZQ-BJHKZQ',
    'CCS-KHGL-KHGL-HKZQ-CJHKZQ': 'CCS-KHGL-KHGL-HKZQ-CJHKZQ', // 创建货款帐期
    'CCS-KHGL-KHGL-HKZQ-CKFPXX': 'CCS-KHGL-KHGL-HKZQ-CKFPXX',
    'CCS-KHGL-KHGL-HKZQ-BJFPXX': 'CCS-KHGL-KHGL-HKZQ-BJFPXX',
    'CCS-KHGL-KHGL-HKZQ-CJFPXX': 'CCS-KHGL-KHGL-HKZQ-CJFPXX', // 创建发票信息
    'CCS-KHGL-KHGL-HKZQ-CKYHKXX': 'CCS-KHGL-KHGL-HKZQ-CKYHKXX',
    'CCS-KHGL-KHGL-HKZQ-BJYHKXX': 'CCS-KHGL-KHGL-HKZQ-BJYHKXX',
    'CCS-KHGL-KHGL-HKZQ-CJYHKXX': 'CCS-KHGL-KHGL-HKZQ-CJYHKXX', // 创建银行卡信息
    'CCS-KHGL-KHGL-FXXX-CKFXXX': 'CCS-KHGL-KHGL-FXXX-CKFXXX',
    'CCS-KHGL-KHGL-FXXX-BJFXXX': 'CCS-KHGL-KHGL-FXXX-BJFXXX',
    'CCS-KHGL-KHGL-FXXX-CJFXXX': 'CCS-KHGL-KHGL-FXXX-CJFXXX', // 创建风险信息
    'CCS-KHGL-KHGL-ZLWJ-CKZLWJ': 'CCS-KHGL-KHGL-ZLWJ-CKZLWJ',
    'CCS-KHGL-KHGL-ZLWJ-BJZLWJ': 'CCS-KHGL-KHGL-ZLWJ-BJZLWJ',
    'CCS-KHGL-KHGL-ZLWJ-CJZLWJ': 'CCS-KHGL-KHGL-ZLWJ-CJZLWJ', // 创建资料文件
    'CCS-KHGL-KHGL-XTGL-CKWXTGLXX': 'CCS-KHGL-KHGL-XTGL-CKWXTGLXX',
    'CCS-KHGL-KHGL-XTGL-BJWXTGLXX': 'CCS-KHGL-KHGL-XTGL-BJWXTGLXX',
    'CCS-KHGL-KHGL-XTGL-CJWXTGLXX': 'CCS-KHGL-KHGL-XTGL-CJWXTGLXX', // 创建系统关联信息
    'CCS-KHGL-KHGL-KEXQ-DASH': 'CCS-KHGL-KHGL-KEXQ-DASH', // 档案审核
    'CCS-KHGL-KHGL-KEBJ-TJSH': 'CCS-KHGL-KHGL-KEBJ-TJSH', // 提交审核
    'CCS-KHGL-KHGL-KEXQ-SHJL': 'CCS-KHGL-KHGL-KEXQ-SHJL', // 客户详情-审核记录
    'CCS-KHGL-KHGL-KEXQ-GXTYC': 'CCS-KHGL-KHGL-KEXQ-GXTYC', // 更新天眼查
    'CSS-KHGL-KHDA-ZYYW': 'CSS-KHGL-KHDA-ZYYW', // 自营业务
    'CSS-KHGL-KHDA-PTYW': 'CSS-KHGL-KHDA-PTYW', // 平台业务
    'CCS-KHGL-KHGL-KHLX': 'CCS-KHGL-KHGL-KHLX', // 客户类型
    'CCS-KHGL-KHDA-XDLX': 'CCS-KHGL-KHDA-XDLX', // 下单类型
    'CCS-KHGL-KHDA-SC': 'CCS-KHGL-KHDA-SC', // 删除客户
    'CCS-KHGL-KHGL-CJCHKH': 'CCS-KHGL-KHGL-CJCHKH', // 创建平台客户
    'CCS-KHGL-KHGL-SHJL-ZJSHR': 'CCS-KHGL-KHGL-SHJL-ZJSHR', // 转交审核人
    'CCS-KHGL-KHDA-DC': 'CCS-KHGL-KHDA-DC', // 导出
  };
  return {
    /*
    * 客户编码
    * 控制：客户管理-客户管理-客户编码
    * 跳转路由名称：CustomerManageCustomerDetail
    * */
    CAN_VIEW: computed(() => has(codeMap['CCS-KHGL-KHGL-KHBM'])),
    /*
    * 创建客户
    * 控制：客户管理-客户管理-创建客户
    * 跳转路由名称：CustomerManageCreateCustomer
    * */
    CAN_CREATE: computed(() => has(codeMap['CCS-KHGL-KHGL-CJKH'])),
    /*
    * 补录
    * 控制：客户管理-客户管理-补录
    * 跳转路由名称：CustomerManageUpdateCustomer
    * */
    CAN_ADD: computed(() => has(codeMap['CCS-KHGL-KHGL-BL'])),
    /*
    * 编辑
    * 控制：客户管理-客户管理-编辑
    * 跳转路由名称：CustomerManageUpdateCustomer
    * */
    CAN_UPDATE: computed(() => has(codeMap['CCS-KHGL-KHGL-BJ'])),
    /*
    * 审核
    * 控制：客户管理-客户管理-审核
    * 跳转路由名称：CustomerManageCustomerDetail
    * */
    CAN_APPROVE: computed(() => has(codeMap['CCS-KHGL-KHGL-SH'])),
    /*
    * 启用停用
    * 控制：客户管理-客户管理-启用停用
    * 跳转路由名称：
    * */
    CAN_TOGGLE_STATUS: computed(() => has(codeMap['CCS-KHGL-KHGL-QYTY'])),
    /*
    * 操作日志
    * 控制：客户管理-客户管理详情-操作日志
    * 跳转路由名称：
    * */
    CAN_VIEW_LOG: computed(() => has(codeMap['CCS-KHGL-KHGL-CZRZ'])),
    /*
    * 基本信息-创建工商信息
    * 控制：客户管理-客户管理详情-基本信息-创建工商信息
    * 跳转路由名称：
    * */
    CAN_CREATE_BUSINESS_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-JBXX-CJGSXX'])),
    /*
    * 基本信息-查看工商信息
    * 控制：客户管理-客户管理详情-基本信息-查看工商信息
    * 跳转路由名称：
    * */
    CAN_VIEW_BUSINESS_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-JBXX-CKGSXX'])),
    /*
    * 基本信息-编辑工商信息
    * 控制：客户管理-客户管理详情-基本信息-编辑工商信息
    * 跳转路由名称：
    * */
    CAN_UPDATE_BUSINESS_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-JBXX-BJGSXX'])),
    /*
    * 基本信息-查看规模信息
    * 控制：客户管理-客户管理详情-基本信息-查看规模信息
    * 跳转路由名称：
    * */
    CAN_VIEW_SCALE_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-JBXX-CKGMXX'])),
    /*
    * 基本信息-编辑规模信息
    * 控制：客户管理-客户管理详情-基本信息-编辑规模信息
    * 跳转路由名称：
    * */
    CAN_UPDATE_SCALE_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-JBXX-BJGMXX'])),
    /*
    * 基本信息-编辑规模信息
    * 控制：客户管理-客户管理详情-基本信息-创建规模信息
    * 跳转路由名称：
    * */
    CAN_CREATE_SCALE_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-JBXX-CJGMXX'])),
    /*
    * 基本信息-查看其他
    * 控制：客户管理-客户管理详情-基本信息-查看其他
    * 跳转路由名称：
    * */
    CAN_VIEW_OTHER_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-JBXX-CKQT'])),
    /*
    * 基本信息-编辑其他
    * 控制：客户管理-客户管理详情-基本信息-编辑其他
    * 跳转路由名称：
    * */
    CAN_UPDATE_OTHER_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-JBXX-BJQT'])),
    /*
    * 基本信息-编辑其他
    * 控制：客户管理-客户管理详情-基本信息-创建其他
    * 跳转路由名称：
    * */
    CAN_CREATE_OTHER_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-JBXX-CJQT'])),
    /*
    * 运营信息-查看产品信息
    * 控制：客户管理-客户管理详情-运营信息-查看产品信息
    * 跳转路由名称：
    * */
    CAN_VIEW_PRODUCT_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-YYXX-CKCPXX'])),
    /*
    * 运营信息-编辑产品信息
    * 控制：客户管理-客户管理详情-运营信息-编辑产品信息
    * 跳转路由名称：
    * */
    CAN_UPDATE_PRODUCT_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-YYXX-BJCPXX'])),
    /*
    * 运营信息-编辑产品信息
    * 控制：客户管理-客户管理详情-运营信息-创建产品信息
    * 跳转路由名称：
    * */
    CAN_CREATE_PRODUCT_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-YYXX-CJCPXX'])),
    /*
    * 运营信息-查看收货地址
    * 控制：客户管理-客户管理详情-运营信息-查看收货地址
    * 跳转路由名称：
    * */
    CAN_VIEW_DELIVERY_ADDRESS: computed(() => has(codeMap['CCS-KHGL-KHGL-YYXX-CKSHDZ'])),
    /*
    * 运营信息-编辑收货地址
    * 控制：客户管理-客户管理详情-运营信息-编辑收货地址
    * 跳转路由名称：
    * */
    CAN_UPDATE_DELIVERY_ADDRESS: computed(() => has(codeMap['CCS-KHGL-KHGL-YYXX-BJSHDZ'])),
    /*
    * 运营信息-编辑收货地址
    * 控制：客户管理-客户管理详情-运营信息-创建收货地址
    * 跳转路由名称：
    * */
    CAN_CREATE_DELIVERY_ADDRESS: computed(() => has(codeMap['CCS-KHGL-KHGL-YYXX-CJSHDZ'])),
    /*
    * 联系管理-查看联系人信息
    * 控制：客户管理-客户管理详情-联系管理-查看联系人信息
    * 跳转路由名称：
    * */
    CAN_VIEW_CONTACT_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-LXGL-CKLXRXX'])),
    /*
    * 联系管理-编辑联系人信息
    * 控制：客户管理-客户管理详情-联系管理-编辑联系人信息
    * 跳转路由名称：
    * */
    CAN_UPDATE_CONTACT_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-LXGL-BJLXRXX'])),
    /*
    * 联系管理-编辑联系人信息
    * 控制：客户管理-客户管理详情-联系管理-创建联系人信息
    * 跳转路由名称：
    * */
    CAN_CREATE_CONTACT_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-LXGL-CJLXRXX'])),
    /*
    * 货款账期-查看货款账期
    * 控制：客户管理-客户管理详情-货款账期-查看货款账期
    * 跳转路由名称：
    * */
    CAN_VIEW_PAYMENT_PERIOD: computed(() => has(codeMap['CCS-KHGL-KHGL-HKZQ-CKHKZQ'])),
    /*
    * 货款账期-编辑货款账期
    * 控制：客户管理-客户管理详情-货款账期-编辑货款账期
    * 跳转路由名称：
    * */
    CAN_UPDATE_PAYMENT_PERIOD: computed(() => has(codeMap['CCS-KHGL-KHGL-HKZQ-BJHKZQ'])),
    /*
    * 货款账期-编辑货款账期
    * 控制：客户管理-客户管理详情-货款账期-创建货款账期
    * 跳转路由名称：
    * */
    CAN_CREATE_PAYMENT_PERIOD: computed(() => has(codeMap['CCS-KHGL-KHGL-HKZQ-CJHKZQ'])),
    /*
    * 货款账期-查看发票信息
    * 控制：客户管理-客户管理详情-货款账期-查看发票信息
    * 跳转路由名称：
    * */
    CAN_VIEW_INVOICE_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-HKZQ-CKFPXX'])),
    /*
    * 货款账期-编辑发票信息
    * 控制：客户管理-客户管理详情-货款账期-编辑发票信息
    * 跳转路由名称：
    * */
    CAN_UPDATE_INVOICE_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-HKZQ-BJFPXX'])),
    /*
    * 货款账期-编辑发票信息
    * 控制：客户管理-客户管理详情-货款账期-创建发票信息
    * 跳转路由名称：
    * */
    CAN_CREATE_INVOICE_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-HKZQ-CJFPXX'])),
    /*
    * 货款账期-查看银行卡信息
    * 控制：客户管理-客户管理详情-货款账期-查看银行卡信息
    * 跳转路由名称：
    * */
    CAN_VIEW_CARD_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-HKZQ-CKYHKXX'])),
    /*
    * 货款账期-编辑银行卡信息
    * 控制：客户管理-客户管理详情-货款账期-编辑银行卡信息
    * 跳转路由名称：
    * */
    CAN_UPDATE_CARD_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-HKZQ-BJYHKXX'])),
    /*
    * 货款账期-编辑银行卡信息
    * 控制：客户管理-客户管理详情-货款账期-创建银行卡信息
    * 跳转路由名称：
    * */
    CAN_CREATE_CARD_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-HKZQ-CJYHKXX'])),
    /*
    * 风险信息-查看风险信息
    * 控制：客户管理-客户管理详情-风险信息-查看风险信息
    * 跳转路由名称：
    * */
    CAN_VIEW_RISK_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-FXXX-CKFXXX'])),
    /*
    * 风险信息-编辑风险信息
    * 控制：客户管理-客户管理详情-风险信息-编辑风险信息
    * 跳转路由名称：
    * */
    CAN_UPDATE_RISK_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-FXXX-BJFXXX'])),
    /*
    * 风险信息-编辑风险信息
    * 控制：客户管理-客户管理详情-风险信息-创建风险信息
    * 跳转路由名称：
    * */
    CAN_CREATE_RISK_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-FXXX-CJFXXX'])),
    /*
    * 资料文件-查看资料文件
    * 控制：客户管理-客户管理详情-资料文件-查看资料文件
    * 跳转路由名称：
    * */
    CAN_VIEW_DOCUMENT_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-ZLWJ-CKZLWJ'])),
    /*
    * 资料文件-编辑资料文件
    * 控制：客户管理-客户管理详情-资料文件-编辑资料文件
    * 跳转路由名称：
    * */
    CAN_UPDATE_DOCUMENT_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-ZLWJ-BJZLWJ'])),
    /*
    * 资料文件-编辑资料文件
    * 控制：客户管理-客户管理详情-资料文件-创建资料文件
    * 跳转路由名称：
    * */
    CAN_CREATE_DOCUMENT_DATA: computed(() => has(codeMap['CCS-KHGL-KHGL-ZLWJ-CJZLWJ'])),
    /*
    * 系统关联-查看外系统关联信息
    * 控制：客户管理-客户管理详情-系统关联-查看外系统关联信息
    * 跳转路由名称：
    * */
    CAN_VIEW_SYSTEM_LINKAGES: computed(() => has(codeMap['CCS-KHGL-KHGL-XTGL-CKWXTGLXX'])),
    /*
    * 系统关联-编辑外系统关联信息
    * 控制：客户管理-客户管理详情-系统关联-编辑外系统关联信息
    * 跳转路由名称：
    * */
    CAN_UPDATE_SYSTEM_LINKAGES: computed(() => has(codeMap['CCS-KHGL-KHGL-XTGL-BJWXTGLXX'])),
    /*
    * 系统关联-编辑外系统关联信息
    * 控制：客户管理-客户管理详情-系统关联-创建外系统关联信息
    * 跳转路由名称：
    * */
    CAN_CREATE_SYSTEM_LINKAGES: computed(() => has(codeMap['CCS-KHGL-KHGL-XTGL-CJWXTGLXX'])),
    /*
    * 客户详情-档案审核
    * 控制：客户管理-客户管理详情-档案审核
    * 跳转路由名称：
    * */
    CAN_AUDIT_ARCHIVES: computed(() => has(codeMap['CCS-KHGL-KHGL-KEXQ-DASH'])),
    /*
    * 客户创建-提交审核
    * 控制：客户管理-客户管理详情-提交审核
    * 跳转路由名称：
    * */
    CAN_SAVE_AUDIT: computed(() => has(codeMap['CCS-KHGL-KHGL-KEBJ-TJSH'])),
    /*
    * 客户详情-审核记录
    * 控制：客户管理-客户管理详情-审核记录
    * 跳转路由名称：
    * */
    CAN_VIEW_AUDIT_RECORD: computed(() => has(codeMap['CCS-KHGL-KHGL-KEXQ-SHJL'])),
    /*
    * 客户详情-更新天眼查
    * 控制：客户管理-客户管理详情-更新天眼查
    * 跳转路由名称：
    * */
    CAN_UPDATE_SYK_EYE_CHECK: computed(() => has(codeMap['CCS-KHGL-KHGL-KEXQ-GXTYC'])),
    /*
    * 客户管理列表-自营业务
    * 控制：客户管理-客户管理列表-业务类型查询
    * 跳转路由名称：
    * */
    CAN_VIEW_ZYYW: computed(() => has(codeMap['CSS-KHGL-KHDA-ZYYW'])),
    /*
    *客户管理列表-平台业务
    * 控制：客户管理-客户管理列表-业务类型查询
    * 跳转路由名称：
    * */
    CAN_VIEW_PTYW: computed(() => has(codeMap['CSS-KHGL-KHDA-PTYW'])),
    /*
    * 客户详情-客户类型
    * 控制：客户管理-客户管理详情-客户类型
    * 跳转路由名称：
    * */
    CAN_UPDATE_KHLX: computed(() => has(codeMap['CCS-KHGL-KHGL-KHLX'])),
    /*
    * 客户档案-下单类型
    * 控制：客户管理-客户档案-下单类型（详情展示）
    * 跳转路由名称：
    * */
    CAN_ORDER_TYPE: computed(() => has(codeMap['CCS-KHGL-KHDA-XDLX'])),
    /*
    * 客户档案-删除
    * 控制：客户管理-客户档案-删除
    * 跳转路由名称：
    * */
    CAN_DELETE_CUSTOMER: computed(() => has(codeMap['CCS-KHGL-KHDA-SC'])),
    /*
    * 创建平台客户
    * 控制：客户管理-客户管理-创建平台客户
    * 跳转路由名称：CustomerManageCreateCustomer
    * */
    CAN_CREATE_PLATFORM: computed(() => has(codeMap['CCS-KHGL-KHGL-CJCHKH'])),
    /*
    * 转交审核人
    * 控制：客户管理-客户管理详情-审核记录-转交审核人
    * 跳转路由名称：
    * */
    CAN_TRANSFER_REVIEW: computed(() => has(codeMap['CCS-KHGL-KHGL-SHJL-ZJSHR'])),
    /*
    * 导出
    * 控制：客户管理-客户档案列表-导出
    * 跳转路由名称：
    * */
    CAN_DC: computed(() => has(codeMap['CCS-KHGL-KHDA-DC'])),
  };
};
