<template>
  <div class="custom-bread-crumb">
    <Breadcrumb :style="{ fontSize: `${fontSize}px` }">
      <BreadcrumbItem v-for="item in list" :to="item.to" :key="item.id">
        <Icon style="margin-right: 4px;" :type="item.icon || ''" />
        {{ item.title }}
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<script>
import "./custom-bread-crumb.less";
export default {
  name: "customBreadCrumb",
  props: {
    list: {
      type: Array,
      default: () => []
    },
    fontSize: {
      type: Number,
      default: 14
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  }
};
</script>
