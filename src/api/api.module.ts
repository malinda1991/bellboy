import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiResolver } from './api.resolver';

@Module({
  providers: [ApiResolver, ApiService],
})
export class ApiModule {}
