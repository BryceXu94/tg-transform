import { readdir } from 'fs-extra';
import { IFiles } from '../types';

export const getFilesPath = async (path: string) => {
  const files: IFiles = [];
  await deep(path, files);
  return files;
}

async function deep(path: string, files: IFiles) {
  const paths = await readdir(path, { withFileTypes: true });
  for (const v of paths) {
    const isDirectory = v.isDirectory();
    const curFilePath = `${path}/${v.name}`;
    if (isDirectory) {
      await deep(curFilePath, files);
    } else {
      files.push({
        name: v.name,
        path: curFilePath,
      })
    }
  }
}