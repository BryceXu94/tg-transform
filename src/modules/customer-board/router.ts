export default [
  {
    path: '/customer-operate-bi',
    name: 'CustomerOperateBi',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/customer-operate-bi/customer-profile',
    meta: {
      title: '客户看板',
      auth: true,
      noCache: true,
    },
    children: [
      {
        path: 'customer-profile',
        name: 'CustomerOperateBiCustomerProfile',
        component: () => import('../data-warehouse-bi/views/index.vue'),
        meta: {
          title: '客户概览',
          auth: true,
          noCache: true,
          url: 'https://bi.tiangong.tech/webroot/decision/v5/design/report/88a2b4672f75477daa1dffe5aa5a8bbb/view',
        },
      },
      {
        path: 'add-order-analysis',
        name: 'CustomerOperateBiAddOrderAnalysis',
        component: () => import('../data-warehouse-bi/views/index.vue'),
        meta: {
          title: '新增下单分析',
          auth: true,
          noCache: true,
          url: 'https://bi.tiangong.tech/webroot/decision/v5/design/report/b66dfb521ac848bcaf877e6f223df1e4/view',
        },
      },
      {
        path: 'active-customer-analysis',
        name: 'CustomerOperateBiActiveCustomerAnalysis',
        component: () => import('../data-warehouse-bi/views/index.vue'),
        meta: {
          title: '活跃客户分析',
          auth: true,
          noCache: true,
          url: 'https://bi.tiangong.tech/webroot/decision/v5/design/report/16f157f9d0a24161a6b3fc8f76449f2d/view',
        },
      },
      {
        path: 'quality-customer-analysis',
        name: 'CustomerOperateBiQualityCustomerAnalysis',
        component: () => import('../data-warehouse-bi/views/index.vue'),
        meta: {
          title: '优质客户分析',
          auth: true,
          noCache: true,
          url: 'https://bi.tiangong.tech/webroot/decision/v5/design/report/30513c25b61e461497b70b38a9faa0bc/view',
        },
      },
      {
        path: 'customer-risk/profile',
        name: 'CustomerOperateBiCustomerRiskProfile',
        component: () => import('./customer-risk/views/profile/index.vue'),
        meta: {
          title: '客户风险概况',
          auth: true,
        },
      },
      {
        path: 'customer-risk/list',
        name: 'CustomerOperateBiCustomerRiskList',
        component: () => import('./customer-risk/views/list/index.vue'),
        meta: {
          title: '客户风险列表',
          auth: true,
          activeMenu: 'CustomerOperateBiCustomerRiskList',
        },
      },
    ],
  },
];
