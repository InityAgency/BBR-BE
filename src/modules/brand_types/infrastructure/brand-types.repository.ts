import { Injectable } from '@nestjs/common';
import { BrandType } from '../domain/brand-type.entity';
import { IBrandTypesRepository } from '../domain/brand-type.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class BrandTypesRepository implements IBrandTypesRepository {
  @LogMethod()
  async findAll(): Promise<BrandType[]> {
    return await BrandType.query().whereNull('deleted_at').select('*');
  }

  @LogMethod()
  async create(brandType: Partial<BrandType>): Promise<BrandType> {
    return await BrandType.query().insert(brandType).returning('*');
  }

  @LogMethod()
  async findByName(name: string): Promise<BrandType | undefined> {
    return await BrandType.query().where({ name }).whereNull('deleted_at').first();
  }

  @LogMethod()
  async findById(id: string): Promise<BrandType | undefined> {
    return await BrandType.query().findById(id).whereNull('deleted_at').withGraphFetched('brands');
  }

  @LogMethod()
  async update(id: string, brandType: Partial<BrandType>): Promise<BrandType> {
    return await BrandType.query().updateAndFetchById(id, brandType);
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    await BrandType.query().update({ deletedAt: new Date() }).where({ id });
  }
}
