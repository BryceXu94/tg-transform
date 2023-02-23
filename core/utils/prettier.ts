import prettier from 'prettier'
import { ESLint } from 'eslint'
import { readdir } from 'fs-extra';
import { cwd } from 'node:process';
import { PARSER_ENUM } from '../types';

const eslint = new ESLint();

let prettierConfig = null;
const readPrettierConfig = async () => {
  if (prettierConfig) return prettierConfig;
  const rootDir = cwd();
  prettierConfig = await prettier.resolveConfig(rootDir) || {
    // 每行最大字符数
    "printWidth": 120,
    // 缩进的宽度
    "tabWidth": 2,
    // 使用tab缩进
    "useTabs": false,
    // 语句末尾必须有分号
    "semi": true,
    // 强制单引号
    "singleQuote": true,
    // JSX强制单引号
    "jsxSingleQuote": true,
    // 在多行逗号分隔的句法结构中尽可能打印尾随逗号
    "trailingComma": 'es5',
    // 在对象文字中的括号之间打印空格
    "bracketSpacing": true,
    // 不单独将元素的“>”符号另起一行
    "bracketSameLine": false,
    // 在唯一的箭头函数参数周围包含括号  always=始终包括括号 avoid=尽可能省略括号
    "arrowParens": "avoid",
    "htmlWhitespaceSensitivity": "strict",
    // 是否缩进 Vue 文件中的代码<script>和<style>标签
    "vueIndentScriptAndStyle": false,
    "singleAttributePerLine": true,
  };
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
  // const eslintConfig = await readEslintConfig();
  const prettierConfig = await readPrettierConfig();
  const outputCode = await prettier.format(code, {
    parser,
    ...prettierConfig,
  });
  return outputCode;
}