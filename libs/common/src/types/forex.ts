import { ForexCurrency } from '../enums/index';
export type ForexCurrencyRateData = {
  buyingRate: number;
  sellingRate: number;
  maxRate: number;
  minRate: number;
};

export type ForexCurrencyValue = {
  [key in ForexCurrency]?: ForexCurrencyRateData;
};
