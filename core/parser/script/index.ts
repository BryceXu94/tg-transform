import { parse } from '@babel/parser';
import traverse, { TraverseOptions } from '@babel/traverse';
import generate from '@babel/generator';
import template from '@babel/template';

export class ScriptParser {
  parse(code: string, opt?: TraverseOptions) {
    const ast =  parse(code, {
      sourceType: 'unambiguous',
      plugins: ['typescript', 'jsx'],
    })
    // traverse(ast, opt);
    
    traverse(ast, {
      Program: {
        enter(path, state) {
          const names: string[] = [];
          let usedElement = false;
          path.traverse({
            ImportDeclaration(curPath) {
              const requirePath = curPath.get('source').node.value;
              if (requirePath === 'element-plus') {
                usedElement = true;
                const specifiers = curPath.get('specifiers');
                specifiers.forEach(v => {
                  const name = (v.node as any)?.imported?.name;
                  if (name) {
                    names.push(name.replace(/^El/, 'Tg'))
                  }
                })
                curPath.remove();
              }
            },
          })
          if (usedElement) {
            const tg = template(`import {${names.join(',')}} from '@tiangong/components';`)()
            Array.isArray(tg) ? path.node.body.unshift(...tg): path.node.body.unshift(tg);
          }
          // if (!(state as any).tgPath) {
          // }
        }
      },
      // 处理ts声明
      // TSUnionType: {
      //   enter(path){
      //     const types = path.get('types');
      //     types.forEach((v: any) => {
      //       const exprName = (v?.node as any)?.exprName;
      //       if(exprName && exprName.name && exprName.name.indexOf('El') === 0) {
      //         v.node.exprName.name = v.node.exprName.name.replace(/^El/, 'Tg');
      //       }
      //     })
      //   }
      // },
      // 处理jsx
      JSXOpeningElement: {
        enter(path) {
          const nameNode = (path.get('name') as any).node as any;
          if (nameNode.name.indexOf('el-') === 0) {
            console.log('name', nameNode);
            nameNode.name = nameNode.name.replace(/^el-/, 'tg-');
          } else if (nameNode.name.indexOf('El') === 0) {
            console.log('name', nameNode);
            nameNode.name = nameNode.name.replace(/^El/, 'Tg');
          }
        }
      },
      JSXClosingElement: {
        enter(path) {
          const nameNode = (path.get('name') as any).node as any;
          if (nameNode.name.indexOf('el-') === 0) {
            console.log('name', nameNode);
            nameNode.name = nameNode.name.replace(/^el-/, 'tg-');
          } else if (nameNode.name.indexOf('El') === 0) {
            console.log('name', nameNode);
            nameNode.name = nameNode.name.replace(/^El/, 'Tg');
          }
        }
      },
      TSTypeQuery: {
        enter(path) {
          const exprName = path.get('exprName') as any;
          const name = exprName.node.name;
          if (name && name.indexOf('El') === 0) {
            exprName.node.name = exprName.node.name.replace(/^El/, 'Tg');
          }
          console.log('exprName.node.name', exprName.node.name);
          
        },
      },
    });
    return generate(ast).code;
  }
}
export const scriptParser = new ScriptParser();