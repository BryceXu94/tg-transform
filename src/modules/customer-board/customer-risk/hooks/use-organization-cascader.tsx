import { ref, Ref } from 'vue';
import { getUserOrgOptions } from '@/api/global';

export interface ICascaderOptionItem {
  value: string;
  label: string;
  children?: ICascaderOptionItem[];
}

const useOrganizationCascader = (params: Ref<any>, cascaderOption: Ref<ICascaderOptionItem[]>) => {
  const hasManagerAuth = ref(false);
  const allCascader = ref<Array<string[]>>([]);
  const allUserIds = ref<string[]>([]);

  const getCascaderOptions = async () => {
    if (cascaderOption.value.length !== 0) return;
    const { data } = await getUserOrgOptions();
    const bdIds: string[] = [];
    const selectedIds: Array<string[]> = [];
    let isManager = false;
    cascaderOption.value = data.bdRegionList.map((v) => {
      if (v.isManager) {
        isManager = true;
      }
      return {
        label: v.regionName,
        value: v.regionName,
        children: v.orgModelList.map(it => ({
          label: it.orgName,
          value: it.orgId,
          children: it.bdModelList.map((bdItem) => {
            bdIds.push(bdItem.bdId);
            selectedIds.push([v.regionName, it.orgId, bdItem.bdId]);
            return {
              label: bdItem.bdName,
              value: bdItem.bdId,
            };
          }),
        })),
      };
    });
    params.value.cascader = selectedIds;
    params.value.userIds = bdIds;
    hasManagerAuth.value = isManager;
    allCascader.value = selectedIds;
    allUserIds.value = bdIds;
  };

  const handleChangeCascader = (val: Array<string[]> | null) => {
    if (!val) {
      params.value.userIds = [];
    } else {
      params.value.userIds = val.reduce((arr, current) => {
        const [, , bdId] = current;
        return arr.concat([bdId]);
      }, []);
    }
  };
  return {
    hasManagerAuth,
    allCascader,
    allUserIds,
    getCascaderOptions,
    handleChangeCascader,
  };
};

export default useOrganizationCascader;
