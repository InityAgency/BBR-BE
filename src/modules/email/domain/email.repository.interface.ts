export abstract class IEmailRepository {
  abstract sendEmail(
    to: string,
    subject: string,
    template: string,
    variabels: Record<string, any>
  ): Promise<any>;
}
