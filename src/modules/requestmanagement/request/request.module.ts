import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { MediaModule } from 'src/modules/media/media.module';
import { UpdateRequestStatusCommandHandler } from './application/handler/update-request-status.command.handler';
import { DeleteRequestCommandHandler } from './application/handler/delete-request.command.handler';
import { RequestController } from './ui/request.controller';
import { RequestMapper } from './ui/mapper/request.mapper';
import { IRequestRepository } from './domain/irequest.repository.interface';
import { RequestRepositoryImpl } from './infrastructure/request.repository.impl';
import { ILeadRepository } from '../lead/domain/ilead.repository.interface';
import { LeadRepositoryImpl } from '../lead/infrastructure/lead.repository.impl';
import { CreateRequestCommandHandler } from './application/handler/create-request-command.handler';
import { UpdateRequestCommandHandler } from './application/handler/update-request.command.handler';
import { CreateLeadCommandHandler } from '../lead/application/handler/create-lead-command.handler';
import { FindRequestByIdCommandQuery } from './application/query/find-request-by-id.command.query';
import { FetchRequestsCommandQuery } from './application/query/fetch-requests.command.query';
import { RequestPublicController } from './ui/request.public.controller';

@Module({
  imports: [DatabaseModule, MediaModule],
  controllers: [RequestController, RequestPublicController],
  providers: [
    {
      provide: IRequestRepository,
      useClass: RequestRepositoryImpl,
    },
    {
      provide: ILeadRepository,
      useClass: LeadRepositoryImpl,
    },
    CreateLeadCommandHandler,
    CreateRequestCommandHandler,
    UpdateRequestStatusCommandHandler,
    UpdateRequestCommandHandler,
    DeleteRequestCommandHandler,
    FindRequestByIdCommandQuery,
    FetchRequestsCommandQuery,
    RequestMapper,
  ],
})
export class RequestModule {}
