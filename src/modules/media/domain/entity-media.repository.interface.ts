export abstract class IEntityMediaRepository {
  abstract getEntityMedia(data: any): Promise<any>;
}
