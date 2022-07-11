/**
 * 漏斗图hook
 */
import { ref, Ref } from 'vue';
import {
  getCluesLifeCycleFunnelData,
  getRecordLifeCycleFunnelData,
} from '@/modules/clue-manage/life-cycle/api';
import { IFunnelParams, IFunnelDataItem } from '../type';
import { DIMENSION_ENUM } from '../constant';
import { divide, times } from 'number-precision';

export const useFunnel = (
  curTab: Ref<DIMENSION_ENUM>,
) => {
  // 漏斗图数据
  const funnelData = ref<IFunnelDataItem[]>([]);
  // 请求参数
  const funnelParams = ref<IFunnelParams>({
    isManager: false,
    userIds: [],
    date: ['', ''],
    cascader: [],
  });
  // 获取数据
  const getFunnelData = async () => {
    try {
      let api = getCluesLifeCycleFunnelData;
      switch (curTab.value) {
        case DIMENSION_ENUM.CLUES:
          api = getCluesLifeCycleFunnelData;
          break;
        case DIMENSION_ENUM.RECORD:
          api = getRecordLifeCycleFunnelData;
          break;
        default:
          break;
      }
      const [beginDate = '', endDate = ''] = funnelParams.value.date ?? [];
      const { data } = await api({
        userIds: funnelParams.value.userIds,
        isManager: funnelParams.value.isManager,
        beginDate,
        endDate,
      });
      funnelData.value = data.lifeCycleModelList.map((v, i) => {
        let rate = 100;
        if (i !== 0) {
          if (Number(data.lifeCycleModelList[i - 1].totalCount) === 0) {
            rate = 0;
          } else {
            rate = divide(
              Math.floor(
                times(
                  divide(Number(v.totalCount), Number(data.lifeCycleModelList[i - 1].totalCount)),
                  100,
                  100,
                ),
              ),
              100,
            );
          }
        }
        return {
          value: v.totalCount,
          label: v.lifeCycleStepDesc,
          rate,
          detail: v.lifeCycleDetailList.map(it => ({
            value: Number(it.count),
            label: it.desc,
          })),
        };
      });
    } catch (error) {
      funnelData.value = [];
      console.log('获取漏斗图数据失败', error);
    }
  };
  // 选择数据维度
  const handleChangeCascader = (val: Array<string[]> | null) => {
    if (!val) {
      funnelParams.value.userIds = [];
    } else {
      funnelParams.value.userIds = val.reduce((arr, current) => {
        const [,, bdId] = current;
        return arr.concat([bdId]);
      }, []);
    }
  };
  return {
    handleChangeCascader,
    funnelData,
    funnelParams,
    getFunnelData,
  };
};
