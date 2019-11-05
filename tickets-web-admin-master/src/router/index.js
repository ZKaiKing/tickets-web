import Vue from "vue";
import VueRouter from "vue-router";
import { routers } from './router';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
  base: process.env.BASE_URL,
  routes: routers
};

export const router = new VueRouter(RouterConfig);