import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchResidencesQuery } from '../application/commands/fetch-residences.query';
import { Residence } from './residence.entity';

export abstract class IResidenceRepository {
  abstract create(residence: Partial<Residence>): Promise<Residence | undefined>;
  abstract update(id: string, data: Partial<Residence>): Promise<Residence | undefined>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<Residence | undefined>;
  abstract findByName(name: string): Promise<Residence | undefined>;
  abstract findAll(
    query: FetchResidencesQuery
  ): Promise<{ data: Residence[]; pagination: PaginationResponse }>;

  abstract syncOrderedMediaGallery(
    residenceId: string,
    gallery: { id: string; order: number }[],
    type: 'mainGallery' | 'secondaryGallery'
  ): Promise<void>;
}
