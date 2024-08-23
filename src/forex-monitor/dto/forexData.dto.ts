import { Bank } from '../types';
import { ForexCurrencyValue } from '@common';
export class CreateForexDataDto {
  readonly bank: Bank;
  readonly forex: ForexCurrencyValue;
  readonly lastUpdatedDateTime: string;
}
