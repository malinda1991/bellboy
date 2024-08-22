import { Injectable } from '@nestjs/common';
import { ForexScrapLocations, Bank } from '../types';
import { Puppeteer, NodeHtmlParser, Luxon, ForexCurrency } from '@common';
import type {
  HTMLElement,
  DateTimeMaybeValid,
  ForexCurrencyValue,
} from '@common';

/**
 * Scrapes the current exchange rates from the Bank of Ceylon website.
 *
 * @author Sandun Munasinghe
 * @since 19/08/2024
 *
 */
@Injectable()
export class BocDataScrapper {
  public static bank: Bank = Bank.BOC;
  private scrapLocation: string;
  private webExtractor: Puppeteer;
  private scrapedForexData: ForexCurrencyValue;
  private essentialForexData: ForexCurrencyValue;
  private htmlParser: NodeHtmlParser;
  private bankSiteLastUpdatedDateTime: string;

  public constructor() {
    this.scrapLocation = ForexScrapLocations.BOC;
    this.webExtractor = new Puppeteer({
      url: this.scrapLocation,
      timeout: 90000,
    });
    this.scrapedForexData = {};
    this.essentialForexData = {};
    this.htmlParser = new NodeHtmlParser();
  }

  /**
   * Prints the scrapped forex data in the console
   *
   * @author Sandun Munasinghe
   * @since 19/08/2024
   */
  private printScrappedData = (): void => {
    console.log('Bank site was last updated at ', this.getLastUpdatedTime());
    if (Object.keys(this.scrapedForexData).length > 0) {
      console.log('Full forex dataset', this.scrapedForexData);
      console.log('Essential dataset', this.essentialForexData);
    } else {
      console.log('No data were extracted');
    }
  };

  /**
   * Extracts last updated date time text from the web page,
   * formats the datetime string
   * and assigns it to bankSiteLastUpdatedDateTime private property
   *
   * @author Sandun Munasinghe
   * @since 21/08/2024
   *
   * @returns Promise<void>
   */
  private extractLastUpdatedDateTime = async (): Promise<void> => {
    const filterDateText = (dateText: string): string => {
      return dateText.substring(1);
    };
    await this.webExtractor.runExtraction('#exchange-rates thead tr');

    const extractedHtmlData = this.webExtractor.getExtractedHtmlData();

    const firstRow = extractedHtmlData[0];
    const lastUpdatedDateTimeElement = this.htmlParser
      .parseHtml(firstRow)
      .getElementsByTagName('b');

    this.bankSiteLastUpdatedDateTime = filterDateText(
      lastUpdatedDateTimeElement[1].innerText,
    );
  };

  /**
   * Extracts the html table body rows from the web page, formats the forex data and
   * assigns the result to scrapedForexData private property
   *
   * @author Sandun Munasinghe
   * @since 19/08/2024
   *
   * @returns Promise<void>
   */
  private extractForexData = async (): Promise<void> => {
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

    await this.webExtractor.runExtraction('#exchange-rates tbody tr');

    const extractedHtmlData = this.webExtractor.getExtractedHtmlData();

    extractedHtmlData.forEach((htmlRow) => {
      const tableRow = this.htmlParser.parseHtml(htmlRow);
      const cells = tableRow.getElementsByTagName('td');

      const currencyCell = cells[0];
      const buyingRateCell = cells[1];
      const sellingRateCell = cells[2];

      const maxMinRates = getMaxMinRates(cells);

      const currencyCode = currencyCell.textContent.trim();

      const forexData = {
        buyingRate: formatCellValuetoFloat(buyingRateCell),
        sellingRate: formatCellValuetoFloat(sellingRateCell),
        ...maxMinRates,
      };
      this.scrapedForexData[currencyCode] = forexData;

      if (currencyCode in ForexCurrency) {
        // this currency is an essential
        this.essentialForexData[currencyCode] = forexData;
      }
    });
  };

  /**
   * Get the forex data was last updated time figure in the website
   *
   * @param asObject set this as true if you want the last updated date time as a Luxon DateTimeMaybeValid object
   *
   * @returns DateTimeMaybeValid object if asObject parameter is set to true,
   * else returns just the string of the date time text extracted from the site
   */
  public getLastUpdatedTime = (
    asObject = false,
  ): DateTimeMaybeValid | string => {
    if (!this.bankSiteLastUpdatedDateTime) {
      throw new Error('last updated was not recorded');
    }
    if (asObject) {
      const dateTime = this.bankSiteLastUpdatedDateTime;
      const splitDateTime = dateTime.split(' ');
      const dateValues = splitDateTime[0].split('.');
      const timeValues = splitDateTime[1].split(':');
      const amPmValue = splitDateTime[2];

      const hour = ((): number => {
        if (amPmValue === 'PM' && timeValues[0] !== '12') {
          // PM time hours
          return parseInt(timeValues[0]) + 12;
        } else {
          // AM time hours
          if (timeValues[0] === '12') {
            return 0;
          }
          return parseInt(timeValues[0]);
        }
      })();

      return Luxon.fromObject({
        year: parseInt(dateValues[2]),
        month: parseInt(dateValues[1]),
        day: parseInt(dateValues[0]),
        hour,
        minute: parseInt(timeValues[1]),
        second: parseInt(timeValues[2]),
      });
    } else {
      // return as same
      return this.bankSiteLastUpdatedDateTime;
    }
  };

  /**
   * Runs the BOC data scrap operations
   *
   * @author Sandun Munasinghe
   * @since 21/8/2024
   */
  public runScrapper = async (): Promise<void> => {
    await this.extractForexData();
    await this.extractLastUpdatedDateTime();
    this.printScrappedData();
  };
}
