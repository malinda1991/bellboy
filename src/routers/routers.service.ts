import { Injectable } from '@nestjs/common';
import { CreateRouterDto } from './dto/create-router.dto';
import { UpdateRouterDto } from './dto/update-router.dto';

@Injectable()
export class RoutersService {
  create(createRouterDto: CreateRouterDto) {
    return 'This action adds a new router';
  }

  findAll() {
    return `This action returns all routers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} router`;
  }

  update(id: number, updateRouterDto: UpdateRouterDto) {
    return `This action updates a #${id} router`;
  }

  remove(id: number) {
    return `This action removes a #${id} router`;
  }
}
