import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { cwd } from 'node:process';
import { vueParser } from '../parser/vue';
import { scriptParser } from '../parser/script';
import { IFiles, PARSER_ENUM } from '../types';
import { getFilesPath } from '../utils/read-files';
import { prettierFormat } from '../utils/prettier'

const sourceDir = `${cwd()}/src`;
// const outputDir = join(__dirname, '../../output2');

async function readFile(file: IFiles[0]) {
  const { name, path } = file;
  const suffix = name.split('.').pop();
  let parser = PARSER_ENUM.BABEL;
  let outputCode = '';
  const code = readFileSync(path, {
    encoding: 'utf-8'
  });
  switch (suffix) {
    case 'ts':
    case 'tsx':
      parser = PARSER_ENUM.TS;
      outputCode = scriptParser.parse(code)
      break;
    case 'js':
    case 'jsx':
      parser = PARSER_ENUM.BABEL;
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
  // const outputPath = path.replace(tempDir, outputDir);
  // const dirPaths = outputPath.replace(outputDir, '').replace(name, '').split('/').filter(v => v);
  // let curDir = outputDir;
  // dirPaths.forEach(v => {
  //   curDir += `/${v}`
  //   if (!existsSync(curDir)) {
  //     mkdirSync(curDir);
  //   }
  // })
  writeFileSync(path, outputCode)
}

const run = () => {
  // const isExist = existsSync(outputDir);
  // if (!isExist) {
  //   mkdirSync(outputDir);
  // }
  const paths = getFilesPath(sourceDir);
  paths.forEach(v => {
    readFile(v)
  })
};
run();

