<template>
  <el-breadcrumb
    class="breadcrumb-container app-breadcrumb  "
    separator="/"
  >
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbList"
        :key="item.path"
      >
        <!-- no-redirect || last one -->
        <span
          v-if="item.redirect === 'noRedirect' || index === breadcrumbList.length - 1"
          class="no-redirect"
        >
          {{ item.meta.title }}
        </span>
        <a
          v-else
          @click.prevent="onClickBreadcrumb(item, index)"
        >{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { compile } from 'path-to-regexp';
import { RouteRecord, useRoute, useRouter } from 'vue-router';

// 首页路由配置
export const HOME_ROUTE: Partial<RouteRecord> = {
  path: '/dashboard',
  name: 'Dashboard',
  meta: {
    title: '首页',
    icon: 'document',
  },
};

// 获取路由记录列表
function useBreadcrumbList() {
  const currentRoute = useRoute();
  const breadcrumbList = ref<RouteRecord[]>([]);

  // 是否为首页
  const isDashboard = (route: RouteRecord) => {
    const name = route && route.name as string;
    if (!name || !HOME_ROUTE.name) {
      return false;
    }
    return name.trim().toLowerCase() === (HOME_ROUTE.name as string).toLowerCase();
  };

  // 获取路由记录列表
  const getBreadcrumbList = () => {
    // 获取带标题的路由
    let matched = currentRoute.matched.filter(
      item => item.meta && item.meta.title && item.meta.breadcrumb !== false,
    );
    const [first] = matched;

    if (!isDashboard(first)) {
      matched = [HOME_ROUTE as RouteRecord].concat(matched);
    }

    breadcrumbList.value = matched;
  };

  // 监听 重新获取 路由记录
  watch(
    () => {
      return currentRoute.path;
    },
    (path) => {
      // if you go to the redirect page, do not update the breadcrumbs
      if (path.startsWith('/redirect/')) {
        return;
      }
      getBreadcrumbList();
    },
  );
  // 初始化
  getBreadcrumbList();
  return {
    breadcrumbList,
  };
}

export default defineComponent({
  name: 'Breadcrumb',
  setup() {
    const currentRouter = useRouter();
    const currentRoute = useRoute();
    const { breadcrumbList } = useBreadcrumbList();

    const pathCompile = (path: string) => {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = currentRoute;
      const toPath = compile(path);
      return toPath(params);
    };

    const onClickBreadcrumb = (item: RouteRecord, index: number) => {
      const currentName = currentRoute.name;
      const { path } = item;
      const { name } = item;

      const childItem = breadcrumbList.value[index + 1];
      const { activeMenu, breadcrumbLink } = childItem?.meta || {};
      const _handleLink = breadcrumbLink || activeMenu;

      // 跳转的路径
      const toPath = typeof _handleLink === 'function' ? _handleLink(currentRoute) : _handleLink || name;

      // 跳转地址 等于当前地址 不做任何操作
      if (toPath && toPath === currentName) {
        return;
      }

      if (toPath) {
        currentRouter.push({
          name: toPath,
        });
        return;
      }

      const url = pathCompile(path);
      currentRouter.push(url);
    };

    return {
      onClickBreadcrumb,
      breadcrumbList,
    };
  },
});
</script>

<style lang="scss" scoped>
$breadcrumb-color-text-base: #606166;
$breadcrumb-color-text-last: var(--el-color-primary);

.app-breadcrumb.el-breadcrumb {
  display: block;
  font-size: 14px;
  line-height: 22px;
  .no-redirect {
    cursor: text;
    color: $breadcrumb-color-text-base;
    font-weight: 500;
  }

  .el-breadcrumb__inner,
  .el-breadcrumb__inner a,
  .el-breadcrumb__inner.is-link {
    color: $breadcrumb-color-text-base;
    font-weight: 400;
  }

  .el-breadcrumb__inner a,
  .el-breadcrumb__inner.is-link {
    &:hover {
      color: var(--el-color-primary);
    }
  }

  .el-breadcrumb__item:last-child span {
    color: $breadcrumb-color-text-last;
    font-weight: 500;
  }
}

/* breadcrumb transition */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all .5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
@media only screen and (max-width: 768px){
  .app-breadcrumb{
    display: none !important;
  }
}

</style>
