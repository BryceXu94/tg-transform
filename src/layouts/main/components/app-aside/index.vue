<template>
  <aside class="app-layout-sider">
    <div class="app-layout-sider-inner">
      <section class="menu">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-menu
            :default-openeds="defaultOpeneds"
            :default-active="activeMenu"
            :collapse="isCollapse"
            :unique-opened="false"
            :collapse-transition="false"
            :background-color="variables.menuBg"
            :text-color="variables.menuText"
            :active-text-color="variables.menuTextActive"
            mode="vertical"
          >
            <sidebar-item
              v-for="menu in menuList"
              :key="menu.frontEndUrl"
              :item="menu"
              :collapse="isCollapse"
            />
          </el-menu>
        </el-scrollbar>
      </section>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import SidebarItem from './sidebar-item.vue';
import variables from '@/styles/variables/index.module.scss';
import { useRoute } from 'vue-router';
import { IMenuItem } from '@/store/menu/type';

interface Sidebar {
  opened: boolean;
  withoutAnimation: boolean;
}

export default defineComponent({
  name: 'AppSider',
  components: {
    SidebarItem,
  },
  props: {
    menus: {
      type: Array as PropType<IMenuItem[]>,
      default: () => ([]),
    },
    isCollapse: {
      type: Boolean,
    },
    sidebar: {
      type: Object as PropType<Sidebar>,
      default: () => ({
        opened: false,
        withoutAnimation: true,
      }),
    },
  },
  setup(props) {
    const route = useRoute();
    const menuList = computed<IMenuItem[]>(() => {
      return props.menus;
    });
    const styleVariables = computed(() => {
      return variables;
    });

    const activeMenu = computed(() => {
      const { meta, name } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        // return meta.activeMenu;
        return typeof meta.activeMenu === 'function' ? meta.activeMenu(route) : meta.activeMenu;
      }
      return name;
    });

    return {
      activeMenu,
      variables: styleVariables,
      menuList,
      defaultOpeneds: [],
    };
  },
});
</script>

<style lang="scss" scoped>
.app-layout {

  &-sider {
    width: $app-sider-width;
    transition: all .2s;
    z-index: 200;
    background: #fff;
    position: fixed;
    left: 0;
    top: $app-header-height;
    height: calc(100vh - #{$app-header-height});
    box-shadow: 2px 0px 6px 0px rgba(130, 194, 255, 0.12);
    &-mask {
      position: fixed;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.65);
      transition: opacity .3s linear;
      z-index: 201;
    }

    &-inner {
      background: $app-sider-menu-fill;
      position: relative;
      height: 100%;
    }

    &.hide {
      width: $app-sider-width-min;
    }

    .menu {
      // padding: 16px 0;
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>

<style lang="scss" scoped>
// @TODO: min stauts menu atived

.app-layout-sider {
  padding: 8px;
  :deep(.el-scrollbar) {
    height: 100%;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }
  :deep(.el-menu-item){
    min-width: auto;
  }

  :deep(.el-menu) {
    border-right: none;
    .menu_icon{
      color: #333;
    }
    .el-submenu__icon-arrow{
      font-size: 12px !important;
      color: #333;
      font-weight: bold;
    }
    .el-menu-item,
    .el-submenu__title {
      &:hover {
        color: $menu-text-active !important;
        background-color: transparent !important;
        .menu_icon{
          color: $menu-text-active !important;
        }
      }

      .icon-svg {
        font-size: 16px;
        margin-right: 6px;
        vertical-align: middle;
      }
    }
  }
  :deep(.el-menu) {

  }
  .menu :deep(.el-menu-item, .el-submenu__title) {
    position: relative;
    height: 40px;
    line-height: 40px;
    // margin: 8px;
    // width: 184px;
    &.is-active {
      color: $menu-text-active !important;
      background-color: $menu-bg-active !important;
      border-radius: 4px;
      font-weight: 500;
      .menu_icon{
        color: $menu-text-active !important;
      }
    }
  }
  .menu :deep(.el-submenu.is-active) {
    .el-submenu__icon-arrow{
      color: $menu-text-active !important;
    }
    .el-submenu__title {
      color: $menu-text-active !important;
      border-bottom-color: transparent;
      font-weight: 500;
      .menu_icon{
        color: $menu-text-active !important;
      }
    }
  }
  .menu :deep(.el-submenu .el-menu) {
    background-color: $sub-menu-bg !important;

    .el-menu-item,
    .el-submenu__title {
      background-color: $sub-menu-bg !important;
      span{
        padding-left: 8px;
      }

      &.is-active {
        position: relative;
        background-color: $menu-bg-active !important;
        border-radius: 4px;
        font-weight: 500;
        .menu_icon{
          color: $menu-text-active !important;
        }
      }
    }

    .el-menu {
      background-color: $sub-menu-bg !important;
    }
  }

  // min status
  // :deep(.el-menu--collapse) {
  //   width: $app-sider-width-min;

  //   .el-menu-item.is-active,
  //   .el-submenu__title.is-active {
  //     background-color: transparent !important;
  //   }

  //   .el-menu-item,
  //   .el-submenu__title {
  //     text-align: center;
  //   }

  //   .el-menu-item .icon-svg,
  //   .el-submenu__title .icon-svg {
  //     margin-right: 0;
  //   }

  //   .el-submenu > .el-submenu__title > span {
  //     height: 0;
  //     width: 0;
  //     overflow: hidden;
  //     visibility: hidden;
  //     display: inline-block;
  //   }

  //   .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
  //     display: none;
  //   }
  // }
}
</style>
