import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserCommandHandler } from '../application/create-user.command.handler';
import { FetchUsersCommandHandler } from '../application/fetch-users-command-handler';
import { FindByIdUserCommandHandler } from '../application/find-by-id-user.command.handler';
import { DeleteUserCommandHandler } from '../application/delete-user.command.handler';
import { UpdateUserCommandHandler } from '../application/update-user-command-handler';
import { UserResponse } from './response/user-response';
import { CreateUserRequest } from './request/create-user.request';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserCommand } from '../application/command/update-user.command';
import { UpdateUserRequest } from './request/updateu-ser.request';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserHandler: CreateUserCommandHandler,
    private readonly fetchUsersHandler: FetchUsersCommandHandler,
    private readonly findByIdUserHandler: FindByIdUserCommandHandler,
    private readonly deleteUserHandler: DeleteUserCommandHandler,
    private readonly updateUserHandler: UpdateUserCommandHandler
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponse })
  @ApiResponse({ status: 400, description: 'Bad request (validation error)' })
  @ApiResponse({ status: 409, description: 'Conflict - Email already exists.' })
  @ApiResponse({ status: 400, description: 'Not Saved - User could not be saved.' })
  async create(@Body() command: CreateUserRequest): Promise<UserResponse> {
    const user = await this.createUserHandler.handle(command);
    return new UserResponse(user);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserResponse] })
  async findAll(): Promise<UserResponse[]> {
    const users = await this.fetchUsersHandler.handle();
    return users.map((user) => new UserResponse(user));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponse })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  async update(@Param('id') id: string, @Body() request: UpdateUserRequest): Promise<UserResponse> {
    const command: UpdateUserCommand = {
      id,
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
    };
    const user = await this.updateUserHandler.handle(command);
    return new UserResponse(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Not Updated - User could not be deleted.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteUserHandler.handle(id);
  }
}
