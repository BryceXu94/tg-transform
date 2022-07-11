export default [
  {
    path: '/sale-operate-bi',
    name: 'SaleOperateBi',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/sale-operate-bi/business-overview',
    meta: {
      title: '销售看板',
      auth: true,
      noCache: true,
    },
    children: [
      {
        path: 'business-overview',
        name: 'SaleOperateBiBusinessOverview',
        component: () => import('./views/index.vue'),
        meta: {
          title: '经营概况',
          auth: true,
          noCache: true,
          url: 'https://bi.tiangong.tech/webroot/decision/v5/design/report/4e60105c42dd420a8d1e6bb2adfc6858/view',
        },
      },
      {
        path: 'department-business-analysis',
        name: 'SaleOperateBiDepartmentBusinessAnalysis',
        component: () => import('./views/index.vue'),
        meta: {
          title: '部门经营分析',
          auth: true,
          noCache: true,
          url: 'https://bi.tiangong.tech/webroot/decision/v5/design/report/6cacb05bea004e1d9531297b53b9fe0f/view',
        },
      },
      {
        path: 'organization-business-analysis',
        name: 'SaleOperateBiOrganizationBusinessAnalysis',
        component: () => import('./views/index.vue'),
        meta: {
          title: '区域经营分析',
          auth: true,
          noCache: true,
          url: 'https://bi.tiangong.tech/webroot/decision/v5/design/report/b57cc894f9e14743a67617b509299b2a/view',
        },
      },
      {
        path: 'bd-business-analysis',
        name: 'SaleOperateBiBdBusinessAnalysis',
        component: () => import('./views/index.vue'),
        meta: {
          title: 'BD经营分析',
          auth: true,
          noCache: true,
          url: 'https://bi.tiangong.tech/webroot/decision/v5/design/report/e82deb9589ed498ea48d0e12874ebeca/view',
        },
      },
    ],
  },
];
