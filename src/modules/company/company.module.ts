import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { ICompanyRepository } from './domain/company.repository.interface';
import { CompanyRepository } from './infrastructure/company.repository';
import { CompanyController } from './ui/company.controller';
import { FetchAllCompanyCommandQuery } from './application/query/fetch-all-company.command.query';
import { FetchCompanyByIdCommandQuery } from './application/query/fetch-company-by-id.command.query';
import { DeleteCompanyCommandHandler } from './application/handlers/delete-company.command.handler';
import { UpdateCompanyCommandHandler } from './application/handlers/update-company.command.handler';
import { UpdateCompanyProfileCommandHandler } from './application/handlers/update-company-profile.command.handler';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [DatabaseModule, MediaModule],
  controllers: [CompanyController],
  providers: [
    {
      provide: ICompanyRepository,
      useClass: CompanyRepository,
    },
    FetchAllCompanyCommandQuery,
    FetchCompanyByIdCommandQuery,
    DeleteCompanyCommandHandler,
    UpdateCompanyCommandHandler,
    UpdateCompanyProfileCommandHandler,
  ],
})
export class CompanyModule {}
