import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { MediaFileRequest } from '../ui/request/media-file.request';

@Injectable()
export class MediaInterceptor implements NestInterceptor {
  constructor(private readonly mediaRepository: IMediaRepository) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    let { uploads = [], deleted = [] } = request.body;

    // Ensure uploads is an array
    if (!Array.isArray(uploads)) {
      uploads = [];
    }

    if (uploads.length) {
      const uploadedFiles = await this.mediaRepository.create(uploads); // ✅ Bulk insert

      // **Assign IDs back to the respective uploaded files**
      uploads = uploads.map((file: MediaFileRequest, index: number) => ({
        ...file,
        id: uploadedFiles[index]?.id, // ✅ Ensure correct ID assignment
      }));

      request.body.uploads = uploads; // ✅ Update request with new file IDs
    }

    // **Delete files if needed**
    if (deleted.length) {
      await this.mediaRepository.delete(deleted);
    }

    return next.handle();
  }
}
