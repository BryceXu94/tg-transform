<template>
  <el-form
    :model="data"
    :rules="rules"
    ref="formEl"
    scrollToError
  >
    <custom-card title="联系信息">
      <el-button
        type="primary"
        class="margin-bottom-10"
        @click="handleAddContact"
      >新增</el-button>
      <tgo-table
        :data="data"
        :columns="columns"
      />
    </custom-card>
  </el-form>
</template>
<script lang="ts">
import { defineComponent, ref, computed, PropType, nextTick } from 'vue';
import { IContactListItem } from '../../type';
import { useColumns } from './use-columns';
import { FormRules, ElForm } from 'element-plus';
import { isEmpty, isEmail } from '@tiangong/utils';
import CustomCard from '@/modules/clue-manage/components/custom-card/index.vue';

export default defineComponent({
  components: {
    CustomCard,
  },
  emits: ['update:data'],
  props: {
    data: {
      type: Array as PropType<IContactListItem[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const formEl = ref<InstanceType<typeof ElForm>>();
    const needValidateAll = ref(false);
    // 新增联系人
    const handleAddContact = () => {
      const { data } = props;
      const list = [...data];
      list.push({
        contactName: '',
        post: '',
        phone: '',
        email: '',
        remark: '',
      });
      emit('update:data', list);
    };
    // 删除联系人
    const handleDeleteContact = (index: number) => {
      const { data } = props;
      const list = [...data];
      list.splice(index, 1);
      emit('update:data', list);
    };
    const rules = computed<FormRules>(() => {
      return {
        contactName: [
          {
            trigger: 'blur',
            validator: (_rules, value, cb) => {
              if (!needValidateAll.value) {
                cb();
                return;
              }
              if (isEmpty(value)) {
                cb('联系人不能为空');
              } else {
                cb();
              }
            },
          },
        ],
        phone: [
          {
            trigger: 'blur',
            validator: (_rules, value, cb) => {
              if (!needValidateAll.value) {
                cb();
                return;
              }
              if (isEmpty(value)) {
                cb('联系电话不能为空');
                return;
              }
              if (/[^\d-]/.test(value)) {
                cb('请填写正确格式');
                return;
              }
              cb();
            },
          },
        ],
        post: [
          {
            trigger: 'blur',
            validator: (_rules, value, cb) => {
              if (!needValidateAll.value) {
                cb();
                return;
              }
              if (isEmpty(value)) {
                cb('所属职务不能为空');
                return;
              }
              cb();
            },
          },
        ],
        email: [
          {
            trigger: 'blur',
            validator: (_rules, value, cb) => {
              if (!needValidateAll.value) {
                cb();
                return;
              }
              if (isEmpty(value) || isEmail(value)) {
                cb();
                return;
              }
              cb('请填写正确格式');
            },
          },
        ],
      };
    });
    const { columns } = useColumns({
      rules,
      handleDeleteContact,
    });
    // 表单校验
    const validate = async () => {
      try {
        needValidateAll.value = true;
        await nextTick();
        await formEl.value?.validate();
      } catch (error: any) {
        throw new Error(error);
      } finally {
        setTimeout(() => {
          needValidateAll.value = false;
        }, 200);
      }
    };
    return {
      formEl,
      rules,
      columns,
      handleAddContact,
      validate,
    };
  },
});
</script>
