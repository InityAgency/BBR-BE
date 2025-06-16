import { Injectable } from '@nestjs/common';
import { KnexService } from '../../../../shared/infrastructure/database/knex.service';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { applyPagination } from '../../../../shared/utils/pagination.util';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { applyFilters } from '../../../../shared/filters/query.dynamic-filters';
import { ILeadRepository } from '../domain/ilead.repository.interface';
import { Lead } from '../domain/lead.entity';
import { FetchLeadsQuery } from '../application/command/fetch-leads.query';
import { User } from 'src/modules/user/domain/user.entity';

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
      preferredContactMethod: JSON.stringify(data.preferredContactMethod ?? []),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const knex = this.knexService.connection;

    const insertedLead = await knex('leads').insert(leadData).returning('*');

    return this.findById(insertedLead[0].id);
  }

  async findById(id: string): Promise<Lead | undefined> {
    return Lead.query().findById(id).whereNull('deletedAt').withGraphFetched('[requests]');
  }

  async findOwnById(companyId: string, id: string): Promise<Lead | undefined> {
    const lead = Lead.query()
      .findById(id)
      .whereNull('leads.deletedAt')
      .leftJoin('requests', 'leads.id', 'requests.leadId')
      .leftJoin('residences as reqRes', 'reqRes.id', 'requests.entityId')
      .leftJoin('units as u', 'u.id', 'requests.entityId')
      .leftJoin('residences as unitRes', 'unitRes.id', 'u.residence_id')
      .withGraphFetched('[requests]');

    if (companyId) {
      lead.where((qb) =>
        qb
          // slučaj gde je request bio na rezidenciju
          .where('reqRes.companyId', companyId)
          // ili slučaj gde je request bio na jedinicu čija rezidencija pripada toj kompaniji
          .orWhere('unitRes.companyId', companyId)
      );
    }

    return lead;
  }

  async findByEmail(email: string): Promise<Lead | undefined> {
    return Lead.query().where('email', email).whereNull('deletedAt').first();
  }

  async findAll(query: FetchLeadsQuery): Promise<{ data: Lead[]; pagination: PaginationResponse }> {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      searchQuery,
      firstName,
      lastName,
      email,
      status,
      companyId,
    } = query;

    const columnsToSearch = [
      'leads.first_name',
      'leads.last_name',
      'leads.email',
      'leads.status',
      'leads.phone',
    ];
    const columnsToSort = ['firstName', 'lastName', 'createdAt', 'updatedAt'];

    let leadQuery = Lead.query()
      .alias('leads')
      .modify((qb) => applyFilters(qb, { firstName, lastName, email, status }, 'leads'))
      .whereNull('leads.deleted_at')
      .joinRelated('requests')
      .leftJoin('residences as reqRes', 'reqRes.id', 'requests.entityId')
      .leftJoin('units as u', 'u.id', 'requests.entityId')
      .leftJoin('residences as unitRes', 'unitRes.id', 'u.residenceId');

    if (companyId) {
      leadQuery.where((qb) =>
        qb
          // case #1: direct residence request, must match company
          .whereNotNull('reqRes.id')
          .andWhere('reqRes.companyId', companyId)

          // OR case #2: unit-request whose residence matches
          .orWhere((sub) => sub.whereNotNull('unitRes.id').andWhere('unitRes.companyId', companyId))
      );
    }
    leadQuery = applySearchFilter(leadQuery, searchQuery, columnsToSearch);

    if (sortBy && sortOrder) {
      if (columnsToSort.includes(sortBy)) {
        leadQuery = leadQuery.orderBy(sortBy, sortOrder);
      }
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(
      leadQuery,
      page,
      limit,
      'leads.id' // DODATI ZA DISTINCT
    );

    const distLeadQuery = await leadQuery
      .clone()
      .distinct('leads.*')
      .withGraphFetched('[requests(filterEntity)]')
      .modifiers({
        filterEntity(builder) {
          builder.whereNotNull('entityId');
        },
      });

    return {
      data: distLeadQuery,
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
        preferredContactMethod: JSON.stringify(data.preferredContactMethod ?? []),
        updatedAt: new Date(),
      })
      .where('id', id);

    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    const knex = this.knexService.connection;

    await Lead.query().patch({ deletedAt: new Date() }).where('id', id).whereNull('deletedAt');
  }
}
