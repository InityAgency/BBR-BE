export abstract class IMediaRepository {
  abstract create(data: any): Promise<any>;
  abstract update(id: string, data: any): Promise<any>;
  abstract delete(id: string): Promise<any>;
}
