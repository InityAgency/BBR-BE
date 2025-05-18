import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRequestCommand } from '../command/create-request.command';
import { IRequestRepository } from '../../domain/irequest.repository.interface';
import { Request } from '../../domain/request.entity';
import { ILeadRepository } from '../../../lead/domain/ilead.repository.interface';
import { CreateLeadCommandHandler } from '../../../lead/application/handler/create-lead-command.handler';
import { CreateLeadCommand } from '../../../lead/application/command/create-lead.command';
import { RequestStatusEnum } from '../../domain/request-status.enum';
import { UpdateLeadCommandHandler } from '../../../lead/application/handler/update-lead.command.handler';
import { UpdateLeadCommand } from '../../../lead/application/command/update-lead.command';

@Injectable()
export class CreateRequestCommandHandler {
  constructor(
    private readonly leadRepository: ILeadRepository,
    private readonly requestRepository: IRequestRepository,
    private readonly createLeadHandler: CreateLeadCommandHandler,
    private readonly updateLeadCommandHandler: UpdateLeadCommandHandler,
  ) {}

  async handle(command: CreateRequestCommand): Promise<Request> {
    if (!command.termsAccepted) {
      throw new BadRequestException('Terms and conditions must be accepted!');
    }

    let lead = await this.leadRepository.findByEmail(command.email);

    if (!lead) {
      const leadCommand = new CreateLeadCommand(
        command.firstName,
        command.lastName,
        command.email,
        command.phoneNumber,
        command.preferredContactMethod,
      );
      lead = await this.createLeadHandler.handle(leadCommand);
    } else {
      const updateLeadCommand = new UpdateLeadCommand(
        lead.id,
        command.firstName,
        command.lastName,
        command.email,
        command.phoneNumber,
        command.preferredContactMethod,
      );
      lead = await this.updateLeadCommandHandler.handle(updateLeadCommand);
    }



    const requestData: Partial<Request> = {
        lead: lead,
        type: command.type,
        subject: command.subject,
        entityId: command.entityId,
        message: command.message,
        status: RequestStatusEnum.NEW,
    };

    const request = await this.requestRepository.create(requestData);

    if (!request) {
      throw new InternalServerErrorException('Failed to create request');
    }

    return request;
  }
}
