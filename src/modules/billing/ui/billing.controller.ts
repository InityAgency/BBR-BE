import { Body, Controller, Get, Param, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { RBACGuard } from 'src/shared/guards/rbac.guard';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { FetchAllPaymentMethodsByUserCommandQuery } from '../application/query/fetch-all-payment-methods-by-user.command.query';
import { AddPaymentMethodCommandHandler } from '../application/handlers/add-payment-method.command.handler';
import { GenerateCheckoutOneTimeCommandHandler } from '../application/handlers/generate-checkout-one-time.command.handler';
import { BillingMapper } from './mappers/billing.mapper';
import { FetchAllProductsCommandQuery } from '../application/query/fetch-all-products.command.query';
import { CreateProductRequest } from './requests/create-product.request';
import { CreateProductCommandHandler } from '../application/handlers/create-product.command.handler';
import { GenerateCheckoutOneTimeRequest } from './requests/generate-checkout-one-time.request';
import { GenerateCheckoutSubscriptionCommandHandler } from '../application/handlers/generate-checkout-subscription.command.handler';

@ApiTags('Billing')
@UseGuards(RBACGuard)
@Controller('billing')
export class BillingController {
  constructor(
    private readonly fetchAllPaymentMethodsByUserQuery: FetchAllPaymentMethodsByUserCommandQuery,
    private readonly fetchAllProductsCommandQuery: FetchAllProductsCommandQuery,
    private readonly addPaymentMethodCommandHandler: AddPaymentMethodCommandHandler,
    private readonly generateCheckoutOneTimeCommandHandler: GenerateCheckoutOneTimeCommandHandler,
    private readonly generateCheckoutSubscriptionCommandHandler: GenerateCheckoutSubscriptionCommandHandler,
    private readonly createProductCommandHandler: CreateProductCommandHandler
  ) {}

  @Post('checkout/one-time')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.READ)
  @ApiOperation({ summary: 'Generate checkout one time' })
  async generateCheckoutOneTime(
    @Body(ValidationPipe) generateCheckoutOneTimeRequest: GenerateCheckoutOneTimeRequest,
    @Req() req
  ) {
    const command = BillingMapper.toGenerateCheckoutOneTimeCommand(req.user.id, req.user.email, {
      ...generateCheckoutOneTimeRequest,
    });

    return await this.generateCheckoutOneTimeCommandHandler.handle(command);
  }

  @Post('checkout/subscription')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.READ)
  @ApiOperation({ summary: 'Generate checkout subscription' })
  async generateCheckoutSubscription(
    @Body(ValidationPipe) generateCheckoutOneTimeRequest: GenerateCheckoutOneTimeRequest,
    @Req() req
  ) {
    const command = BillingMapper.toGenerateCheckoutSubscriptionCommand(
      req.user.id,
      req.user.email,
      {
        ...generateCheckoutOneTimeRequest,
      }
    );

    return await this.generateCheckoutSubscriptionCommandHandler.handle(command);
  }

  @Get('payment-methods/:id')
  @ApiOperation({ summary: 'Get payment methods' })
  async fetchAllPaymentMethodsByUser(@Param('id') id: string) {
    return await this.fetchAllPaymentMethodsByUserQuery.handle(id);
  }

  @Get('payment-methods')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.READ)
  @ApiOperation({ summary: 'Get payment methods' })
  async fetchAllPaymentMethods(@Req() req) {
    const userId = req.user.id;
    return await this.fetchAllPaymentMethodsByUserQuery.handle(userId);
  }

  @Post('payment-method')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @ApiOperation({ summary: 'Add payment method' })
  async addPaymentMethod(@Req() req) {
    const userId = req.user.id;

    return await this.addPaymentMethodCommandHandler.handle(userId);
  }

  @Get('products')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.READ)
  @ApiOperation({ summary: 'Get products' })
  async fetchAllProducts() {
    const result = await this.fetchAllProductsCommandQuery.handle();

    return result.map((product) => BillingMapper.toProductResponse(product));
  }

  @Post('products')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.READ)
  @ApiOperation({ summary: 'Get products' })
  async createProduct(@Body(ValidationPipe) createProductRequest: CreateProductRequest) {
    const command = BillingMapper.toCreateProductCommand(createProductRequest);

    return await this.createProductCommandHandler.handle(command);
  }
}
