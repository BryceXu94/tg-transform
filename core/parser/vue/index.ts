import { parse } from '@vue/compiler-sfc';
import { scriptParser } from '../script';
import { htmlParser } from '../html';

class VueParser {
  parse(code: string) {
    const ast = parse(code);
    const source = ast.descriptor.source;
    const scriptObj = ast.descriptor.script || ast.descriptor.scriptSetup;
    const script = scriptObj?.content;
    const scriptLoc = scriptObj?.loc;
    const template = ast.descriptor.template?.content;
    const templateLoc = ast.descriptor.template?.loc;
    const pos = [
      {
        type: 'script',
        offset: {
          start: scriptLoc?.start.offset || 0,
          end: scriptLoc?.end.offset || 0,
        },
      },
      {
        type: 'template',
        offset: {
          start: templateLoc?.start.offset || 0,
          end: templateLoc?.end.offset || 0,
        },
      },
    ].sort((a,b) => a.offset.start - b.offset.start);
    let curOffset = 0;
    let outputCode = '';
    let parsed = false;
    pos.forEach((v, i) => {
      if (v.offset.start > curOffset) {
        outputCode += source.substring(curOffset, v.offset.start);
        if (v.type === 'template') {
          if (template) {
            const {
              code: outputHtmlCode,
              parsed: htmlParsed
            } = htmlParser.parse(template)
            if (htmlParsed) {
              outputCode += outputHtmlCode;
              parsed = true;
            } else {
              outputCode += template;
            }
            curOffset = v.offset.end - 1;
          }
        } else if (v.type === 'script') {
          if (script) {
            const {
              code: scriptCode,
              parsed: scriptParsed
            } = scriptParser.parse(script)
            if (scriptParsed) {
              outputCode += scriptCode;
              parsed = true;
            } else {
              outputCode += script;
            }
            curOffset = v.offset.end - 1;
          }
        }
      }
      if (!parsed) {
        return {
          code,
          parsed
        };
      }
      if (i === pos.length - 1 && curOffset !== source.length - 1) {
        outputCode += source.substring(curOffset, source.length);
      }
    })
    return {
      code: outputCode,
      parsed
    };
  }
}

export const vueParser = new VueParser();