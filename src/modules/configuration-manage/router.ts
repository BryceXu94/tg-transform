export default [
  {
    path: '/configuration-manage',
    name: 'ConfigurationManage',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/sales-manage/visit-record/list',
    meta: {
      title: '配置管理',
    },
    children: [
      {
        path: 'data-permissions/list',
        name: 'ConfigurationManageDataPermissionsList',
        component: () => import('./data-permissions/views/list/index.vue'),
        meta: {
          title: '数据权限',
          auth: true,
          isKeepAlive: true,
        },
      },
    ],
  },
];
