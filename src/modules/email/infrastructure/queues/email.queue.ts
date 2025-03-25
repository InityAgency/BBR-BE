import { Queue, Worker } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { EmailJobProcessor } from '../jobs/email.job';
import { ConfigService } from '@nestjs/config';
import { QueuesEnum } from 'src/shared/types/queues.enum';
import { EmailAction } from '../../domain/email-action.enum';

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
    const redisPassword = this.configService.get<string>('REDIS_PASSWORD');

    const redisConfig = {
      host: redisHost,
      port: redisPort,
      password: redisPassword,
    };

    this.queue = new Queue(QueuesEnum.EMAIL, {
      connection: redisConfig,
    });

    this.worker = new Worker(
      QueuesEnum.EMAIL,
      async (job) => {
        await this.emailJobProcessor.process(job);
      },
      { connection: redisConfig, concurrency: 5 }
    );
  }

  async addEmailJob(
    action: EmailAction,
    data: {
      to: string;
      subject?: string;
      template?: string;
      variables?: Record<string, any>;
    }
  ) {
    await this.queue.add(
      QueuesEnum.EMAIL,
      { action, ...data },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 3000 },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
  }
}
