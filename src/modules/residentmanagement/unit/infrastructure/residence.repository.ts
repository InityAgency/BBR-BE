import { Injectable } from '@nestjs/common';
import { IResidenceRepository } from '../domain/residence.repository.interface';
import { Residence } from '../domain/residence.entity';

@Injectable()
export class ResidenceRepositoryImpl implements IResidenceRepository {
  async findById(id: string): Promise<Residence | undefined> {
    return Residence.query().findById(id).whereNull('deletedAt');
  }

  async findByIds(ids: string[]): Promise<Residence[]> {
    return Residence.query().findByIds(ids).whereNull('deletedAt').withGraphFetched('company');
  }
}
