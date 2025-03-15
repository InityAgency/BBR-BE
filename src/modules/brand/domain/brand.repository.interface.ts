import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { Brand } from './brand.entity';
import { FetchBrandsQuery } from '../application/command/fetch-brands.query';

export abstract class IBrandRepository {
  abstract create(brand: Partial<Brand>): Promise<Brand>;
  abstract findById(id: string): Promise<Brand | undefined>;
  abstract findByName(name: string): Promise<Brand | undefined>;
  abstract findAll(
    query: FetchBrandsQuery
  ): Promise<{ data: Brand[]; pagination: PaginationResponse }>;
  abstract update(id: string, updateData: Partial<Brand>): Promise<Brand>;
  abstract delete(id: string): Promise<void>;
}
