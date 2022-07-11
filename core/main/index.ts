import { readFile, writeFile } from 'fs-extra';
import { cwd } from 'node:process';
import { vueParser } from '../parser/vue';
import { scriptParser } from '../parser/script';
import { IFiles, PARSER_ENUM } from '../types';
import { getFilesPath } from '../utils/read-files';
import { prettierFormat } from '../utils/prettier'
import { progress } from '../utils/progress'
import { queue } from '../utils/queue'
import inquirer from 'inquirer';

const sourceDir = `${cwd()}/src`;

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
      resolve(true);
      return;
    }
    const code = await readFile(path, {
      encoding: 'utf-8'
    });
    switch (suffix) {
      case 'ts':
      case 'tsx':
        outputCode = scriptParser.parse(code)
        break;
      case 'vue': {
        outputCode = vueParser.parse(code);
        parser = PARSER_ENUM.VUE;
      }
      break;
      default:
        break;
    }
    outputCode = await prettierFormat(outputCode, parser);
    await writeFile(path, outputCode);
    progress.add()
    resolve(true);
  })
}

const run = async () => {
  const promptName = `将对${sourceDir}进行转换`;
  inquirer.prompt([
    {
      name: promptName,
      default: 'yes',
      
    }
  ]).then(async (res) => {
    if (res[promptName] === 'yes') {
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
      const et = performance.now();
      console.log((et-st)/1000);

    }
  })
  
};
run();

