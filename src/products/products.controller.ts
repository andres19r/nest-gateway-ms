import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct() {
    return 'Crea un producto';
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send(
      { cmd: 'find_all_products' },
      paginationDto,
    );
  }

  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    this.productsClient.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );

    // try {
    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'find_one_product' }, { id }),
    //   );
    //   return product;
    // } catch (err) {
    //   throw new RpcException(err);
    // }
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return `Delete the product with id ${id}`;
  }

  @Patch(':id')
  updateProduct(@Param('id') id: string, @Body() body: any) {
    return `Update the product with id ${id}`;
  }
}
