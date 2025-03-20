import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { IEmailRepository } from '../../domain/email.repository.interface';

@Injectable()
export class EmailJobProcessor {
  constructor(private readonly emailRepository: IEmailRepository) {}

  async process(job: Job) {
    const { recipient, subject, template, variables } = job.data;
    try {
      await this.emailRepository.sendEmail(recipient, subject, template, variables);
    } catch (error) {
      Logger.error(error);
    }
  }
}
