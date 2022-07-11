export default [
  {
    path: '/report-forms-manage',
    name: 'ReportFormsManage',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/report-forms-manage/list',
    mete: {
      title: '报表管理',
    },
    children: [
      {
        path: 'report-summary/list',
        name: 'ReportFormsManageList',
        component: () => import('./report-summary/views/index.vue'),
        meta: {
          title: '报表汇总',
          auth: true,
        },
      },
      {
        path: 'report-summary/report-form/:reportFormUrl',
        name: 'ReportFormContainer',
        component: () => import('./report-summary/views/report-forms/index.vue'),
        meta: {
          title: '报表汇总',
          auth: true,
        },
      },
      {
        path: 'goal-completion-statistics/list',
        name: 'TabaleManageGoalCompletionStatistics',
        component: () => import('./goal-completion-statistics/views/list/index.vue'),
        meta: {
          title: '目标完成统计',
          auth: true,
        },
      },
    ],
  },
];
