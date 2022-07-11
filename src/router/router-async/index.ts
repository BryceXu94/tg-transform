import customer from '@/modules/customer/router';
import TabaleManage from '@/modules/report-forms-manage/router';
import CustomerManage from '@/modules/customer-manage/router';
import ApprovalManage from '@/modules/approval-manage/router';
import FinancialManage from '@/modules/financial-manage/router';
import SalesManage from '@/modules/sales-manage/router';
import CustomerFollow from '@/modules/customer-follow/router';
import TenantManage from '@/modules/tenant-manage/router';
import DemandManage from '@/modules/demand-manage/router';
import DataWarehouseBi from '@/modules/data-warehouse-bi/router';
import CustomerBoard from '@/modules/customer-board/router';
import ClueManage from '@/modules/clue-manage/router';
import ConfigurationManage from '@/modules/configuration-manage/router';
import SystemConfiguration from '@/modules/system-configuration/router';
import ContractManage from '@/modules/contract-manage/router';

export default [
  ...customer,
  ...TabaleManage,
  ...CustomerManage,
  ...ApprovalManage,
  ...FinancialManage,
  ...SalesManage,
  ...CustomerFollow,
  ...TenantManage,
  ...DemandManage,
  ...DataWarehouseBi,
  ...CustomerBoard,
  ...ClueManage,
  ...ConfigurationManage,
  ...SystemConfiguration,
  ...ContractManage,
];
