<script lang="tsx">
import { defineComponent, watchEffect, watch, ref, PropType, computed } from 'vue';
import { useRoute } from 'vue-router';
import { desensitizeDecrypt } from '@/api/global';
import { IEncryptionData, IDesensitizeData } from './types';

export default defineComponent({
  name: 'Encryption',
  props: {
    data: {
      type: Object as PropType<IEncryptionData>,
      default: () => {
        return {
          businessId: '',
          dataType: '',
          content: '',
          unit: '',
          prefix: '',
          suffix: '',
          pageUrl: '',
          pageTab: '',
          dateColumn: '',
          format: (content: string) => content,
        };
      },
      required: true,
    },
  },
  emits: ['updateContent'],
  setup(props, { emit }) {
    const $router = useRoute();
    const delimiter = '$$';
    const parsed = ref(false);
    const showBtn = ref(false);
    const desensitizeData = ref<IDesensitizeData[]>([]);
    const formatFn = props.data.format ? props.data.format : (content: string) => content;

    const unit = computed(() => props.data.unit || '');
    const prefix = computed(() => props.data.prefix || '');
    const suffix = computed(() => props.data.suffix || '');
    const text = computed(() => desensitizeData.value.map(item => item.content).join(''));

    const init = (data: IDesensitizeData) => {
      if (data.secret && parsed.value === false) {
        showBtn.value = true;
      } else {
        data.content = formatFn(data.content);
      }
    };

    watchEffect(() => {
      if (parsed.value) return;
      let propsContent = props.data.content || '';
      const propsDateColumn = props.data.dateColumn || '';
      let contentArr = [] as string[];
      let dateColumnArr = [] as string[];
      if (Object.prototype.toString.call(propsDateColumn) !== '[object Array]') {
        propsContent = propsContent.toString();
      }
      if (typeof propsContent === 'string') {
        contentArr = [propsContent];
        dateColumnArr = [propsDateColumn as string];
      } else {
        contentArr = propsContent;
        dateColumnArr = propsDateColumn as string[];
      }
      desensitizeData.value = contentArr.map((content, index) => {
        const [desensitizeContent = '', desensitizeSecret = ''] = (content || '').toString().split(delimiter);
        const data = {
          content: desensitizeContent,
          secret: desensitizeSecret,
          dateColumn: dateColumnArr[index] || '',
        };
        init(data);
        return data;
      });
    });

    const handleParse = async () => {
      const decryptReqList = desensitizeData.value.map((item) => {
        return {
          businessId: props.data.businessId,
          dataType: props.data.dataType,
          cipherText: item.secret,
          pageUrl: props.data.pageUrl || $router.path,
          pageTab: props.data.pageTab || '',
          dateColumn: item.dateColumn,
        };
      });
      const res = await desensitizeDecrypt({ decryptReqList });
      desensitizeData.value.forEach((item) => {
        item.content = formatFn(res?.data?.[item.dateColumn] || '');
      });

      parsed.value = true;
      showBtn.value = false;

      emit('updateContent', desensitizeData.value);
    };

    // 重置
    watch(() => props.data, (val) => {
      if (val.content === desensitizeData.value?.[0]?.content) {
        parsed.value = false;
        showBtn.value = false;
      }
    });

    return {
      handleParse,
      text,
      unit,
      prefix,
      suffix,
      showBtn,
      parsed,
    };
  },
  render() {
    return (
      <div class="block">
        <div>{this.prefix}{this.text}{this.suffix}{this.showBtn ? '' : this.unit}</div>
        {(this.showBtn) && (
          <el-button
            class="btn margin-left-5"
            onClick={this.handleParse}
            type='primary'
            size='small'
            plain
          >显示</el-button>
        )}
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.block {
  display: flex;
  align-items: center;
  position: relative;
}
</style>
