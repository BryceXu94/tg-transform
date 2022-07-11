export default [
  {
    path: '/system-configuration',
    name: 'SystemConfiguration',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/system-configuration/credit-configuration/detail',
    meta: {
      title: '审批管理',
    },
    children: [
      {
        path: 'credit-configuration/detail',
        name: 'SystemCreditConfiguration',
        component: () => import('./credit-configuration/views/detail/index.vue'),
        meta: {
          title: '授信配置',
          auth: true,
        },
      },
    ],
  },
];
