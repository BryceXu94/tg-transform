import { BAR_DATE_ENUM } from '../constant';
import dayjs from 'dayjs';

/**
 * 获取时间区间的开始结束时间
 */
export const getDateRange = (type: BAR_DATE_ENUM) => {
  const today = dayjs();
  let formerSt: null|dayjs.Dayjs = today;
  let formerEt: null|dayjs.Dayjs = today;
  let latterSt: null|dayjs.Dayjs = today;
  let latterEt: null|dayjs.Dayjs = today;
  switch (type) {
    case BAR_DATE_ENUM.WEEK: {
      if (today.day() === 0) {
        latterSt = today
          .add(-6, 'day')
          .startOf('day');
        latterEt = today.endOf('day');
      } else {
        latterSt = today
          .startOf('week')
          .add(1, 'day')
          .startOf('day');
        latterEt = today
          .endOf('week')
          .add(1, 'day')
          .endOf('day');
      }
      formerSt = latterSt.add(-1, 'week');
      formerEt = latterEt.add(-1, 'week');
      break;
    }
    case BAR_DATE_ENUM.MONTH:
      latterSt = today
        .startOf('month')
        .startOf('month')
        .startOf('day');
      latterEt = today
        .endOf('month')
        .endOf('month')
        .endOf('day');
      formerSt = latterSt
        .add(-1, 'month')
        .startOf('month')
        .startOf('day');
      formerEt = latterEt
        .add(-1, 'month')
        .endOf('month')
        .endOf('day');
      break;
    case BAR_DATE_ENUM.CUSTOM:
    default:
      latterSt = null;
      latterEt = null;
      formerSt = null;
      formerEt = null;
      break;
  }
  return {
    formerDate: [
      formerSt?.format('YYYY-MM-DD') || '',
      formerEt?.format('YYYY-MM-DD') || '',
    ],
    latterDate: [
      latterSt?.format('YYYY-MM-DD') || '',
      latterEt?.format('YYYY-MM-DD') || '',
    ],
  };
};
