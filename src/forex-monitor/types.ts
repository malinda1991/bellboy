import { ForexCurrency } from '@common';

export enum Bank {
  BOC = 'BOC',
  HSBC = 'HSBC',
}

export const BankName: {
  [key in Bank]: string;
} = {
  BOC: 'Bank of Ceylon',
  HSBC: 'Hongkong and Shanghai Bank Coporation',
};

export type CurrencyName = {
  [key in ForexCurrency]: string;
};
export type ScrapLocations = {
  [key in Bank]?: string;
};

export const ForexCurrencyName: CurrencyName = {
  [ForexCurrency.USD]: 'US Dollar',
  [ForexCurrency.GBP]: 'Great Britain Pound',
  [ForexCurrency.EUR]: 'Euro',
  [ForexCurrency.CAD]: 'Canadian Dollar',
  [ForexCurrency.AUD]: 'Australian Dollar',
  [ForexCurrency.AED]: 'UAE Diram',
  [ForexCurrency.NZD]: 'New Zealand Dollar',
  [ForexCurrency.SEK]: 'Swedish Kroner',
  [ForexCurrency.NOK]: 'Norwegian Kroner',
};
export const ForexScrapLocations: ScrapLocations = {
  BOC: 'https://www.boc.lk/rates-tariff',
  HSBC: 'https://www.hsbc.lk/content/dam/hsbc/lk/documents/tariffs/foreign-exchange-rates.pdf',
};
