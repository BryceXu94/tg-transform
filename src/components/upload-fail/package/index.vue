<script lang="tsx">
import {
  defineComponent,
  computed,
  PropType,
  ref,
  nextTick,
  reactive,
  provide,
  toRefs,
} from 'vue';
import { ElMessage, useFormItem } from 'element-plus';
import promiseIterator from '@/core/utils/promise-iterator';
import { uploadFile } from '@/api/open';
import { IFile, TFileData, IFakeFileData, ImageEl, ICompress, uploaderKey, TOnMove, TOnRemove } from './type';
import IconUpload from '@/assets/icon_upload.png';
import UploadPaste from './upload-paste.vue';
import { Document, Close, ZoomIn, Delete, Plus } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'Upload',
  components: {
    FileList,
    Document,
    Close,
    ZoomIn,
    Delete,
    Plus,
  },
  emits: ['change', 'update:modelValue', 'delete', 'upload'],
  props: {
    needMask: {
      type: Boolean,
      default: false,
    },
    maskContent: {
      type: String,
      default: '致景科技 创新BG',
    },
    /**
     * 文本提示
     */
    tip: {
      type: String,
      default: '',
    },
    /**
     * fileList：文件列表
     * imageList：图片列表
     */
    type: {
      type: String as PropType<'fileList'|'imageList'>,
      default: 'imageList',
    },
    modelValue: {
      type: Array as PropType<(IFile | TFileData)[]>,
      default: () => [],
    },
    /**
     * 是否显示粘贴上传
     */
    paste: {
      type: Boolean,
      default: false,
    },
    /**
     * 禁用编辑
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 上传数量限制， 0为不限制
     */
    limit: {
      type: Number,
      default: Infinity,
    },
    /**
     * 是否支持多选文件
     */
    multiple: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: 'file',
    },
    accept: {
      type: String,
      default: 'image/png,image/jpeg,image/jpg',
    },
    /**
     * 样式大小
     */
    size: {
      type: String as PropType<'medium' | 'small' | 'mini'>,
      viladator: (val: string) => {
        return ['medium', 'small', 'mini'].indexOf(val) !== -1;
      },
      default: 'small',
    },
    onMove: {
      type: Function as PropType<TOnMove>,
      default: null,
    },
    onRemove: {
      type: Function as PropType<TOnRemove>,
      default: null,
    },
    onError: {
      type: Function,
      default: null,
    },
    /**
     * 文件超出个数限制时的钩子
     */
    onExceed: {
      type: Function,
      default: () => {
        ElMessage.warning('上传数量超过限制');
      },
    },
    sizeLimit: {
      type: Number,
      default: Infinity,
    },
    canDownload: {
      type: Boolean,
      default: true,
    },
    // 图片压缩参数
    compress: {
      type: Object as PropType<ICompress>,
      default: () => {},
    },
    /**
     * 是否可以查看大图
     */
    preview: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否可以移除
     */
    remove: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否粘贴、拖放到面板立即上传
     */
    pasteAutoUpload: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否可以移动
     */
    move: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const { formItem } = useFormItem();
    const getFormFileData = (file: File) => {
      const formData = new FormData();
      formData.append('files', file, file.name);
      return formData;
    };

    const inputRef = ref<HTMLInputElement | null>(null);
    const imagesEl = ref<ImageEl[]>([]);
    // 临时的列表
    const fakeList = ref<IFakeFileData[]>([]);
    // 用于显示文件的列表
    const showFilesList = computed(() => {
      return props.modelValue.concat(fakeList.value);
    });
    const setImageRef = (el: ImageEl, i:number) => {
      imagesEl.value[i] = el;
    };
    /**
     * 检测是否可以多选
     */
    const isMultiple = computed(() => {
      const { multiple, limit, modelValue } = props;
      if (multiple) {
        // 当前数量大于限制两张才可以
        return limit - modelValue.length >= 2;
      }
      return multiple;
    });

    const beforeUpload = (file: File) => {
      if (file.size / 1024 / 1024 > props.sizeLimit) {
        ElMessage.warning(`上传图片大小不能超过 ${parseFloat(`${props.sizeLimit}`)}MB!`);
        return false;
      }
      const { accept } = props;
      const types = accept.split(',');
      if (
        types.includes('*') === false
        && types.includes(file.type) === false
        && types.some(v => file.name.indexOf(v) !== -1) === false
      ) {
        ElMessage.warning('文件格式有误');
        return false;
      }
      return true;
    };
    // 判断是否是可用canvas绘制的图片类型
    const isImage = (file: File) => {
      return file.type.indexOf('image') !== -1
        && (
          file.type.indexOf('png') !== -1
          || file.type.indexOf('jpeg') !== -1
          || file.type.indexOf('jpg') !== -1
        );
    };
    const drawMask = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const { width, height } = canvas;
      const { maskContent } = props;
      context.save();
      context.translate(width - 30, height);
      context.rotate((Math.PI / 180) * 25);
      context.textAlign = 'right';
      context.strokeStyle = '#999';
      context.font = '24px serif';
      context.globalAlpha = 0.1;
      context.strokeText(maskContent, 0, 0);
      context.restore();
    };
    /** *
     * 图片压缩
    */
    const handleCompress = (file: FileList[0]) => {
      return new Promise((resolve, reject) => {
        // 转换成base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (item) => {
          const { compress: {
            compressWidth,
            isCompress,
          } } = props;
          const src = item?.target?.result as string;
          const image = new Image();
          image.src = src;
          image.onload = () => {
            const quality = 0.92; // 默认图片质量为0.92
            const w = image.width;
            const h = image.height;
            // 压缩后宽，高（如果原图更小，就按照原图压缩质量，大小不变）
            let targetWidth = w;
            let targetHeight = h;
            // 需要压缩则处理分辨率
            if (isCompress) {
              targetWidth = compressWidth > w ? w : compressWidth;
              targetHeight = ((targetWidth * h) / w);
            }
            // 生成canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            ctx?.drawImage(image, 0, 0, targetWidth, targetHeight);
            // 是否添加水印
            if (props.needMask) {
              drawMask(ctx, canvas);
            }
            const base64 = canvas.toDataURL(file.type, quality);
            const bytes = window.atob(base64.split(',')[1]);
            // 处理异常,将ascii码小于0的转换为大于0
            const ab = new ArrayBuffer(bytes.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < bytes.length; i++) {
              ia[i] = bytes.charCodeAt(i);
            }
            const files = new Blob([ab], { type: file.type });
            // 将blob类型转换成file类型，解决了文件名设置的问题（后端接口必须要文件名，用作校验）
            const _files = new File([files], file.name, { type: file.type });
            resolve(_files);
          };
          image.onerror = (e) => {
            console.log('压缩失败');
            reject(e);
          };
        };
        reader.onerror = (e) => {
          console.log('压缩失败');
          reject(e);
        };
      });
    };

    /**
     * 上传
     */
    async function uploadFiles(files: FileList) {
      const { limit, modelValue: fileList, onExceed } = props;

      if (fileList.length + files.length > limit) {
        onExceed(files, fileList);
        return;
      }

      let postFileList = Array.from(files);

      if (!postFileList.length) {
        return;
      }

      if (!isMultiple.value) {
        postFileList = postFileList.slice(0, 1);
      }
      try {
        const res = await promiseIterator(postFileList, async (file) => {
          // 是否压缩（只能是图片压缩）
          const _file = isImage(file) ? await handleCompress(file) as File : file;

          let beforeUploadRes = true;
          beforeUploadRes = await beforeUpload(_file);
          if (beforeUploadRes) {
            // 当前的下标
            const index = fakeList.value.length;
            fakeList.value.push({
              loading: true,
              name: file.name,
              size: `${file.size}`,
              type: file.type,
              url: URL.createObjectURL(_file),
            });
            try {
              const { data } = await uploadFile(getFormFileData(_file));
              const _fileRes = Object.assign({
                type: file.type,
              }, data[0]);
              // 替换当前临时数据
              fakeList.value.splice(index, 1, _fileRes);
              return _fileRes;
            } catch (error) {
              console.log('上传文件出错', error);
            }
          }
          return null;
        });
        const _fileDataList = res.filter(Boolean) as TFileData[];
        if (_fileDataList.length === 0) return;
        const returnData = [...fileList, ..._fileDataList];
        emit('update:modelValue', returnData);
        emit('upload', _fileDataList);
        emit('change', returnData);
        // 解决Value变更不会出发Form校验
        formItem?.validate('change');
      } catch (e) {
        console.log('上传文件失败', e);
      } finally {
        nextTick(() => {
          fakeList.value = [];
        });
      }
    }

    /**
     * 处理文件选择
     */
    const handleFilePick = (files?: FileList | null) => {
      if (files?.length) {
        uploadFiles(files);
      }

      nextTick(() => {
        const _inputRef = inputRef.value!;
        _inputRef.value = '';
      });
    };

    /**
     * 处理change事件
     */
    const handleIputChange = (e: Event) => {
      const { files } = e.target as HTMLInputElement;
      handleFilePick(files);
    };
    const handleDelete = (index: number, e: Event) => {
      e.stopPropagation();
      const list = [...props.modelValue];
      const row = list.splice(index, 1);
      emit('update:modelValue', list);
      emit('delete', row, index);
      emit('change', list);
      // 解决Value变更不会出发Form校验
      formItem?.validate('change');
    };
    const handlePreview = (i: number) => {
      if (imagesEl.value[i]) {
        // 原生触发点击
        const _$img = imagesEl.value[i]!.$el?.childNodes[0] as HTMLElement;
        _$img?.click?.();
      }
    };
    const handleDownload = (row: IFile | TFileData) => {
      if (row.url) {
        const req = new XMLHttpRequest();
        req.open('GET', row.url, true);
        req.responseType = 'blob';
        req.onload = () => {
          const url = window.URL.createObjectURL(req.response);
          const a = document.createElement('a');
          a.href = url;
          a.download = row.name || row.url;
          a.click();
        };
        req.send();
      }
    };

    const uploaderRef = reactive({
      emit,
      inputRef,
      ...toRefs(props),
      uploadFiles,
    });

    provide(uploaderKey, uploaderRef);
    return {
      handleDownload,
      handlePreview,
      setImageRef,
      inputRef,
      isMultiple,
      showFilesList,
      handleIputChange,
      handleDelete,
      uploadFiles,
      handleIputDrop(e: DragEvent) {
        const { files } = e.dataTransfer!;
        handleFilePick(files);
        e.preventDefault();
      },
    };
  },
  render() {
    const upLoadWrapClassName = `upload-wrap__${this.size}`;
    return (
      <div class="upload-container">
        {this.type === 'fileList' && (
          <div class="file-list-layout">
            {!this.disabled && (
              <el-button
                class="upload"
                disabled={this.showFilesList.length >= this.limit}
              >
                {this.showFilesList.length < this.limit && (
                  <input
                    type="file"
                    ref="inputRef"
                    class="input"
                    onDrop={ this.handleIputDrop }
                    onChange={ this.handleIputChange }
                    multiple={ this.isMultiple }
                    name={ this.name }
                  />
                )}
                <div class="upload_button">
                  <img src={IconUpload} alt="" class="icon"/>
                  <div>上传文件</div>
                </div>
              </el-button>
            )}
            {this.tip && !this.disabled ? (
              <div class="tip">{this.tip}</div>
            ) : null}
            <div class="ul">
              <div class="file-image-ul">
                {this.showFilesList.map((v, i) => (
                  ['jpeg', 'png', 'jpg'].includes(v.name!.split('.')[v.name!.split.length - 1])
                    ? <div class="file-image-li float-left">
                 <el-image
                    class="cover margin-right-10"
                    fit="cover"
                    ref={ (el: ImageEl) => this.setImageRef(el, i) }
                    src={ v.url }
                    style="width: 100px; height: 100px"
                    initial-index={i}
                    preview-src-list={ this.showFilesList.filter(info => ['jpeg', 'png', 'jpg'].includes(
                      info.name!.split('.')[v.name!.split.length - 1],
                    )).map(item => item.url) }
                  />
                  <div class="mask">
                    <el-icon
                      class="preview"
                      onClick={() => this.handlePreview(i)}
                    >
                      <zoom-in></zoom-in>
                    </el-icon>
                    {!this.disabled && (
                      <el-icon
                        class="delete"
                        onClick={(e: any) => this.handleDelete(i, e)}
                      >
                        <delete></delete>
                      </el-icon>
                    )}
                  </div>
              </div> : null
                ))}
              </div>
              <div>
                {this.showFilesList.map((v, i) => (
                  !['jpeg', 'png', 'jpg'].includes(v.name!.split('.')[v.name!.split.length - 1])
                    ? <div class="li" onClick={() => this.handleDownload(v)}>
                  <el-icon class="icon">
                    <document></document>
                  </el-icon>
                  <div class="name">{v.name || v.url}</div>
                  {!this.disabled && (
                    <el-icon
                      class="right"
                      onClick={(e: any) => this.handleDelete(i, e)}
                    >
                      <close></close>
                    </el-icon>
                  )}
                </div> : null
                ))}
              </div>
              {this.showFilesList.length === 0 && this.disabled && (
                <div class="error">暂无数据</div>
              )}
            </div>
          </div>
        )}
        {this.type === 'imageList' && (
          <div class="image-list-layout">
            <div class="ul">
              {this.showFilesList.map((v, i) => (
                <div class="li">
                  <el-image
                    class="cover"
                    fit="cover"
                    ref={ (el: ImageEl) => this.setImageRef(el, i) }
                    src={ v.url }
                    initial-index={i}
                    preview-src-list={ this.showFilesList.map(item => item.url) }
                  />
                  <div class="mask">
                    <el-icon
                      class="preview"
                      onClick={() => this.handlePreview(i)}
                    >
                      <zoom-in></zoom-in>
                    </el-icon>
                    {!this.disabled && (
                      <el-icon
                        class="delete"
                        onClick={(e: any) => this.handleDelete(i, e)}
                      >
                        <delete></delete>
                      </el-icon>
                    )}
                  </div>
                </div>
              ))}
              {this.disabled && this.showFilesList.length === 0 && (
                <div class="li">
                  <el-image
                    class="cover"
                    fit="cover"
                    src=""
                    v-slots={{
                      error: () => (
                        <div class="error">
                          <div>暂无图片</div>
                        </div>
                      ),
                    }}
                  />
                </div>
              )}
              {(!this.disabled && this.showFilesList.length < this.limit) && (
                <div class="flex">
                  <div class={['upload', upLoadWrapClassName, 'margin-right-10']}>
                    <el-icon
                      class="icon"
                    >
                      <plus></plus>
                    </el-icon>
                    <input
                      type="file"
                      ref="inputRef"
                      class="input"
                      onDrop={ this.handleIputDrop }
                      onChange={ this.handleIputChange }
                      multiple={ this.isMultiple }
                      name={ this.name }
                    />
                  </div>
                  {this.paste && <UploadPaste />}
                </div>
              )}
            </div>
            {this.tip && !this.disabled ? (
              <div class="tip">{this.tip}</div>
            ) : null}
          </div>
        )}
      </div>
    );
  },
});
</script>

<style lang="scss" scoped>
.upload-container{
  .file-list-layout{
    .upload_button{
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0, 0, 0, 0.65) !important;
      .icon{
        width: 14px;
        height: 14px;
        margin-right: 4px;
      }
    }
    .upload{
      position: relative;
    }
    .tip{
      font-size: 12px;
      line-height: 17px;
      color: #B4B4B4;
      padding: 4px 0 10px;
      // padding-top: 10px;
    }
    .ul{
      .file-image-ul {
        overflow: hidden;
      }
      .file-image-li {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 4px;
        overflow: hidden;
        margin-right: 5px;
        margin-bottom: 5px;
         .mask{
          display:flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,.6);
          color: #fff;
          font-size: 16px;
          transition: all 0.3s;
          opacity: 0;
          .preview{
            cursor: pointer;
          }
          .delete{
            margin-left: 10px;
            cursor: pointer;
          }
        }
        &:hover .mask{
          opacity: 1;
        }
      }
      .li{
        display: flex;
        align-items: center;
        position: relative;
        height: 28px;
        padding: 0 30px 0 5px;
        border-radius: 4px;
        color: #666;
        transition: all 0.3s;
        &:hover{
          background-color: #f6f6f6;
        }
        .icon{
          font-size: 12px;
          cursor: pointer;
        }
        .name{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: $menu-text-active;
          padding-left: 8px;
          line-height: 18px;
          cursor: pointer;
          font-size: 14px;
        }
        .right{
          position: absolute;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
    .error{
      font-size: 12px;
      color: #666;
    }
  }
  .image-list-layout{
    .ul{
      display: flex;
      flex-wrap: wrap;
      .li{
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 4px;
        overflow: hidden;
        margin-right: 5px;
        margin-bottom: 5px;
        .cover{
          width: 100%;
          height: 100%;
        }
        .mask{
          display:flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,.6);
          color: #fff;
          font-size: 16px;
          transition: all 0.3s;
          opacity: 0;
          .preview{
            cursor: pointer;
          }
          .delete{
            margin-left: 10px;
            cursor: pointer;
          }
        }
        &:hover .mask{
          opacity: 1;
        }
        .error{
          display:flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          color: #C0C4CC;
          background-color: #F5F7FA;
        }
      }
    }
    .upload{
      display:flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 4px;
      border: 1px dashed #999;
      transition: all 0.3s;
      .icon{
        font-size: 24px;
        color: #999;
        transition: all 0.3s;
      }
      &:hover{
        border-color: $menu-text-active;
        .icon{
          color: $menu-text-active;
        }
      }
    }
    .tip{
      font-size: 12px;
      line-height: 17px;
      color: #B4B4B4;
      padding: 4px 0 10px;
      // padding-top: 10px;
    }
  }
  .input{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
}
</style>
