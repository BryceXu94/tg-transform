import prettierEslint from 'prettier-eslint'
import { ESLint } from 'eslint'
import { readdir } from 'fs-extra';
import { cwd } from 'node:process';
import { PARSER_ENUM } from '../types';

const eslint = new ESLint();

let prettierConfig = null;
const readPrettierConfig = async () => {
  if (prettierConfig) return prettierConfig;
  prettierConfig = {};
  const rootDir = cwd();
  const files = await readdir(rootDir);
  if (files.includes('.prettierrc.js')) {
    prettierConfig = require(`${rootDir}/.prettierrc.js`)
  }
  return prettierConfig;
};
let eslintConfig: any = null;
const readEslintConfig = async () => {
  if (eslintConfig) return eslintConfig;
  eslintConfig = {};
  const rootDir = cwd();
  const files = await readdir(rootDir);
  if (files.includes('.eslintrc.js')) {
    eslintConfig = await eslint.calculateConfigForFile(`${rootDir}/.eslintrc.js`)
    eslintConfig.overrideConfig = {
      plugins: eslintConfig.plugins,
    };
    delete eslintConfig.plugins;
    
  }
  return eslintConfig;
};

export const prettierFormat = async (code: string, parser: PARSER_ENUM) => {
  const eslintConfig = await readEslintConfig();
  const prettierConfig = await readPrettierConfig();
  const outputCode = await prettierEslint({
    text: code,
    eslintConfig,
    prettierOptions: {
      parser,
      ...prettierConfig,
    },
  });
  return outputCode;
}