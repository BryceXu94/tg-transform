import { parse } from '@babel/parser';
import traverse, { TraverseOptions } from '@babel/traverse';
import generate from '@babel/generator';
import template from '@babel/template';

export class ScriptParser {
  parse(code: string, opt?: TraverseOptions) {
    const ast =  parse(code, {
      sourceType: 'unambiguous',
      plugins: [
        'typescript',
        'jsx'
      ],
    })
    // traverse(ast, opt);
    
    traverse(ast, {
      Program: {
        enter(path) {
          path.traverse({
            ImportDeclaration(curPath) {
              const requirePath = curPath.get('source').node.value;
              // 处理element-plus的引用
              if (requirePath === 'element-plus') {
                const specifiers = curPath.get('specifiers');
                const importKind = curPath.node.importKind;
                let type = null;
                const names: string[] = [];
                specifiers.forEach(v => {
                  const name = (v.node as any)?.imported?.name;
                  type = v.type;
                  if (name) {
                    names.push(name.replace(/^El/, 'Tg'))
                  }
                })
                let uses = '';
                // importKind=type 说明是 import type {} from '***'
                // importKind=value 说明是 import {} from '***'
                // type=ImportSpecifier 说明是 import {} from '***'
                // type=ImportDefaultSpecifier 说明是 import ElementPlus from '***'
                if (importKind === 'type' && type === 'ImportSpecifier') {
                  uses = `type {${names.join(',')}}`
                } else if (importKind === 'value' && type === 'ImportDefaultSpecifier') {
                  uses = 'TgComponents'
                } else if (importKind === 'value' && type === 'ImportSpecifier') {
                  uses = `{${names.join(',')}}`
                }
                const tg = template(`import ${uses} from '@tiangong/components';`, { plugins: ['jsx','typescript'] })();
                curPath.insertBefore(tg);
                curPath.remove();
              } else if (requirePath === 'element-plus/lib/locale/lang/zh-cn') {
                curPath.get('source').node.value = '@tiangong/components/lib/lang/zh-cn';
              } else if (requirePath.indexOf('element-plus') === 0) {
                curPath.get('source').node.value = '@tiangong/components';
              }
            },
          })
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
            nameNode.name = nameNode.name.replace(/^el-/, 'tg-');
          } else if (/^El[A-Z]/.test(nameNode.name)) {
            nameNode.name = nameNode.name.replace(/^El/, 'Tg');
          }
        }
      },
      JSXClosingElement: {
        enter(path) {
          const nameNode = (path.get('name') as any).node as any;
          if (nameNode.name.indexOf('el-') === 0) {
            nameNode.name = nameNode.name.replace(/^el-/, 'tg-');
          } else if (/^El[A-Z]/.test(nameNode.name)) {
            nameNode.name = nameNode.name.replace(/^El/, 'Tg');
          }
        }
      },
      TSTypeQuery: {
        enter(path) {
          const exprName = path.get('exprName') as any;
          const name = exprName.node.name;
          if (name && /^El[A-Z]/.test(name)) {
            exprName.node.name = exprName.node.name.replace(/^El/, 'Tg');
          }
        },
      },
      Identifier: {
        enter(path) {
          const name = path.node.name;
          if (name && /^El[A-Z]/.test(name) || name === 'ElementPlus') {
            if (name === 'ElementPlus') {
              path.node.name = 'TgComponents';
            } else {
              path.node.name = path.node.name.replace(/^El/, 'Tg');
            }
          }
        },
      },
    });
    return generate(ast, {
      retainLines: true,
    }, code).code;
  }
}
export const scriptParser = new ScriptParser();