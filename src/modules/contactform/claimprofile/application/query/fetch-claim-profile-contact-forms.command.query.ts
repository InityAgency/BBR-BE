import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { ClaimProfileContactForm } from '../../domain/claim-profile-contact-form.entity';
import { FetchClaimProfileContactFormsQuery } from '../command/fetch-claim-profile-contact-forms.query';
import { IClaimProfileContactFormRepository } from '../../domain/claim-profile-contact-form.repository';

@Injectable()
export class FetchClaimProfileContactFormsCommandQuery {
  constructor(private readonly claimProfileContactFormRepository: IClaimProfileContactFormRepository) {}

  @LogMethod()
  async handle(
    query: FetchClaimProfileContactFormsQuery
  ): Promise<{ data: ClaimProfileContactForm[]; pagination: PaginationResponse }> {
    const result = await this.claimProfileContactFormRepository.findAll(query);
    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
