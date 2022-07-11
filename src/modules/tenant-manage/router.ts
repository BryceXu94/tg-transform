export default [
  {
    path: '/tenant-manage',
    name: 'TenantManage',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/account-manage/tenant-manage/list',
    meta: {
      title: '租户管理',
    },
    children: [
      {
        path: 'tenant-manage/list',
        name: 'TenantManageList',
        component: () => import('./tenant-manage/views/list/index.vue'),
        meta: {
          title: '租户管理列表',
          auth: true,
          isKeepAlive: true,
        },
      },
    ],
  },
];
