import { Controller, Get, Param, Query, Post, Body, Delete, Patch, Put, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClaimProfileContactForm } from '../domain/claim-profile-contact-form.entity';
import {
  FetchClaimProfileContactFormsCommandQuery
} from '../application/query/fetch-claim-profile-contact-forms.command.query';
import {
  FindClaimProfileContactFormByIdCommandQuery
} from '../application/query/find-claim-profile-contact-form-by-id.command.query';
import {
  CreateClaimProfileContactFormCommandHandler
} from '../application/handler/create-claim-profile-contact-form.command.handler';
import {
  UpdateClaimProfileContactFormCommandHandler
} from '../application/handler/update-claim-profile-contact-form.command.handler';
import {
  DeleteClaimProfileContactFormCommandHandler
} from '../application/handler/delete-claim-profile-contact-form.command.handler';
import {
  UpdateClaimProfileContactFormStatusCommandHandler
} from '../application/handler/update-claim-profile-contact-form-status.command.handler';
import { FetchClaimProfileContactFormsQuery } from '../application/command/fetch-claim-profile-contact-forms.query';
import { ClaimProfileContactFormResponse } from './response/claim-profile-contact-form.response';
import { ClaimProfileContactFormMapper } from './mapper/claim-profile-contact-form.mapper';
import { CreateClaimProfileContactFormRequest } from './request/create-claim-profile-contact-form.request';
import { UpdateClaimProfileContactFormStatusRequest } from './request/update-claim-profile-contact-form-status.request';
import { UpdateClaimProfileContactFormRequest } from './request/update-claim-profile-contact-form.request';
import { User } from '../../../user/domain/user.entity';
import { Request } from 'express';


@ApiTags('Claim Profile Contact Forms')
@Controller()
export class ClaimProfileContactFormController {
  constructor(
    private readonly fetchContactFormsCommandQuery: FetchClaimProfileContactFormsCommandQuery,
    private readonly findContactFormByIdCommandQuery: FindClaimProfileContactFormByIdCommandQuery,
    private readonly createContactFormCommandHandler: CreateClaimProfileContactFormCommandHandler,
    private readonly updateContactFormStatusCommandHandler: UpdateClaimProfileContactFormStatusCommandHandler,
    private readonly updateContactFormCommandHandler: UpdateClaimProfileContactFormCommandHandler,
    private readonly deleteContactFormCommandHandler: DeleteClaimProfileContactFormCommandHandler
  ) {}

  @Get('claim-profile-contact-forms')
  @ApiOperation({ summary: 'Get all claim profile contact forms' })
  @ApiResponse({ type: [ClaimProfileContactFormResponse] })
  async fetchAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    const { data, pagination } = await this.fetchContactFormsCommandQuery.handle(
      new FetchClaimProfileContactFormsQuery(query, page, limit, sortBy, sortOrder)
    );

    const mappedContactForms = data.map((contactForm: ClaimProfileContactForm) => ClaimProfileContactFormMapper.toResponse(contactForm));

    return {
      data: mappedContactForms,
      pagination,
    };
  }

  @Get('claim-profile-contact-forms/:id')
  @ApiOperation({ summary: 'Get claim profile contact form by ID' })
  @ApiResponse({ type: ClaimProfileContactFormResponse })
  async findById(@Param('id') id: string) {
    const contactForm = await this.findContactFormByIdCommandQuery.handle(id);
    return ClaimProfileContactFormMapper.toResponse(contactForm);
  }

  @Post('public/claim-profile-contact-forms')
  @ApiOperation({ summary: 'Create a new claim profile contact form' })
  @ApiResponse({ type: ClaimProfileContactFormResponse })
  async create(@Body() request: CreateClaimProfileContactFormRequest,  @Req() req: Request) {
    const loggedUserEmail = (req.user as User).email;
    const command = ClaimProfileContactFormMapper.toCreateCommand(request, loggedUserEmail);
    const createdContactForm = await this.createContactFormCommandHandler.handle(command);

    console.log(createdContactForm);
    return ClaimProfileContactFormMapper.toResponse(createdContactForm);
  }

  @Patch('claim-profile-contact-forms/:id/status')
  @ApiOperation({ summary: 'Update the status of a claim profile contact form' })
  @ApiResponse({ type: ClaimProfileContactFormResponse })
  async updateStatus(@Param('id') id: string, @Body() request: UpdateClaimProfileContactFormStatusRequest) {
    const command = ClaimProfileContactFormMapper.toUpdateStatusCommand(id, request);
    const updatedContactForm = await this.updateContactFormStatusCommandHandler.handle(command);
    return ClaimProfileContactFormMapper.toResponse(updatedContactForm);
  }

  @Put('claim-profile-contact-forms/:id')
  @ApiOperation({ summary: 'Update a claim profile contact form' })
  @ApiResponse({ type: ClaimProfileContactFormResponse })
  async update(@Param('id') id: string, @Body() request: UpdateClaimProfileContactFormRequest) {
    const command = ClaimProfileContactFormMapper.toUpdateCommand(id, request);
    const updatedContactForm = await this.updateContactFormCommandHandler.handle(command);
    return ClaimProfileContactFormMapper.toResponse(updatedContactForm);
  }

  @Delete('claim-profile-contact-forms/:id')
  @ApiOperation({ summary: 'Delete a claim profile contact form' })
  async delete(@Param('id') id: string) {
    return this.deleteContactFormCommandHandler.handle(id);
  }
}
