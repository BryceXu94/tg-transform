#!/usr/bin/env node
const { program } = require('commander');
const inquirer = require('inquirer');
const clark = require('chalk');
const ora = require('ora');
const { existsSync } = require('fs');
const { run, sourceDir } = require('../build/main/index');
program
  .command('parse')
  .description('将element-plus转为tiangong-components')
  .action(async () => {
    const isExists = existsSync(sourceDir)
    if (isExists) {
      const promptName = `将对${sourceDir}进行转换`;
      const res = await inquirer.prompt([
        {
          name: promptName,
          default: 'Y/N',
          
        }
      ])
      if (res[promptName] === 'Y') {
        await run();
      }
    } else {
      ora(clark.red(`${sourceDir} 文件夹不存在`)).fail();
    }
  })

program
  .version(`tg-components-transform@${require('../package.json').version}`);

//解析用户传入的命令
program.parse(process.argv);