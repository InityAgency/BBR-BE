import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CareerContactFormStorageConfig } from './contact-form-storage-config.service';

@Module({
  imports: [ConfigModule],
  providers: [CareerContactFormStorageConfig],
  exports: [CareerContactFormStorageConfig],
})
export class CareerContactFormStorageModule {}
