import { HtmlParser as Parser } from '@starptech/webparser';
import fromWebparser from '@starptech/hast-util-from-webparser';
import toHTML from '@starptech/prettyhtml-hast-to-html';
class HtmlParser {
    parser = new Parser();
    parse(code) {
        const ast = fromWebparser(this.parser.parse(code, '').rootNodes);
        this.traverse(ast, {});
        return toHTML(ast);
    }
    traverse(node, opt) {
        const { enter } = opt;
        if (node?.children?.length && enter) {
            enter?.(node);
            node.children.forEach(v => {
                this.traverse(v, {
                    enter,
                });
            });
        }
    }
}
export const htmlParser = new HtmlParser();
//# sourceMappingURL=index.js.map