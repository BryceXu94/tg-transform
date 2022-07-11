export default [
  {
    path: '',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('./views/dashboard/index.vue'),
        meta: {
          icon: 'home',
          title: '首页',
          affix: true,
          auth: true,
        },
      },
    ],
  },
  {
    path: '',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'CustomerList',
        name: 'CustomerList',
        component: () => import('./views/dashboard/index.vue'),
        meta: {
          icon: 'home',
          title: '首页',
          affix: true,
          auth: true,
        },
      },
    ],
  },
  {
    path: '',
    component: () => import('@/layouts/main/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'TEST',
        name: 'TEST',
        component: () => import('./views/dashboard/index.vue'),
        meta: {
          icon: 'home',
          title: '首页',
          affix: true,
          auth: true,
        },
      },
    ],
  },
  {
    path: '/select-company',
    name: 'SelectCompany',
    component: () => import('./views/select-company/index.vue'),
    hidden: true,
    meta: {
      auth: true,
    },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('./views/error-page/404.vue'),
    hidden: true,
    meta: {
    },
  },
  {
    path: '/403',
    name: 'NoAuth',
    component: () => import('./views/error-page/403.vue'),
    hidden: true,
    meta: {
    },
  },
  {
    path: '/401',
    name: 'NoLogin',
    component: () => import('./views/error-page/401.vue'),
    hidden: true,
    meta: {
    },
  },
  {
    path: '/redirect',
    component: () => import('@/layouts/main/index.vue'),
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('./views/redirect/index.vue'),
        meta: {
        },
      },
    ],
  },
];
