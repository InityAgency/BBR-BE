import { IsOptional } from 'class-validator';
import { SortOrderEnum } from 'src/shared/types/sort-order.enum';

export class FetchAllCompanyRequest {
  @IsOptional()
  page: number = 1;
  @IsOptional()
  limit: number = 10;
  @IsOptional()
  sortBy?: string = 'createdAt';
  @IsOptional()
  sortOrder?: SortOrderEnum = SortOrderEnum.DESC;
}
