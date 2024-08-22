import { Injectable } from '@nestjs/common';
import { ForexScrapLocations, Bank } from '../types';
import {
  Puppeteer,
  NodeHtmlParser,
  Luxon,
  ForexCurrency,
  axios,
} from '@common';
import type {
  // HTMLElement,
  DateTimeMaybeValid,
  ForexCurrencyValue,
} from '@common';

// ----------------------- test imports------------
import { createWriteStream } from 'fs';
import { resolve as pathResolve } from 'path';
import { PdfReader, TableParser } from 'pdfreader';

const downloadDirPath = pathResolve(__dirname, '../temp');
const downloadFilePath = `${downloadDirPath}/hsbc.pdf`;

/**
 * Scrapes the current exchange rates from the HSBC Sri lanka website.
 *
 * @author Sandun Munasinghe
 * @since 19/08/2024
 *
 */
@Injectable()
export class HsbcDataScrapper {
  public static bank: Bank = Bank.HSBC;
  private scrapLocation: string;
  // private webExtractor: Puppeteer;
  private scrapedForexData: ForexCurrencyValue;
  private essentialForexData: ForexCurrencyValue;
  private htmlParser: NodeHtmlParser;
  private bankSiteLastUpdatedDateTime: string;
  private pdfParser: PdfReader;

  public constructor() {
    this.scrapLocation = ForexScrapLocations.HSBC;
    // this.webExtractor = new Puppeteer({
    //   url: this.scrapLocation,
    //   timeout: 90000,
    // });
    this.scrapedForexData = {};
    this.essentialForexData = {};
    this.htmlParser = new NodeHtmlParser();
    this.pdfParser = new PdfReader();
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

  private downloadPdfFromBank = async (): Promise<void> => {
    const writer = createWriteStream(downloadFilePath);
    try {
      const response = await axios.get(this.scrapLocation, {
        responseType: 'stream',
      });

      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve); // Resolve when the file is fully written
        writer.on('error', reject); // Reject if there's an error
      });
    } catch (error) {
      console.error('Error downloading pdf from hsbc', error);
    } finally {
      console.log('Download finished');
      writer.close();
    }
  };

  private extractPdfData = async (): Promise<void> => {
    console.log('Reading pdf file');
    try {
      const nbCols = 2;
      const cellPadding = 40; // each cell is padded to fit 40 characters
      const columnQuantitizer = (item) => parseFloat(item.x) >= 20;

      const padColumns = (array, nb) =>
        // eslint-disable-next-line prefer-spread
        Array.apply(null, { length: nb }).map((val, i) => array[i] || []);
      // .. because map() skips undefined elements

      const mergeCells = (cells) =>
        (cells || [])
          .map((cell) => cell.text)
          .join('') // merge cells
          .substr(0, cellPadding)
          .padEnd(cellPadding, ' '); // padding

      const renderMatrix = (matrix) =>
        (matrix || [])
          .map((row, y) => padColumns(row, nbCols).map(mergeCells).join(' | '))
          .join('\n');

      let table = new TableParser();
      const pdfContent = await new Promise((resolve, reject) => {
        this.pdfParser.parseFileItems(downloadFilePath, (error, item) => {
          if (error) {
            reject(error);
          } else {
            // if (!item || item.page) {
            //   console.log('item page', item);
            // } else if (item.text) {
            //   console.log('item text', item);
            // }

            if (!item || item.page) {
              // end of file, or page
              console.log(renderMatrix(table.getMatrix()));
              console.log('PAGE:', item.page);
              table = new TableParser(); // new/clear table for next page
            } else if (item.text) {
              // accumulate text items into rows object, per line
              // @ts-expect-error just to test
              table.processItem(item, columnQuantitizer(item));
            }
          }
        });
      });

      console.log(pdfContent);
    } catch (error) {
      console.error('Error occurred while parsing pdf', error);
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
  // private extractLastUpdatedDateTime = async (): Promise<void> => {
  //   const filterDateText = (dateText: string): string => {
  //     return dateText.substring(1);
  //   };
  //   await this.webExtractor.runExtraction('#exchange-rates thead tr');

  //   const extractedHtmlData = this.webExtractor.getExtractedHtmlData();

  //   const firstRow = extractedHtmlData[0];
  //   const lastUpdatedDateTimeElement = this.htmlParser
  //     .parseHtml(firstRow)
  //     .getElementsByTagName('b');

  //   this.bankSiteLastUpdatedDateTime = filterDateText(
  //     lastUpdatedDateTimeElement[1].innerText,
  //   );
  // };

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
    try {
      await this.downloadPdfFromBank();
      await this.extractPdfData();
      // await this.extractForexData();
      // await this.extractLastUpdatedDateTime();
      // this.printScrappedData();
    } catch (error) {
      console.error('Error occurred during HSBC scrapping');
      throw error;
    }
  };
}
