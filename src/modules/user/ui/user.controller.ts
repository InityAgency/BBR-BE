import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RBACGuard } from 'src/shared/guards/rbac.guard';
import { UpdateUserCommand } from '../application/command/update-user.command';
import { CreateUserCommandHandler } from '../application/handler/create-user.command.handler';
import { DeleteUserCommandHandler } from '../application/handler/delete-user.command.handler';
import { FetchUsersCommandHandler } from '../application/query/fetch-users-command.query';
import { FindByIdUserCommandHandler } from '../application/query/find-by-id-user.command.query';
import { UpdateUserCommandHandler } from '../application/handler/update-user-command.handler';
import { CreateUserRequest } from './request/create-user.request';
import { UpdateUserRequest } from './request/update-user.request';
import { UserResponse } from './response/user-response';
import { PaginationRequest } from 'src/shared/ui/request/pagination.request';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { SendVerificationCommand } from '../application/command/send-verification.command';
import { SendVerifyEmailCommandHandler } from '../application/handler/send-verify-email.command.handler';
import { VerificationCommand } from '../application/command/verification.command';
import { VerifyEmailCommandHandler } from '../application/handler/verify-email.command.handler';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../domain/user.entity';
import { CreateUserCommand } from '../application/command/create-user.command';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(RBACGuard)
export class UserController {
  constructor(
    private readonly createUserHandler: CreateUserCommandHandler,
    private readonly fetchUsersHandler: FetchUsersCommandHandler,
    private readonly findByIdUserHandler: FindByIdUserCommandHandler,
    private readonly deleteUserHandler: DeleteUserCommandHandler,
    private readonly updateUserHandler: UpdateUserCommandHandler,
    private readonly sendVerifyEmailHandler: SendVerifyEmailCommandHandler,
    private readonly verifyEmailCommandHandler: VerifyEmailCommandHandler
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponse })
  @ApiResponse({ status: 400, description: 'Bad request (validation error)' })
  @ApiResponse({ status: 409, description: 'Conflict - Email already exists.' })
  @ApiResponse({ status: 400, description: 'Not Saved - User could not be saved.' })
  @UseGuards(SessionAuthGuard)
  async create(
    @Body() request: CreateUserRequest,
    @CurrentUser() currentUser: User
  ): Promise<UserResponse> {
    const command = new CreateUserCommand(
      request.fullName,
      request.email,
      request.password,
      request.roleId,
      request.signupMethod,
      request.emailNotifications,
      currentUser.id
    );

    const user = await this.createUserHandler.handle(command);
    return new UserResponse(user);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserResponse] })
  @UseGuards(SessionAuthGuard)
  async findAll(
    @Query() query: PaginationRequest
  ): Promise<{ data: UserResponse[]; pagination: PaginationResponse }> {
    const users = await this.fetchUsersHandler.handle(query);
    return users;
  }

  // * Resend verification email
  @HttpCode(HttpStatus.OK)
  @Post(':id/resend-verification-email')
  @UseGuards(SessionAuthGuard)
  async resendVerificationEmail(@Param('id') id: string) {
    const command = new SendVerificationCommand(id);

    await this.sendVerifyEmailHandler.handle(command);
  }

  // * Verify email
  @HttpCode(HttpStatus.OK)
  @Post(':token/verify-email')
  @UseGuards(SessionAuthGuard)
  async verifyEmail(@Param('token') token: string) {
    const command = new VerificationCommand(token);

    await this.verifyEmailCommandHandler.handle(command);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponse })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(SessionAuthGuard)
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    const user = await this.findByIdUserHandler.handle(id);
    return new UserResponse(user);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponse })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'User not updatable.' })
  @ApiResponse({ status: 400, description: 'Not Updated - User could not be updated.' })
  @UseGuards(SessionAuthGuard)
  async update(@Param('id') id: string, @Body() request: UpdateUserRequest): Promise<UserResponse> {
    const command = new UpdateUserCommand(
      id,
      request.fullName,
      request.email,
      request.roleId,
      request.password,
      request.signupMethod,
      request.emailNotifications
    );
    const user = await this.updateUserHandler.handle(command);
    return new UserResponse(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Not Updated - User could not be deleted.' })
  @UseGuards(SessionAuthGuard)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteUserHandler.handle(id);
  }
}
