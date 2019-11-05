import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/index'
import './plugins/iview.js'
import './index.less'
import { setStore, getStore, removeStore } from '@/libs/storage'
import '@/assets/icons/iconfont.css'
import '@/assets/style/global.less'
import TreeTable from 'tree-table-vue'

Vue.config.productionTip = false
Vue.use(TreeTable)

//挂载全局的使用方法
Vue.prototype.setStore = setStore
Vue.prototype.getStore = getStore
Vue.prototype.removeStore = removeStore

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
