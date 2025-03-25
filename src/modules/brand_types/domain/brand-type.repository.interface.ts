import { BrandType } from './brand-type.entity';

export abstract class IBrandTypesRepository {
  abstract findAll(): Promise<BrandType[]>;
  abstract findByName(name: string): Promise<BrandType | undefined>;
  abstract findById(id: string): Promise<BrandType | undefined>;
  abstract create(brandType: Partial<BrandType>): Promise<BrandType>;
  abstract update(id: string, brandType: Partial<BrandType>): Promise<BrandType>;
  abstract delete(id: string): Promise<void>;
}
