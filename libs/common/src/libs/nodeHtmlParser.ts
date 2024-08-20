import { HTMLElement, parse as parseHtml } from 'node-html-parser';

export { HTMLElement };

export class NodeHtmlParser {
  public constructor() {}

  public parseHtml(htmlContent: string): HTMLElement {
    console.log('parsing html');
    return parseHtml(htmlContent);
  }
}
