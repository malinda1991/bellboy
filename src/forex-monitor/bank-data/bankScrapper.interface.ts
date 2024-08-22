import type { DateTimeMaybeValid } from '@common';

export interface BankScrapper {
  getLastUpdatedTime: (asObject: boolean) => DateTimeMaybeValid | string;
  runScrapper: () => Promise<void>;
}
