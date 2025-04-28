import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './modules/auth/auth.module';
import { BrandTypesModule } from './modules/brand_type/brand-type.module';
import { CompanyModule } from './modules/company/company.module';
import { RoleModule } from './modules/role/roles.module';
import { UserModule } from './modules/user/user.module';
import { CacheModule } from './shared/cache/redis.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { LoggerModule } from './shared/infrastructure/logger/logger.module';
import { ABACMiddleware } from './shared/middleware/abac.middleware';
import { RBACMiddleware } from './shared/middleware/rbac.middleware';
import EmailModule from './modules/email/email.module';
import { BrandModule } from './modules/brand/brand.module';
import { AwsModule } from './shared/aws/aws.module';
import { MediaModule } from './modules/media/media.module';
import { SchedulerModule } from './shared/scheduler/scheduler.module';
import { ContinentModule } from './modules/shared/continent/continent.module';
import { CountryModule } from './modules/shared/country/country.module';
import { LifestyleModule } from './modules/lifestyles/lifestyle.module';
import { CityModule } from './modules/shared/city/city.module';
import { AmenityModule } from './modules/residentmanagement/amenity/amenity.module';
import { BullModule } from '@nestjs/bullmq';
import { getBullConfig } from './shared/config/bull.config';
import { QueuesEnum } from './shared/types/queues.enum';
import { KeyFeatureModule } from './modules/residentmanagement/key_feature/key-feature.module';
import { ResidenceModule } from './modules/residentmanagement/residence/residence.module';
import { RankingCategoryTypeModule } from './modules/shared/rankingmanagement/categorytype/ranking-category-type.module';
import { RankingCategoryModule } from './modules/shared/rankingmanagement/category/ranking-category.module';
import { UnitModule } from './modules/residentmanagement/unit/unit.module';
import { UnitTypeModule } from './modules/residentmanagement/unit_type/unit-type.module';
import { CareerContactFormModule } from './modules/contactform/career/career-contact-form.module';
import { RankingCriteriaModule } from './modules/shared/rankingmanagement/criteria/ranking-criteria.module';
import { ResidenceRankingScoreModule } from './modules/residentmanagement/ranking_score/residence-ranking-score.module';
import { RequestModule } from './modules/requestmanagement/request/request.module';
import { LeadModule } from './modules/requestmanagement/lead/lead.module';
import { ReviewModule } from './modules/residentmanagement/review/review.module';
import { ContactFormModule } from './modules/contactform/contactform/contact-form.module';
import { BillingModule } from './modules/billing/billing.module';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath will be handled by dotenv-cli, so no need to specify here
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getBullConfig,
    }),
    BullModule.registerQueue({ name: QueuesEnum.EMAIL }, { name: QueuesEnum.NOTIFICATION }),
    AwsModule,
    SchedulerModule,
    UserModule,
    AuthModule,
    RoleModule,
    CompanyModule,
    MediaModule,
    LoggerModule,
    DatabaseModule,
    CacheModule,
    BrandModule,
    BrandTypesModule,
    EmailModule,
    CountryModule,
    ContinentModule,
    LifestyleModule,
    CityModule,
    AmenityModule,
    UnitTypeModule,
    ResidenceModule,
    KeyFeatureModule,
    RankingCategoryTypeModule,
    RankingCategoryModule,
    UnitModule,
    CareerContactFormModule,
    RankingCriteriaModule,
    ResidenceRankingScoreModule,
    RequestModule,
    LeadModule,
    ReviewModule,
    ContactFormModule,
    BillingModule,
  ],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RBACMiddleware, ABACMiddleware).forRoutes('{*path}');
  }
}
