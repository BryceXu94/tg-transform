import { spawn } from 'child_process';

export const exec = (cmd, args) => {
  return new Promise((resolve, reject) => {
     const child = spawn(cmd, args, {
      cwd: process.cwd(),
      stdio: 'inherit',
     })
     child.on('error', () => {
      reject()
     })
     child.on('exit', () => {
      resolve(true);
     })
  })
}