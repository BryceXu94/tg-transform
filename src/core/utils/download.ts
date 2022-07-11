import { ref } from 'vue';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { ElLoading } from 'element-plus';

export const download = (data: Blob | File, fileName: string) => {
  const url = URL.createObjectURL(data);
  const downloadEl = document.createElement('a');
  downloadEl.href = url;
  downloadEl.download = fileName;
  document.body.appendChild(downloadEl);
  downloadEl.click();
  document.body.removeChild(downloadEl);
};

// 打包下载图片/pdf（两个以上才打包）
const loading = ref<any>(null);
const jsZip = new JSZip();
export const handleBatchDownLoadImgOrPdf = (url: string[], name: string) => {
  const flies = jsZip.folder(name);
  const promise = [];
  for (let i = 0; i < url.length; i++) {
    const length = url[i]?.split('.').length;
    const type = url[i]?.split('.')?.[length - 1];
    console.log(type, 'type');
    const item = new Promise((resolve, reject) => {
      try {
        fetch(url[i]).then((res) => {
          res.blob().then((blob) => {
            resolve(flies?.file(`${name}-${i + 1}.${type}`, blob, { binary: true }));
          });
        });
      } catch (e) {
        reject('下载错误');
      }
    });
    promise.push(item);
  }
  return promise;
};

/**
 * url: 文件地址（后端返回的oss地址）
 * name: 打包的文件名
*/
export const handleZipDownLoad = (url: string[], name: string = '附件') => {
  try {
    if (!url.length) return;
    if (url.length > 1) {
      loading.value = ElLoading.service({
        lock: true,
        text: '正在打包中...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      Promise.all(handleBatchDownLoadImgOrPdf(url, name))
        .then(() => {
          jsZip.generateAsync({ type: 'blob' })
            .then((content) => {
              FileSaver.saveAs(content, `${name}.zip`);
              loading.value?.close();
            });
        });
    }
  } catch (e) {
    console.log('打包下载失败');
    loading.value?.close();
  }
};

/**
 * url：可访问的文件地址
*/
export const handleDownLoadFile = (url: string, fileName: string) => {
  loading.value = ElLoading.service({
    lock: true,
    text: '正在下载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  try {
    const length = url?.split('.').length;
    const type = url?.split('.')?.[length - 1];
    fetch(url).then((res) => {
      res.blob().then((blob) => {
        const downUrl = window.URL.createObjectURL(blob);
        const downloadElement = document.createElement('a');
        document.body.appendChild(downloadElement);
        downloadElement.href = downUrl;
        downloadElement.download = `${fileName}.${type}`;
        downloadElement.click();
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(downUrl);
        loading.value?.close();
      });
    });
  } catch (e) {
    console.log('下载错误');
  }
};
