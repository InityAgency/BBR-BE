import { BrandMapper } from 'src/modules/brand/ui/mappers/brand.mapper';
import { CompanyMapper } from 'src/modules/company/ui/mappers/company.mapper';
import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { AmenityMapper } from 'src/modules/residentmanagement/amenity/ui/mapper/amenity.ui.mapper';
import { KeyFeatureMapper } from 'src/modules/residentmanagement/key_feature/ui/mappers/key-feature.mapper';
import { Residence } from '../../domain/residence.entity';
import { CityResponse } from '../response/city.response';
import { CountryResponse } from '../response/country.response';
import { ResidencePublicResponse } from '../response/residence.public.response';
import { ResidenceResponse } from '../response/residence.response';
import { HighlightedAmenityMapper } from './highlighted-amenity.mapper';
import { UnitMapper } from './unit.mapper';

export class ResidenceMapper {
  static toResponse(residence: Residence): ResidenceResponse {
    return new ResidenceResponse(
      residence.id,
      residence.name,
      residence.status,
      residence.developmentStatus,
      residence.subtitle,
      residence.description,
      residence.budgetStartRange,
      residence.budgetEndRange,
      residence.address,
      residence.latitude,
      residence.longitude,
      residence.country,
      residence.city,
      residence.createdAt,
      residence.updatedAt,
      residence.rentalPotential,
      residence.websiteUrl,
      residence.yearBuilt,
      residence.floorSqft,
      residence.staffRatio,
      residence.avgPricePerUnit,
      residence.avgPricePerSqft,
      residence.petFriendly,
      residence.disabledFriendly,
      residence.videoTourUrl,
      residence.videoTour
        ? new MediaResponse(
            residence.videoTour.id,
            residence.videoTour.originalFileName,
            residence.videoTour.mimeType,
            residence.videoTour.uploadStatus,
            residence.videoTour.size,
            residence.videoTour.securedUrl
          )
        : null,
      residence.featuredImage
        ? new MediaResponse(
            residence.featuredImage.id,
            residence.featuredImage.originalFileName,
            residence.featuredImage.mimeType,
            residence.featuredImage.uploadStatus,
            residence.featuredImage.size,
            residence.featuredImage.securedUrl
          )
        : null,
      residence.keyFeatures
        ? residence.keyFeatures.map((data) => KeyFeatureMapper.toResponse(data))
        : [],
      residence.brand ? BrandMapper.toResponse(residence.brand) : null,
      residence.units?.map((unit) => UnitMapper.toResponse(unit)) || [],
      residence.amenities ? residence.amenities.map((data) => AmenityMapper.toResponse(data)) : [],
      residence.company ? CompanyMapper.toResponse(residence.company) : null,
      residence.mainGallery
        ? residence.mainGallery.map(
            (media) =>
              new MediaResponse(
                media.id,
                media.originalFileName,
                media.mimeType,
                media.uploadStatus,
                media.size,
                media.securedUrl
              )
          )
        : [],
      residence.secondaryGallery
        ? residence.secondaryGallery.map(
            (media) =>
              new MediaResponse(
                media.id,
                media.originalFileName,
                media.mimeType,
                media.uploadStatus,
                media.size,
                media.securedUrl
              )
          )
        : [],
      residence.highlightedAmenities
        ? residence.highlightedAmenities.map((data) => HighlightedAmenityMapper.toResponse(data))
        : []
    );
  }

  static toPublicResponse(residence: Residence): ResidencePublicResponse {
    return new ResidencePublicResponse(
      residence.id,
      residence.name,
      residence.description,
      residence.status,
      residence.developmentStatus,
      residence.address,
      residence.country ? new CountryResponse(residence.country.id, residence.country.name) : null,
      residence.city
        ? new CityResponse(residence.city.id, residence.city.name, residence.city.asciiName)
        : null,
      residence.featuredImage
        ? new MediaResponse(
            residence.featuredImage.id,
            residence.featuredImage.originalFileName,
            residence.featuredImage.mimeType,
            residence.featuredImage.uploadStatus,
            residence.featuredImage.size,
            residence.featuredImage.securedUrl
          )
        : null,
      residence.createdAt,
      residence.updatedAt,
      residence.brand ? BrandMapper.toResponse(residence.brand) : null,
      residence.rankingCategories
    );
  }
}
