import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
export class ScriptParser {
    parse(code, opt) {
        const ast = parse(code, {
            sourceType: 'unambiguous',
            plugins: ['typescript', 'jsx'],
        });
        traverse(ast, opt);
        return generate(ast).code;
    }
}
export const scriptParser = new ScriptParser();
//# sourceMappingURL=index.js.map