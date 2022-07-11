export default [
  {
    path: '/demand-manage',
    name: 'DemandManage',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/demand-manage/platform-demand/list',
    meta: {
      title: '需求管理',
    },
    children: [
      {
        path: 'platform-demand/list',
        name: 'DemandManagePlatformDemandList',
        component: () => import('./platform-demand/views/list/index.vue'),
        meta: {
          title: '平台需求',
          auth: true,
          isKeepAlive: true,
        },
      },
      {
        path: 'platform-demand/create',
        name: 'DemandManagePlatformDemandCreate',
        component: () => import('./platform-demand/views/create/index.vue'),
        meta: {
          title: '创建需求',
          auth: true,
          activeMenu: 'DemandManagePlatformDemandList',
        },
      },
      {
        path: 'platform-demand/update/:id',
        name: 'DemandManagePlatformDemandUpdate',
        component: () => import('./platform-demand/views/create/index.vue'),
        meta: {
          title: '编辑需求',
          auth: true,
          activeMenu: 'DemandManagePlatformDemandList',
        },
      },
      {
        path: 'platform-demand/create-again/:id',
        name: 'DemandManagePlatformDemandCreateAgain',
        component: () => import('./platform-demand/views/create/index.vue'),
        meta: {
          title: '再次下单',
          auth: true,
          activeMenu: 'DemandManagePlatformDemandList',
        },
      },
      {
        path: 'platform-demand/detail/:id',
        name: 'DemandManagePlatformDemandDetail',
        component: () => import('./platform-demand/views/detail/index.vue'),
        meta: {
          title: '需求详情',
          auth: true,
          activeMenu: 'DemandManagePlatformDemandList',
        },
      },
    ],
  },
];
