import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { FetchCompaniesQuery } from '../application/commands/fetch-all-company.query';
import { Company } from '../domain/company.entity';
import { ICompanyRepository } from '../domain/company.repository.interface';
import { applySearchFilter } from 'src/shared/filter/query.filter';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor() {}

  async create(company: Company): Promise<Company> {
    const createdCompany = await Company.create(company);
    return createdCompany;
  }

  async update(id: string, company: Company): Promise<Company> {
    const updatedCompany = await Company.query()
      .whereNull('deleted_at')
      .patchAndFetchById(id, company)
      .withGraphFetched('[image, contactPersonAvatar]');
    return updatedCompany;
  }

  async delete(id: string): Promise<void> {
    await Company.query().whereNull('deleted_at').patchAndFetchById(id, { deletedAt: new Date() });
  }

  async findById(id: string): Promise<Company | undefined> {
    const company = await Company.query()
      .whereNull('deleted_at')
      .findById(id)
      .withGraphFetched('[image, contactPersonAvatar]');
    return company;
  }

  @LogMethod()
  async findAll(
    fetchQuery: FetchCompaniesQuery
  ): Promise<{ data: Company[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery } = fetchQuery;

    let query = Company.query()
      .whereNull('deleted_at')
      .withGraphFetched('[image, contactPersonAvatar]');

    query = applySearchFilter(query, searchQuery, this.columnsToSearchAndSort, Company.tableName);

    if (sortBy && sortOrder) {
      if (this.columnsToSearchAndSort.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    const paginatedCompanies = await applyPagination(query, page, limit);

    const totalResult = (await query.clone().clearSelect().clearOrder().count('* as total').first()) as { total: string } | undefined;

    const totalCount = totalResult ? Number(totalResult.total) : 0;
    const totalPages = Math.ceil(totalCount / (limit || 1)); // Avoid division by zero

    return {
      data: paginatedCompanies,
      pagination: {
        total: totalCount,
        totalPages,
        page: page,
        limit: limit,
      },
    };
  }

  private readonly columnsToSearchAndSort: string[] = [
    'name',
    'address',
    'phone_number',
    'phone_number_country_code',
    'website',
    'contact_person_full_name',
    'contact_person_job_title',
    'contact_person_email',
    'contact_person_phone_number',
    'contact_person_phone_number_country_code',
  ];
}
