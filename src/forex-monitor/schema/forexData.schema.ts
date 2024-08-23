import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Bank } from '../types';
import { ForexCurrencyValue } from '@common';

@Schema()
export class ForexData extends Document {
  @Prop({ type: String, enum: Bank, required: true })
  bank: Bank;

  @Prop({ type: Object, required: true })
  forex: ForexCurrencyValue;

  @Prop({ type: String, required: true })
  lastUpdatedDateTime: string;
}

export const ForexDataSchema = SchemaFactory.createForClass(ForexData);
