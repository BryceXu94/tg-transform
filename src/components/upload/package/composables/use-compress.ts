import {
  IProps,
} from '../type';

export const useCompress = (props: IProps) => {
  // 判断是否是可用canvas绘制的图片类型
  const isImage = (file: File) => {
    return file.type.indexOf('image') !== -1
      && (
        file.type.indexOf('png') !== -1
        || file.type.indexOf('jpeg') !== -1
        || file.type.indexOf('jpg') !== -1
      );
  };
  // 绘制水印
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
  const handleCompress = (file: File) => {
    return new Promise<File>((resolve, reject) => {
      if (!isImage(file)) {
        resolve(file);
        return;
      }
      // 转换成base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (item) => {
        const { compress: {
          compressWidth = 1000,
          isCompress = false,
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
  return {
    handleCompress,
    isImage,
  };
};
