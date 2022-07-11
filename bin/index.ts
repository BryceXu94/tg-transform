#!/usr/bin/env node
import { program } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
// const chalk = require('chalk');

console.log('ora', ora);
const spinner = ora(chalk.bgGray('12312')).start();
setTimeout(() => {
  spinner.color = 'red'
  spinner.text = 'blue'
  // spinner.stop();
  
}, 3000);
// program.command('parse');

// program.parse();

// const options = program.opts();
// const limit = options.first ? 1 : undefined;
