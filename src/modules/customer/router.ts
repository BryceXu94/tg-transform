export default [
  {
    path: '/customer',
    name: 'Customer',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/customer/list',
    mete: {
      title: '客户资料',
    },
    children: [
      {
        path: 'list',
        name: 'CustomerList',
        component: () => import('./view/list.vue'),
        meta: {
          title: '客户资料列表',
          auth: true,
        },
      },
      {
        path: 'create',
        name: 'CustomerCreate',
        component: () => import('./view/create/index.vue'),
        meta: {
          title: '创建',
          auth: true,
        },
      },
      {
        path: 'edit/:id',
        name: 'CustomerEdit',
        component: () => import('./view/create/index.vue'),
        meta: {
          title: '编辑',
          auth: true,
        },
      },
      {
        path: 'details/:id',
        name: 'CustomerDetails',
        component: () => import('./view/create/index.vue'),
        meta: {
          title: '详情',
          auth: true,
          readOnly: true,
        },
      },
    ],
  },
];
