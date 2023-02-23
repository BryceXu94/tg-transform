import { readFile, writeFile } from 'fs-extra';
import { cwd } from 'node:process';
import chalk from 'chalk'
import { vueParser } from '../parser/vue';
import { scriptParser } from '../parser/script';
import { IFiles, PARSER_ENUM } from '../types';
import { getFilesPath } from '../utils/read-files';
import { prettierFormat } from '../utils/prettier'
import { progress } from '../utils/progress'
import { queue } from '../utils/queue'
import { exec } from '../utils/exec'

export const sourceDir = `${cwd()}/src`;

async function parseFile(file: IFiles[0]) {
  return new Promise(async (resolve) => {
    const { name, path } = file;
    const suffix = name.split('.').pop();
    let parser = PARSER_ENUM.UN_KNOW;
    let outputCode = '';
    switch (suffix) {
      case 'ts':
      case 'tsx':
        parser = PARSER_ENUM.TS;
        break;
      case 'js':
      case 'jsx':
        parser = PARSER_ENUM.BABEL;
        break;
      case 'vue': {
        parser = PARSER_ENUM.VUE;
      }
      break;
      default:
        break;
    }
    if (parser === PARSER_ENUM.UN_KNOW) {
      progress.add()
      resolve(true);
      return;
    }
    const code = await readFile(path, {
      encoding: 'utf-8'
    });
    let parsed = false;
    switch (suffix) {
      case 'ts':
      case 'tsx': {
        const res = scriptParser.parse(code);
        if (res.parsed) {
          outputCode = res.code;
          parsed = true;
        }
        break;
      }
      case 'vue': {
        const res = vueParser.parse(code);
        if (res.parsed) {
          outputCode = res.code;
          parsed = true;
          parser = PARSER_ENUM.VUE;
        }
      }
      break;
      default:
        break;
    }
    if (parsed) {
      outputCode = await prettierFormat(outputCode, parser);
    }
    progress.add()
    if (parsed) {
      await writeFile(path, outputCode);
    }
    resolve(parsed);
  })
}

export const run = async () => {
  const st = performance.now();
  const paths = await getFilesPath(sourceDir);
  progress.setTotal(paths.length);
  const arr:Promise<unknown>[]= []
  for(const item of paths) {
    arr.push(queue.run(async () => {
      await parseFile(item);
    }))
  }
  await Promise.all(arr)
  console.log(chalk.blue('正在执行eslint fix'));
  await exec('npx', ['eslint', '--fix', '--ext', '.js,.vue,.jsx,.tsx,.ts', 'src']);
  console.log(chalk.green('任务完成'));
  const et = performance.now();
  console.log(`共${paths.length}个文件，耗时${et-st}ms`);
};

// run();