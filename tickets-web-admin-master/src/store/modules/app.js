import { otherRouter } from "@/router/router";
import router from "@/router.js";
import Util from "@/libs/util";
import Vue from "vue";

const app = {
  state: {
    menuList: [],
    routers: [],
  },
  mutations: {
    // 动态添加主界面路由，需要缓存
    updateAppRouter(state, routes) {
      state.routers.push(...routes);
      router.addRoutes(routes);
    },
    // 接受前台数组，刷新菜单
    updateMenulist(state, routes) {
      state.menuList = routes;
    },
  }
};

export default app;