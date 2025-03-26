import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCompanyProfileCommand } from '../commands/update-company-profile.command';
import { ICompanyRepository } from '../../domain/company.repository.interface';

@Injectable()
export class UpdateCompanyProfileCommandHandler {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  async handle(command: UpdateCompanyProfileCommand) {
    const company = await this.companyRepository.findById(command.id);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return await this.companyRepository.update(command.id, command);
  }
}
