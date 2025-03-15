import { Injectable } from '@nestjs/common';
import { Company } from 'src/modules/company/domain/company.entity';
import { ICompanyRepository } from 'src/modules/company/domain/company.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { FetchCompaniesQuery } from '../fetch-all-company.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { CompanyResponse } from 'src/modules/company/ui/response/company.response';

@Injectable()
export class FetchAllCompanyCommandQuery {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  @LogMethod()
  async handler(
    query: FetchCompaniesQuery
  ): Promise<{ data: CompanyResponse[]; pagination: PaginationResponse }> {
    const result = await this.companyRepository.findAll(query);
    return {
      data: result.data.map((company) => new CompanyResponse(company)),
      pagination: result.pagination,
    };
  }
}
