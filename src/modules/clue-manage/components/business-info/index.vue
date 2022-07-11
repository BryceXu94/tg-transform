<template>
  <el-form
    label-width="140px"
  >
    <custom-card title="工商信息">
      <responsive-row
        :col="{
          xs: 12, sm: 12, md: 12, lg: 12, xl: 12
        }"
      >
        <el-form-item label="客户名称">{{data?.customerName || '-'}}</el-form-item>
        <el-form-item label="统一社会信用代码">{{data?.socialCreditCode || '-'}}</el-form-item>
        <el-form-item
          label="注册地址"
          :col="{
            xs: 24, sm: 24, md: 24, lg: 24, xl: 24
          }"
        >
          {{data?.registrationProvince}}
          {{data?.registrationCity}}
          {{data?.registrationRegion}}
          {{data?.registrationAddress}}
        </el-form-item>
        <el-form-item label="营业状态">{{data?.openState || '-'}}</el-form-item>
        <el-form-item label="公司类型">{{data?.companyType || '-'}}</el-form-item>
        <el-form-item label="成立日期">
          {{$filters.formatTime(data?.establishmentDate || '', 'YYYY-MM-DD') || '-'}}
        </el-form-item>
        <el-form-item label="法人代表">{{data?.artificialPerson || '-'}}</el-form-item>
        <el-form-item label="实缴资本">{{data?.actualPayCapital || '-'}}万元人民币</el-form-item>
        <el-form-item label="注册资本">{{data?.regCapital || '-'}}万元人民币</el-form-item>
        <el-form-item
          label="经营地址"
          :col="{
            xs: 24, sm: 24, md: 24, lg: 24, xl: 24
          }"
        >
          {{data?.fullOperatingAddress || '-'}}
        </el-form-item>
      </responsive-row>
    </custom-card>
  </el-form>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IGetCluesDetailRes } from '@/modules/clue-manage/customer-clue/api/type';
import CustomCard from '@/modules/clue-manage/components/custom-card/index.vue';

export default defineComponent({
  components: {
    CustomCard,
  },
  props: {
    data: {
      type: Object as PropType<IGetCluesDetailRes['businessInfoModel']>,
      required: true,
    },
  },
});
</script>
