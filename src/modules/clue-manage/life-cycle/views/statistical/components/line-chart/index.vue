<script lang="tsx">
import { defineComponent, PropType, computed, ref, onMounted, onBeforeMount } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components';
import { IBarDataItem } from '../../type';
import { debounce } from 'lodash-es';

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

export default defineComponent({
  name: 'LineChart',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Array as PropType<IBarDataItem[]>,
      required: true,
    },
  },
  components: {
    VChart,
  },
  setup(props) {
    const chartEl = ref<InstanceType<typeof VChart>>();
    const option = computed(() => {
      const {
        data = [],
      } = props;
      const baseOption = {
        title: {
          text: '',
          left: 'center',
        },
        // color: ['#647DFA'],
        tooltip: {
          trigger: 'axis',
          formatter: (params: any[]) => {
            let str = `${params[0].data.label}<br>`;
            params.forEach((v) => {
              v.data.detail.forEach((it: any) => {
                str += v.marker;
                str += `${it.label}   ${it.value}<br>`;
              });
            });
            return str;
          },
        },
        grid: {
          left: '60',
          right: '40',
          top: '80',
          bottom: '24',
          containLabel: true,
        },
        legend: {
          left: '60',
          top: '28',
          type: 'scroll',
          // icon: 'circle',
          // itemWidth: 6,
          textStyle: {
            // color: '#fff',
            // fontSize: 18,
          },
        },
        xAxis: {
          type: 'category',
          axisTick: {
            show: false,
          },
          data: (data.length && data?.[0].data.map(v => v.label)) || [],
        },
        yAxis: {
          type: 'value',
        },
        series: data.map((v) => {
          return {
            name: v.date,
            data: v.data,
            type: 'bar',
            label: {
              show: true,
              position: 'top',
            },
            smooth: true,
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
            },
          };
        }),
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
      chartEl,
      option,
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
