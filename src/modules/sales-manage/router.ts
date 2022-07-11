export default [
  {
    path: '/sales-manage',
    name: 'SalesManage',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/sales-manage/visit-record/list',
    meta: {
      title: '销售管理',
    },
    children: [
      {
        path: 'visit-record/list',
        name: 'SalesManageVisitRecordList',
        component: () => import('./visit-record/views/list/index.vue'),
        meta: {
          title: '拜访记录',
          auth: true,
          isKeepAlive: true,
        },
      },
      {
        path: 'visit-record/detail/:id',
        name: 'SalesManageVisitRecordDetail',
        component: () => import('./visit-record/views/detail/index.vue'),
        meta: {
          title: '拜访详情',
          auth: true,
          activeMenu: 'SalesManageVisitRecordList',
        },
      },
      {
        path: 'target-setting/list',
        name: 'SalesManageTargetSettingList',
        component: () => import('./target-setting/views/list/index.vue'),
        meta: {
          title: '目标设置',
          auth: true,
          isKeepAlive: true,
        },
      },
      {
        path: 'target-setting/detail/:id',
        name: 'SalesManageTargetSettingDetail',
        component: () => import('./target-setting/views/detail/index.vue'),
        meta: {
          title: '目标详情',
          auth: true,
        },
      },
    ],
  },
];
