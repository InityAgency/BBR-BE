import { Injectable, NotFoundException } from '@nestjs/common';
import { Company } from 'src/modules/company/domain/company.entity';
import { ICompanyRepository } from 'src/modules/company/domain/company.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { UpdateCompanyCommand } from '../update-company.command';

@Injectable()
export class UpdateCompanyCommandHandler {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  @LogMethod()
  async handler(command: UpdateCompanyCommand): Promise<Company> {
    const company = await this.companyRepository.findById(command.id);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return await this.companyRepository.update(command.id, command);
  }
}
