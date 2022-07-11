import { computed } from 'vue';
import { ITableColumnsItem } from '@/components/tgo-table/package/type';
import {
  IContractArchivesPageResListItem,
} from '../../api/type';
import { filters } from '@/core/plugins/filter';
import { CONTRACT_STATE_LIST } from '../../constant';

export const useColumns = (
  handlePreview: (url: string[]) => void,
  handleDownLoad: (url: string[], name: string) => void,
  CAN__PREVIEW_CONTRACT: boolean,
  CAN__DOWNLOAD_CONTRACT: boolean,
) => {
  const columns = computed<ITableColumnsItem<IContractArchivesPageResListItem>[]>(() => {
    return [
      {
        label: '合同编号',
        minWidth: '200',
        render: row => (
          <div>
            {row.contractCode}
          </div>
        ),
      },
      {
        label: '合同对象',
        minWidth: '270',
        render: row => (
          <div>
            <div>甲方：{row?.firstParty}</div>
            <div>乙方：{row?.secondParty}</div>
          </div>
        ),
      },
      {
        label: '单据编号',
        minWidth: '220',
        render: row => (
          <div>
            <div>平台单号: {row?.platformOrderCode}</div>
            <div>需求单号: {row?.demandCode}</div>
          </div>
        ),
      },
      {
        label: '状态',
        minWidth: '150',
        render: row => (
          <div>
            {filters.getEnumLabel(CONTRACT_STATE_LIST, row.contractState!)}
          </div>
        ),
      },
      {
        label: '操作',
        minWidth: '180',
        fixed: 'right',
        render: row => (
          <>
            {!!row.contractUrlList?.length && <div>
                {CAN__PREVIEW_CONTRACT
                  && <el-button
                    type="text"
                    class="margin-right-10"
                    onClick={() => handlePreview(row.contractUrlList!)}
                  >预览合同</el-button>
                }
                {CAN__DOWNLOAD_CONTRACT
                  && <el-button
                    type="text"
                    onClick={() => handleDownLoad(row.contractUrlList!, row.contractName!)}
                  >下载合同</el-button>
                }
              </div>
            }
          </>
        ),
      },
    ];
  });
  return {
    columns,
  };
};
