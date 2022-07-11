<script lang="tsx">
import { ElMessage } from 'element-plus';
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from 'vue';
import WangEditor from 'wangeditor';
import { uploadFile } from '@/api/open';

export default defineComponent({
  name: 'editor',
  emits: ['update:modelValue'],
  props: {
    placeholder: {
      type: String,
      default: '请输入内容',
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const domEl = ref<null|HTMLElement>(null);
    const editorEl = ref<InstanceType <typeof WangEditor>|null>(null);
    onMounted(() => {
      editorEl.value = new WangEditor(domEl.value);
      Object.assign(editorEl.value.config, {
        // base64 保存图片
        uploadImgShowBase64: true,
        height: 200,
        // 隐藏插入网络图片的功能
        showLinkImg: false,
        placeholder: props.placeholder,
        excludeMenus: [
          'video',
          'code',
          'emoticon',
        ],
        async onchange() {
          const content = editorEl.value?.txt.html();
          await nextTick();
          emit('update:modelValue', content);
        },
        // 上传图片
        async customUploadImg(imageList: File[], insertToEditor: (url: string) => void) {
          const [image] = imageList;
          if (!/^image/.test(image.type)) {
            ElMessage.warning('图片格式错误');
          } else {
            const formData = new FormData();
            formData.append('files', image, image.name);
            const { data } = await uploadFile(formData);
            const [imageItem] = data;
            insertToEditor(imageItem.url);
          }
        },
      });
      editorEl.value?.create();
      editorEl.value?.txt.html(props.modelValue);
    });
    onBeforeUnmount(() => {
      editorEl.value?.destroy();
      editorEl.value = null;
    });
    watch(() => props.modelValue, (val) => {
      const content = editorEl.value?.txt.html();
      if (content !== val) {
        editorEl.value?.txt.html(val);
      }
    }, {
      immediate: true,
    });
    return {
      domEl,
    };
  },
  render() {
    return (
      <div ref='domEl'></div>
    );
  },
});
</script>
