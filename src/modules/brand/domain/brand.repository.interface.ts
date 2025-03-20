import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { Brand } from './brand.entity';
import { FetchBrandsQuery } from '../application/command/fetch-brands.query';
import { EntityMedia } from 'src/modules/media/domain/entity-media.entity';

export abstract class IBrandRepository {
  abstract create(brand: Partial<Brand>): Promise<Brand>;
  abstract findById(id: string): Promise<Brand | undefined>;
  abstract findByName(name: string): Promise<Brand | undefined>;
  abstract findAll(
    query: FetchBrandsQuery
  ): Promise<{ data: Brand[]; pagination: PaginationResponse }>;
  abstract update(id: string, updateData: Partial<Brand>): Promise<Brand>;
  abstract delete(id: string): Promise<void>;
  abstract getLogo(brandId: string): Promise<EntityMedia | undefined>;
  abstract updateLogo(brandId: string, mediaId: string): Promise<void>;
}
