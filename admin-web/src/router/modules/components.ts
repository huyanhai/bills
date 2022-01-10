import Layout from '@/layouts';
import ListIcon from '@/assets/assets-slide-list.svg';

export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Layout,
    redirect: '/dashboard/waiting',
    meta: { title: '发票管理', icon: ListIcon, hide: false },
    children: [
      {
        path: 'waiting',
        name: 'waiting',
        component: () => import('@/pages/list/base/index.vue'),
        meta: { title: '待开票管理', hide: false },
      },
      {
        path: 'complete',
        name: 'complete',
        component: () => import('@/pages/list/base/complete.vue'),
        meta: { title: '已开票管理', hide: false },
      },
      {
        path: 'voided',
        name: 'voided',
        component: () => import('@/pages/list/base/voided.vue'),
        meta: { title: '冲红作废管理', hide: false },
      },
      {
        path: 'invoice',
        name: 'invoice',
        component: () => import('@/pages/list/base/tongji.vue'),
        meta: { title: '开票统计', hide: false },
      },
      {
        path: 'cancel',
        name: 'cancel',
        component: () => import('@/pages/list/base/tongji2.vue'),
        meta: { title: '作废统计', hide: false },
      },
      {
        path: 'red',
        name: 'red',
        component: () => import('@/pages/list/base/tongji3.vue'),
        meta: { title: '冲红统计', hide: false },
      },
      {
        path: 'tick',
        name: 'tick',
        component: () => import('@/pages/list/base/tick.vue'),
        meta: { title: '发票管理', hide: true },
      },
      {
        path: 'tick1',
        name: 'tick1',
        component: () => import('@/pages/list/base/tick1.vue'),
        meta: { title: '发票管理', hide: true },
      },
    ],
  },
];
