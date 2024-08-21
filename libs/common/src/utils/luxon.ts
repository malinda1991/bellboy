import { DateTime, Settings, DateTimeMaybeValid } from 'luxon';

Settings.defaultZone = 'Asia/Colombo';

export { DateTime as Luxon, DateTimeMaybeValid };

export class LuxonUtil {}
