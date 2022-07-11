<template>
  <div
    v-if="!item.hidden"
    class="menu-wrapper"
  >
    <template
      v-if="!children || !children.length"
    >
      <app-link
        :to="item.frontEndUrl"
      >
        <el-menu-item
          :index="item.frontEndUrl"
          :router="{
            name: item.frontEndUrl,
          }"
        >
          <item
            :icon="item.icon ? item.icon : ''"
            :title="!collapse ? item.resourceName : ''"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu
      v-else
      ref="subMenu"
      :index="item.frontEndUrl"
      popper-append-to-body
    >
      <template #title>
        <item
          :title="!collapse ? item.resourceName : ''"
          :icon="item.icon ? item.icon : ''"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.frontEndUrl"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import Item from './item.vue';
import AppLink from './link.vue';
import { IMenuItem } from '@/store/menu/type';
import { RESOURCE_TYPE_ENUM } from '@/api/menu/type';

interface IProps {
  item: IMenuItem;
  basePath?: string;
  collapse?: boolean;
}

export default defineComponent({
  name: 'SidebarItem',
  components: {
    Item,
    AppLink,
  },
  props: {
    item: {
      type: Object as PropType<IMenuItem>,
      required: true,
    },
    collapse: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: IProps) {
    const children = computed(() => {
      return (props.item.children || []).filter((it) => {
        return it.resourceType !== RESOURCE_TYPE_ENUM.BUTTON;
      });
    });

    return {
      children,
    };
  },
});
</script>
