<template>
  <div class="header">
    <div class="system_info">
      <img
        class="logo"
        :src="IconLogo"
      />
      <div class="name">{{systemName}}</div>
      <div class="split" />
    </div>
    <div class="main">
      <div class="hamburger">
        <!-- 面包屑 -->
        <template v-if="pageHeader.length > 0">
          <breadcrumb
            v-if="pageHeader.includes('breadcrumb')"
            class="app-breadcrumb hide-in-mobile"
          />
        </template>
      </div>
      <div class="user_info">
        <el-tooltip
          effect="dark"
          content="全屏"
          placement="bottom"
        >
          <span class="action action-fullscreen">
            <fullscreen />
          </span>
        </el-tooltip>

        <!-- 账户操作 -->
        <div class="action">
          <el-dropdown
            class="action-button"
            trigger="hover"
            placement="top"
          >
            <div class="action-button-inner">
              <img
                class="avatar"
                :src="IconAvatar"
              />
              <span class="name">
                {{ accountData?.userName || '-' }}
                <span v-if="accountData?.bbCode">
                  {{`（${accountData.bbCode}）`}}
                </span>
              </span>
            </div>
            <template #dropdown>
              <el-dropdown-menu
                placement="bottom-end"
              >
                <slot name="dropdown-menu"></slot>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import IconAvatar from '@/assets/avatar.png';
// import Hamburger from './components/hamburger/index.vue';
import Fullscreen from './components/fullscreen/index.vue';
import Breadcrumb from './components/breadcrumb/index.vue';
import IconLogo from '@/assets/logo1.png';

const PAGE_HEADER = ['breadcrumb'];

interface IAccountData {
  account?: string;
  avatar?: string;
  userName?: string;
  // 旧百布的bbCode
  bbCode?: string;
}

export default defineComponent({
  name: 'AppHeader',
  emits: ['toggle-sidebar'],
  components: {
    Fullscreen,
    Breadcrumb,
  },
  props: {
    systemName: {
      type: String,
      default: '云版房',
    },
    accountData: {
      type: Object as PropType<IAccountData>,
      default: () => ({}),
    },
    opened: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const handleToggleSideBar = () => {
      emit('toggle-sidebar');
    };

    return {
      handleToggleSideBar,
      // 页面头部需要显示的内容
      pageHeader: PAGE_HEADER,
      IconAvatar,
      IconLogo,
    };
  },
});
</script>

<style lang="scss" scoped>
.header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 200;
  height: $app-header-height;
  border-bottom: 1px solid #EBEDF5;
  background: #fff url(~@/assets/nav_bg.png) right center no-repeat;
  background-size: 640px 64px;
  .system_info{
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 24px;
    flex-shrink: 1;
    .logo{
      width: 42px;
      height: 42px;
    }
    .split{
      margin: 0 24px;
      border-left: 1px solid #EBEDF5;
      height: 24px;
    }
    .name{
      font-size: 16px;
      color: #18181A;
      font-weight: 600;
      padding-left: 10px;
    }
  }
  .main{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    height: 100%;

    .user_info{
      display: flex;
      align-items: center;
    }
  }
}
.action {
  padding: 0 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.25s;

  &-button {
    cursor: pointer;
    position: relative;
    font-size: 22px;
    top: 0;
    color: #808080;
    height: $app-header-height;
    display: flex;
    justify-content: center;
    align-items: center;

    &-inner {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .name {
    font-size: 14px;
    margin-left: 12px;
    line-height: 22px;
    color: #606166;
  }

  .avatar {
    display: block;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
  }
  .el-badge {
    line-height: normal;
    position: relative;
    top: -3px;
  }
}
</style>
