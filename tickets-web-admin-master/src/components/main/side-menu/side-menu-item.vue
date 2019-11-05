<template>
  <Submenu :name="parentItem.name">
    <template slot="title">
      <Icon :type="parentItem.icon || ''" />
      <span>{{ parentItem.title }}</span>
    </template>
    <template v-for="item in parentItem.children">
      <side-menu-item
        v-if="item.children && item.children.length >= 1"
        :key="`menu-${item.name}`"
        :parent-item="item"
      >
      </side-menu-item>
      <menu-item v-else :name="item.name" :key="`menu-${item.name}`">
        <Icon :type="item.icon || ''" />
        <span>{{ item.title }}</span>
      </menu-item>
    </template>
  </Submenu>
</template>

<script>
export default {
    name: "SideMenuItem",
    props: {
    parentItem: {
            type: Object,
            default: () => {}
    },
        theme: String,
    iconSize: Number
    },
    computed: {
        children() {
            return this.parentItem.children;
    },
        textColor() {
      return this.theme === "dark" ? "#fff" : "#495060";
    }
    }
};
</script>
