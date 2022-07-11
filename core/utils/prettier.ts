import prettierEslint from 'prettier-eslint'
import { ESLint } from 'eslint'
import { readdir } from 'fs-extra';
import { cwd } from 'node:process';
import { PARSER_ENUM } from '../types';

const eslint = new ESLint();

const readPrettierConfig = async () => {
  const rootDir = cwd();
  const files = await readdir(rootDir);
  let prettierConfig = {};
  if (files.includes('.prettierrc.js')) {
    prettierConfig = require(`${rootDir}/.prettierrc.js`)
  }
  return prettierConfig;
};
const readEslintConfig = async () => {
  const rootDir = cwd();
  const files = await readdir(rootDir);
  let eslintConfig = {};
  if (files.includes('.eslintrc.js')) {
    eslintConfig = eslint.calculateConfigForFile(`${rootDir}/.eslintrc.js`)
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