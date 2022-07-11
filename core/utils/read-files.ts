import { readdirSync } from 'fs';
import { IFiles } from '../types';

export const getFilesPath = (path: string) => {
  const files: IFiles = [];
  deep(path, files);
  return files;
}

function deep(path: string, files: IFiles) {
  const paths = readdirSync(path, { withFileTypes: true });
  paths.forEach(v => {
    const isDirectory = v.isDirectory();
    const curFilePath = `${path}/${v.name}`;
    if (isDirectory) {
      deep(curFilePath, files);
    } else {
      files.push({
        name: v.name,
        path: curFilePath,
      })
    }
  })
}