import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IBrandRepository } from 'src/modules/brand/domain/brand.repository.interface';
import { ICityRepository } from 'src/modules/shared/city/domain/city.repository.interface';
import { ICountryRepository } from 'src/modules/shared/country/domain/country.repository.interface';
import { Residence } from '../../domain/residence.entity';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { CreateResidenceCommand } from '../commands/create-residence.command';

@Injectable()
export class CreateResidenceCommandHandler {
  constructor(
    private readonly residenceRepository: IResidenceRepository,
    private readonly brandRepository: IBrandRepository,
    private readonly countryRepository: ICountryRepository,
    private readonly cityRepository: ICityRepository
  ) {}

  async handle(command: CreateResidenceCommand): Promise<Residence> {
    const residence = await this.residenceRepository.create(command);

    if (!residence) {
      throw new InternalServerErrorException('Residence not created');
    }

    const existingBrand = await this.brandRepository.findById(command.brandId);
    if (!existingBrand) {
      throw new NotFoundException('Brand not found');
    }

    const existingCountry = await this.countryRepository.findById(command.countryId);
    if (!existingCountry) {
      throw new NotFoundException('Country not found');
    }

    const existingCity = await this.cityRepository.findById(command.cityId);
    if (!existingCity) {
      throw new NotFoundException('City not found');
    }

    const created = await this.residenceRepository.findById(residence.id);

    if (!created) {
      throw new InternalServerErrorException('Residence not created');
    }

    return created;
  }
}
