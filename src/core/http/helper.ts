import { isObject, cloneDeep, debounce } from 'lodash-es';

import { ElLoading } from 'element-plus';
import { LoadingInstance } from 'element-plus/lib/components/loading/src/loading';

let needLoadingRequestCount = 0;
let loadingInstance: LoadingInstance | null = null;

function startLoading(message = '') {
  loadingInstance = ElLoading.service({
    text: message,
  });
}

function endLoading() {
  if (loadingInstance) {
    loadingInstance.close();
  }
  loadingInstance = null;
}

function tryCloseLoading() {
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
}

export function showFullScreenLoading(message = ''): void {
  if (needLoadingRequestCount === 0) {
    startLoading(message);
  }
  needLoadingRequestCount += 1;
}

export function hideFullScreenLoading(): void {
  if (needLoadingRequestCount <= 0) {
    return;
  }
  needLoadingRequestCount -= 1;
  if (needLoadingRequestCount === 0) {
    debounce(tryCloseLoading, 300)();
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isEmpty(val: any): boolean {
  return val === null || val === '' || val === undefined;
}

/* eslint-disable */
export const deepDeleteEmptyValue = (o: any) => {
  if (!isObject(o)) {
    return o;
  }
  const newVal: any = cloneDeep(o);
  for (const key in newVal) {
    if (!newVal.hasOwnProperty(key)) {
      continue;
    }
    if (isObject(newVal[key])) {
      newVal[key] = deepDeleteEmptyValue(newVal[key]);
      continue;
    }
    if (isEmpty(newVal[key])) {
      delete newVal[key];
    }
  }
  return newVal;
};
