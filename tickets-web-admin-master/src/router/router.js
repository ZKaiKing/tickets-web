// import Home from "@/views/Home.vue";

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录-演唱会票务后台管理系统 '
    },
    component: () => import('@/views/Login.vue')
}

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@/views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    page500,
    page403
];
