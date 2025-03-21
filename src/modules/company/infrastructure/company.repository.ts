import { Injectable } from '@nestjs/common';
import { ICompanyRepository } from '../domain/company.repository.interface';
import { Company } from '../domain/company.entity';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { CompanyResponse } from '../ui/response/company.response';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchCompaniesQuery } from '../application/commands/fetch-all-company.query';

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
  async findAll(
    fetchQuery: FetchCompaniesQuery
  ): Promise<{ data: Company[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder } = fetchQuery;

    let query = Company.query();

    if (sortBy && sortOrder) {
      if (this.allowedSortColumns.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    const paginatedCompanies = await applyPagination(query, page, limit);

    const totalResult = (await Company.query().count('* as total').first()) as
      | { total: string }
      | undefined;

    const totalCount = totalResult ? Number(totalResult.total) : 0;
    const totalPages = Math.ceil(totalCount / (limit || 1)); // Avoid division by zero

    return {
      data: paginatedCompanies.map((company) => new CompanyResponse(company)),
      pagination: {
        total: totalCount,
        totalPages,
        page: page,
        limit: limit,
      },
    };
  }

  private readonly allowedSortColumns: string[] = [
    'name',
    'address',
    'logo',
    'phoneNumber',
    'phoneNumberCountryCode',
    'website',
    'contactPersonAvatar',
    'contactPersonFullName',
    'contactPersonJobTitle',
    'contactPersonEmail',
    'contactPersonPhoneNumber',
    'contactPersonPhoneNumberCountryCode',
    'createdAt',
    'updatedAt',
  ];
}
