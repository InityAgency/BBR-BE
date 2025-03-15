import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { CreateMediaCommand } from '../application/commands/create-media.command';
import { DeleteMediaCommand } from '../application/commands/delete-media.command';
import { GetPresignedUrlQuery } from '../application/commands/get-presigned-url.query';
import { CreateMediaCommandHandler } from '../application/commands/handlers/create-media.command.handler';
import { DeleteMediaCommandHandler } from '../application/commands/handlers/delete-media.command.handler';
import { UpdateMediaCommandHandler } from '../application/commands/handlers/update-media.command.handler';
import { GeneratePrestigedUrlCommandQuery } from '../application/commands/query/generate-prestiged-url.command.handler';
import { UpdateMediaCommand } from '../application/commands/update-media.command';

@Controller('media')
export class MediaController {
  constructor(
    private readonly createMediaCommandHandler: CreateMediaCommandHandler,
    private readonly deleteMediaCommandHandler: DeleteMediaCommandHandler,
    private readonly updateMediaCommandHandler: UpdateMediaCommandHandler,
    private readonly generatePresignedUrlQuery: GeneratePrestigedUrlCommandQuery
  ) {}
  @Get('presigned-url')
  async getPresignedUrl(@Query('fileType') fileType: string) {
    const query = new GetPresignedUrlQuery(fileType);
    return await this.generatePresignedUrlQuery.handler(query);
  }

  @Post()
  async create(
    @Body() body: { fileName: string; fileType: string; uploadedBy?: string },
    @Req() req: any
  ) {
    const command = new CreateMediaCommand(body.fileName, body.fileType, req.user.id);
    return await this.createMediaCommandHandler.handler(command);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { fileName: string; fileType: string; uploadedBy?: string }
  ) {
    const command = new UpdateMediaCommand(id, body.fileName, body.fileType, body.uploadedBy);
    return await this.updateMediaCommandHandler.handler(command);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const command = new DeleteMediaCommand(id);
    return await this.deleteMediaCommandHandler.handler(command);
  }
}
