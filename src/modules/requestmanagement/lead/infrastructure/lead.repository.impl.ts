import { Injectable } from '@nestjs/common';
import { KnexService } from '../../../../shared/infrastructure/database/knex.service';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { applyPagination } from '../../../../shared/utils/pagination.util';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { applyFilters } from '../../../../shared/filters/query.dynamic-filters';
import { ILeadRepository } from '../domain/ilead.repository.interface';
import { Lead } from '../domain/lead.entity';
import { FetchLeadsQuery } from '../application/command/fetch-leads.query';
import { Unit } from '../../../residentmanagement/unit/domain/unit.entity';

@Injectable()
export class LeadRepositoryImpl implements ILeadRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(data: Partial<Lead>): Promise<Lead | undefined> {
    const leadData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      status: data.status,
      preferredContactMethod: data.preferredContactMethod,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const knex = this.knexService.connection;

    const insertedLead = await knex('leads')
      .insert(leadData)
      .returning('*');

    return this.findById(insertedLead[0].id);
  }

  async findById(id: string): Promise<Lead | undefined> {
    return Lead.query().findById(id).whereNull('deletedAt');
  }

  async findByEmail(email: string): Promise<Lead | undefined> {
    return Lead.query().where('email', email).whereNull('deletedAt').first();
  }

  async findAll(query: FetchLeadsQuery): Promise<{ data: Lead[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery, firstName, lastName, email, status } = query;

    const columnsToSearchAndSort = ['first_name', 'last_name', 'email', 'status'];

    let leadQuery = Lead.query()
      .modify((qb) => applyFilters(qb, { firstName,lastName, email,status }, Lead.tableName))
      .whereNull('deletedAt');

    leadQuery = applySearchFilter(leadQuery, searchQuery, columnsToSearchAndSort);

    if (sortBy && sortOrder) {
      if (columnsToSearchAndSort.includes(sortBy)) {
        leadQuery = leadQuery.orderBy(sortBy, sortOrder);
      }
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(leadQuery, page, limit);

    return {
      data: paginatedQuery,
      pagination: {
        total: totalCount,
        totalPages,
        page: page,
        limit: limit,
      },
    };
  }

  async update(id: string, data: Partial<Lead>): Promise<Lead | undefined> {
    const knex = this.knexService.connection;

    await knex('leads')
      .update({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        status: data.status,
        preferredContactMethod: data.preferredContactMethod,
        updatedAt: new Date(),
      })
      .where('id', id);

    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    const knex = this.knexService.connection;

    await Lead.query()
      .patch({ deletedAt: new Date() })
      .where('id', id)
      .whereNull('deletedAt');
  }
}
