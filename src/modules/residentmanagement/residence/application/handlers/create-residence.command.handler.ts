import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IBrandRepository } from 'src/modules/brand/domain/brand.repository.interface';
import { ICityRepository } from 'src/modules/shared/city/domain/city.repository.interface';
import { ICountryRepository } from 'src/modules/shared/country/domain/country.repository.interface';
import { Residence } from '../../domain/residence.entity';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { CreateResidenceCommand } from '../commands/create-residence.command';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { ICompanyRepository } from 'src/modules/company/domain/company.repository.interface';
import { IAmenityRepository } from 'src/modules/residentmanagement/amenity/domain/amenity.repository.interface';
import { IKeyFeatureRepository } from 'src/modules/residentmanagement/key_feature/domain/key-feature.repository.interface';

@Injectable()
export class CreateResidenceCommandHandler {
  constructor(
    private readonly residenceRepository: IResidenceRepository,
    private readonly brandRepository: IBrandRepository,
    private readonly countryRepository: ICountryRepository,
    private readonly cityRepository: ICityRepository,
    private readonly mediaRepository: IMediaRepository,
    private readonly companyRepository: ICompanyRepository,
    private readonly amenityRepository: IAmenityRepository,
    private readonly keyFeatureRepository: IKeyFeatureRepository
  ) {}

  async handle(command: CreateResidenceCommand): Promise<Residence> {
    if (!command.brandId) {
      throw new NotFoundException('Brand not found');
    }

    if (!command.countryId) {
      throw new NotFoundException('Country not found');
    }

    if (!command.cityId) {
      throw new NotFoundException('City not found');
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

    if (command.featuredImageId) {
      const media = await this.mediaRepository.findById(command.featuredImageId!);

      if (!media) {
        throw new NotFoundException('Media not found');
      }
    }

    if (command.companyId) {
      const company = await this.companyRepository.findById(command.companyId!);

      if (!company) {
        throw new NotFoundException('Company not found');
      }
    }

    const rawSlug = command.slug?.trim() ?? command.name!;
    const slug = Residence.slugify(rawSlug);

    const existingSlug = await this.residenceRepository.findBySlug(slug);
    if (existingSlug) {
      throw new ConflictException(`Residence with slug ${slug} already exists`);
    }

    const createResidence = {
      name: command.name,
      slug: slug,
      websiteUrl: command.websiteUrl,
      subtitle: command.subtitle,
      description: command.description,
      budgetStartRange: command.budgetStartRange,
      budgetEndRange: command.budgetEndRange,
      address: command.address,
      latitude: command.latitude,
      longitude: command.longitude,
      brandId: command.brandId,
      countryId: command.countryId,
      cityId: command.cityId,
      rentalPotential: command.rentalPotential,
      developmentStatus: command.developmentStatus,
      yearBuilt: command.yearBuilt,
      floorSqft: command.floorSqft,
      staffRatio: command.staffRatio,
      avgPricePerUnit: command.avgPricePerUnit,
      avgPricePerSqft: command.avgPricePerSqft,
      petFriendly: command.petFriendly,
      disabledFriendly: command.disabledFriendly,
      videoTourUrl: command.videoTourUrl,
      videoTourId: command.videoTourId,
      featuredImageId: command.featuredImageId,
      companyId: command.companyId,
    };

    const residence = await this.residenceRepository.create(createResidence);
    if (!residence) {
      throw new InternalServerErrorException('Residence not created');
    }

    if (command.amenities?.length) {
      const amenities = await this.amenityRepository.validateAndFetchByIds(command.amenities);

      await residence.$relatedQuery('amenities').unrelate();
      await residence.$relatedQuery('amenities').relate(amenities.map((amenityId) => amenityId.id));
    }

    if (command.keyFeatures?.length) {
      const keyFeatures = await this.keyFeatureRepository.validateAndFetchByIds(
        command.keyFeatures
      );
      await residence.$relatedQuery('keyFeatures').unrelate();
      await residence
        .$relatedQuery('keyFeatures')
        .relate(keyFeatures.map((keyFeatureId) => keyFeatureId.id));
    }

    if (command.mainGallery?.length) {
      await this.residenceRepository.syncOrderedMediaGallery(
        residence.id,
        command.mainGallery,
        'mainGallery'
      );
    }

    if (command.secondaryGallery?.length) {
      await this.residenceRepository.syncOrderedMediaGallery(
        residence.id,
        command.secondaryGallery,
        'secondaryGallery'
      );
    }

    if (command.highlightedAmenities?.length) {
      const amenityIdSet = new Set<string>();

      for (const highlighted of command.highlightedAmenities) {
        if (amenityIdSet.has(highlighted.id)) {
          throw new ConflictException(`Duplicate amenityId in highlighted amenities`);
        }
        amenityIdSet.add(highlighted.id);
      }

      for (const highlighted of command.highlightedAmenities) {
        const { id, order } = highlighted;

        const exists = await this.amenityRepository.findById(id);
        if (!exists) {
          throw new NotFoundException(`Highlighted amenity not found`);
        }

        await this.residenceRepository.addHighlightedAmenity({
          residenceId: residence.id,
          amenityId: id,
          order,
        });
      }
    }

    const created = await this.residenceRepository.findById(residence.id);

    if (!created) {
      throw new InternalServerErrorException('Residence not created');
    }

    return created;
  }
}
