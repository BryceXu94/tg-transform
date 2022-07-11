import { ref, nextTick, Ref } from 'vue';
import useOrganizationCascader, { ICascaderOptionItem } from './use-organization-cascader';
import { usePermissionList } from '@/hooks/use-permission-list';
import { IPermissionItem } from '@/hooks/use-permission-list/type';
import { getRegionList } from '@/api/global';

const useInitSearch = (params: Ref<any>) => {
  const BELONG_AREA_LIST = ref<IPermissionItem<string>[]>([]);
  const {
    permissionList: regionList,
    defaultCondition,
  } = usePermissionList<string>(
    BELONG_AREA_LIST,
    true,
  );

  const cascaderOption = ref<ICascaderOptionItem[]>([]);
  const {
    hasManagerAuth,
    allCascader,
    allUserIds,
    getCascaderOptions,
    handleChangeCascader,
  } = useOrganizationCascader(params, cascaderOption);

  const initRegionList = async () => {
    const res = await getRegionList();
    const belongAreaList = res?.data || [];

    BELONG_AREA_LIST.value = belongAreaList.map((item) => {
      return {
        label: item.regionName,
        value: item.regionCode,
        permissionCode: `CCS-KHYYKB-KHFX-SSQY-${item.regionCode}`,
      };
    });
    await nextTick();
    params.value.regionCode = defaultCondition.value;
  };

  return {
    BELONG_AREA_LIST,
    regionList,
    defaultRegion: defaultCondition,
    cascaderOption,
    hasManagerAuth,
    allCascader,
    allUserIds,
    getCascaderOptions,
    handleChangeCascader,
    initRegionList,
  };
};

export {
  useInitSearch,
};
