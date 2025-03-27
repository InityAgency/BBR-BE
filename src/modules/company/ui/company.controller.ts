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
import { UserResponse } from 'src/modules/user/ui/response/user-response';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { RBACGuard } from 'src/shared/guards/rbac.guard';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { UpdateCompanyCommand } from '../application/commands/update-company.command';
import { DeleteCompanyCommandHandler } from '../application/handlers/delete-company.command.handler';
import { UpdateCompanyProfileCommandHandler } from '../application/handlers/update-company-profile.command.handler';
import { UpdateCompanyCommandHandler } from '../application/handlers/update-company.command.handler';
import { FetchAllCompanyCommandQuery } from '../application/query/fetch-all-company.command.query';
import { FetchCompanyByIdCommandQuery } from '../application/query/fetch-company-by-id.command.query';
import { CompanyMapper } from './mappers/company.mapper';
import { FetchAllCompanyRequest } from './request/fetch-all-companies.request';
import { UpdateCompanyProfileRequest } from './request/update-company-profile.request';
import { CompanyResponse } from './response/company.response';

@ApiTags('Companies')
@ApiCookieAuth()
@Controller('companies')
@UseGuards(RBACGuard)
export class CompanyController {
  constructor(
    private readonly fetchAllCompanyCommandQuery: FetchAllCompanyCommandQuery,
    private readonly fetchCompanyByIdCommandQuery: FetchCompanyByIdCommandQuery,
    private readonly deleteCompanyCommandHandler: DeleteCompanyCommandHandler,
    private readonly updateCompanyCommandHandler: UpdateCompanyCommandHandler,
    private readonly updateCompanyProfileCommandHandler: UpdateCompanyProfileCommandHandler
  ) {}

  @Get()
  @ApiOperation({ summary: 'Company Find All' })
  @UseGuards(SessionAuthGuard)
  async findAll(
    @Query() query: FetchAllCompanyRequest
  ): Promise<{ data: CompanyResponse[]; pagination: PaginationResponse }> {
    const { data, pagination } = await this.fetchAllCompanyCommandQuery.handler(query);
    return {
      data: data.map((company) => CompanyMapper.toResponse(company)),
      pagination,
    };
  }

  // * Update self company
  @Put('me')
  @ApiOperation({ summary: 'Update self company' })
  @UseGuards(SessionAuthGuard)
  async updateSelf(
    @Body() request: UpdateCompanyProfileRequest,
    @CurrentUser() user: Partial<UserResponse>
  ) {
    if (!user || !user.company?.id) {
      throw new Error('Company not found');
    }

    const command = new UpdateCompanyCommand(
      user.company.id,
      request.name,
      request.address,
      request.imageId,
      request.phoneNumber,
      request.phoneNumberCountryCode,
      request.website,
      request.contactPersonAvatarId,
      request.contactPersonFullName,
      request.contactPersonJobTitle,
      request.contactPersonEmail,
      request.contactPersonPhoneNumber,
      request.contactPersonPhoneNumberCountryCode
    );

    return await this.updateCompanyProfileCommandHandler.handle(command);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Company Find By Id' })
  @UseGuards(SessionAuthGuard)
  async findById(@Param('id') id: string): Promise<CompanyResponse> {
    const company = await this.fetchCompanyByIdCommandQuery.handler(id);

    return CompanyMapper.toResponse(company);
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

    return CompanyMapper.toResponse(company);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Company Delete' })
  @UseGuards(SessionAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.deleteCompanyCommandHandler.handler(id);
  }
}
