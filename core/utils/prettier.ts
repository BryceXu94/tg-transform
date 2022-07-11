import prettierEslint from 'prettier-eslint'
import { ESLint } from 'eslint'
import { readdirSync } from 'fs';
import { cwd } from 'node:process';
import { PARSER_ENUM } from '../types';

const eslint = new ESLint();

const readPrettierConfig = () => {
  const rootDir = cwd();
  const files = readdirSync(rootDir);
  let prettierConfig = {};
  if (files.includes('.prettierrc.js')) {
    prettierConfig = require(`${rootDir}/.prettierrc.js`)
  }
  return prettierConfig;
};
const readEslintConfig = () => {
  const rootDir = cwd();
  const files = readdirSync(rootDir);
  let eslintConfig = {};
  if (files.includes('.eslintrc.js')) {
    eslintConfig = eslint.calculateConfigForFile(`${rootDir}/.eslintrc.js`)
  }
  return eslintConfig;
};

export const prettierFormat = async (code: string, parser: PARSER_ENUM) => {
  const eslintConfig = readEslintConfig();
  const prettierConfig = readPrettierConfig();
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