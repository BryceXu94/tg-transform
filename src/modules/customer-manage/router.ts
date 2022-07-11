export default [
  {
    path: '/customer-manage',
    name: 'CustomerManage',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/customer-manage/customer-manage/list',
    meta: {
      title: '客户管理',
    },
    children: [
      {
        path: 'customer-manage/list',
        name: 'CustomerManageCustomerList',
        component: () => import('./customer-manage/views/list/index.vue'),
        meta: {
          title: '客户档案',
          auth: true,
          isKeepAlive: true,
        },
      },
      {
        path: 'customer-manage/create/:id',
        name: 'CustomerManageCreateCustomer',
        component: () => import('./customer-manage/views/create/index.vue'),
        meta: {
          title: '创建客户资料',
          auth: true,
          activeMenu: 'CustomerManageCustomerList',
        },
      },
      {
        path: 'customer-manage/detail/:id',
        name: 'CustomerManageCustomerDetail',
        component: () => import('./customer-manage/views/detail/index.vue'),
        meta: {
          title: '客户资料详情',
          auth: true,
          activeMenu: 'CustomerManageCustomerList',
        },
      },
      {
        path: 'customer-manage/update/:id',
        name: 'CustomerManageUpdateCustomer',
        component: () => import('./customer-manage/views/create/index.vue'),
        meta: {
          title: '编辑客户资料',
          auth: true,
          activeMenu: 'CustomerManageCustomerList',
        },
      },
      {
        path: 'group-manage/list',
        name: 'CustomerManageGroupList',
        component: () => import('./group-manage/views/list/index.vue'),
        meta: {
          title: '集团管理',
          auth: true,
          isKeepAlive: true,
        },
      },
      {
        path: 'group-manage/create',
        name: 'CustomerManageCreateGroup',
        component: () => import('./group-manage/views/detail/index.vue'),
        meta: {
          title: '创建集团',
          auth: true,
          activeMenu: 'CustomerManageGroupList',
        },
      },
      {
        path: 'group-manage/detail/:id',
        name: 'CustomerManageGroupDetail',
        component: () => import('./group-manage/views/detail/index.vue'),
        meta: {
          title: '集团详情',
          auth: true,
          activeMenu: 'CustomerManageGroupList',
        },
      },
      {
        path: 'group-manage/update/:id',
        name: 'CustomerManageUpdateGroup',
        component: () => import('./group-manage/views/detail/index.vue'),
        meta: {
          title: '编辑集团详情',
          auth: true,
          activeMenu: 'CustomerManageGroupList',
        },
      },
      {
        path: 'develop-plan/list',
        name: 'CustomerManageDevelopPlanList',
        component: () => import('./develop-plan/views/list/index.vue'),
        meta: {
          title: '开发计划',
          auth: true,
          isKeepAlive: true,
        },
      },
    ],
  },
];
