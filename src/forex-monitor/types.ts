export enum ForexCurrency {
  USD = 'USD',
  GBP = 'GBP',
  EUR = 'EUR',
  AUD = 'AUD',
  CAD = 'CAD',
  AED = 'AED',
  NZD = 'NZD',
  SEK = 'SEK',
  NOK = 'NOK',
}

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
};
