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
  routes: [
    {
    path: "/home",
    name: "home",
    component: Home,
    // redirect: '/audit-brand',
    children: [
      // {
      //   path: '/audit-brand',
      //   name: "AuditBrand",
      //   component: () =>
      //     import("./views/goods/AuditBrand.vue")
      // },

      //系统管理
      {
        path: '/role-manage',
        name: "role-manage",
        component: () =>
          import("./views/system/RoleManage.vue")
      },
      {
        path: '/account-manage',
        name: "account-manage",
        component: () =>
          import("./views/system/AccountManage.vue")
      },
      {
        path: '/user-manage',
        name: "user-manage",
        component: () =>
          import("./views/system/UserManage.vue")
      },

      //意见反馈
      {
        path: '/feed-back-manage',
        name: "feed-back-manage",
        component: () =>
          import("./views/feedBack/FeedBack.vue")
      },
      //订单管理
      {
        path: '/order-manage',
        name: "order-manage",
        component: () =>
          import("./views/order/Order.vue")
      },
      //流水
      {
        path: '/account-log-manage',
        name: "account-log-manage",
        component: () =>
          import("./views/order/AccountLog.vue")
      },
      //门票
      {
        path: '/tickets-manage',
        name: "tickets-manage",
        component: () =>
          import("./views/tickets/TicketsManage.vue")
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
  let authorization = localStore.getAuthorization();
  if (!authorization && to.path !== "/login") {
    localStore.clear();
    next("/login");
  } else if (authorization && to.path == "/login") {
    let lastRoute = localStore.getLastRoute();
    next(lastRoute);
  } else {
    localStore.setLastRoute(to.path);
    next()
  }
});
export default router;
