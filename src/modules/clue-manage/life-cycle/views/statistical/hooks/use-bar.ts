/**
 * 柱状对比图hook
 */
import { ref, computed, Ref } from 'vue';
import { getCluesLifeCycleBarData, getRecordLifeCycleBarData } from '@/modules/clue-manage/life-cycle/api';
import { IBarParams, IBarDataItem } from '../type';
import { BAR_DATE_ENUM, DIMENSION_ENUM } from '../constant';
import { getDateRange } from '../utils/date';
import { ElForm, ElMessage, FormItemRule } from 'element-plus';
import dayjs from 'dayjs';
import { isEmpty } from '@tiangong/utils';
import { plus } from 'number-precision';

export const useBar = (
  curTab: Ref<DIMENSION_ENUM>,
) => {
  // 表单实例
  const barFormEl = ref<InstanceType<typeof ElForm>>();
  // 当前选中的日期对比维度
  const dateEnum = ref(BAR_DATE_ENUM.MONTH);
  // 柱状图数据
  const barData = ref<IBarDataItem[]>([]);
  // 请求参数
  const barParams = ref<IBarParams>({
    isManager: false,
    userIds: [],
    formerDate: getDateRange(BAR_DATE_ENUM.MONTH).formerDate,
    latterDate: getDateRange(BAR_DATE_ENUM.MONTH).latterDate,
  });
  // 改变选中日期对比维度
  const handleChangeDateEnum = (val: BAR_DATE_ENUM) => {
    const {
      formerDate,
      latterDate,
    } = getDateRange(val);
    barParams.value.formerDate = formerDate;
    barParams.value.latterDate = latterDate;
    dateEnum.value = val;
  };
  const barRules = computed(() => {
    return {
      formerDate: [
        {
          validator: (_rules, value = ['', ''], cb) => {
            const [st, et] = value;
            if (isEmpty(st) || isEmpty(et)) {
              cb('开始时间不能为空');
            } else {
              cb();
            }
          },
        },
      ] as FormItemRule[],
      latterDate: [
        {
          validator: (_rules, value = [], cb) => {
            const [st, et] = value;
            if (isEmpty(st) || isEmpty(et)) {
              cb('结束时间不能为空');
            } else {
              cb();
            }
          },
        },
      ] as FormItemRule[],
    };
  });
  // 获取数据
  const getBarData = async () => {
    try {
      await barFormEl.value?.validate();
      if (dateEnum.value === BAR_DATE_ENUM.CUSTOM
          && JSON.stringify(barParams.value.formerDate) === JSON.stringify(barParams.value.latterDate)
      ) {
        ElMessage.warning('开始结束的日期区间不能相同');
        throw new Error('开始结束的日期区间不能相同');
      }
      let api = getCluesLifeCycleBarData;
      switch (curTab.value) {
        case DIMENSION_ENUM.CLUES:
          api = getCluesLifeCycleBarData;
          break;
        case DIMENSION_ENUM.RECORD:
          api = getRecordLifeCycleBarData;
          break;
        default:
          break;
      }
      const [formerBeginDate, formerEndDate] = barParams.value.formerDate;
      const [latterBeginDate, latterEndDate] = barParams.value.latterDate;
      const { data } = await api({
        userIds: barParams.value.userIds,
        isManager: barParams.value.isManager,
        formerBeginDate,
        formerEndDate,
        latterBeginDate,
        latterEndDate,
      });
      const formerData: IBarDataItem = {
        date: `${dayjs(formerBeginDate).format('YYYY/MM/DD')} ~ ${dayjs(formerEndDate).format('YYYY/MM/DD')}`,
        data: [],
      };
      const latterData: IBarDataItem = {
        date: `${dayjs(latterBeginDate).format('YYYY/MM/DD')} ~ ${dayjs(latterEndDate).format('YYYY/MM/DD')}`,
        data: [],
      };
      data.lifeCycleList.forEach((v) => {
        formerData.data.push({
          label: v.lifeCycleStepDesc,
          value: v.formerList.reduce((total, current) => plus(total, Number(current.count)), 0),
          detail: v.formerList.map(it => ({
            value: Number(it.count),
            label: it.desc,
          })),
        });
        latterData.data.push({
          label: v.lifeCycleStepDesc,
          value: v.latterList.reduce((total, current) => plus(total, Number(current.count)), 0),
          detail: v.latterList.map(it => ({
            value: Number(it.count),
            label: it.desc,
          })),
        });
      });
      barData.value = [
        formerData,
        latterData,
      ];
    } catch (error) {
      barData.value = [];
      console.log('获取饼图失败', error);
    }
  };
  return {
    getBarData,
    barRules,
    barFormEl,
    handleChangeDateEnum,
    dateEnum,
    barParams,
    barData,
  };
};
