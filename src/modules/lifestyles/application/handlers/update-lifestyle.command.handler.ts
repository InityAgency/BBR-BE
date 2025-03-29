import { Injectable, NotFoundException } from '@nestjs/common';
import { Lifestyle } from '../../domain/lifestyle.entity';
import { ILifestyleRepository } from '../../domain/lifestyle.repository.interface';
import { UpdateLifestyleCommand } from '../command/update-lifestyle.command';

@Injectable()
export class UpdateLifestyleCommandHandler {
  constructor(private readonly lifestyleRepository: ILifestyleRepository) {}

  async handle(command: UpdateLifestyleCommand): Promise<Lifestyle> {
    const existingLifestyle = await this.lifestyleRepository.findById(command.id);

    if (!existingLifestyle) {
      throw new NotFoundException('Lifestyle not found');
    }

    const updateData = {
      name: command.name,
      imageId: command.imageId,
      order: command.order,
    };

    const udpatedLifestyle = await this.lifestyleRepository.update(command.id, updateData);

    if (!udpatedLifestyle) {
      throw new NotFoundException('Lifestyle not updated');
    }

    return udpatedLifestyle;
  }
}
