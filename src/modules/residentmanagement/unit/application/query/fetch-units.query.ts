import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { Unit } from '../../domain/unit.entity';
import { IUnitRepository } from '../../domain/unit.repository.interface';
import { FetchUnitsQuery } from '../command/fetch-units.query';
import { IMediaService } from '../../../../../shared/media/media.service.interface';

@Injectable()
export class FetchUnitsCommandQuery {
  constructor(
    private readonly unitRepository: IUnitRepository,
    private readonly mediaService:IMediaService
  ) {}

  @LogMethod()
  async handle(
    query: FetchUnitsQuery
  ): Promise<{ data: Unit[]; pagination: PaginationResponse }> {
    const result = await this.unitRepository.findAll(query);

    const featureImages = result.data
      .map((unit) => unit.featureImage)
      .filter((image) => image !== undefined && image !== null);

    await this.mediaService.addTemporalUrls(featureImages);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
