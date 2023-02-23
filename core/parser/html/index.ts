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
    let parsed = false;
    this.traverse(ast, {
      enter(path) {
        const { type, tagName  } = path;
        if (type && tagName && type === 'element' && tagName.indexOf('el-') === 0) {
          path.tagName = path.tagName!.replace(/^el-/, 'tg-');
          parsed = true;
        }
      },
    });
    if (!parsed) {
      return {
        code,
        parsed
      };
    }
    return {
      code: toHTML(ast) as string,
      parsed
    };
  }
  private traverse(node: INode, opt: IOptions) {
    const { enter } = opt;
    enter?.(node);
    if (node?.children?.length && enter) {
      node.children.forEach(v => {
        this.traverse(v, {
          enter,
        })
      })
    }
  }
}

export const htmlParser = new HtmlParser();