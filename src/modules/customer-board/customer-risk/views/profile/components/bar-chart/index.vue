<script lang="tsx">
import { defineComponent, PropType, ref, computed, onMounted, onUnmounted } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { debounce } from 'lodash-es';
import { IBarChartData } from '../../type';

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
]);

export default defineComponent({
  name: 'BarChart',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Array as PropType<IBarChartData[]>,
      required: true,
    },
    xAxisData: {
      type: Array as PropType<string[]>,
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
        xAxisData = [],
      } = props;
      const baseOption = {
        title: {
          text: '中高风险客户变化趋势',
        },
        color: ['#FFFF80', '#F59A23', '#EC808D'],
        tooltip: {
          trigger: 'item',
          formatter(params: any) {
            return params.value ? `
              ${params.name}<br />
              ${params.seriesName}<br />
              客户数：<span style="font-weight: bold">${params.value}</span>
            ` : '';
          },
        },
        legend: {
          right: 0,
        },
        grid: {
          show: true,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          axisTick: {
            show: false,
          },
          axisLine: {
            symbolOffset: 6,
            symbol: ['none', 'arrow'],
            symbolSize: [6, 8],
          },
          data: xAxisData,
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true,
            symbolOffset: 6,
            symbol: ['none', 'arrow'],
            symbolSize: [6, 8],
          },
        },
        series: data.map((item) => {
          return {
            name: item.name,
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
            },
            data: item.data.map((value) => {
              if (+value === 0) {
                return {
                  value: 0,
                  itemStyle: { opacity: 0 },
                };
              }
              return value;
            }),
            barMaxWidth: '40%',
            // barMinHeight: 10,
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
    onUnmounted(() => {
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
            class="bar-chart"
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
  .bar-chart {
    height: 100%;
    width: 100%;
  }
}
</style>
