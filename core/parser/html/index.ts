import { HtmlParser as Parser } from '@starptech/webparser';
import fromWebparser from '@starptech/hast-util-from-webparser';
import toHTML from '@starptech/prettyhtml-hast-to-html';

type INode = ReturnType<typeof fromWebparser>;
type IOptions = {
  enter?:(node: INode) => void
}

class HtmlParser {
  private parser = new Parser();
  parse(code: string) {
    const ast = fromWebparser(this.parser.parse(code, '').rootNodes);
    this.traverse(ast, {});
    return toHTML(ast) as string;
  }
  private traverse(node: INode, opt: IOptions) {
    const { enter } = opt;
    if (node?.children?.length && enter) {
      enter?.(node);
      node.children.forEach(v => {
        this.traverse(v, {
          enter,
        })
      })
    }
  }
}

export const htmlParser = new HtmlParser();