import { Injectable } from '@nestjs/common';
import { Company } from 'src/modules/company/domain/company.entity';
import { ICompanyRepository } from 'src/modules/company/domain/company.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { FetchAllCompanyQuery } from '../fetch-all-company.query';

@Injectable()
export class FetchAllCompanyCommandQuery {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  @LogMethod()
  async handler(query: FetchAllCompanyQuery): Promise<Company[]> {
    return this.companyRepository.findAll(query.page, query.limit);
  }
}
