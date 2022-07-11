import { computed } from 'vue';
import { ITableColumnsItem } from '@/components/tgo-table/package/type';
import { filters } from '@/core/plugins/filter';
import {
  IPaybackPageResListItem,
} from '@/modules/financial-manage/collection-voucher/api/type';

export const useColumns = () => {
  const columns = computed<ITableColumnsItem<IPaybackPageResListItem>[]>(() => [
    {
      label: '客户名称',
      minWidth: '200',
      render: row => (
        <div>
          <div>{row?.customerName}</div>
          <div>{row?.paybackCode}</div>
        </div>
      ),
    },
    {
      label: '回款金额',
      minWidth: '150',
      render: row => (
        <div>{row?.paybackAmount}</div>
      ),
    },
    {
      label: '回款凭证',
      minWidth: '150',
      render: row => (
        <div>
          {row?.paybackProofs!.length > 0 && <el-image
            style="width: 100px; height: 100px"
            src={row?.paybackProofs?.[0]?.url}
            preview-src-list={row?.paybackProofs?.map(info => info.url)}
            preview-teleported
            fit="cover"
          />}
        </div>
      ),
    },
    {
      label: '回款日期',
      minWidth: '180',
      render: row => (
        <div>{filters.formatTime(row.paybackDate!, 'yyyy-MM-DD')}</div>
      ),
    },
    {
      label: '收款账户',
      minWidth: '200',
      render: row => (
        <div>
          <div>{row?.accountName}</div>
          <div>{row?.bankAccountNumber}</div>
          <div>{row?.bankName}</div>
        </div>
      ),
    },
    {
      label: '所属BD',
      minWidth: '100',
      render: row => (
        <div>
          <span>{row?.bdName}</span>
          {row?.regionName && <span>[{row?.regionName}]</span>}
        </div>
      ),
    },
    {
      label: '所属部门',
      minWidth: '180',
      render: row => (
        <div>{row?.orgName}</div>
      ),
    },
    {
      label: '创建信息',
      minWidth: '200',
      render: row => (
        <div>
          <div>{row?.creatorName}</div>
          <div>{filters.formatTime(row.createdTime!)}</div>
        </div>
      ),
    },
  ]);
  return {
    columns,
  };
};
