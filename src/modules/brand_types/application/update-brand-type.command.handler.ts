import { Injectable } from '@nestjs/common';
import { IBrandTypesRepository } from '../domain/brand-type.repository.interface';
import { UpdateBrandTypeCommand } from './command/update-brand-type.command';

@Injectable()
export class UpdateBrandTypeCommandHandler {
  constructor(private readonly brandTypesRepository: IBrandTypesRepository) {}

  async handle(command: UpdateBrandTypeCommand) {
    const existingBrandType = await this.brandTypesRepository.findById(command.id);

    if (!existingBrandType) {
      throw new Error('Brand type not found');
    }

    return await this.brandTypesRepository.update(command.id, command);
  }
}
