import { Injectable, NotFoundException } from '@nestjs/common';
import { IUnitRepository } from '../../domain/unit.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class DeleteUnitCommandHandler {
  constructor(private readonly unitRepository: IUnitRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const unit = await this.unitRepository.findById(id);
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    await this.unitRepository.softDelete(id);
  }
}
