export abstract class ICompanyRepository {
  abstract create(company: any): Promise<any>;
  abstract update(id: string, company: any): Promise<any>;
  abstract delete(id: string): Promise<any>;
  abstract findById(id: string): Promise<any>;
  abstract findAll(page: number, limit: number): Promise<any>;
}
