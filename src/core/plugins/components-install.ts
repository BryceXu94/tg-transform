import { App } from 'vue';

import AppPage from '@/components/app-page';
import AddressPicker from '@/components/address-picker';
import Pagination from '@/components/pagination';
import Upload from '@/components/upload/index';
import ConditionSelect from '@/components/condition-select';
import ResponsiveRow from '@/components/responsive-row';
import InputNumber from '@/components/input-number';
import InputNumberRanger from '@/components/input-number-ranger';
import CustomTable from '@/components/custom-table';
import QuerySelect from '@/components/query-select';
import Empty from '@/components/empty';
import Editor from '@/components/editor';
import Tabs from '@/components/tabs';
import SearchArea from '@/components/search-area';
import HeaderArea from '@/components/header-area';
import DetailTitle from '@/components/detail-title';
import SubmitTipsDialog from '@/components/submit-tips-dialog';
import CopyText from '@/components/copy-text';
import CustomLogs from '@/components/custom-logs';
import Encryption from '@/components/encryption';
import TgoTable from '@/components/tgo-table';
import StatusLabel from '@/components/status-label';

export default function componentsInstall(app: App) {
  app.use(AppPage);
  app.use(AddressPicker);
  app.use(TgoTable);
  app.use(Pagination);
  app.use(ConditionSelect);
  app.use(Upload);
  app.use(InputNumber);
  app.use(InputNumberRanger);
  app.use(ResponsiveRow);
  app.use(CustomTable);
  app.use(QuerySelect);
  app.use(Editor);
  app.use(Empty);
  app.use(Tabs);
  app.use(SearchArea);
  app.use(HeaderArea);
  app.use(DetailTitle);
  app.use(SubmitTipsDialog);
  app.use(CopyText);
  app.use(CustomLogs);
  app.use(Encryption);
  app.use(StatusLabel);
}
