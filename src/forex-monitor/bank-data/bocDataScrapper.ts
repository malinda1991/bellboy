import { ForexCurrency, ForexScrapLocations, Bank } from '../config';
import { Puppeteer, NodeHtmlParser } from '@common';
import type { HTMLElement } from '@common';

type ForexCurrencyRateData = {
  buyingRate: number;
  sellingRate: number;
  maxRate: number;
  minRate: number;
};

type ForexCurrencyValue = {
  [key in ForexCurrency]?: ForexCurrencyRateData;
};

export class BocDataScrapper {
  private bank: Bank;
  private scrapLocation: string;
  private webExtractor: Puppeteer;
  private scrapedForexData: ForexCurrencyValue;
  private htmlParser: NodeHtmlParser;

  public constructor() {
    this.bank = Bank.BOC;
    this.scrapLocation = ForexScrapLocations.BOC;
    this.webExtractor = new Puppeteer({
      url: this.scrapLocation,
      querySelector: '#exchange-rates tbody tr',
      timeout: 90000,
    });
    this.scrapedForexData = {};
    this.htmlParser = new NodeHtmlParser();
  }

  private printScrappedData = (): void => {
    if (Object.keys(this.scrapedForexData).length > 0) {
      console.log(this.scrapedForexData);
    } else {
      console.log('No data were extracted');
    }
  };

  public runScrapper = async () => {
    const formatCellValuetoFloat = (cell: HTMLElement) => {
      let cellText = cell.textContent;
      if (cellText && cellText !== '-') {
        // is a valid value
        cellText = cellText.replace(',', '');
        return parseFloat(cellText);
      } else {
        // is not a valid value
        return 0;
      }
    };

    const getMaxMinRates = (
      cells: HTMLElement[],
    ): {
      maxRate: number;
      minRate: number;
    } => {
      let maxRate = 0;
      let minRate = 0;

      cells.forEach((cell, index) => {
        // skip the first cell which contains the currency code
        const cellValue = formatCellValuetoFloat(cell);

        if (index !== 0 && cellValue !== 0) {
          if (maxRate === 0 || cellValue > maxRate) {
            maxRate = cellValue;
          }

          if (minRate === 0 || cellValue < minRate) {
            minRate = cellValue;
          }
        }
      });

      return {
        maxRate,
        minRate,
      };
    };

    await this.webExtractor.runExtraction();

    const extractedHtmlData = this.webExtractor.getExtractedHtmlData();

    extractedHtmlData.forEach((htmlRow) => {
      const tableRow = this.htmlParser.parseHtml(htmlRow);
      const cells = tableRow.getElementsByTagName('td');

      const currencyCell = cells[0];
      const buyingRateCell = cells[1];
      const sellingRateCell = cells[2];

      const maxMinRates = getMaxMinRates(cells);

      const currencyCode = currencyCell.textContent.trim();

      this.scrapedForexData[currencyCode] = {
        buyingRate: formatCellValuetoFloat(buyingRateCell),
        sellingRate: formatCellValuetoFloat(sellingRateCell),
        ...maxMinRates,
      };
    });

    this.printScrappedData();
  };
}
