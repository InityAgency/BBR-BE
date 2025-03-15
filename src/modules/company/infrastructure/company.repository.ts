import { Injectable } from '@nestjs/common';
import { ICompanyRepository } from '../domain/company.repository.interface';
import { Company } from '../domain/company.entity';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { CompanyResponse } from '../ui/response/company.response';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  private tableName = 'companies';

  constructor(private readonly knexService: KnexService) {}

  async create(company: Company): Promise<Company> {
    const createdCompany = await Company.create(company);
    return createdCompany;
  }

  async update(id: string, company: Company): Promise<Company> {
    const updatedCompany = await Company.query().patchAndFetchById(id, company);
    return updatedCompany;
  }

  async delete(id: string): Promise<void> {
    await Company.query().patchAndFetchById(id, { deletedAt: new Date() });
  }

  async findById(id: string): Promise<Company | undefined> {
    const company = await Company.query().findById(id);
    return company;
  }

  @LogMethod()
  async findAll(page: number, limit: number): Promise<{ data: Company[]; pagination: any }> {
    const query = this.knexService.connection(this.tableName).select();

    const paginatedQuery = await applyPagination(query, page, limit);

    const totalQuery = this.knexService.connection(this.tableName).count('* as total').first();

    const [data, totalResult] = await Promise.all([paginatedQuery, totalQuery]);

    return {
      data: data.map((company) => new CompanyResponse(company)),
      pagination: {
        total: totalResult ? Number(totalResult.total) : 0,
        totalPages: Math.ceil((totalResult ? Number(totalResult.total) : 0) / limit),
        page,
        limit,
      },
    };
  }
}
