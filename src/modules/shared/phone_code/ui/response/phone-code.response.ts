export class PhoneCodeResponse {
  id: string;
  code: string;
  countryId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, code: string, countryId: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.code = code;
    this.countryId = countryId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
