<script lang="tsx">
import { TgMain, TgHeader, TgFooter } from "@tiangong/components";
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { getColStyle, getColClassList } from "./utils";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
export default defineComponent({
  name: "AppPage",
  props: {
    mainBg: {
      type: String,
      default: "#fff",
    },
    laside: {
      type: Object,

      default() {
        return {};
      },
    },
    raside: {
      type: Object,

      default() {
        return {};
      },
    },
    fheader: {
      type: Object,

      default() {
        return {};
      },
    },
  },

  setup() {
    const contentHeight = ref(0);
    const collapse = ref(false);
    const contentMainRef = ref<typeof TgMain | null>(null);
    const contentHeaderRef = ref<typeof TgHeader | null>(null);
    const contentFooterRef = ref<typeof TgFooter | null>(null);
    const contentWrapperRef = ref<typeof TgMain | null>(null);

    const computedContentHeight = () => {
      if (contentMainRef.value) {
        const { clientHeight } = contentMainRef.value.$el;
        let headerHeight = 0;
        let footerHeight = 0;

        if (contentHeaderRef.value) {
          headerHeight = parseInt(
            getComputedStyle(contentHeaderRef.value?.$el)?.height,
            10
          );
        }

        if (contentFooterRef.value) {
          footerHeight = parseInt(
            getComputedStyle(contentFooterRef.value?.$el)?.height,
            10
          );
        }

        contentHeight.value = clientHeight - headerHeight - footerHeight - 1;
      }
    };

    let timer: number | null = null;

    const windowResizeCallBack = () => {
      if (timer) return;
      timer = window.setTimeout(() => {
        timer = null;
        computedContentHeight();
      }, 200);
    };

    onMounted(() => {
      computedContentHeight();
      window.addEventListener("resize", windowResizeCallBack, false);
    });
    onUnmounted(() => {
      window.removeEventListener("resize", windowResizeCallBack, false);
    });
    return {
      contentHeight,
      collapse,
      contentMainRef,
      contentHeaderRef,
      contentWrapperRef,
      contentFooterRef,
      computedContentHeight,
      windowResizeCallBack,
    };
  },

  render() {
    const renderCollapse = () => {
      const { showCollapse } = this.fheader;
      return (
        <tg-button
          v-show={showCollapse}
          type="text"
          onClick={() => {
            this.collapse = !this.collapse;
            this.windowResizeCallBack();
          }}
        >
          {this.collapse ? "收起" : "展开"}
          <tg-icon class="margin-left-5">
            {this.collapse ? <ArrowUp /> : <ArrowDown />}
          </tg-icon>
        </tg-button>
      );
    }; // 渲染固定头部

    const renderFHeader = () => {
      const { row = {}, col } = this.fheader;
      const fheaderVNode = this.$slots.fheader?.({
        collapse: this.collapse,
      });

      if (fheaderVNode instanceof Array) {
        fheaderVNode.forEach((vNodeItem: any) => {
          const vNodeChildKeys = Object.keys(vNodeItem.children || {});

          if (vNodeItem.type?.name === "ElForm") {
            vNodeChildKeys.forEach((key) => {
              const _renderFunc = vNodeItem.children[key];

              if (typeof _renderFunc !== "function") {
                return;
              }

              vNodeItem.children[key] = function renderDef() {
                const children = _renderFunc(); // 给row的数据

                const rowPropsData = {
                  gutter: 10,
                  ...row,
                };

                const _renderChild = () => {
                  // 这块处理展开按钮
                  {
                    const _getShowCollapseVNode = (vNode: any) => {
                      const childs = vNode.children.default();

                      vNode.children.default = () => {
                        return [...childs, renderCollapse()];
                      };

                      return vNode;
                    };

                    let len = children?.length || 0;

                    while (len > 0) {
                      len -= 1;
                      const lastElFormItemChild = children[len];

                      if (
                        lastElFormItemChild?.type?.componentName ===
                          "ElFormItem" && // 保证最后一个form-item可被正确渲染
                        typeof lastElFormItemChild?.children?.default ===
                          "function"
                      ) {
                        _getShowCollapseVNode(lastElFormItemChild);

                        break;
                      }
                    }
                  }
                  const colClass = getColClassList(
                    col || {
                      xs: 24,
                      sm: 12,
                      md: 12,
                      lg: 8,
                      xl: 8,
                    },
                    rowPropsData
                  );
                  const colStyle = getColStyle(rowPropsData);
                  return children.map((vNode: any) => {
                    return vNode?.type?.componentName !== "ElFormItem" ? (
                      vNode
                    ) : (
                      <div class={["el-col", colClass]} style={colStyle}>
                        {vNode}
                      </div>
                    );
                  });
                };

                return [<tg-row {...rowPropsData}>{_renderChild()}</tg-row>];
              };
            });
          }
        });
      }

      return (
        <tg-header class="page-fixed-header" v-show={!!fheaderVNode}>
          {
            /**
             * 保证vue node节点插入
             */
            fheaderVNode || <div></div>
          }
        </tg-header>
      );
    }; // render Main header

    const renderMainHeader = () => {
      if (!this.$slots.header) return null;
      this.windowResizeCallBack();
      return (
        <tg-header class="page-main-header" ref="contentHeaderRef">
          {this.$slots.header()}
        </tg-header>
      );
    }; // 渲染主要内容区域

    const renderMain = () => {
      return (
        <tg-main
          class="page-content"
          ref="contentWrapperRef"
          style={{
            backgroundColor: this.mainBg,
          }}
        >
          {this.$slots.main && (
            <tg-main ref="contentMainRef" class="page-main">
              {renderMainHeader()}
              {this.$slots.main({
                height: this?.contentHeight || 0,
              })}
              {this.$slots.footer && (
                <tg-footer class="page-footer" ref="contentFooterRef">
                  {this.$slots.footer()}
                </tg-footer>
              )}
            </tg-main>
          )}
        </tg-main>
      );
    }; // 渲染固定底部

    const renderFFooter = () => {
      if (!this.$slots.ffooter) return null;
      return (
        <tg-footer class="page-fixed-footer">{this.$slots.ffooter()}</tg-footer>
      );
    }; // 渲染左侧边栏

    const renderLAside = () => {
      if (!this.$slots.laside) return null;
      const laside = this.laside || {};
      return (
        <tg-aside class="page-left-aside" {...laside}>
          {this.$slots.laside()}
        </tg-aside>
      );
    }; // 渲染右侧边栏

    const renderRAside = () => {
      if (!this.$slots.raside) return null;
      const raside = this.raside || {};
      return (
        <tg-aside class="page-right-aside" {...raside}>
          {this.$slots.raside()}
        </tg-aside>
      );
    };

    return (
      <div class="app-page" style="height:calc(100vh - 112px);">
        {this.$slots.default && this.$slots.default()}
        <tg-container>
          {renderLAside()}
          <tg-container class="page-center-container" direction="vertical">
            {renderFHeader()}
            {renderMain()}
            {renderFFooter()}
          </tg-container>
          {renderRAside()}
        </tg-container>
      </div>
    );
  },
});
</script>

<style lang="scss" scoped>
.app-page {
  overflow-x: auto;

  :deep(.el-card__body) {
    height: 100%;
    padding: 0;
  }

  :deep(.el-container) {
    height: 100%;
  }

  :deep(.el-header, .el-footer) {
    height: auto !important;
    padding: 0;
  }

  :deep(.el-main) {
    padding: 0;
  }

  .page-left-aside {
    padding: 15px;
    overflow-x: hidden;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.15);
  }
  .page-center-container {
    width: auto;
  }
  .page-right-aside {
    padding: 15px;
    overflow-x: hidden;
    box-shadow: -2px 0 6px rgba(0, 21, 41, 0.15);
  }
  .page-fixed-header {
    position: relative;
    height: auto !important;
    padding: 15px 10px 0;
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 12px;
    :deep(.el-form) {
      width: 100%;
    }

    :deep(.el-form-item) {
      margin-bottom: 15px;

      &.label-hidden {
        .el-form-item__label {
          display: none;
        }
        .el-form-item__content {
          margin-left: 0 !important;
        }
      }
    }

    :deep(.el-date-editor, .el-select) {
      width: 100%;
    }

    .page-fixed-header-collapse {
      display: flex;
      align-items: center;
      position: absolute;
      z-index: 1;
      left: 50%;
      bottom: -24px;
      transform: translateX(-50%);
      font-size: 14px;
      padding: 5px 20px;
      color: #606266;
      background: #fff;
      border-radius: 0 0 4px 4px;
      box-shadow: 0 5px 6px rgba(0, 21, 41, 0.1);
      user-select: none;
      cursor: pointer;
      [class^="el-icon-"] {
        font-size: 14px;
        font-weight: 600;
        margin-left: 3px;
        color: #606266;
      }
    }
  }
  .page-fixed-footer {
    background-color: #fff;
    height: auto !important;
    overflow-x: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px 10px;
    margin-top: 8px;
    // box-shadow: 0 -2px 6px rgba(0, 21, 41, 0.15);
    border-radius: 4px;

    :deep(.el-paginatio) {
      white-space: nowrap;
      margin-left: 30px;
    }
  }
  .page-content {
    height: 100%;
    padding: 16px 24px;
    border-radius: 4px;
    .page-main {
      height: 100%;
      &-header {
        padding-bottom: 16px;
      }
    }
    .page-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0;
    }
  }
}
</style>
