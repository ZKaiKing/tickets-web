import { getMenuList } from "@/api/index";
import lazyLoading from './lazyLoading.js';
// import router from '@/router.js';

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode;
  if (parentNode) {
    let classList = parentNode.classList;
    if (
      classList &&
      classes.every(className => classList.contains(className))
    ) {
      return parentNode;
    } else {
      return findNodeUpperByClasses(parentNode, classes);
    }
  }
};

let util = {};

util.initRouter = function (vm) {
  const constRoutes = [];
  getMenuList().then(res => {
    let menuData = res.result;
    if (!menuData) return;
    util.initAllMenuData(constRoutes, menuData);
    // vm.$store.commit('updateAppRouter', constRoutes.filter(item => item.children.length > 0));
    vm.$store.commit('updateMenulist', constRoutes.filter(item => item.children.length > 0));
  })

  util.initAllMenuData = function (constRoutes, data) {
    let allMenuData = [];
    data.forEach(e => {
        e.children.forEach(item => {
          allMenuData.push(item);
        })
    })
    util.initRouterNode(constRoutes, allMenuData);
  }

  // 生成路由节点
util.initRouterNode = function (routers, data) {
  // let i = 0;
  for (var item of data) {
    // console.log(i + item)
      let menu = Object.assign({}, item);
      // console.log(menu.component);
      if(menu.component === 'Home'){
        menu.component = ()=>import(`@/views/Home.vue`);
      } else {
        let url = `@/views/goods/${menu.component}`;
        menu.component = ()=>import('@/views/goods/' + menu.component)
      }
       
      // menu.component = lazyLoading(menu.component);

      if (item.children && item.children.length > 0) {
          menu.children = [];
          util.initRouterNode(menu.children, item.children);
      }

      let meta = {};
      // 给页面添加权限、标题、第三方网页链接
      meta.permTypes = menu.permTypes ? menu.permTypes : null;
      meta.title = menu.title ? menu.title + "-葱鸭后台管理系统" : null;
      menu.meta = meta;

      routers.push(menu);
  }
  console.log(routers);
};

}

export default util;