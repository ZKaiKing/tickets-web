<style scoped>
/* .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    } */
</style>
<template>
  <Layout class="main" style="height:100%">
    <Sider
      :style="{ position: 'fixed', height: '100vh', left: 0, overflow: 'auto' }"
    >
      <Menu
        active-name="itemList[0].subItemList[0].name"
        theme="dark"
        width="auto"
        :open-names="['itemList[0].name']"
      >
        <Submenu
          v-for="(item, index) in itemList"
          :name="item.name"
          :key="index"
        >
          <template slot="title">
            <Icon :type="item.icon"></Icon>
            {{ item.title }}
          </template>
          <MenuItem
            v-for="(subItem, subIndex) in item.subItemList"
            :name="subItem.name"
            :key="subIndex"
          >
            {{ subItem.title }}
          </MenuItem>
        </Submenu>
      </Menu>
    </Sider>
    <Layout :style="{ marginLeft: '200px' }">
      <Header class="header-con">
        <header-bar collapsed="false"></header-bar>
      </Header>
      <Content :style="{ padding: '0 16px 16px' }">
        <Breadcrumb :style="{ margin: '16px 0' }">
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Components</BreadcrumbItem>
          <BreadcrumbItem>Layout</BreadcrumbItem>
        </Breadcrumb>
        <Card>
          <div style="height: 600px">Content</div>
        </Card>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
export default {
  data() {
        return {
      shrink: false,
      itemList: [
        {
          name: "goods1",
          title: "商品",
          icon: "ios-navigate",
          subItemList: [
            {
              name: "goods-list1",
              title: "商品列表",
              path: "/togoodlist1"
            },
                        {
              name: "goods-detail1",
              title: "商品详情",
              path: "/togooddetail1"
            }
          ]
                },
                {
          name: "goods2",
          title: "商品1",
          icon: "ios-keypad",
          subItemList: [
            {
              name: "goods-list2",
              title: "商品列表2",
              path: "/togoodlist2"
            },
            {
              name: "goods-detail2",
              title: "商品详情2",
              path: "/togooddetail2"
            }
          ]
        }
      ]
        };
  }
};
</script>
