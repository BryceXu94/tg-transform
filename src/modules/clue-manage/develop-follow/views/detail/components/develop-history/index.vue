<template>
  <div class="develop-history">
    <div class="develop-history__header">
      <detail-title title="线索开发历程" />
    </div>
    <div class="develop-history__content">
      <custom-logs
        ref="logRef"
        :request="getHistory"
        :requestParams="{devId}"
        :config="developHistoryConfig"
        :initialize="false"
        :showFilterBar="true"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { getHistory } from '@/modules/clue-manage/develop-follow/api';
import { IGetHistoryListResItem } from '@/modules/clue-manage/develop-follow/api/types';
import CustomLogs from '@/components/custom-logs';
import { useDictionary } from '@/hooks/use-dictionary/';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { getLabelByVal } from '@/core/plugins/filter';
import { YES_OR_NO_NUMBER_ENUM } from '@/constant/global';
import { DEVELOP_STATE_ENUM } from '@/modules/clue-manage/develop-follow/constant';

export default defineComponent({
  props: {
    devId: {
      type: String,
      required: true,
      default: '',
    },
  },
  setup() {
    const { getDictionaryOptions } = useDictionary();
    // 线索开发情况
    const CRM_CLUE_DEVELOPMENT = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_CLUE_DEVELOPMENT) || [];
    });
    // 线索无效原因
    const CRM_CLUE_INVALID = computed(() => {
      return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_CLUE_INVALID) || [];
    });

    const logRef = ref<InstanceType<typeof CustomLogs> | null>(null);

    const getDevelopHistory = () => {
      // const res = await getHistory({
      //   devId: developDetail.value.devId,
      //   bdIdList: [],
      // });
      logRef.value?.getLogs();
    };

    return {
      logRef,
      developHistoryConfig: {
        listKey: 'data',
        timeKey: 'createdTime',
        userKey: 'creatorName',
        contentKey: 'devContent',
        remarkKey: 'remark',
        customizeFormatContent: (item: IGetHistoryListResItem) => {
          const { devState, devVisitCode } = item;
          let { devSpeed } = item;
          if (DEVELOP_STATE_ENUM.IN_DEVELOP === devState && devVisitCode === YES_OR_NO_NUMBER_ENUM.NO) {
            devSpeed = getLabelByVal(CRM_CLUE_DEVELOPMENT.value, devSpeed);
          } if (DEVELOP_STATE_ENUM.INVALID === devState) {
            devSpeed = getLabelByVal(CRM_CLUE_INVALID.value, devSpeed);
          }
          return `${item.devContent}${devSpeed}`;
        },
      },
      getHistory,
      getDevelopHistory,
    };
  },
});
</script>

<style lang="scss" scoped>
.develop-history {
  margin-top: 8px;
  &__header {
    padding: 0 20px;
  }
  &__content {
    padding: 0 20px;
  }
}
</style>
