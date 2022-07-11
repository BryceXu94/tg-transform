<template>
  <tgo-table :data="data" :columns="columns" />
</template>
<script lang="tsx">
import TgoTable from '../package/tgo-table';
import { defineComponent, ref, computed } from 'vue';
import { ITableColumnsItem } from '../package/type';
import { TgButton } from '../../tg-button';
import { TgSelect, TgOption } from '../../tg-select';

interface IDataItem {
  name: string;
  age: string;
  gender: string;
  date: string;
  renderHeader3: string;
}

export default defineComponent({
  components: { TgButton, TgoTable, TgSelect, TgOption },
  setup() {
    const genderHeader = ref('1');
    const options = ref([
      {
        label: '男',
        value: '1',
      },
      {
        label: '女',
        value: '0',
      },
      {
        label: '未知',
        value: '-1',
      },
    ]);
    const data = ref<IDataItem[]>([
      {
        name: '<iframe onload=alert(document.location)>',
        age: '12',
        gender: '1',
        date: '2020-12-12 16:00:00',
        renderHeader3: '2020-12-12 16:00:00',
      },
      {
        name: '路人乙',
        age: '10',
        gender: '0',
        date: '2020-12-12 16:00:00',
        renderHeader3: '2020-12-12 16:00:00',
      },
      {
        name: '路人丙',
        age: '13',
        gender: '-1',
        date: '2020-12-12 16:00:00',
        renderHeader3: '2020-12-12 16:00:00',
      },
    ]);
    const columns = computed<ITableColumnsItem<IDataItem>[]>(() => [
      {
        label: '名称',
        width: '100px',
        ellipsis: true,
        prop: 'name',
      },
      {
        label: '性别',
        minWidth: '100px',
        prop: 'gender',
        render: (row) => (
          <TgSelect v-model={row.gender}>
            {options.value.map((v) => (
              <TgOption value={v.value} label={v.label}></TgOption>
            ))}
          </TgSelect>
        ),
        renderHeader: () => (
          <TgSelect v-model={genderHeader.value}>
            {options.value.map((v) => (
              <TgOption value={v.value} label={v.label} key={v.value} />
            ))}
          </TgSelect>
        ),
      },
      {
        label: '性别',
        minWidth: '100px',
        prop: 'renderHeader',
        renderHeader: () => (
          <TgSelect>
            {options.value.map((v) => (
              <TgOption value={v.value} label={v.label}></TgOption>
            ))}
          </TgSelect>
        ),
        children: [
          {
            label: '性别11',
            minWidth: '100px',
            prop: 'renderHeader3',
            renderHeader: () => (
              <TgSelect>
                {options.value.map((v) => (
                  <TgOption value={v.value} label={v.label}></TgOption>
                ))}
              </TgSelect>
            ),
          },
        ],
      },
      {
        label: '操作',
        minWidth: '100px',
        prop: 'oper',
        renderHeader: () => <TgButton>oper自定义头部</TgButton>,
        render: () => <TgButton>操作</TgButton>,
      },
    ]);
    return {
      columns,
      data,
    };
  },
});
</script>
