import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { CreateB2BFormSubmissionCommand } from '../command/create-b2b-form-submission.command';
import { IB2BFormSubmissionRepository } from '../../domain/b2b-form-submission.repository.interface';
import { B2BFormSubmission } from '../../domain/b2b-form-submission.entity';
import { B2BFormSubmissionStatus } from '../../domain/b2b-form-submission-status.enum';

@Injectable()
export class CreateB2BFormSubmissionCommandHandler {
  constructor(
    private readonly b2bFormSubmissionRepository: IB2BFormSubmissionRepository,
  ) {}

  @LogMethod()
  async handle(command: CreateB2BFormSubmissionCommand): Promise<B2BFormSubmission> {
    const formData: Partial<B2BFormSubmission> = {
      name: command.name,
      phoneNumber: command.phoneNumber,
      email: command.email,
      pageOrigin: command.pageOrigin,
      companyName: command.companyName,
      brandedResidencesName: command.brandedResidencesName,
      companyWebsite: command.companyWebsite,
      status: B2BFormSubmissionStatus.NEW,
    };

    const createdForm = await this.b2bFormSubmissionRepository.create(formData);

    if (!createdForm) {
      throw new InternalServerErrorException('B2B Form Submission could not be saved');
    }

    return createdForm;
  }
}
