/*
 * @Descripttion:
 * @Author: weitongxue
 */
import { PropType, ref, defineComponent, watch, onMounted, onBeforeUnmount } from 'vue';
import { IOptionsItem, IRequestConfig } from './type.d';
import { get, isEqual } from 'lodash-es';

export default defineComponent({
  name: 'querySelect',
  emits: ['update:modelValue', 'change'],
  props: {
    /**
     * 请求携带额外参数
     */
    queryParams: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 是否在初始化的时候查询数据
     */
    needInitSearch: {
      type: Boolean,
      default: false,
    },
    /**
     * 请求方式
     */
    method: {
      type: Function,
      default: () => {},
    },
    /**
     * key值解析
     */
    config: {
      type: Object as PropType<IRequestConfig>,
      default: () => ({}),
    },
    modelValue: {
      type: String,
      default: '',
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    /**
     * 自定义格式化选项显示
     */
    formatFn: {
      type: Function,
      default: null,
    },
    findKey: {
      type: String,
      default: '',
    },
    /**
     * 查询值变化则置空选项
     */
    needInitOptions: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const timer = ref<any>(null);
    const options = ref<IOptionsItem[]>([]);
    const loading = ref(false);
    const debounce = (fn: () => void) => {
      if (timer.value) {
        clearTimeout(timer.value);
        timer.value = null;
      }
      timer.value = setTimeout(() => {
        fn();
      }, 400);
    };
    /**
     *
     * @param keyword 关键词
     * @param type 请求类型 valueSearch：通过valueSearchKey作为key值查询
     * @param type 请求类型 keywordSearch：通过keywordKey作为key值查询
     * @returns
     */
    const getData = async (
      keyword: string,
      type: 'keywordQuery' | 'valueQuery' = 'keywordQuery',
    ) => {
      try {
        if (loading.value) return;
        const { method, config } = props;
        const { labelKey, valueKey, dataKey, keywordQueryKey, valueQueryKey, codeKey, showCode }: IRequestConfig = {
          labelKey: 'label',
          valueKey: 'value',
          codeKey: 'value',
          dataKey: 'data.list',
          keywordQueryKey: 'keyword',
          valueQueryKey: 'keyword',
          pageSize: 20,
          ...config,
        };
        loading.value = true;
        const params = {
          ...props.queryParams,
        };
        if (type === 'keywordQuery') {
          params[keywordQueryKey] = keyword;
        } else {
          params[valueQueryKey] = keyword;
          // 绑定的id, 用传进来的名称去查询下拉列表（因为接口不支持id查询）
          if (props.findKey) {
            params[keywordQueryKey] = props.findKey;
          }
        }
        const res = await method(params);
        if (props.formatFn) {
          options.value = props.formatFn(res, dataKey);
        } else {
          options.value = get(res, dataKey).map((v: any) => ({
            label: showCode ? `${v[labelKey]}（${v[codeKey]}）` : v[labelKey],
            value: v[valueKey],
            row: v,
          }));
        }
      } catch (error) {
        console.log('搜索失败', error);
      } finally {
        loading.value = false;
      }
    };
    const remoteMethod = async (keyword: string) => {
      const inputValue = keyword.trim();
      if (!inputValue && !props.needInitSearch) return;
      debounce(() => {
        getData(inputValue);
      });
    };

    const onChange = (val: string) => {
      const option = options.value.find(v => v.value === val);
      if (option) {
        emit('update:modelValue', option.value);
        emit('change', option.value, option.row);
      } else {
        emit('change', '');
        emit('update:modelValue', '');
      }
    };
    watch(
      () => props.modelValue,
      () => {
        if (props.modelValue && !options.value.find(v => v.value === props.modelValue)) {
          debounce(() => {
            getData(props.modelValue, 'valueQuery');
          });
        }
      },
      {
        immediate: true,
      },
    );
    watch(
      () => props.queryParams,
      (n, o) => {
        if (props.needInitOptions && !isEqual(n, o)) {
          options.value = [];
        }
      },
      {
        immediate: true,
      },
    );
    onMounted(() => {
      if (props.needInitSearch) {
        debounce(() => {
          getData('');
        });
      }
    });
    onBeforeUnmount(() => {
      if (timer.value) {
        clearTimeout(timer.value);
        timer.value = null;
      }
    });

    // 刷新key
    const refreshKey = ref(false);
    const onFocus = () => {
      refreshKey.value = true;
    };
    return {
      options,
      loading,
      refreshKey,
      remoteMethod,
      onChange,
      onFocus,
    };
  },
  render() {
    return (
      <>
        {this.readonly ? (
          this.$filters.getEnumLabel(this.options, this.modelValue)
        ) : (
          <el-select
            filterable
            clearable={this.clearable}
            disabled={this.disabled}
            {...this.$attrs}
            modelValue={this.modelValue}
            remote
            remote-method={this.remoteMethod}
            loading={this.loading}
            onChange={this.onChange}
            onFocus={this.onFocus}
            class="select-full"
            key={this.refreshKey}
          >
            {this.options.map((item) => {
              return <el-option key={item.value} label={item.label} value={item.value} disabled={item.disabled} />;
            })}
          </el-select>
        )}
      </>
    );
  },
});
