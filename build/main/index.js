"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.run=exports.sourceDir=void 0;const tslib_1=require("tslib"),fs_extra_1=require("fs-extra"),node_process_1=require("node:process"),chalk_1=tslib_1.__importDefault(require("chalk")),vue_1=require("../parser/vue"),script_1=require("../parser/script"),types_1=require("../types"),read_files_1=require("../utils/read-files"),prettier_1=require("../utils/prettier"),progress_1=require("../utils/progress"),queue_1=require("../utils/queue"),exec_1=require("../utils/exec");async function parseFile(_){return new Promise(async e=>{const{name:r,path:s}=_;var t=r.split(".").pop();let a=types_1.PARSER_ENUM.UN_KNOW,i="";switch(t){case"ts":case"tsx":a=types_1.PARSER_ENUM.TS;break;case"js":case"jsx":a=types_1.PARSER_ENUM.BABEL;break;case"vue":a=types_1.PARSER_ENUM.VUE}if(a===types_1.PARSER_ENUM.UN_KNOW)return progress_1.progress.add(),void e(!0);var u=await(0,fs_extra_1.readFile)(s,{encoding:"utf-8"});switch(t){case"ts":case"tsx":i=script_1.scriptParser.parse(u);break;case"vue":i=vue_1.vueParser.parse(u),a=types_1.PARSER_ENUM.VUE}i=await(0,prettier_1.prettierFormat)(i,a),progress_1.progress.add(),await(0,fs_extra_1.writeFile)(s,i),e(!0)})}exports.sourceDir=(0,node_process_1.cwd)()+"/src";const run=async()=>{var e=await(0,read_files_1.getFilesPath)(exports.sourceDir);progress_1.progress.setTotal(e.length);const r=[];for(const s of e)r.push(queue_1.queue.run(async()=>{await parseFile(s)}));await Promise.all(r),console.log(chalk_1.default.blue("正在执行eslint fix")),await(0,exec_1.exec)("npx",["eslint","--fix","--ext",".js,.vue,.jsx,.tsx,.ts","src"]),console.log(chalk_1.default.green("任务完成"))};exports.run=run;