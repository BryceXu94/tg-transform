import { ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import {
  activeClue,
} from '@/modules/clue-manage/customer-clue/api';
import {
  ITrackItem,
} from './type';
import { useMenuStore } from '@/store/menu';

export const useOperation = (props:{
  reloadFn: () => void;
}) => {
  const { deleteKeepAlive } = useMenuStore();
  // 当前选中的线索
  const selectedTracks = ref<ITrackItem[]>([]);
  // 审核线索弹窗
  const auditModalConfig = ref({
    visible: false,
    tracks: [] as ITrackItem[],
  });
  // 审核线索
  const handleAuditTrack = (tracks: ITrackItem[]) => {
    auditModalConfig.value.visible = true;
    auditModalConfig.value.tracks = tracks;
  };
  // 激活线索
  const handleActiveTrack = async (trackId: string, needLoadList: boolean = false) => {
    const { reloadFn } = props;
    await ElMessageBox.confirm(
      '请确认线索是否需要激活？激活后可重新编辑与提交至审核',
      '激活线索',
    );
    await activeClue({
      trackId,
    });
    if (needLoadList) {
      deleteKeepAlive('ClueManageCustomerClueList');
    }
    reloadFn?.();
  };
  return {
    handleActiveTrack,
    selectedTracks,
    auditModalConfig,
    handleAuditTrack,
  };
};
