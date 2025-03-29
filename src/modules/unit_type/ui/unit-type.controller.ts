import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Unit Type')
@Controller('unit-type')
export class UnitTypeController {
  constructor() {}
}
