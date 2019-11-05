<template>
  <Dropdown
    ref="dropdown"
    @on-click="handleClick"
    :class="hideTitle ? '' : 'collased-menu-dropdown'"
    :transfer="hideTitle"
    :placement="placement"
  >
    <a
      class="drop-menu-a"
      type="text"
      @mouseover="handleMousemove($event, parentItem.children)"
      :style="{ textAlign: !hideTitle ? 'left' : '' }"
    >
      <Icon :size="rootIconSize" :color="textColor" :type="parentItem.icon" />
      <span class="menu-title" v-if="!hideTitle">{{ parentItem.title }}</span>
      <Icon
        style="float: right;"
        v-if="!hideTitle"
        type="ios-arrow-forward"
        :size="16"
      />
    </a>
    <DropdownMenu ref="dropdown" slot="list">
      <template v-for="item in parentItem.children">
        <collapsed-menu
          v-if="item.children && item.children.length >= 1"
          :icon-size="iconSize"
          :parent-item="item"
          :key="`drop-menu-${item.name}`"
        ></collapsed-menu>
        <DropdownItem v-else :key="`drop-item-${item.name}`" :name="item.name">
          <Icon :size="iconSize" :type="item.icon" />
          <span class="menu-title">{{ item.title }}</span>
        </DropdownItem>
      </template>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
import { findNodeUpperByClasses } from "@/libs/util";

export default {
  name: "CollapsedMenu",
  props: {
    hideTitle: {
      type: Boolean,
      default: false
    },
    rootIconSize: {
      type: Number,
      default: 16
    },
    parentItem: {
      type: Object,
      default: () => {}
    },
    theme: String,
    iconSize: Number
  },
  data() {
    return {
      placement: "right-end"
    };
  },
  methods: {
    handleClick(name) {
      console.log("CollapsedMenu->handleClick" + name);
      this.$emit("on-click", name);
    },
    handleMousemove(event, children) {
      const { pageY } = event;
      const height = children.length * 38;
      const isOverflow = pageY + height < window.innerHeight;
      this.placement = isOverflow ? "right-start" : "right-end";
    }
  },
  computed: {
    textColor() {
      return this.theme === "dark" ? "#fff" : "#495060";
    }
  },
  mounted() {
    let dropdown = findNodeUpperByClasses(this.$refs.dropdown.$el, [
      "ivu-select-dropdown",
      "ivu-dropdown-transfer"
    ]);
    if (dropdown) dropdown.style.overflow = "visible";
  }
};
</script>
