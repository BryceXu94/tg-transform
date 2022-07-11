export default [
  {
    path: '/customer-follow',
    name: 'CustomerFollow',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/customer-follow/sale-follow/list',
    meta: {
      title: '销售跟进',
    },
    children: [
      {
        path: 'sale-follow/list',
        name: 'CustomerFollowSaleList',
        component: () => import('./sale-follow/views/list/index.vue'),
        meta: {
          title: '销售跟进',
          auth: true,
          isKeepAlive: true,
        },
      },
      {
        path: 'design-follow/list',
        name: 'CustomerFollowDesignList',
        component: () => import('./design-follow/views/list/index.vue'),
        meta: {
          title: '设计跟进',
          auth: true,
          isKeepAlive: true,
        },
      },
    ],
  },
];
