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
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RBACGuard } from 'src/shared/guards/rbac.guard';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { FetchAllCompanyRequest } from './request/fetch-all-companies.request';
import { PaginationRequest } from 'src/shared/ui/request/pagination.request';
import { CompanyResponse } from './response/company.response';
import { UpdateCompanyCommand } from '../application/commands/update-company.command';
import { FetchCompaniesQuery } from '../application/commands/fetch-all-company.query';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchAllCompanyCommandQuery } from '../application/query/fetch-all-company.command.query';
import { FetchCompanyByIdCommandQuery } from '../application/query/fetch-company-by-id.command.query';
import { DeleteCompanyCommandHandler } from '../application/handlers/delete-company.command.handler';
import { UpdateCompanyCommandHandler } from '../application/handlers/update-company.command.handler';

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
  @ApiOperation({ summary: 'Company Find All' })
  @UseGuards(SessionAuthGuard)
  async findAll(
    @Query() query: FetchAllCompanyRequest
  ): Promise<{ data: CompanyResponse[]; pagination: PaginationResponse }> {
    return await this.fetchAllCompanyCommandQuery.handler(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Company Find By Id' })
  @UseGuards(SessionAuthGuard)
  async findById(@Param('id') id: string): Promise<CompanyResponse> {
    const company = await this.fetchCompanyByIdCommandQuery.handler(id);

    return new CompanyResponse(company);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Company Update' })
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
  @ApiOperation({ summary: 'Company Delete' })
  @UseGuards(SessionAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.deleteCompanyCommandHandler.handler(id);
  }
}
