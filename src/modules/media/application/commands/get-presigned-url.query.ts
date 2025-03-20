export class GetPresignedUrlQuery {
  constructor(
    public readonly entity: string,
    public readonly files: {
      fileType: string;
      count: number;
    }[]
  ) {}
}
