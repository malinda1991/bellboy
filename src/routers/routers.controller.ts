import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RoutersService } from './routers.service';
import { CreateRouterDto } from './dto/create-router.dto';
import { UpdateRouterDto } from './dto/update-router.dto';

@Controller()
export class RoutersController {
  constructor(private readonly routersService: RoutersService) {}

  @MessagePattern('createRouter')
  create(@Payload() createRouterDto: CreateRouterDto) {
    return this.routersService.create(createRouterDto);
  }

  @MessagePattern('findAllRouters')
  findAll() {
    return this.routersService.findAll();
  }

  @MessagePattern('findOneRouter')
  findOne(@Payload() id: number) {
    return this.routersService.findOne(id);
  }

  @MessagePattern('updateRouter')
  update(@Payload() updateRouterDto: UpdateRouterDto) {
    return this.routersService.update(updateRouterDto.id, updateRouterDto);
  }

  @MessagePattern('removeRouter')
  remove(@Payload() id: number) {
    return this.routersService.remove(id);
  }
}
