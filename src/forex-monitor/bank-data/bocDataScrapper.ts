import { ForexCurrency, ForexScrapLocations, Bank } from '../config';

import puppeteer from 'puppeteer';

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
  private scrapedDataSet: ForexCurrencyValue | null;

  public constructor() {
    this.bank = Bank.BOC;
    this.scrapLocation = ForexScrapLocations.BOC;
    this.scrapedDataSet = null;
  }

  private printScrappedData = (): void => {
    console.log(this.scrapedDataSet);
  };

  public runScrapper = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(this.scrapLocation, {
      waitUntil: 'networkidle2',
    });

    this.scrapedDataSet = await page.evaluate(() => {
      // Select all elements with crayons-tag class

      const formatCellValuetoFloat = (cell) => {
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

      const elementsArray = document.querySelectorAll(
        '#exchange-rates tbody tr',
      );

      const result = {};

      elementsArray.forEach((element) => {
        const cells = element.getElementsByTagName('td');
        const currencyCell = cells['0'];
        const buyingRateCell = cells['1'];
        const sellingRateCell = cells['2'];

        let maxRate = 0;
        let minRate = 0;

        Object.keys(cells).forEach((cellKey, index) => {
          // skip the first cell which contains the currency code
          const cellValue = formatCellValuetoFloat(cells[cellKey]);

          if (index !== 0 && cellValue !== 0) {
            if (maxRate === 0 || cellValue > maxRate) {
              maxRate = cellValue;
            }

            if (minRate === 0 || cellValue < minRate) {
              minRate = cellValue;
            }
          }
        });

        const maxMinRates: {
          maxRate: number;
          minRate: number;
        } = {
          maxRate,
          minRate,
        };

        const currencyCode = currencyCell.textContent.trim();

        result[currencyCode] = {
          buyingRate: formatCellValuetoFloat(buyingRateCell),
          sellingRate: formatCellValuetoFloat(sellingRateCell),
          ...maxMinRates,
        };
      });

      return result;
    });

    await browser.close();

    this.printScrappedData();
  };
}
