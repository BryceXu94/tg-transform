import { parse } from '@vue/compiler-sfc';
import { scriptParser } from '../script';
import { htmlParser } from '../html';
class VueParser {
    parse(code) {
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
                    start: scriptLoc.start.offset,
                    end: scriptLoc.end.offset,
                },
            },
            {
                type: 'template',
                offset: {
                    start: templateLoc.start.offset,
                    end: templateLoc.end.offset,
                },
            },
        ].sort((a, b) => a.offset.start - b.offset.start);
        let curOffset = 0;
        let outputCode = '';
        pos.forEach((v, i) => {
            if (v.offset.start > curOffset) {
                outputCode += source.substring(curOffset, v.offset.start);
                if (v.type === 'template') {
                    if (template) {
                        const outputHtmlCode = htmlParser.parse(template);
                        outputCode += outputHtmlCode;
                        curOffset = v.offset.end - 1;
                    }
                }
                else if (v.type === 'script') {
                    if (script) {
                        const scriptCode = scriptParser.parse(script);
                        outputCode += scriptCode;
                        curOffset = v.offset.end - 1;
                    }
                }
            }
            if (i === pos.length - 1 && curOffset !== source.length - 1) {
                outputCode += source.substring(curOffset, source.length);
            }
        });
    }
}
export const vueParser = new VueParser();
//# sourceMappingURL=index.js.map