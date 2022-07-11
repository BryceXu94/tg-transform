<script lang="tsx">
import { defineComponent, PropType, ref, computed, onMounted, onUnmounted } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
} from 'echarts/components';
import { debounce } from 'lodash-es';
import { IPieChartData } from '../../type';

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
]);

export default defineComponent({
  name: 'PieChart',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Array as PropType<IPieChartData['data'][]>,
      required: true,
    },
    config: {
      type: Object as PropType<IPieChartData['config']>,
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
        config = {
          title: '',
          titleColor: '',
          pieColor: '',
        },
      } = props;
      const baseOption = {
        title: {
          text: config.title,
          left: 'center',
          top: 'center',
          textStyle: {
            color: config.titleColor,
            fontSize: 12,
          },
        },
        color: [config.pieColor],
        series: [
          {
            type: 'pie',
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: data.map(item => ({ value: item.value })),
            radius: ['75%', '100%'],
            emphasis: {
              scale: false,
            },
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
          <empty class="empty" />
        ) : (
          <v-chart
            class="pie-chart"
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
  .empty,
  .pie-chart {
    height: 100%;
    width: 100%;
  }
  .empty {
    margin-top: 8px;
  }
}
</style>
