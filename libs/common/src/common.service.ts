import { Injectable } from '@nestjs/common';
import config from './config/index';
import interfaces from './interfaces/index';
import types from './types/index';
import libs from './libs/index';
import utils from './utils/index';
import enums from './enums/index';

@Injectable()
export class CommonService {
  public config;
  public interfaces;
  public types;
  public libs;
  public utils;
  public enums;

  public constructor() {
    this.config = config;
    this.interfaces = interfaces;
    this.types = types;
    this.libs = libs;
    this.utils = utils;
    this.enums = enums;
  }
}
