import { IUnitRepository } from '../domain/unit.repository.interface';
import { Unit } from '../domain/unit.entity';
import { Injectable } from '@nestjs/common';
import { FetchUnitsQuery } from '../application/command/fetch-units.query';
import { KnexService } from '../../../../shared/infrastructure/database/knex.service';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { applyPagination } from '../../../../shared/utils/pagination.util';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';


@Injectable()
export class UnitRepositoryImpl implements IUnitRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(unit: Partial<Unit>): Promise<Unit | undefined> {
    const unitData = {
      name: unit.name,
      description: unit.description,
      surface: unit.surface,
      status: unit.status,
      regularPrice: unit.regularPrice,
      exclusivePrice: unit.exclusivePrice,
      exclusiveOfferStartDate: unit.exclusiveOfferStartDate,
      exclusiveOfferEndDate: unit.exclusiveOfferEndDate,
      roomType: unit.roomType,
      roomAmount: unit.roomAmount,
      type: unit.type,
      serviceType: unit.serviceType,
      serviceAmount: unit.serviceAmount,
      featureImageId: unit.featureImage?.id,
      residenceId: unit.residence?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const knex = this.knexService.connection;

    const insertedUnit = await knex('units')
      .insert(unitData)
      .returning('*');

    // Insert gallery images
    if (unit.gallery && unit.gallery.length > 0) {
      await knex('unit_gallery')
        .insert(
          unit.gallery.map(media => ({
            unit_id: insertedUnit[0].id,
            media_id: media.id,
          }))
        );
    }

    return this.findById(insertedUnit[0].id);
  }

  async findById(id: string): Promise<Unit | undefined> {
    return Unit.query()
      .findById(id)
      .whereNull('deletedAt')
      .withGraphFetched('[residence, gallery, featureImage]');
  }

  async findAll(query: FetchUnitsQuery): Promise<{ data: Unit[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery } = query;

    let unitQuery = Unit.query()
      .whereNull('deletedAt')
      .withGraphFetched('[residence, gallery, featureImage]'); 

    const columnsToSearchAndSort = ['name', 'description', 'roomType', 'status'];
    unitQuery = applySearchFilter(unitQuery, searchQuery, columnsToSearchAndSort);

    if (sortBy && sortOrder) {
      if (columnsToSearchAndSort.includes(sortBy)) {
        unitQuery = unitQuery.orderBy(sortBy, sortOrder);
      }
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(unitQuery, page, limit);

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

  async update(id: string, data: Partial<Unit>): Promise<Unit | undefined> {
    const knex = this.knexService.connection;

    await knex('units')
      .update({
        name: data.name,
        description: data.description,
        surface: data.surface,
        status: data.status,
        regularPrice: data.regularPrice,
        exclusivePrice: data.exclusivePrice,
        exclusiveOfferStartDate: data.exclusiveOfferStartDate,
        exclusiveOfferEndDate: data.exclusiveOfferEndDate,
        roomType: data.roomType,
        roomAmount: data.roomAmount,
        type: data.type,
        serviceType: data.serviceType,
        serviceAmount: data.serviceAmount,
        featureImageId: data.featureImage?.id,
        residenceId: data.residence?.id,
        updatedAt: new Date(),
      })
      .where('id', id);

    if (data.gallery) {
      const currentGalleryImages = await knex('unit_gallery')
        .select('media_id')
        .where('unit_id', id);

      const currentImageIds = currentGalleryImages.map(image => image.mediaId);
      const newImageIds = data.gallery.map(media => media.id);

      const imagesToRemove = currentImageIds.filter(id => !newImageIds.includes(id));

      console.log('imagesToRemove:', imagesToRemove);
      if (Array.isArray(imagesToRemove)) {
        const validImagesToRemove = imagesToRemove.filter((id) => !!id);
        if (validImagesToRemove.length > 0) {
          await knex('unit_gallery')
            .where('unit_id', id)
            .whereIn('media_id', validImagesToRemove)
            .delete();
        }
      }

      const imagesToInsert = newImageIds.filter(id => !currentImageIds.includes(id));
      if (imagesToInsert.length > 0) {
        await knex('unit_gallery')
          .insert(
            imagesToInsert.map(mediaId => ({
              unit_id: id,
              media_id: mediaId,
            }))
          );
      }
    }

    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    const knex = this.knexService.connection;

    await Unit.query()
      .patch({ deletedAt: new Date() })
      .where('id', id)
      .whereNull('deletedAt');

    await knex('unit_gallery')
      .where('unit_id', id)
      .delete();
  }
}
