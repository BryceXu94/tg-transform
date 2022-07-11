<template>
  <app-page class="contract_archives__list">
    <template #fheader>
      <search-area
        v-model="params"
        @handleSearch="handleSearch"
        @handleReset="handleReset"
        :config="config"
      />
    </template>
    <template #header>
      <header-area>
        <template #default>
          <condition-select
            :conditionInfo="statusConditionInfo"
            v-model="params.contractState"
            @conditionChange="handleSearch()"
          />
        </template>
      </header-area>
    </template>
    <template #main="{ height }">
      <tgo-table
        :height="height"
        :key="height"
        :data="tableData"
        :columns="columns"
      ></tgo-table>
    </template>
    <template #ffooter>
      <el-row
        style="width: 100%"
        type="flex"
        justify="end"
      >
        <pagination
          :total="tableTotal"
          :current-page="params.pageNum"
          :page-size="params.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </template>
  </app-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { useColumns } from './use-columns';
import { useList } from '@/hooks/use-list';

import { getCustomerInfoPageApi } from '../../api';
import {
  IContractArchivesPageReq,
  IContractArchivesPageRes,
} from '../../api/type';
import { CONTRACT_STATE_LIST } from '../../constant';
import { usePermissionConfig } from '../../use-permission-config';
import { handleZipDownLoad, handleDownLoadFile } from '@/core/utils/download';
import { ElLoading } from 'element-plus';

const {
  params,
  tableTotal,
  tableData,
  handleSearch,
  handleReset,
  handleSizeChange,
  handleCurrentChange,
} = useList<IContractArchivesPageRes, IContractArchivesPageReq>({
  request: {
    api: getCustomerInfoPageApi,
    params: {
      pageNum: 1,
      pageSize: 10,
      firstParty: '', // 甲方对象
      secondParty: '', // 乙方对象
      platformOrderCode: '', // 平台单号
      demandCode: '', // 需求单号
      contractState: '',
    },
  },
});

handleSearch();

const {
  CAN__PREVIEW_CONTRACT,
  CAN__DOWNLOAD_CONTRACT,
} = usePermissionConfig();

// 获取高度
const handleGetHeight = async (imgData: string[]) => {
  const promise: any = [];
  let maxWidth = 0;
  let totalHeight = 0;
  imgData.forEach((url: string) => {
    const item = new Promise((resolve) => {
      const imgDom = new Image();
      imgDom.src = url;
      imgDom.onload = () => {
        resolve({
          height: imgDom.height,
          width: imgDom.width,
        });
      };
    });
    promise.push(item);
  });
  await Promise.all(promise).then((res) => {
    maxWidth = Math.max(...res.map(info => info.width));
    totalHeight = res.map(info => info.height).reduce((sum, item) => {
      return sum + item;
    }, 0);
  });
  return {
    maxWidth,
    totalHeight,
  };
};

const loading = ref<InstanceType<typeof ElLoading | any> | null>(null);
// 多张图片预览（多张图片转换成一张图片）
const canvasDrawImage = async (imgData: string[]) => {
  loading.value = ElLoading.service({
    lock: true,
    text: '正在预览中...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  // 初始化canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;

  // 获取canvas宽高，宽度为图片的最大宽度，高度为所有图片的高度之和
  await handleGetHeight(imgData).then((res) => {
    const { maxWidth, totalHeight } = res;
    canvas.width = maxWidth; // 画布宽
    canvas.height = totalHeight; // 画布高
  });

  let beforeHeight = 0;
  const promise: any[] = [];
  imgData.forEach((url) => {
    if (url) {
      // 因为图片加载会有延迟，因此使用promise 保证合并图片的正确性
      const item = new Promise((resolve) => {
        const imgUpload = new Image();
        // 防止跨域
        imgUpload.setAttribute('crossOrigin', 'anonymous');
        imgUpload.src = url;
        imgUpload.onload = () => {
          context.drawImage(imgUpload, 0, beforeHeight, imgUpload.width, imgUpload.height);
          // 多图绘制，下一张的y应该是上一张的高度
          beforeHeight += imgUpload.height;
          resolve(true);
        };
      });
      promise.push(item);
    }
  });

  Promise.all(promise).then(() => {
    try {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      // 将canvas转换成blob，再转换成url
      canvas.toBlob((blob) => {
        const src = URL.createObjectURL(blob!);
        window.open(src);
        loading.value?.close();
        // URL.revokeObjectURL(src);
      });
    } catch (e) {
      console.log(e);
      loading.value?.close();
    }
  });
};

// 预览合同
const handlePreview = (url: string[]) => {
  if (!url?.length) return;
  if (url?.length === 1) {
    const { length } = url[0].split('.');
    const type = url[0].split('.')[length - 1];
    if (type === 'pdf') {
      // 防止直接下载
      window.open(`${url[0]}?response-content-type=application/pdf`);
    } else {
      window.open(url[0]);
    }
  } else {
    // pdf和png混合
    const imgList = url.filter((info) => {
      const { length } = info.split('.');
      const type = info.split('.')[length - 1];
      return ['png', 'jpg', 'jpeg'].includes(type);
    });
    const otherList = url.filter((info) => {
      const { length } = info.split('.');
      const type = info.split('.')[length - 1];
      return type === 'pdf';
    });

    if (imgList.length) {
      if (imgList.length > 1) {
        canvasDrawImage(imgList);
      } else {
        window.open(imgList[0]);
      }
    }

    // pdf
    if (otherList.length) {
      for (let i = 0; i < otherList.length; i++) {
        window.open(`${url[i]}?response-content-type=application/pdf`);
      }
    }
  }
};

// 下载合同（pdf跳过浏览器预览直接下载，单张直接下载，多张打包下载）
const handleDownLoad = (url: string[], name: string) => {
  try {
    if (!url.length) return;
    if (url.length > 1) {
      handleZipDownLoad(url, name);
    } else {
      handleDownLoadFile(url[0], name);
    }
  } catch (e) {
    console.log('下载失败');
  }
};

// 列表
const { columns } = useColumns(
  handlePreview,
  handleDownLoad,
  CAN__PREVIEW_CONTRACT.value,
  CAN__DOWNLOAD_CONTRACT.value,
);

const config = ref([
  {
    name: '甲方对象：',
    component: 'input',
    valueName: 'firstParty',
    placeholder: '请输入甲方对象',
  },
  {
    name: '乙方对象：',
    component: 'input',
    valueName: 'secondParty',
    placeholder: '请输入乙方对象',
  },
  {
    name: '平台单号：',
    component: 'input',
    valueName: 'platformOrderCode',
    placeholder: '请输入平台单号',
  },
  {
    name: '需求单号：',
    component: 'input',
    valueName: 'demandCode',
    placeholder: '请输入需求单号',
  },
]);

const statusConditionInfo = ref({
  title: '档案状态：',
  conditionList: [
    {
      label: '全部',
      value: '',
    },
    ...CONTRACT_STATE_LIST,
  ],
});

</script>
