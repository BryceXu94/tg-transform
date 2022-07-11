import { ElImage } from 'element-plus';
import type { InjectionKey } from 'vue';

export interface IFile {
  url: string;
  name?: string;
}

export interface TFileData extends IFile {
  name: string;
  size: string | number;
  type: string;
}

export interface IFakeFileData extends TFileData {
  loading?: boolean;
}

export interface IFileData extends Partial<IFakeFileData> {
  url: string;
}

export type ImageEl = InstanceType<typeof ElImage>;

export interface ICompress {
  /** 是否压缩 */
  isCompress: boolean;
  /** 压缩后的图片宽度 （按照比例压缩） */
  compressWidth: number;
}

export type TOnMove = (nextIndex: number, currIndex: number, file: IFileData) => void | Promise<void>;

export type TOnRemove = (index: number, file: IFileData) => void | Promise<void>;

export interface UploaderContext {
  size: 'medium' | 'small' | 'mini';
  name: string;
  preview: boolean;
  pasteAutoUpload: boolean;
  multiple: boolean;
  disabled: boolean;
  move: boolean;
  remove: boolean;
  emit: (evt: 'change' | 'update:modelValue', ...args: any[]) => void;
  uploadFiles(files: FileList): Promise<void>;
  onMove?: TOnMove;
  onRemove?: TOnRemove;
}

export const uploaderKey: InjectionKey<UploaderContext> = 'uploader' as any;
