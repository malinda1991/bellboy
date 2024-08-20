import puppeteer from 'puppeteer';

type PuppeteerParams = {
  url: string;
  querySelector: string;
  timeout?: number;
};

export class Puppeteer {
  private url: string;
  private querySelector: string;
  private extractedHtmlData: string[];
  private timeout: number;

  public constructor({ url, querySelector, timeout }: PuppeteerParams) {
    this.url = url;
    this.querySelector = querySelector;
    this.timeout = timeout || 30000;
  }

  public getExtractedHtmlData = (): string[] => {
    return this.extractedHtmlData;
  };

  public runExtraction = async (): Promise<void> => {
    console.log('Begining extraction from ', this.url);
    const browser = await puppeteer.launch();
    try {
      const page = await browser.newPage();
      await page.goto(this.url, {
        waitUntil: 'networkidle2',
        timeout: this.timeout,
      });

      this.extractedHtmlData = await page.evaluate(
        ({ querySelector }) => {
          return [...document.querySelectorAll(querySelector)].map(
            (element) => {
              return element.innerHTML;
            },
          );
        },
        {
          querySelector: this.querySelector,
        },
      );
    } catch (error) {
      console.error('Error caught while web scraping', error);
    } finally {
      await browser.close();
      console.log('Extraction finished');
    }
  };
}
