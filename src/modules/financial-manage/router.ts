export default [
  {
    path: '/financial-manage',
    name: 'FinancialManage',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/financial-manage/credit-manage/list',
    meta: {
      title: '财务管理',
    },
    children: [
      {
        path: 'credit-manage/list',
        name: 'FinancialManageCreditList',
        component: () => import('./credit-manage/views/list/index.vue'),
        meta: {
          title: '授信管理',
          auth: true,
          isKeepAlive: true,
        },
      },
      {
        path: 'credit-manage/usage-detail/:type/:id',
        name: 'FinancialManageCreditUsageDetail',
        component: () => import('./credit-manage/views/usage/index.vue'),
        meta: {
          title: '授信使用明细',
          auth: true,
          activeMenu: 'FinancialManageCreditList',
        },
      },
      {
        path: 'credit-manage/detail/:type/:id',
        name: 'FinancialManageCreditDetail',
        component: () => import('./credit-manage/views/detail/index.vue'),
        meta: {
          title: '授信详情',
          auth: true,
          activeMenu: 'FinancialManageCreditList',
        },
      },
      {
        path: 'tgo-bullion/list',
        name: 'FinancialManageTgoBullionList',
        component: () => import('./tgo-bullion/views/list/index.vue'),
        meta: {
          title: '天工金条',
          auth: true,
          isKeepAlive: true,
        },
      },
      {
        path: 'money-back-scheme/list',
        name: 'FinancialManageMoneyBackSchemeList',
        component: () => import('./money-back-scheme/views/list/index.vue'),
        meta: {
          title: '回款计划',
          auth: true,
          isKeepAlive: true,
        },
      },
      {
        path: 'customer-statement/list',
        name: 'FinancialManageCustomerStatementList',
        component: () => import('./customer-statement/views/list/index.vue'),
        meta: {
          title: '客户对账单',
          auth: true,
          isKeepAlive: true,
        },
      },
      {
        path: 'customer-statement/bill-preview/:id',
        name: 'FinancialManageCustomerStatementBillPreview',
        component: () => import('./customer-statement/views/bill-preview/index.vue'),
        meta: {
          title: '账单明细',
          auth: true,
          activeMenu: 'FinancialManageCustomerStatementList',
        },
      },
      {
        path: 'customer-statement/detail/:id',
        name: 'FinancialManageCustomerStatementDetail',
        component: () => import('./customer-statement/views/detail/index.vue'),
        meta: {
          title: '账单信息',
          auth: true,
          activeMenu: 'FinancialManageCustomerStatementList',
        },
      },
      {
        path: 'customer-statement/bill-detail/:id',
        name: 'FinancialManageCustomerStatementBillDetail',
        component: () => import('./customer-statement/views/bill-detail/index.vue'),
        meta: {
          title: '子账单明细',
          auth: true,
          activeMenu: 'FinancialManageCustomerStatementList',
        },
      },
      {
        path: 'collection-voucher/list',
        name: 'FinancialManageCollectionVoucherList',
        component: () => import('./collection-voucher/views/list/index.vue'),
        meta: {
          title: '回款凭证',
          auth: true,
          isKeepAlive: true,
        },
      },
    ],
  },
];
