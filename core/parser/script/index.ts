import { parse } from '@babel/parser';
import traverse, { TraverseOptions, NodePath } from '@babel/traverse';
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
        enter(path) {
          let elementPath: any = null;
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
                elementPath = curPath;
                // curPath.remove();
              }
            },
          })
          if (usedElement) {
            const uses = names.length === 0 ? 'TgComponents' : `{${names.join(',')}}`
            const tg = template(`import ${uses} from '@tiangong/components';`)()
            elementPath!.insertBefore(tg);
            elementPath!.remove();
          }
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
          } else if (nameNode.name.indexOf('El') === 0) {
            nameNode.name = nameNode.name.replace(/^El/, 'Tg');
          }
        }
      },
      JSXClosingElement: {
        enter(path) {
          const nameNode = (path.get('name') as any).node as any;
          if (nameNode.name.indexOf('el-') === 0) {
            nameNode.name = nameNode.name.replace(/^el-/, 'tg-');
          } else if (nameNode.name.indexOf('El') === 0) {
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
        },
      },
      Identifier: {
        enter(path) {
          const name = path.node.name;
          if (name && name.indexOf('El') === 0) {
            if (name === 'ElementPlus') {
              path.node.name = 'TgComponents';
            } else {
              path.node.name = path.node.name.replace(/^El/, 'Tg');
            }
          }
        },
      },
    });
    return generate(ast).code;
  }
}
export const scriptParser = new ScriptParser();