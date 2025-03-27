import { Injectable, NotFoundException } from '@nestjs/common';
import { ILifestyleRepository } from '../domain/lifestyle.repository.interface';
import { Lifestyle } from '../domain/lifestyle.entity';

@Injectable()
export class FindByIdLifestyleQueryHandler {
  constructor(private readonly lifestyleRepository: ILifestyleRepository) {}

  async handle(id: string): Promise<Lifestyle> {
    const lifestyle = await this.lifestyleRepository.findById(id);

    if (!lifestyle) {
      throw new NotFoundException('Lifestyle not found');
    }

    return lifestyle;
  }
}
