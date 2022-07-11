<template>
  <div class="detail-container target_detail">
    <!-- 目标设置详情 -->
    <div class="setting_detail">
      <div
        class="setting_detail__header flex flex-align-center flex-justify-between"
      >
        <div>
          <span class="title margin-right-10">目标设置详情</span>
          <el-tag>{{filters.getEnumLabel(TARGET_STATUS_LIST, targetDetail.effectiveState!)}}</el-tag>
        </div>
        <div>
          <el-button
            @click="router.back()"
          >返回列表</el-button>
          <el-button
            v-if="CAN_MBBG
              && [TARGET_STATUS_ENUM.NOT_EFFECTIVE, TARGET_STATUS_ENUM.EFFECTIVE_PADDING]
                .includes(targetDetail.effectiveState!)"
            type="primary"
            @click="handleTargetChange"
          >目标变更</el-button>
        </div>
      </div>
      <div class="margin-top-20 detail_content">
        <el-form
          :model="{}"
          label-width="150"
        >
          <responsive-row
            :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
          >
            <el-form-item
              label="目标名称："
            >
              <div>{{targetDetail?.targetName}}</div>
            </el-form-item>
            <el-form-item
              label="目标类型："
            >
              <div>
                {{filters.getEnumLabel(
                  TARGET_TYPE_LIST,
                  targetDetail?.targetType!
                )}}
              </div>
            </el-form-item>
            <el-form-item
              label="目标完成："
            >
              <div>
                <span>{{targetDetail?.targetValue}}</span>
                <span>{{filters.getEnumLabel(utilList, targetDetail?.targetUnit!)}}</span>
              </div>
            </el-form-item>
            <el-form-item
              label="生效日期："
            >
              <div>
                <span>{{filters.getEnumLabel(EFFECTIVE_DATE_LIST, targetDetail?.effectivePeriod!)}}</span>
                <span
                  v-if="targetDetail?.effectiveBeginDate"
                >（{{filters.formatTime(targetDetail?.effectiveBeginDate!, 'YYYY-MM-DD')}}）</span>
              </div>
            </el-form-item>
            <el-form-item
              label="设置对象："
            >
              <div>{{targetDetail?.objectiveList?.[0].objectiveName}}</div>
            </el-form-item>
            <el-form-item
              label="设置范围："
            >
              <div>
                {{filters.getEnumLabel(
                  TARGET_RANGE_LIST,
                  targetDetail?.objectiveType!
                )}}
              </div>
            </el-form-item>
            <el-form-item
              label="设置时间："
            >
              <div>{{filters.formatTime(targetDetail?.createdTime!)}}</div>
            </el-form-item>
            <el-form-item
              label="设置人员："
            >
              <div>{{targetDetail?.creatorName}}</div>
            </el-form-item>
          </responsive-row>
        </el-form>
      </div>
    </div>
    <!-- 修改记录 -->
    <div v-if="targetDetail?.recordList?.length">
      <div class="title margin-bottom-20">修改记录</div>
      <div
        class="record_content"
        v-for="item in targetDetail?.recordList"
        :key="item?.targetRecordId"
      >
        <el-form
          :model="item"
          label-width="150"
        >
          <responsive-row
            :col="{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }"
          >
            <el-form-item
              label="变更内容："
            >
              <div>{{item?.changeContent}}</div>
            </el-form-item>
            <el-form-item
              label="变更时效："
            >
              <div>{{$filters.getEnumLabel(TARGET_STATUS_LIST,item?.effectiveState!)}}</div>
            </el-form-item>
            <el-form-item
              label="变更原因："
            >
              <div class="padding-right-10">{{item?.reason}}</div>
            </el-form-item>
            <el-form-item
              label="操作人员："
            >
              <div>{{item?.operator}}</div>
            </el-form-item>
            <el-form-item
              label="操作时间："
            >
              <div>{{filters.formatTime(item?.createdTime!)}}</div>
            </el-form-item>
          </responsive-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';

import { getSaleTargetDetailApi } from '../../api';
import { IV1SaleTargetRes } from '../../api/type';
import {
  TARGET_TYPE_LIST,
  TARGET_RANGE_LIST,
  EFFECTIVE_DATE_LIST,
  TYPE_ENUM,
  TARGET_STATUS_ENUM,
  TARGET_STATUS_LIST,
} from '../../constant';
import { filters } from '@/core/plugins/filter';
import { useRouter, useRoute } from 'vue-router';
import { useDictionary } from '@/hooks/use-dictionary';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';

import { usePermissionConfig } from '../../use-permission-config';
import { handleOpenDialog } from '@/hooks/use-dialog';
import TargetSetDialog from '../list/components/target-set-dialog.vue';

const router = useRouter();
const route = useRoute();

// 单位
const { getDictionaryOptions } = useDictionary();
const utilList = computed(() => {
  return getDictionaryOptions(CX_DICTIONARY_KEY.CRM_SALESMAN_AMOUNT_UNIT);
});

// 权限
const {
  CAN_MBBG,
} = usePermissionConfig();

// 获取详情
const targetDetail = ref({} as IV1SaleTargetRes);
const getSaleTargetDetail = async () => {
  const res = await getSaleTargetDetailApi(route.params.id as string);
  targetDetail.value = res?.data;
};
getSaleTargetDetail();

// 目标变更
const handleTargetChange = () => {
  handleOpenDialog(TargetSetDialog, {
    type: TYPE_ENUM.UPDATE,
    utilList: utilList.value,
    success: getSaleTargetDetail,
    row: {
      targetId: targetDetail.value.targetId,
      targetType: targetDetail.value?.targetType,
      targetName: targetDetail.value?.targetName,
      objectiveType: targetDetail.value?.objectiveType,
      objectiveOrgId: targetDetail.value?.objectiveOrgId,
      objectiveOrgName: targetDetail.value?.objectiveOrgName,
      objectiveName: targetDetail.value?.objectiveList?.[0]?.objectiveName,
      targetValue: targetDetail.value?.targetValue,
      targetUnit: targetDetail.value?.targetUnit,
      effectivePeriod: targetDetail.value?.effectivePeriod,
      objectiveList: targetDetail.value?.objectiveList,
      creatorId: targetDetail.value?.creatorId,
    },
  });
};

</script>

<style lang="scss" scope>
.target_detail {
  padding: 20px 20px 30px!important;
  background: #fff;
  .title {
    border-left: 4px solid #3A64E6;
    padding-left:6px;
  }
  .detail_content, .record_content {
    padding: 10px 15px 10px;
    border: 1px solid rgba(225, 228, 237, 1);
  }
  .detail_content {
    margin-bottom: 40px;
  }
  .record_content {
    border-bottom: none;
  }
  .record_content:nth-last-child(1) {
    border-bottom: 1px solid rgba(225, 228, 237, 1);
  }
  .el-form-item--default {
    margin-bottom: 5px;
  }
}

</style>
