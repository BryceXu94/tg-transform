<!--
 * @Descripttion: 操作日志-抽屉
 * @Author: weitongxue
-->
<template>
  <div class="padding-left-20 padding-right-20">
    <el-form
      v-if="showFilterBar && list.length"
      class="filter-bar"
    >
      <el-form-item label="操作人员：" class="filter-bar-item">
        <el-checkbox-group
          v-model="selectedUserIds"
        >
          <el-checkbox
            v-for="item in users"
            :key="item.userId"
            :label="item.userId"
          >{{item.user}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <el-timeline v-if="logs.length">
      <el-timeline-item
        v-for="(item, index) in logs"
        :key="index"
        :timestamp="item.time"
        placement="top"
        :color="getColor(index)"
      >
        <div class="line-height-20">
          {{ item.user }}
          <div
            v-if="item.content"
            style="line-height: 1.5em;"
            class="margin-top-5"
          >
            {{item.content}}
          </div>
          <div
            v-if="item.remark"
            style="line-height: 1.5em;"
            class="margin-top-5 operation-drawer-remark"
          >
            {{item.remark}}
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
    <empty v-else />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import { get } from 'lodash-es';
import { formatTime } from '@tiangong/utils';
import { filters } from '@/core/plugins/filter';
import { IRequestConfig, IListItem, IUsersItem } from './type.d';

export default defineComponent({
  name: 'CustomLogs',
  props: {
    /** 接口 */
    request: {
      type: Function,
      default: () => {},
    },
    config: {
      type: Object as PropType<IRequestConfig>,
      default: () => ({}),
    },
    requestParams: {
      type: [Object, String],
    },
    isAscending: {
      type: Boolean,
      default: false,
    },
    initialize: {
      type: Boolean,
      default: true,
    },
    showFilterBar: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const selectedUserIds = ref<string[]>([]);
    const users = ref<IUsersItem[]>([]);
    const list = ref<IListItem[]>([]);
    const init = async () => {
      const { config } = props;
      const res = await props.request(props.requestParams);
      const { timeKey, userKey, contentKey, remarkKey, operateList, userIdKey, customizeFormatContent } = {
        timeKey: 'time',
        userKey: 'user',
        contentKey: 'content',
        remarkKey: 'remark',
        userIdKey: 'userId',
        ...config,
      };
      list.value = get(res, config.listKey! || 'data')?.map((item: any) => {
        return {
          time: typeof (item[timeKey]) === 'number' ? formatTime(item[timeKey]) : item[timeKey],
          user: item[userKey],
          userId: item[userIdKey] || item[userKey],
          // eslint-disable-next-line no-nested-ternary
          content: customizeFormatContent ? customizeFormatContent(item)
            : (operateList ? filters.getEnumLabel(operateList, item[contentKey]) : item[contentKey]),
          remark: item[remarkKey] ?? '',
        };
      }) || [];
      users.value = list.value.reduce<IUsersItem[]>((arr, current) => {
        if (arr.some(it => it.userId === current.userId)) {
          return arr;
        }
        return [
          ...arr,
          {
            user: current.user,
            userId: current.userId,
          },
        ];
      }, []);
      selectedUserIds.value = users.value.map(v => v.userId);
    };

    if (props.initialize) {
      init();
    }

    const getColor = (idx: number) => {
      if (props.isAscending) {
        return idx === list.value.length - 1 ? '#4974F5' : '#cccccc';
      }
      return idx === 0 ? '#4974F5' : '#cccccc';
    };
    const logs = computed(() => {
      const { showFilterBar } = props;
      if (showFilterBar) {
        return list.value.filter(v => selectedUserIds.value.includes(v.userId));
      }
      return list.value;
    });
    return {
      logs,
      selectedUserIds,
      users,
      list,
      getColor,
      getLogs: init,
    };
  },
});
</script>

<style scoped lang="scss">
.filter-bar {
  display: flex;
  justify-content: flex-end;
  &-item {
    max-width: 60%;
  }
}
.operation-drawer-remark {
  background-color: #eee;
  padding: 10px;
  border-radius: 2px;
}
</style>
