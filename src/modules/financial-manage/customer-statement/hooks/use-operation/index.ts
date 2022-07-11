import { ref } from 'vue';
import { getCustomerStatementDetail } from '../../api';
import { IStatementListItem, IStatementData } from './type';

export const useOperation = () => {
  const bill = ref({
    details: [] as IStatementListItem[],
  } as IStatementData); // 账单明细

  // 请求账单明细
  const fetchBill = async (billId: string) => {
    try {
      const { data } = await getCustomerStatementDetail({
        billId,
      });
      const m = new Map();
      const details = data.details.map((item) => {
        let groupSize = 0;
        if (!m.has(item.manufacturingOrderCode)) {
          m.set(item.manufacturingOrderCode, 1);
          groupSize = data.details.filter(
            sItem => sItem.manufacturingOrderCode === item.manufacturingOrderCode,
          ).length;
        }
        return {
          ...item,
          groupSize,
        };
      });
      bill.value = {
        ...data,
        collectingAccount: data.collectingAccount ? `${data.collectingAccount}-客户对账单` : '客户对账单',
        details,
      };
    } catch (error) {
      console.log(error);
    }
  };

  return {
    bill,
    fetchBill,
  };
};
