import { Component } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

const Layout = () => import("@/components/layout/layout.vue");
const Home = () => import("@/pages/Home.vue");
// 通用路由页面

export type routeType = {
  path: string,
  component: Component,
  name: string,
  meta: {
    title: string,
    hidden?: boolean
    icon: string
  },
  children?: routeType[]
}
export const commonRoutes = [
  {
    path: '/login',
    component: () => import('@/pages/Login.vue'),
    name: 'login',
    meta: {
      title: 'login',
      hidden: true, // 是否在侧边导航栏中展示
    },
  },
  {
    path: "/",
    name: "Layout",
    component: Layout,
    meta: {
      title: "",
      hidden: false,
      icon: "",
    },
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: Home,
        meta: {
          title: "首页",
          hidden: false,
          icon: "HomeFilled",
        },
      },
    ],
  },
  {
    path: '/screen',
    component: () => import('@/pages/Screen.vue'),
    name: 'Screen',
    meta: {
      title: 'Screen',
      hidden: false,
      icon: 'Platform'
    },
  },
  // 因存在动态路由，在动态路由加载前，会触发404匹配，显示notFound页面，故需要将404匹配作为动态路由添加
  // {
  //   // path: '/404',
  //   path: '/:pathMatch(.*)*',
  //   component: () => import('@/pages/NotFound.vue'),
  //   name: '404',
  //   meta: {
  //     title: '404',
  //     hidden: true,
  //   },
  // },
];
// 异步路由
export const asyncRoutes = [
  {
    path: "/product",
    name: "Product",
    component: Layout,
    meta: {
      title: "品牌管理",
      icon: "Goods",
      hidden: false,
    },
    children: [
      {
        path: "/product/trademark",
        component: () => import("@/pages/product/Trademark.vue"),
        name: "Trademark",
        meta: {
          title: "品牌管理",
          icon: "ShoppingCart",
          hidden: false,
        },
      },
      {
        path: "/product/attr",
        component: () => import("@/pages/product/Attr.vue"),
        name: "Attr",
        meta: {
          title: "属性管理",
          icon: "Management",
          hidden: false,
        },
      },
      {
        path: "/product/spu",
        component: () => import("@/pages/product/Spu.vue"),
        name: "Spu",
        meta: {
          title: "Spu",
          icon: "SetUp",
          hidden: false,
        },
      },
    ],
  },
  {
    path: '/acl',
    component: Layout,
    name: 'Acl',
    meta: {
      title: '权限管理',
      hidden: false,
      icon: 'Lock',
    },
    redirect: '/acl/user',
    children: [
      {
        path: '/acl/user',
        component: () => import('@/pages/acl/User.vue'),
        name: 'User',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User',
        },
      },
      {
        path: '/acl/role',
        component: () => import('@/pages/acl/Role.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'Avatar',
        },
      },
      {
        path: '/acl/permission',
        component: () => import('@/pages/acl/Permission.vue'),
        name: 'Permission',
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'List',
        },
      },
    ],
  },
];
export const anyRoute = [{
  path: '/:pathMatch(.*)*',
  // redirect: '/404',
  name: 'NotFound',
  component: () => import('@/pages/NotFound.vue'),
  meta: {
    title: '任意路由',
    hidden: true,
  },
}]
export const routes = [
  ...commonRoutes,
  // anyRoute,
  // ...asyncRoutes
];
// console.log('routes', routes);



const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
