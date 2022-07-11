<template>
  <div>
    <el-form
      ref="formEl"
      :model="formData"
      :rules="formRules"
      label-width="110px"
    >
      <responsive-row :col="col12">
        <el-form-item
          label="集团名称："
          prop="groupName"
        >
          <div v-if="readOnly">{{ formData.groupName }}</div>
          <el-input
            v-else
            v-model.trim="formData.groupName"
            placeholder="请输入集团名称"
            :maxlength="100"
          />
        </el-form-item>
        <el-form-item
          label="集团编码："
          prop="groupCode"
        >
          <div v-if="readOnly">{{ formData.groupCode }}</div>
          <el-input
            v-else
            v-model.trim="formData.groupCode"
            placeholder="系统创建成功后自动生成"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="联系人："
          prop="contactName"
        >
          <encryption
            :data="{
              businessId: formData.groupId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.NAME,
              content: formData.contactName,
              dateColumn: 'contactName',
            }"
            v-if="readOnly"
          ></encryption>
          <el-input
            v-else
            v-model.trim="formData.contactName"
            placeholder="请输入联系人"
            :maxlength="50"
          />
        </el-form-item>
        <el-form-item
          label="所属职务："
          prop="positionCode"
        >
          <div v-if="readOnly">{{ formData.positionName }}</div>
          <el-select
            v-else
            v-model.trim="formData.positionCode"
            placeholder="请选择所属职务"
            style="width: 100%"
            @change="handleSelectJob"
          >
            <el-option
              v-for="item in JOB_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="联系电话："
          prop="contactPhone"
        >
          <encryption
            :data="{
              businessId: formData.groupId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.PHONE,
              content: formData.contactPhone,
              dateColumn: 'contactPhone',
            }"
            v-if="readOnly"
          ></encryption>
          <el-input
            v-else
            v-model.trim="formData.contactPhone"
            placeholder="请输入联系电话"
            :maxlength="100"
          />
        </el-form-item>
        <el-form-item
          label="联系邮箱："
          prop="contaceEmail"
        >
          <encryption
            :data="{
              businessId: formData.groupId,
              dataType: DESENSITIZE_DECRYPT_TYPE_ENUM.EMAIL,
              content: formData.contaceEmail,
              dateColumn: 'contaceEmail',
            }"
            v-if="readOnly"
          ></encryption>
          <el-input
            v-else
            v-model.trim="formData.contaceEmail"
            placeholder="请输入联系邮箱"
            :maxlength="100"
          />
        </el-form-item>
        <el-form-item
          label="备注："
          :col="col24"
          prop="remark"
        >
          <div v-if="readOnly">{{ formData.remark }}</div>
          <el-input
            v-else
            v-model.trim="formData.remark"
            placeholder="请输入备注"
            type="textarea"
            :rows="5"
            :maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
      </responsive-row>
    </el-form>
  </div>
</template>

<script lang="tsx">
import { defineComponent, PropType, computed, ref } from 'vue';
import { isEmpty, isMobilephone, isTelephone, isEmail } from '@tiangong/utils';

import { ElForm } from 'element-plus';

import { useDictionary } from '@/hooks/use-dictionary';
import { CX_DICTIONARY_KEY } from '@/constant/dictionary';
import { ICreateGroupReq } from '@/modules/customer-manage/group-manage/api/types';
import { DESENSITIZE_DECRYPT_TYPE_ENUM } from '@/constant/global';

export default defineComponent({
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Object as PropType<ICreateGroupReq>,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { getDictionaryOptions } = useDictionary();
    const JOB_OPTIONS = computed(() => getDictionaryOptions(CX_DICTIONARY_KEY.POST_NAME));
    const formEl = ref<InstanceType<typeof ElForm> | null>(null);
    const formData = computed(() => {
      return props.modelValue;
    });

    // 选择职务
    const handleSelectJob = (val: string) => {
      const item = JOB_OPTIONS.value.find(v => v.value === val);
      formData.value.positionName = item?.label;
    };

    // 触发表单校验
    const validate = async () => {
      await formEl.value?.validate();
    };

    return {
      JOB_OPTIONS,
      formEl,
      formData,
      handleSelectJob,
      validate,
      formRules: {
        groupName: [
          { required: true, message: '集团名称不能为空' },
        ],
        contactPhone: [{
          trigger: 'blur',
          validator: (_rule: any, value: string, cb: (err?:string) => void) => {
            if (isEmpty(value)) {
              cb();
              return true;
            }
            if (isMobilephone(value)) {
              cb();
              return true;
            }
            if (isTelephone(value)) {
              cb();
              return true;
            }
            cb('格式有误');
            return false;
          },
        }],
        contaceEmail: [{
          trigger: 'blur',
          validator: (_rule: any, value: string, cb: (err?:string) => void) => {
            if (isEmpty(value)) {
              cb();
              return true;
            }
            if (isEmail(value)) {
              cb();
              return true;
            }
            cb('格式有误');
            return false;
          },
        }],
      },
      col12: {
        sm: 24,
        md: 12,
        lg: 12,
        xl: 12,
      },
      col24: {
        sm: 24,
        md: 24,
        lg: 24,
        xl: 24,
      },
      DESENSITIZE_DECRYPT_TYPE_ENUM,
    };
  },

});
</script>
