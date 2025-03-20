import { Queue, Worker } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { EmailJobProcessor } from '../jobs/email.job';
import { ConfigService } from '@nestjs/config';
import { QueuesEnum } from 'src/shared/types/queues.enum';

@Injectable()
export class EmailQueue {
  private queue: Queue;
  private worker: Worker;

  constructor(
    private readonly emailJobProcessor: EmailJobProcessor,
    private readonly configService: ConfigService
  ) {
    const redisHost = this.configService.get<string>('REDIS_HOST');
    const redisPort = this.configService.get<number>('REDIS_PORT');

    this.queue = new Queue(QueuesEnum.EMAIL, { connection: { host: redisHost, port: redisPort } });

    this.worker = new Worker(
      QueuesEnum.EMAIL,
      async (job) => {
        await this.emailJobProcessor.process(job);
      },
      { connection: { host: redisHost, port: redisPort }, concurrency: 5 }
    );
  }

  async addEmailJob(data: {
    recipient: string;
    subject: string;
    template: string;
    variables: Record<string, any>;
  }) {
    await this.queue.add('send-email', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
    });
  }
}
