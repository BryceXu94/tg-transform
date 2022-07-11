export default [
  {
    path: '/approval-manage',
    name: 'ApprovalManage',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/approval-manage/credit-application/list',
    meta: {
      title: '审批管理',
    },
    children: [
      {
        path: 'credit-application/list',
        name: 'ApprovalManageCreditApplicationList',
        component: () => import('./credit-application/views/list/index.vue'),
        meta: {
          title: '授信申请',
          auth: true,
          isKeepAlive: true,
        },
      },
      {
        path: 'credit-application/create',
        name: 'ApprovalManageCreateCreditApplication',
        component: () => import('./credit-application/views/detail/index.vue'),
        meta: {
          title: '创建授信申请',
          auth: true,
          activeMenu: 'ApprovalManageCreditApplicationList',
        },
      },
      {
        path: 'credit-application/create/:type/:id',
        name: 'ApprovalManageResubmitCreditApplication',
        component: () => import('./credit-application/views/detail/index.vue'),
        meta: {
          title: '创建授信申请',
          auth: true,
          activeMenu: 'ApprovalManageCreditApplicationList',
        },
      },
      {
        path: 'credit-application/detail/:type/:id',
        name: 'ApprovalManageCreditApplicationDetail',
        component: () => import('./credit-application/views/detail/index.vue'),
        meta: {
          title: '授信申请详情',
          auth: true,
          activeMenu: 'ApprovalManageCreditApplicationList',
        },
      },
      {
        path: 'credit-application/detail/:id',
        name: 'ApprovalManageCreditApplicationDetailCustomer',
        component: () => import('./credit-application/views/detail/index.vue'),
        meta: {
          title: '授信申请详情',
          auth: true,
          activeMenu: 'ApprovalManageCreditApplicationList',
        },
      },
    ],
  },
];
