<script lang="tsx">
import { defineComponent, PropType, computed, ref, onMounted, onBeforeMount } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { FunnelChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components';
import { IFunnelDataItem } from '../../type';
import { debounce } from 'lodash-es';

use([
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  FunnelChart,
]);

export default defineComponent({
  name: 'LineChart',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Array as PropType<IFunnelDataItem[]>,
      required: true,
    },
  },
  components: {
    VChart,
  },
  setup(props) {
    const chartEl = ref<InstanceType<typeof VChart>>();
    const option = computed(() => {
      const { data } = props;
      const baseOption = {
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            return params.data.detail.map((v: any) => `${v.label}：${v.value}`).join('<br>');
          },
        },
        series: [
          {
            top: '5%',
            bottom: '5%',
            left: '5%',
            right: '5%',
            type: 'funnel',
            sort: 'none',
            minSize: '10%',
            label: {
              show: true,
              position: 'inside',
              formatter: (params: any) => {
                let text = `${params.data.label}：${params.data.value}`;
                if (params.dataIndex !== 0) {
                  text += ` 转化率${params.data.rate}%`;
                }
                return text;
              },
            },
            data,
          },
        ],
      };
      return props.options ? Object.assign(baseOption, props.options) : baseOption;
    });
    const resizeListener = debounce(() => {
      chartEl.value?.resize?.();
    }, 100);
    onMounted(() => {
      window.addEventListener('resize', resizeListener);
    });
    onBeforeMount(() => {
      window.removeEventListener('resize', resizeListener);
    });
    return {
      option,
      chartEl,
    };
  },
  render() {
    return (
      <div class="chart-wrapper">
        {this.data.length === 0 ? (
          <empty/>
        ) : (
          <v-chart
            class="line-chart"
            option={this.option}
            autoresize={true}
            ref="chartEl"
          />
        )}
      </div>
    );
  },
});
</script>
<style scoped lang="scss">
.chart-wrapper{
  display:flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .line-chart {
    height: 100%;
    width: 100%;
  }
}
</style>
