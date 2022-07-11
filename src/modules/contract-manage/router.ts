export default [
  {
    path: '/contract-manage',
    name: 'ContractManage',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/contract-manage/framework-contract/list',
    meta: {
      title: '合同管理',
    },
    children: [
      // {
      //   path: 'framework-contract/list',
      //   name: 'ContractManageFrameworkContractList',
      //   component: () => import('./framework-contract/views/list/index.vue'),
      //   meta: {
      //     title: '框架合同',
      //     auth: true,
      //   },
      // },
      {
        path: 'contract-archives/list',
        name: 'ContractManageContractArchivesList',
        component: () => import('./contract-archives/views/list/index.vue'),
        meta: {
          title: '合同档案',
          auth: true,
        },
      },
    ],
  },
];
