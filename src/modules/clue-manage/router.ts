export default [
  {
    path: '/clue-manage',
    name: 'ClueManage',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/clue-manage/customer-clue/list',
    meta: {
      title: '线索管理',
    },
    children: [
      {
        path: 'customer-clue/list',
        name: 'ClueManageCustomerClueList',
        component: () => import('./customer-clue/views/list/index.vue'),
        meta: {
          title: '客户线索',
          auth: true,
          isKeepAlive: true,
        },
      },
      {
        path: 'customer-clue/create',
        name: 'ClueManageCustomerClueCreate',
        component: () => import('./customer-clue/views/create/index.vue'),
        meta: {
          title: '新增线索',
          auth: true,
          activeMenu: 'ClueManageCustomerClueList',
        },
      },
      {
        path: 'customer-clue/update/:id',
        name: 'ClueManageCustomerClueUpdate',
        component: () => import('./customer-clue/views/create/index.vue'),
        meta: {
          title: '编辑线索',
          auth: true,
          activeMenu: 'ClueManageCustomerClueList',
        },
      },
      {
        path: 'customer-clue/detail/:id',
        name: 'ClueManageCustomerClueDetail',
        component: () => import('./customer-clue/views/detail/index.vue'),
        meta: {
          title: '线索详情',
          auth: true,
          activeMenu: 'ClueManageCustomerClueList',
        },
      },
      {
        path: 'develop-follow/list',
        name: 'ClueManageDevelopList',
        component: () => import('./develop-follow/views/list/index.vue'),
        meta: {
          title: '开发跟进',
          auth: true,
          isKeepAlive: true,
        },
      },
      {
        path: 'develop-follow/detail/:id',
        name: 'ClueManageDevelopDetail',
        component: () => import('./develop-follow/views/detail/index.vue'),
        meta: {
          title: '开发详情',
          auth: true,
          activeMenu: 'ClueManageDevelopList',
        },
      },
      {
        path: 'life-cycle/statistical',
        name: 'ClueManageLifeCycleStatistical',
        component: () => import('./life-cycle/views/statistical/index.vue'),
        meta: {
          title: '生命周期',
          auth: true,
        },
      },
    ],
  },
];
