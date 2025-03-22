export abstract class IEmailRepository {
  abstract sendEmail(
    to: string,
    subject: string,
    template: string,
    variables?: Record<string, any>
  ): Promise<any>;
}
