import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import {
  localStore
} from "@/libs/storage.js";
Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [{
    path: "/home",
    name: "home",
    component: Home,
    redirect: '/audit-brand',
    children: [{
        path: '/audit-brand',
        name: "AuditBrand",
        component: () =>
          import("./views/goods/AuditBrand.vue")
      },
      {
        path: '/brand-label',
        name: "BrandLabel",
        component: () =>
          import("./views/goods/BrandLabel.vue")
      },
      {
        path: '/buy-notes',
        name: "BuyNotes",
        component: () =>
          import("./views/goods/BuyNotes.vue")
      },
      {
        path: '/classify-goods',
        name: "ClassifyGoods",
        component: () =>
          import("./views/goods/ClassifyGoods.vue")
      },
      {
        path: '/goods-comment',
        name: "CommentOfGoods",
        component: () =>
          import("./views/goods/CommentOfGoods.vue")
      },
      {
        path: '/descibe-goods',
        name: "DescibeGoods",
        component: () =>
          import("./views/goods/DescibeGoods.vue")
      },
      {
        path: '/descibe-service',
        name: "DescribeService",
        component: () =>
          import("./views/goods/DescribeService.vue")
      },
      {
        path: '/merchant-service',
        name: "MerchantService",
        component: () =>
          import("./views/goods/MerchantService.vue")
      },
      {
        path: '/descibe-activity',
        name: "DescribeActivity",
        component: () =>
          import("./views/goods/DescribeActivity.vue")
      },
      {
        path: '/goods-params',
        name: "GoodsParams",
        component: () =>
          import("./views/goods/GoodsParams.vue")
      },
      {
        path: '/sensitive-word',
        name: "SensitiveWord",
        component: () =>
          import("./views/goods/SensitiveWord.vue")
      },
      {
        path: '/import-list',
        name: "ImportList",
        component: () =>
          import("./views/goods/ImportList.vue")
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "about" */ "./views/Login.vue")
  },
  {
    path: "/",
    redirect: '/home',
  },
  {
    path: "*",
    name: "404",
    component: () =>
      import("./views/error-page/404.vue")
  }]
});

router.beforeEach((to, from, next) => {
  let authorization = localStore.getAuthorization()
  if (!authorization && to.path !== "/login") {
    localStore.clear()
    next("/login")
  } else if (authorization && to.path == "/login") {
    let lastRoute = localStore.getLastRoute()
    next(lastRoute)
  } else {
    localStore.setLastRoute(to.path)
    next()
  }
})
export default router
