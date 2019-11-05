<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{ overflow: 'hidden' }">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" :username="username" @on-coll-change="handleCollapsedChange">
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <!-- <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/> -->
          </div>
          <Content class="content-wrapper">
            <keep-alive>
              <router-view />
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
  import SideMenu from "@/components/main/side-menu";
  import HeaderBar from "@/components/main/header-bar";
  import minLogo from "@/assets/images/logo-min.jpg";
  import maxLogo from "@/assets/images/logo.jpg";
  import util from "@/libs/util.js";
  import "./home.less";
  export default {
    components: {
      SideMenu,
      HeaderBar
    },
    data() {
      return {
        collapsed: false,
        minLogo,
        maxLogo,
        // menuList: [],
        // [{
        //   name: "item1",
        //   title: "item1",
        //   icon: "ios-navigate",
        //   children: []
        // },
        // {
        //   name: "item2",
        //   title: "item2",
        //   icon: "ios-keypad",
        //   children: [{
        //     name: "item2-1",
        //     title: "item2-1",
        //     icon: "md-arrow-dropdown-circle",
        //     children: [{
        //       name: "item2-1-1",
        //       title: "item2-1-1",
        //       icon: "md-trending-up",
        //       children: []
        //     },
        //     {
        //       name: "item2-1-2",
        //       title: "item2-1-2",
        //       icon: "md-trending-up",
        //       children: []
        //     }]
        //   },
        //   {
        //     name: "item2-2",
        //     title: "item2-2",
        //     icon: "md-trending-up",
        //     children: []
        //   },
        //   {
        //     name: "item2-3",
        //     title: "item2-3",
        //     icon: "md-trending-up",
        //     children: []
        //   }]
        // },
        // {
        //   name: "item3",
        //   title: "item3",
        //   icon: "ios-keypad",
        //   name: "item3-1",
        //   title: "item3-1",
        //   icon: "md-arrow-dropdown-circle",
        //   children: [{
        //     name: "item3-1-1",
        //     title: "item3-1-1",
        //     icon: "md-trending-up",
        //     children: []
        //   },
        //   {
        //     name: "item3-1-2",
        //     title: "item3-1-2",
        //     icon: "md-trending-up",
        //     children: []
        //   }]
        // },
        // {
        //   name: "item3-2",
        //   title: "item3-2",
        //   icon: "md-trending-up",
        //   children: []
        // },
        // {
        //   name: "item3-3",
        //   title: "item3-3",
        //   icon: "md-trending-up",
        //   children: []
        // }],
        userId: "",
        username: "",

      };
    },
    methods: {
      init() {
      //  util.initRouter(this);
        // console.log(this.$route.matched[0]);
        // if (this.$route.name === 'home')
        //   this.$router.push('/auditbrand');
        // console.log(this.$route)
        let userInfo = JSON.parse(this.getStore("userInfo"));
        this.userId = userInfo.id;
        this.username = userInfo.username;

      },
      handleCollapsedChange(state) {
        this.collapsed = state;
      },
      turnToPage(route) {
        console.log('home.vue->turnToPage:' + route);
        let { name, params, query } = {}
        if (typeof route === 'string') name = route
        else {
          name = route.name
          params = route.params
          query = route.query
        }
        if (name.indexOf('isTurnByHref_') > -1) {
          window.open(name.split('_')[1])
          return
        }
        this.$router.push({
          name,
          params,
          query
        })
      },
    },
    computed: {
       menuList() {
          return this.$store.state.app.menuList;
      },
    },
    mounted() {
      util.initRouter(this);
      this.init();
    },
  };
</script>