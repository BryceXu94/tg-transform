<template>
  <div
    class="app-layout"
    :class="layoutClassName"
  >
    <div
      class="app-layout-sider-mask"
    ></div>
    <app-header
      :systemName="SYSTEM_INFO_ENUM.SYSTEM_NAME"
      :opened="sidebar.opened"
      :account-data="accountData"
      @toggle-sidebar="handleToggleSideBar"
    >
      <template #dropdown-menu>
        <!--<el-dropdown-item>
          <router-link :to="baseInfoUrl">基本资料</router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <router-link to="/account/password">修改密码</router-link>
        </el-dropdown-item>-->
        <el-dropdown-item
          @click="handleChangeFactory"
          v-if="companyInfoList.length > 1"
        >
          切换租户
        </el-dropdown-item>
        <el-dropdown-item
          divided
          @click="handleModify"
        >
          修改密码
        </el-dropdown-item>
        <el-dropdown-item
          divided
          @click="handleLogout"
        >
          退出登录
        </el-dropdown-item>
      </template>
    </app-header>
    <app-sider
      :systemName="SYSTEM_INFO_ENUM.SYSTEM_NAME"
      :menus="menus"
      :sidebar="sidebar"
      :is-collapse="isCollapse"
    />
    <div class="app-layout-main">
      <app-body>
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive
              :include="cacheKeys"
              :max="10"
            >
              <component
                v-if="$route.meta.isKeepAlive"
                :is="Component"
                :key="$route.name"
              />
            </keep-alive>
          </transition>
          <transition name="fade-transform" mode="out-in">
            <component
              v-if="!($route.meta.isKeepAlive)"
              :is="Component"
              :key="$route.name"
            />
          </transition>
        </router-view>
      </app-body>
      <app-footer />
    </div>
    <modify-password-modal
      v-model:visible="modifyModalVisible"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import AppSider from './components/app-aside/index.vue';
import AppHeader from './components/app-header/index.vue';
import AppBody from './components/app-body/index.vue';
import AppFooter from './components/app-footer/index.vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store/app';
import { useAccountStore } from '@/store/account';
import useSide from './composables/use-side';
import useHeader from './composables/use-header';
import { useResizeHandler } from './composables/use-resize-handler';
import ModifyPasswordModal from './components/modify-password-modal/index.vue';
import { SYSTEM_INFO_ENUM } from '@/constant';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  name: 'MainLayout',
  components: {
    AppSider,
    AppHeader,
    AppBody,
    AppFooter,
    ModifyPasswordModal,
  },
  setup() {
    const $router = useRouter();
    const accountStore = useAccountStore();
    const menuStore = useMenuStore();
    const modifyModalVisible = ref(false);
    const handleModify = () => {
      modifyModalVisible.value = true;
    };
    // side 组件使用
    const {
      sidebar,
      isCollapse,
      menus,
    } = useSide();
    // header 组件
    const {
      accountData,
      // baseInfoUrl,
      handleLogout,
      handleToggleSideBar,
    } = useHeader();

    useResizeHandler();
    const appState = useAppStore();

    const layoutClassName = computed(() => {
      return {
        'screen-size': appState.screenSize,
        'sidebar-show': appState.sidebar.opened,
        'sidebar-hide': !appState.sidebar.opened,
        'without-animation': appState.sidebar.withoutAnimation,
      };
    });
    const handleChangeFactory = () => {
      $router.push({
        name: 'SelectCompany',
      });
    };
    const companyInfoList = computed(() => accountStore.account?.companyInfoList || []);

    const cacheKeys = computed(() => {
      return [...menuStore.cacheKeys];
    });

    return {
      companyInfoList,
      cacheKeys,
      handleChangeFactory,
      accountData,
      // baseInfoUrl,
      handleModify,
      handleLogout,
      layoutClassName,
      handleToggleSideBar,
      modifyModalVisible,
      menus,
      sidebar,
      isCollapse,
      SYSTEM_INFO_ENUM,
    };
  },
});
</script>

<style lang="scss">
@import "~@/styles/index.scss";

body {
  &.sidebar-show {
    overflow: hidden;
    position: relative;
    width: calc(100% - 17px);
  }
}

.app-layout {
  height: 100vh;
  padding-top: $app-header-height;
  padding-left: $app-sider-width;
  &.without-animation {
    .app-layout-sider {
      transition: none;
    }
  }

  &-main {
    flex: auto;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    position: relative;
    overflow: hidden;
  }

  // 侧边栏显示
  &.sidebar-show {
    .app-layout-sider {
      width: $app-sider-width;
    }
    padding-left: $app-sider-width;
  }
  // 侧边栏隐藏
  &.sidebar-hide {
    .app-layout-sider {
      width: $app-sider-width-min;
    }
    padding-left: $app-sider-width-min;
  }

  // 超小屏
  &.screen-xs {
    padding-left: 0;
    .app-layout-sider {
      width: $app-sider-width !important;
    }
    // 侧边栏显示

    // 侧边栏隐藏
    &.sidebar-hide {
      .app-layout-sider {
        pointer-events: none;
        transform: translate3d(-$app-sider-width, 0, 0);
        box-shadow: none;
      }
    }
  }
}
</style>
