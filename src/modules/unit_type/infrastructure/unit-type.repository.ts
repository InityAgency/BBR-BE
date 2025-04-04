import { Injectable } from '@nestjs/common';
import { UnitType } from '../domain/unit_type.entity';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { applySearchFilter } from 'src/shared/filter/query.filter';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { FetchUnitTypeQuery } from '../application/commands/fetch-unit-type.query';

@Injectable()
export class UnitTypeRepository {
  constructor() {}

  async findAll(
    fetchQuery: FetchUnitTypeQuery
  ): Promise<{ data: UnitType[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery: searchQuery } = fetchQuery;

    let query = UnitType.query();

    if (sortBy && sortOrder) {
      const allowedColumns = ['name', 'created_at', 'updated_at'];
      if (allowedColumns.includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
      }
    }

    const columnsToSearch = ['name'];
    query = applySearchFilter(query, searchQuery, columnsToSearch, 'unit_types');

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(query, page, limit);

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

  async findByName(name: string): Promise<UnitType | undefined> {
    return await UnitType.query().findOne({ name });
  }

  async findById(id: string): Promise<UnitType | undefined> {
    return await UnitType.query().findById(id);
  }

  async create(unitType: Partial<UnitType>): Promise<UnitType> {
    return await UnitType.create(unitType);
  }

  async update(id: string, data: Partial<UnitType>): Promise<UnitType> {
    return await UnitType.query().patchAndFetchById(id, data);
  }

  async delete(id: string): Promise<void> {
    await UnitType.query().deleteById(id);
  }
}
