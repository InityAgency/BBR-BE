import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Knex, { Knex as KnexType } from 'knex';
import knexConfig from './../../../../knexfile';

@Injectable()
export class KnexService implements OnModuleInit, OnModuleDestroy {
  private readonly db: KnexType;

  constructor() {
    this.db = Knex(knexConfig.development);
  }

  async onModuleInit() {
    console.log('KnexService initialized');
  }

  async onModuleDestroy() {
    await this.db.destroy();
    console.log('KnexService destroyed');
  }

  get connection(): KnexType {
    return this.db;
  }
}
