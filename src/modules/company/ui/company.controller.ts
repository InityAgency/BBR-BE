import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { RBACGuard } from 'src/shared/guards/rbac.guard';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { PaginationRequest } from 'src/shared/ui/request/pagination.request';
import { DeleteCompanyCommandHandler } from '../application/commands/handlers/delete-company.command.handler';
import { UpdateCompanyCommandHandler } from '../application/commands/handlers/update-company.command.handler';
import { FetchAllCompanyCommandQuery } from '../application/commands/query/fetch-all-company.command.query';
import { FetchCompanyByIdCommandQuery } from '../application/commands/query/fetch-company-by-id.command.query';
import { CompanyResponse } from './response/company.response';
import { UpdateCompanyCommand } from '../application/commands/update-company.command';
import { FetchCompaniesQuery } from '../application/commands/fetch-all-company.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';

@ApiTags('Company')
@ApiCookieAuth()
@Controller('company')
@UseGuards(RBACGuard)
export class CompanyController {
  constructor(
    private readonly fetchAllCompanyCommandQuery: FetchAllCompanyCommandQuery,
    private readonly fetchCompanyByIdCommandQuery: FetchCompanyByIdCommandQuery,
    private readonly deleteCompanyCommandHandler: DeleteCompanyCommandHandler,
    private readonly updateCompanyCommandHandler: UpdateCompanyCommandHandler
  ) {}

  @Get()
  @ApiTags('Company Find All')
  @UseGuards(SessionAuthGuard)
  async findAll(
    @Query() query: FetchCompaniesQuery
  ): Promise<{ data: CompanyResponse[]; pagination: PaginationResponse }> {
    return await this.fetchAllCompanyCommandQuery.handler(query);
  }

  @Get(':id')
  @ApiTags('Company Find By Id')
  @UseGuards(SessionAuthGuard)
  async findById(@Param('id') id: string): Promise<CompanyResponse> {
    const company = await this.fetchCompanyByIdCommandQuery.handler(id);

    return new CompanyResponse(company);
  }

  @Put(':id')
  @ApiTags('Company Update')
  @UseGuards(SessionAuthGuard)
  async update(@Param('id') id: string, @Body() request: any): Promise<CompanyResponse> {
    const command: UpdateCompanyCommand = {
      id,
      ...request,
    };

    const company = await this.updateCompanyCommandHandler.handler(command);

    return new CompanyResponse(company);
  }

  @Delete(':id')
  @ApiTags('Company Delete')
  @UseGuards(SessionAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.deleteCompanyCommandHandler.handler(id);
  }
}
