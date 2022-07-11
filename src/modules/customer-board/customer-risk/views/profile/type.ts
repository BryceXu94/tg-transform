import {
  RISK_LEVEL_ENUM,
  RISK_STATE_ENUM,
} from '@/modules/customer-board/customer-risk/constant';

export * from '@/modules/customer-board/customer-risk/api/types';

export { IPermissionItem } from '@/hooks/use-permission-list/type';

export type IPieChartData = {
  data: { value: string;};
  config: {
    title: string;
    titleColor: string;
    pieColor: string;

    desc: string;
    riskLevel: RISK_LEVEL_ENUM;
    className: string;
  };
};

export type IBarChartData = {
  name: string;
  data: string[];
};

export type IQueryParams = {
  riskLevel?: RISK_LEVEL_ENUM;
  riskTrend?: RISK_STATE_ENUM;
  updateStartDate?: string;
  updateEndDate?: string;
};
